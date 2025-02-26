
import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const TambahBeritaForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        description: "",
        image_url: "",
    });

    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // Fungsi untuk menangani perubahan input form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Fungsi untuk menangani perubahan file (upload gambar)
    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;
    
        // Validasi tipe file dan ukuran
        const validTypes = ["image/jpeg", "image/jpg", "image/png"]; // Menambahkan "image/png"
        if (!validTypes.includes(uploadedFile.type)) {
            setErrorMessage("File harus berupa JPG, JPEG, atau PNG.");
            return;
        }
        if (uploadedFile.size > 2 * 1024 * 1024) {
            setErrorMessage("Ukuran file tidak boleh lebih dari 2 MB.");
            return;
        }
    
        setFile(uploadedFile);
        setErrorMessage(""); // Reset error jika file valid
    };
    

    // Fungsi untuk menangani submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Cek jika file belum dipilih
        if (!file) {
            setErrorMessage("File gambar belum dipilih.");
            return;
        }

        try {
            // Nama file untuk diupload
            const fileName = `berita-${Date.now()}-${file.name}`;

            // Upload file ke bucket "berita" di Supabase
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("berita")
                .upload(fileName, file, {
                    contentType: file.type, // Pastikan tipe konten sesuai
                    upsert: false,         // Hindari overwrite
                });

            if (uploadError) throw uploadError;

            // Dapatkan URL publik untuk gambar yang diupload
            const { data: publicUrlData } = supabase.storage.from("berita").getPublicUrl(fileName);
            const image_url = publicUrlData.publicUrl;

            // Tambahkan data berita ke Supabase
            const { data: insertData, error: insertError } = await supabase.from("beritas").insert([
                {
                    title: formData.title,
                    date: formData.date,
                    description: formData.description,
                    image_url: image_url, // Simpan URL gambar di database
                },
            ]);

            if (insertError) throw insertError;

            // Alert sukses
            alert("Berita berhasil ditambahkan!");

            // Reset form setelah submit
            setFormData({
                title: "",
                date: "",
                description: "",
                image_url: "",
            });
            setFile(null); // Reset file state
            onClose(); // Tutup modal setelah berhasil
        } catch (error) {
            console.error("Error saat menambahkan berita:", error);
            alert("Gagal menambahkan berita. Silakan coba lagi.");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Tambah Berita</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Judul</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Tanggal</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Deskripsi</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        rows="4"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Upload Gambar</label>
                    <input
                        type="file"
                        accept="image/jpeg"
                        onChange={handleFileChange}
                        className="w-full border rounded p-2"
                    />
                    {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        className="py-2 px-4 bg-gray-300 rounded"
                        onClick={onClose}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="py-2 px-4 bg-red-800 text-white rounded"
                        disabled={Boolean(errorMessage)}
                    >
                        Tambah
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TambahBeritaForm;
