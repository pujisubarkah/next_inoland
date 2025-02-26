import React, { useEffect, useState } from 'react';

const Jippnas = () => {
  const [newsItems, setNewsItems] = useState([]);

  // Fetch berita from API
  const fetchBeritaFromAPI = async () => {
    try {
      const response = await fetch(`https://jippnas.menpan.go.id/unggulan`);
      const data = await response.json();

      // Format data yang difetch agar sesuai dengan komponen `NewsGrid`
      const formattedData = data.inovasi.map((item) => ({
        id: item.id,
        title: item.judul,
        image: `https://jippnas.menpan.go.id/storage/${item.img_1}`, // Sesuaikan dengan atribut yang ada di API
        pemda: item.nm_instansi,
        date: item.waktu,
      }));

      setNewsItems(formattedData);
      console.log('api:', response.url);
    } catch (error) {
      console.error('Error fetching news from API:', error);
    }
  };

  // Fetch berita ketika komponen dipasang
  useEffect(() => {
    fetchBeritaFromAPI();
  });

  const handleItemClick = (id) => {
    window.open(`https://jippnas.menpan.go.id/inovasi/${id}`, '_blank');
  };


 return (
  <div className="app">
    <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', fontSize: '2rem', textAlign: 'center', margin: '20px 0 10px 0' }}>
      ETALASE INOVASI JIPPNAS
    </h1>
    <hr style={{ width: '100px', border: 'none', height: '2px', background: 'linear-gradient(to right, red, black, red)', margin: '0 auto 20px auto' }} />
    <div className="news-grid">
      {newsItems.map((item) => (
        <div key={item.id} className="news-item" onClick={() => handleItemClick(item.id)}>
          <img src={item.image} alt={item.title} className="news-image" />
          <div className="news-content">
            <h3><b>{item.title}</b></h3>
            <p style={{ color: 'darkred' }}>{item.pemda}</p>
          </div>
        </div>
      ))}
    </div>

  </div>
);
};

export default Jippnas;
