
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Import supabase client
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';

const TambahInovasi = () => {
    const [inolands, setInolands] = useState([]);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchInolands = async () => {
        const { data, error } = await supabase
            .from('inolands')
            .select(`
                id,
                tahun,
                provinsi:master_provinsi(nama_provinsi),
                kabupaten:master_kabupaten(nama_kabupaten),
                inovator,
                sdgs:sdgs(sdgs),
                deskripsi
            `);
    
        if (error) {
            console.error('Error fetching inovasi:', error);
        } else {
            setInolands(data);
        }
    };
    

    const handleEditClick = (id) => {
        console.log('Edit item with id:', id);
        // Add your edit logic here
    };

    const deleteProduct = (id) => {
        console.log('Delete item with id:', id);
        // Add your delete logic here
    };

    const handlePublishClick = (id) => {
        console.log('Publish item with id:', id);
        // Add your publish logic here (e.g., update the 'published' status of the item)
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = inolands.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(inolands.length / itemsPerPage);

    return (
        <div className="w-full mt-24">
<h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', fontSize: '2rem', textAlign: 'center', margin: '20px 0 10px 0' }}>
      Tambah Inovasi
    </h1>
    <hr style={{ width: '100px', border: 'none', height: '2px', background: 'linear-gradient(to right, red, black, red)', margin: '0 auto 20px auto' }} />
    

    <div className="flex justify-end w-11/12 mx-auto">
        <div className="w-auto">
            <button
                onClick={() => setShowModalAdd(true)}
                className="py-2 px-3 font-medium text-white rounded shadow flex items-center"
                style={{ backgroundColor: '#a2003b', transition: 'background-color 0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#900028'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#a2003b'}
            >
                Tambah Inovasi
            </button>
        </div>
    </div>

            <div className="w-full flex justify-center mt-16">
                <table className="border-collapse table-auto w-11/12 text-sm self-center">
                    <thead>
                        <tr>
                            <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">Tahun</th>
                            <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">Provinsi</th>
                            <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">Kabupaten</th>
                            <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">Inovator</th>
                            <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">SDGS</th>
                            <th className="border-b text-base font-medium p-4 pl-8 text-slate-400 text-left">Deskripsi</th>
                            <th className="border-b text-base font-medium p-4 text-slate-400 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((inolands, index) => {
                            return (
                                <tr key={inolands.id} className="hover:bg-gray-50">
                                    <td className="border-b p-4 font-bold">{inolands.tahun}</td>
                                    <td className="border-b p-4 font-bold">{inolands.provinsi}</td>
                                    <td className="border-b p-4 font-bold">{inolands.kabupaten}</td>
                                    <td className="border-b p-4 font-bold">{inolands.inovator}</td>
                                    <td className="border-b p-4 font-bold">{inolands.sdgs}</td>
                                    <td className="border-b p-4 font-bold">{inolands.deskripsi}</td>
                                    <td className="border-b p-4 font-bold flex">
                                        <button
                                            onClick={() => handleEditClick(inolands.id)}
                                            className="text-blue-600 hover:text-blue-500"
                                            aria-label="Edit"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(inolands.id)}
                                            className="text-red-600 hover:text-red-500"
                                            aria-label="Delete"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                       
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TambahInovasi;
