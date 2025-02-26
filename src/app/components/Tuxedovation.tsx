import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const Tuxe = () => {
  interface NewsItem {
    id: number;
    title: string;
    image: string;
    pemda: string;
    date: string;
  }

  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = 100;

  useEffect(() => {
    const fetchBeritaFromAPI = async () => {
      try {
        const offset = (currentPage - 1) * itemsPerPage;
        const response = await axios.get(
          `https://api.indeks.inovasi.litbang.kemendagri.go.id/tuxe/new-release?offset=${offset}`
        );

        const formattedData = response.data.inovasi.map((item: { id: number; nama: string; indikator_video?: { thumbnail_url: string }; pemda: string; waktu: string }) => ({
          id: item.id,
          title: item.nama,
          image: item.indikator_video?.thumbnail_url || "/default-image.jpg",
          pemda: item.pemda,
          date: item.waktu,
        }));

        setNewsItems(formattedData);
      } catch (error) {
        console.error("Error fetching news from API:", error);
      }
    };

    fetchBeritaFromAPI();
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-4">TUXEDOVATION KEMENDAGRI</h1>
      <div className="h-1 w-24 bg-gradient-to-r from-red-500 via-black to-red-500 mx-auto mb-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {newsItems.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transform transition hover:scale-105"
            onClick={() => window.open(`https://tuxedovation.inovasi.litbang.kemendagri.go.id/detail_inovasi/${item.id}`, "_blank")}
          >
            <Image src={item.image} alt={item.title} width={500} height={300} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-red-700 text-sm">{item.pemda}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-6 space-x-2">
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300"
          >
            Prev
          </button>
        )}
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const pageNumber = currentPage > 3 ? currentPage - 2 + i : i + 1;
          return (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={`px-3 py-1 rounded-md shadow ${currentPage === pageNumber ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              {pageNumber}
            </button>
          );
        })}
        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Tuxe;

