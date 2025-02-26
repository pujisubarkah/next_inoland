"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

import "./NewsDetail.css";

interface InovasiDetailType {
  nama_inovasi: string;
  nama_instansi: string;
  deskripsi: string;
  image_link: string;
}

const InovasiDetail = () => {
  const params = useParams();
  const id = params?.id as string; // Mengambil ID dari URL
  const [inovasiDetail, setInovasiDetail] = useState<InovasiDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInovasiDetail = async () => {
      try {
        const response = await axios.get(`/api/inovasi_lan?id=${id}`);
        setInovasiDetail(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInovasiDetail();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="news-detail">
      {inovasiDetail && (
        <>
          <h1 className="news-title">{inovasiDetail.nama_inovasi}</h1>
          <div className="news-detail-image">
            <Image
              src={inovasiDetail.image_link}
              alt={inovasiDetail.nama_inovasi}
              width={800}
              height={450}
              layout="responsive"
            />
          </div>
          <p className="news-date">{inovasiDetail.nama_instansi}</p>
          <div
            className="news-description"
            dangerouslySetInnerHTML={{ __html: inovasiDetail.deskripsi }}
          />
        </>
      )}
    </div>
  );
};

export default InovasiDetail;
