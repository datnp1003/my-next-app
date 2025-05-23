'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProductByCategory3 } from '@/core/domain/product/api';
import { useQuery } from '@tanstack/react-query';

export default function ProductCarousel() {
  const [current, setCurrent] = useState(0);

  const { data: products3 } = useQuery({
    queryKey: ['products3'],
    queryFn: () => getProductByCategory3(),
  });

  const productList3 = Array.isArray(products3) ? products3 : [];

  const nextSlide = () => {
    setCurrent(current === productList3.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? productList3.length - 1 : current - 1);
  };

  useEffect(() => {
    if (productList3.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [current, productList3.length]);

  return (
    <div className="py-16 bg-white" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-sans bold text-gray-900 sm:text-4xl border-b-4 border-sky-900 inline-block pb-2">
            Áo Thời Trang Nữ
          </h2>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Carousel chính */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 relative flex flex-col items-center">
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              {productList3.length > 0 && (
                <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${current * 100}%)` }}>
                  {productList3.map((item: any, index: number) => (
                    <div key={index} className="w-full h-full flex-shrink-0">
                      <div className="relative w-full h-96">
                        {item.images?.split(',').filter((x: any) => x).slice(0, 1).map((imageUrl: string, imageIndex: number) => (
                          <Image
                            key={imageIndex}
                            src={imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ))}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 pb-8">
                          <h3 className="text-xl font-semibold">{item.name}</h3>
                          <p className="text-lg text-sky-300">{item.price?.toLocaleString()} đ</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation Buttons */}
              {productList3.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {productList3.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${index === current ? 'bg-white w-4' : 'bg-white/50'}`}
                    onClick={() => setCurrent(index)}
                  />
                ))}
              </div>
            </div>
            {/* Nút xem tất cả */}
            <div className="text-center mt-6">
              <a
                href="/products/ao"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full
                  text-white bg-sky-900 hover:bg-white hover:text-sky-900 hover:border-sky-900 transition-colors duration-200
                  shadow-lg hover:shadow-xl transform"
              >
                Xem tất cả
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Hai sản phẩm tiếp theo */}
          {productList3.slice(0, 1).map((item: any, idx: number) => (
            <div key={idx} className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center">
              <div className="aspect-w-4 aspect-h-5 w-full overflow-hidden rounded-lg relative h-96">
                {item.images?.split(',').filter((x: any) => x).slice(0, 1).map((imageUrl: string, imageIndex: number) => (
                  <Image
                    key={imageIndex}
                    src={imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover object-center transition-transform duration-300"
                  />
                ))}
              </div>
              <div className="mt-4 flex flex-col items-center">
                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm font-semibold text-rose-500">{item.price?.toLocaleString()} đ</p>
              </div>
            </div>
          ))}

          {productList3.slice(1, 2).map((item: any, idx: number) => (
            <div key={idx} className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center">
              <div className="aspect-w-4 aspect-h-5 w-full overflow-hidden rounded-lg relative h-96">
                {item.images?.split(',').filter((x: any) => x).slice(0, 1).map((imageUrl: string, imageIndex: number) => (
                  <Image
                    key={imageIndex}
                    src={imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover object-center transition-transform duration-300"
                  />
                ))}
              </div>
              <div className="mt-4 flex flex-col items-center">
                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm font-semibold text-rose-500">{item.price?.toLocaleString()} đ</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
