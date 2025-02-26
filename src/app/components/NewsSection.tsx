import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper'; // Check import
import 'swiper/css';

import { supabase } from '../supabaseClient'; // Ensure this path is correct

const NewsSection = () => {
  const [beritas, setBeritas] = useState([]);
  const [lastHeadline, setLastHeadline] = useState('');

  useEffect(() => {
    const fetchBeritas = async () => {
      const { data, error } = await supabase
        .from('beritas')
        .select('description, headline')
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        if (data.length > 0) {
          setBeritas(data);
          setLastHeadline(data[0].headline);
        }
      }
    };

    fetchBeritas();
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-gray-100 flex flex-col">
      {/* Featured Article Slider */}
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }} 
        navigation={true} 
        modules={[Pagination, Navigation]} 
        className="h-full"
      >
        {beritas.map((berita, index) => (
          <SwiperSlide key={index}>
            <div className="flex items-center justify-center bg-black text-white p-8 rounded-lg h-full">
              <div className="text-center">
                <h2 className="text-red-500 text-xl">Berita</h2>
                <h1 className="text-4xl mb-4">{berita.description}</h1>
                <h3 className="text-lg font-bold mt-2">{lastHeadline}</h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Small Articles Slider */}
      <Swiper
        spaceBetween={15}
        slidesPerView={3}
        loop={true}
        autoplay={{ delay: 5000 }}
        className="mt-5"
      >
        {beritas.map((berita, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col justify-center bg-gray-800 text-white p-4 rounded-lg">
              <p className="text-center">{berita.description}</p>
              <span className="text-red-500 text-xs mt-2 text-center">Kategori</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NewsSection;
