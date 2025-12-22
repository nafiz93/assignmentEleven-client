import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import banner1 from "@/assets/images/banner1.png";
import banner2 from "@/assets/images/banner2.png";
import banner3 from "@/assets/images/banner3.png";
import banner4 from "@/assets/images/banner4.png";

export default function Banner({ onClickButton }) {
  const slides = [banner1, banner2, banner3, banner4];

  return (
    <div className="relative w-full max-w-6xl mx-auto my-10">
      {/* Button */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
        <button
          type="button"
          onClick={onClickButton}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-lg"
        >
          
        </button>
      </div>

      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showIndicators
        interval={3000}
      >
        {slides.map((src, idx) => (
          <div key={idx} className="h-[400px] md:h-[300px]">
            <img
              src={src}
              alt={`Banner ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
