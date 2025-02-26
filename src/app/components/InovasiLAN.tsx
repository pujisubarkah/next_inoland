import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewsGrid.css';
interface NewsItem {
    id: number;
    image_link: string;
    nama_inovasi: string;
    nama_instansi: string;
}

const InovasiLAN = () => {
    const navigate = useNavigate();
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 12;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        // Fetch data from API
        const fetchBerita = async () => {
            try {
                const response = await axios.get(`/api/inovasi_lan?page=${currentPage}&limit=${itemsPerPage}`);
                setNewsItems(response.data.data);
                setTotalItems(response.data.total);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchBerita();
    }, [currentPage]);

    const handleItemClick = (id: number) => {
        navigate(`/inovasi/${id}`);
    };

    return (
        <div className="app">
            <h1 className="title">LIST INOVASI</h1>
            <hr className="divider" />
            <div className="news-grid">
                {newsItems.map((item) => (
                    <div key={item.id} className="news-item" onClick={() => handleItemClick(item.id)}>
                        <Image src={item.image_link} alt={item.nama_inovasi} className="news-image" width={500} height={300} />
                        <div className="news-content">
                            <h3><b>{item.nama_inovasi}</b></h3>
                            <p className="instansi">{item.nama_instansi}</p>
                        </div>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    {currentPage > 1 && (
                        <button onClick={() => handlePageChange(currentPage - 1)} className="page-btn">Prev</button>
                    )}
                    {[...Array(totalPages)].map((_, i) => (
                        <button key={i + 1} onClick={() => handlePageChange(i + 1)} className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}>
                            {i + 1}
                        </button>
                    ))}
                    {currentPage < totalPages && (
                        <button onClick={() => handlePageChange(currentPage + 1)} className="page-btn">Next</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default InovasiLAN;
