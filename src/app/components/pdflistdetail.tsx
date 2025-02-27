import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../components/NewsDetail.css';


const PdfDetail = () => {
  const { id } = useParams(); // Mengambil ID dari URL
  const [inovasiDetail, setInovasiDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInovasiDetail = async () => {
      const { data, error } = await supabase
        .from('pdflist')
        .select('*') // Fetch data
        .eq('id', id) // Filter by the specific item ID
        .single(); // Since we're fetching one item, we use `.single()`

      if (error) {
        setError(error);
      } else {
        setInovasiDetail(data);
      }
      setLoading(false);
    };

    fetchInovasiDetail();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching news: {error.message}</p>;
  }

  return (
    <div style={{
      padding: '30px',
      maxWidth: '1200px',
      margin: '20px auto',
      background: '#f9f9f9',
      borderRadius: '12px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease',
    }}>
      {inovasiDetail && (
        <>
          <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', fontFamily: 'Georgia' }}>{inovasiDetail.pdf_judul}</h1>
          <p style={{ fontSize: '1.2em', color: '#555' }}>{inovasiDetail.pdf_publisher}</p>
          <br/>
          <div style={{ position: 'relative', paddingTop: 'max(60%, 324px)', width: '100%', height: '0' }}>
            <iframe
              style={{
                position: 'absolute',
                border: 'none',
                width: '100%',
                height: '100%',
                left: '0',
                top: '0',
              }}
              src={inovasiDetail.pdf_url}
              seamless="seamless"
              scrolling="no"
              frameBorder="0"
              allowTransparency="true"
              allowFullScreen="true"
            ></iframe>
          </div>
        </>
      )}
    </div>
  );
};

export default PdfDetail;
