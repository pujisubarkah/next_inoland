import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit,
    faTrash,
    faShare,
} from '@fortawesome/free-solid-svg-icons';
import { Pagination } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TambahBeritaForm from './TambahBeritaForm'; // Pastikan file TambahBeritaForm ada di direktori yang sesuai.

const theme = createTheme({
    components: {
        MuiPagination: {
            styleOverrides: {
                root: {
                    '& .MuiPaginationItem-root': {
                        color: 'darkred',
                        '&.Mui-selected': {
                            backgroundColor: 'darkred',
                            color: '#fff',
                        },
                        '&:hover': {
                            backgroundColor: 'rgba(139, 0, 0, 0.1)',
                        },
                    },
                },
            },
        },
    },
});

const TambahBerita = () => {
    const [beritas, setBeritas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchBeritas = async () => {
            const { data, error } = await supabase
                .from('beritas')
                .select('*');

            if (error) {
                console.error('Error fetching beritas:', error);
            } else {
                setBeritas(data);
            }
        };

        fetchBeritas();
    }, []);

    const handleAddBerita = async (formData) => {
        const { data, error } = await supabase.from("beritas").insert([formData]);
        if (error) {
            console.error("Error adding berita:", error);
        } else {
            setBeritas((prevBeritas) => [...prevBeritas, ...data]);
        }
    };

   
    const handleDeleteBerita = async (id) => {
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus berita ini?");
        if (!confirmDelete) return;
    
        try {
            const { error } = await supabase
                .from('beritas')
                .delete()
                .eq('id', id);
    
            if (error) {
                console.error("Error deleting berita:", error);
                alert("Gagal menghapus berita. Silakan coba lagi.");
            } else {
                // Hapus berita dari state
                setBeritas((prevBeritas) => prevBeritas.filter((berita) => berita.id !== id));
                alert("Berita berhasil dihapus.");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("Terjadi kesalahan. Silakan coba lagi.");
        }
    };
    
     const handlePageChange = (_, newPage) => {
        setCurrentPage(newPage);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = beritas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(beritas.length / itemsPerPage);

    return (
        <ThemeProvider theme={theme}>
            <div className="w-full mt-24">
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', fontSize: '2rem', textAlign: 'center', margin: '20px 0 10px 0' }}>
      Tambah Berita
    </h1>
    <hr style={{ width: '100px', border: 'none', height: '2px', background: 'linear-gradient(to right, red, black, red)', margin: '0 auto 20px auto' }} />
    

                <div className="flex justify-end w-11/12 mx-auto">
                    <button
                        className="py-2 px-3 font-medium text-white rounded shadow flex items-center"
                        style={{
                            backgroundColor: "#a2003b",
                            transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#900028")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#a2003b")
                        }
                        onClick={() => setIsModalOpen(true)}
                    >
                        Tambah Berita
                    </button>
                </div>

                <div className="w-full flex justify-center mt-16">
                    <table className="border-collapse table-auto w-11/12 text-sm self-center">
                        <thead>
                            <tr>
                                <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">
                                    No
                                </th>
                                <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">
                                    Tanggal
                                </th>
                                <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">
                                    Judul
                                </th>
                                <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">
                                    Deskripsi
                                </th>
                                <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">
                                    Image
                                </th>
                                <th className="border-b text-base font-medium p-4 text-slate-400 text-left">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((berita, index) => (
                                <tr key={berita.id} className="hover:bg-gray-50">
                                    <td className="border-b p-4 font-bold">
                                        {indexOfFirstItem + index + 1}
                                    </td>
                                    <td className="border-b p-4 font-bold">
                                        {berita.date}
                                    </td>
                                    <td className="border-b p-4 font-bold">
                                        {berita.title}
                                    </td>
                                    <td className="border-b p-4 font-bold">
                                        {berita.deskripsi}
                                    </td>
                                    <td className="border-b p-4 font-bold">
                                        <img
                                            src={berita.image_url}
                                            alt={berita.title}
                                            width="50"
                                            height="50"
                                        />
                                    </td>
                                    <td className="border-b p-4 font-bold flex space-x-2">
                                     
                                        <button
                                            onClick={() =>
                                                handleDeleteBerita(berita.id)
                                            }
                                            className="text-red-600 hover:text-red-500"
                                            aria-label="Delete"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-4">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        shape="rounded"
                    />
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                        <TambahBeritaForm
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={handleAddBerita}
                        />
                    </div>
                </div>
            )}
        </ThemeProvider>
    );
};

export default TambahBerita;
