import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Proper = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = 20;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Fetch berita from API with Axios
  const fetchBeritaFromAPI = async () => {
    try {
      const response = await axios.get(
        `https://properexpo.lan.go.id/app/api/tx-proper?perPage=${itemsPerPage}&page=${currentPage}`
      );
      const data = response.data.data.data; // Akses array data dari response

      // Format data sesuai kebutuhan
      const formattedData = data.map((item) => ({
        id: item.id_proper,
        title: item.judul,
        image: `https://properexpo.lan.go.id/uploads/properexpo-lan/berkas_poster_landscape/${item.berkas_poster_landscape}`,
        author: item.nama,
        instansi: item.md_instansi?.nama,
        date: item.created_at,
      }));

      // Set data ke state
      setNewsItems(formattedData);

      console.log('api:', response.config.url);
    } catch (error) {
      console.error('Error fetching news from API:', error);
    }
  };

  useEffect(() => {
    fetchBeritaFromAPI();
  }, [currentPage]);

  const handleItemClick = (id) => {
    window.open(`https://properexpo.lan.go.id/web/proper/detail/${id}`, '_blank');
  };

  return (
    <div className="app">
      <h1
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 'bold',
          fontSize: '2rem',
          textAlign: 'center',
          margin: '20px 0 10px 0',
        }}
      >
        PROYEK PERUBAHAN
      </h1>
      <hr
        style={{
          width: '100px',
          border: 'none',
          height: '2px',
          background: 'linear-gradient(to right, red, black, red)',
          margin: '0 auto 20px auto',
        }}
      />
      <div className="news-grid">
        {newsItems.map((item) => (
          <div key={item.id} className="news-item" onClick={() => handleItemClick(item.id)}>
            <img src={item.image} alt={item.title} className="news-image" />
            <div className="news-content">
              <h3>
                <b>{item.title}</b>
              </h3>
              <p style={{ color: 'darkred' }}>
                {item.author} - {item.instansi}
              </p>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
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
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Prev
            </button>
          )}
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNumber =
              currentPage > 3 ? currentPage - 2 + i : i + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                style={{
                  padding: '5px 10px',
                  margin: '0 5px',
                  border: 'none',
                  borderRadius: '3px',
                  backgroundColor:
                    currentPage === pageNumber ? '#444' : '#f9f9f9',
                  color: currentPage === pageNumber ? '#fff' : '#000',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Proper;
