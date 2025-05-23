'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
{
    src: '/img/sp4.jpg',
    alt: 'Sản phẩm 1',
    title: 'Váy thời trang nữ',
    price: '599.000đ'
  },
  {
    src: '/img/sp5.jpg',
    alt: 'Sản phẩm 2',
    title: 'Váy thời trang nữ',
    price: '799.000đ'
  },
  {
    src: '/img/sp6.jpg',
    alt: 'Sản phẩm 3',
    title: 'Váy thời trang nữ',
    price: '899.000đ'
  }
];

export default function ProductCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg">
      {/* Main Image */}
      <div className="relative h-full w-full">
        <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" 
             style={{ transform: `translateX(-${current * 100}%)` }}>
          {images.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0">
              <div className="relative w-full h-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <h3 className="text-xl font-semibold">{image.title}</h3>
                  <p className="text-lg text-sky-300">{image.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === current ? 'bg-white w-4' : 'bg-white/50'
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}
