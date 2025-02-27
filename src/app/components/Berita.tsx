import React, { useEffect, useState } from 'react';
import NewsGrid from './NewsGrid';
import axios from 'axios'; // Import Axios

const Berita = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Tentukan jumlah item per halaman

  // Fetch berita from API
  const fetchBerita = async () => {
    try {
      const response = await axios.get('/api/berita'); // Fetch data from the API
      const data = response.data;

      // Format data yang difetch agar sesuai dengan komponen `NewsGrid`
      const formattedData = data.map((item: { id: number; title: string; image_url: string; deskripsi: string; date: string }) => ({
        id: item.id,
        title: item.title,
        image: item.image_url, // Sesuaikan dengan atribut yang ada di API
        description: item.deskripsi,
        date: item.date,
      }));

      setNewsItems(formattedData);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  // Fetch berita ketika komponen dipasang
  useEffect(() => {
    fetchBerita();
  }, []);

  // Menghitung item yang ditampilkan pada halaman saat ini
  const currentItems = newsItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(newsItems.length / itemsPerPage); // Calculate total pages dynamically

  // Fungsi untuk mengganti halaman
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="app">
      <h1 className="font-poppins font-bold text-2xl text-center my-5">
        BERITA INOVASI
      </h1>
      <hr className="w-24 border-none h-2 bg-gradient-to-r from-red-500 to-black mx-auto mb-5" />
      <NewsGrid items={currentItems} />
      {totalPages > 1 && (
        <div className="mt-2 flex justify-center">
          {currentPage > 1 && (
            <button onClick={() => handlePageChange(currentPage - 1)} className="px-3 py-1 mx-1 border rounded bg-gray-200 hover:bg-gray-300">
              Prev
            </button>
          )}
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNumber = currentPage > 3 ? currentPage - 2 + i : i + 1;
            return (
              <button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={`px-3 py-1 mx-1 border rounded ${currentPage === pageNumber ? 'bg-gray-800 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                {pageNumber}
              </button>
            );
          })}
          {currentPage < totalPages && (
            <button onClick={() => handlePageChange(currentPage + 1)} className="px-3 py-1 mx-1 border rounded bg-gray-200 hover:bg-gray-300">
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Berita;