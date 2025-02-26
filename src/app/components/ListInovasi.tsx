import { useState, useEffect } from "react";
import './InteractiveMap.css';
import { supabase } from '../supabaseClient';

function InteractiveMap() {
    const [inovasiData, setInovasiData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterColumn, setFilterColumn] = useState('');
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        loadInovasi();
    }, []);

    const loadInovasi = async () => {
        const { data: inovasiData, error } = await supabase
            .from('inolands')
            .select(`
            *,
            sdgs (
                image,
                sdgs
            )
            `);

        if (error) {
            console.error("Error fetching inovasi:", error);
        } else {
            setInovasiData(inovasiData);
            setCurrentPage(1);
        }
    };

    const filteredInovasi = inovasiData.filter((inovasi) => {
        if (searchTerm === '') {
            return inovasi;
        } else {
            if (
                (inovasi.judul_inovasi && inovasi.judul_inovasi.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (inovasi.tahun && inovasi.tahun.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (inovasi.kld && inovasi.kld.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (inovasi.inovator && inovasi.inovator.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (inovasi.deskripsi && inovasi.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()))
            ) {
                return inovasi;
            }
        }
    });


    const totalPages = Math.ceil(inovasiData.length / itemsPerPage);
    const currentInovasi = filteredInovasi.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="app">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', width: '100%', maxWidth: '1200px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', fontSize: '2rem', textAlign: 'center', margin: '20px 0 10px 0' }}>
                        TEMUKAN INOVASI
                    </h1>
                    <hr style={{ width: '100px', border: 'none', height: '2px', background: 'linear-gradient(to right, red, black, red)', margin: '0 auto 20px auto' }} />

                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Cari Ide Inovasi/Pemda/Inovator"
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '10px 10px 10px 30px',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    width: '350px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            />
                            <i className="fas fa-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }}></i>
                        </div>
                    </div>

                    {currentInovasi.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', margin: '20px 0' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#444', color: 'white', textAlign: 'left' }}>
                                    <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>Judul Inovasi</th>
                                    <th style={{ padding: '15px', width: '175px', borderBottom: '1px solid #ddd' }}>SDGS</th>
                                    <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>Tahun</th>
                                    <th style={{ padding: '15px', width: '125px', borderBottom: '1px solid #ddd' }}>Pemda</th>
                                    <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>Inovator</th>
                                    <th style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>Deskripsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentInovasi.map((inovasi) => (
                                    <tr key={inovasi.id} style={{ backgroundColor: '#fff', borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '15px' }}>{inovasi.judul_inovasi}</td>
                                        <td style={{ padding: '15px', width: '175px' }}>
                                            <img width='75px' src={inovasi.sdgs ? inovasi.sdgs.image : ''}></img>
                                            <div>{inovasi.sdgs ? inovasi.sdgs.sdgs : 'N/A'}</div>
                                        </td>
                                        <td style={{ padding: '15px' }}>{inovasi.tahun}</td>
                                        <td style={{ padding: '15px', width: '125px' }}>{inovasi.kld}</td>
                                        <td style={{ padding: '15px' }}>{inovasi.inovator}</td>
                                        <td style={{ padding: '15px' }}>{inovasi.deskripsi}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ textAlign: 'center' }}>Tidak ada inovasi yang ditemukan.</p>
                    )}

                    {totalPages > 1 && (
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                            {currentPage > 1 && (
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    style={{
                                        padding: '5px 10px',
                                        margin: '0 5px',
                                        border: 'none',
                                        borderRadius: '3px',
                                        backgroundColor: '#f9f9f9',
                                        color: '#000',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    Prev
                                </button>
                            )}
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                const pageNumber = currentPage > 3 ? currentPage - 2 + i : i + 1;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        style={{
                                            padding: '5px 10px',
                                            margin: '0 5px',
                                            border: 'none',
                                            borderRadius: '3px',
                                            backgroundColor: currentPage === pageNumber ? '#444' : '#f9f9f9',
                                            color: currentPage === pageNumber ? '#fff' : '#000',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                            {currentPage < totalPages && (
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    style={{
                                        padding: '5px 10px',
                                        margin: '0 5px',
                                        border: 'none',
                                        borderRadius: '3px',
                                        backgroundColor: '#f9f9f9',
                                        color: '#000',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InteractiveMap;
