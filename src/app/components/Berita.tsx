import React, { useEffect, useState } from 'react';
import NewsGrid from './NewsGrid';
import Pagination from './Pagination';
import { supabase } from '../supabaseClient'; // Import supabase client

const Berita = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Tentukan jumlah item per halaman
  const totalPages = Math.ceil(newsItems.length / itemsPerPage); // Calculate total pages dynamically

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Fetch berita from Supabase
  const fetchBerita = async () => {
    const { data, error } = await supabase
      .from('beritas')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
    } else {
      // Format data yang difetch agar sesuai dengan komponen `NewsGrid`
      const formattedData = data.map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image_url, // Sesuaikan dengan atribut yang ada di API Supabase
        description: item.deskripsi,
        date: item.date,
      }));

      setNewsItems(formattedData);
    }
  };

  // Fetch berita ketika komponen dipasang
  useEffect(() => {
    fetchBerita();
  }, []);

 // Menghitung item yang ditampilkan pada halaman saat ini
 const currentItems = newsItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

 // Fungsi untuk mengganti halaman
 const paginate = (pageNumber) => setCurrentPage(pageNumber);

 return (
  <div className="app">
    <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', fontSize: '2rem', textAlign: 'center', margin: '20px 0 10px 0' }}>
      BERITA INOVASI
    </h1>
    <hr style={{ width: '100px', border: 'none', height: '2px', background: 'linear-gradient(to right, red, black, red)', margin: '0 auto 20px auto' }} />
    <NewsGrid items={currentItems} />
    {totalPages > 1 && (
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          {currentPage > 1 && (
            <button onClick={() => handlePageChange(currentPage - 1)} style={{ padding: '5px 10px', margin: '0 5px', border: 'none', borderRadius: '3px', backgroundColor: '#f9f9f9', color: '#000', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              Prev
            </button>
          )}
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNumber = currentPage > 3 ? currentPage - 2 + i : i + 1;
            return (
              <button key={pageNumber} onClick={() => handlePageChange(pageNumber)} style={{ padding: '5px 10px', margin: '0 5px', border: 'none', borderRadius: '3px', backgroundColor: currentPage === pageNumber ? '#444' : '#f9f9f9', color: currentPage === pageNumber ? '#fff' : '#000', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {pageNumber}
              </button>
            );
          })}
          {currentPage < totalPages && (
            <button onClick={() => handlePageChange(currentPage + 1)} style={{ padding: '5px 10px', margin: '0 5px', border: 'none', borderRadius: '3px', backgroundColor: '#f9f9f9', color: '#000', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              Next
            </button>
          )}
        </div>
      )}
  </div>
);
};


export default Berita;
