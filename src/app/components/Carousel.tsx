"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowRight, faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./Carousel.css"; // Pastikan Anda memiliki file CSS yang sesuai

const Carousel: React.FC = () => {
  const [images, setImages] = useState<{ link: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch images from API
  const fetchImages = async () => {
    try {
      const response = await axios.get("/api/dokumen");
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 3) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 3 + images.length) % images.length);
  };

  return (
    <div className="carousel-container">
      <h1
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: "bold",
          fontSize: "2rem",
          textAlign: "center",
          margin: "20px 0 10px 0",
        }}
      >
        INFOGRAFIS INOVASI
      </h1>
      <hr
        style={{
          width: "100px",
          border: "none",
          height: "2px",
          background: "linear-gradient(to right, red, black, red)",
          margin: "0 auto 20px auto",
        }}
      />

      <div className="carousel">
        <button onClick={prevSlide} className="carousel-button-prev">
          <FontAwesomeIcon icon={faCircleArrowLeft} size="2x" color="white" />
        </button>

        <div className="carousel-images">
          {images.length > 0 &&
            [...Array(3)].map((_, i) => {
              const index = (currentIndex + i) % images.length;
              return (
                <Image
                  key={index}
                  src={images[index].link}
                  alt={`Slide ${index}`}
                  className="carousel-image"
                  width={500}
                  height={300}
                  layout="intrinsic"
                />
              );
            })}
        </div>

        <button onClick={nextSlide} className="carousel-button-next">
          <FontAwesomeIcon icon={faCircleArrowRight} size="2x" color="white" />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
