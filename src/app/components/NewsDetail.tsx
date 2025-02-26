'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import './NewsDetail.css';
import Image from 'next/image';
interface NewsDetailType {
  title: string;
  const [newsDetail, setNewsDetail] = useState<NewsDetailType | null>(null);
  date: string;
  deskripsi: string;
}

const NewsDetail = () => {
const NewsDetail = () => {
  const { id } = useParams() as { id: string };
  const [newsDetail, setNewsDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await fetch(`/api/berita?id=${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Gagal mengambil berita');
        }
        
        setNewsDetail(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsDetail();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
          <Image className="news-detail-image" src={newsDetail.image_url} alt={newsDetail.title} width={600} height={400} />
  }

  return (
    <div className="news-detail">
      {newsDetail && (
        <>
          <h1 className="news-title">{newsDetail.title}</h1>
          <img className="news-detail-image" src={newsDetail.image_url} alt={newsDetail.title} />
          <p className="news-date">{newsDetail.date}</p>
          <p className="news-description">{newsDetail.deskripsi}</p>
        </>
      )}
    </div>
  );
};

export default NewsDetail;
