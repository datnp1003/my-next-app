import React from 'react';
import Image from 'next/image';
import Header from '@/components/client/header';
import Footer from '@/components/client/footer';
import Product_Ao from '@/components/client/product_ao';
import Product_Vay from '@/components/client/product_vay';
import Product_Dam from '@/components/client/product_dam';
import ProductCard from '@/components/client/ProductCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thời Trang Nữ Sang Trọng & Đẳng Cấp',
  description: 'Khám phá bộ sưu tập thời trang nữ độc đáo và tinh tế. Tôn vinh vẻ đẹp phái nữ với những mẫu thời trang đẳng cấp.',
  keywords: 'Thời trang nữ, thời trang cao cấp, sang trọng, đầm dự tiệc, áo dài'
}

const LandingPage = () => {

  return (
    <div className="min-h-screen pt-16">{/* pt-16 to account for fixed header */}
      <Header />
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-[600px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/img/banner2.jpg"
            alt="Hero background"
            fill
            priority
            sizes="100vw"
            quality={100}
            className="object-cover w-full h-full opacity-50"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Thời Trang Nữ Sang Trọng & Đẳng Cấp
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Khám phá bộ sưu tập mới nhất với những thiết kế độc đáo và tinh tế.
            Tôn vinh vẻ đẹp phái nữ với những mẫu thời trang đẳng cấp.
          </p>
          <div className="mt-10">
            <a
              href="#services"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Tìm hiểu thêm
            </a>
          </div>
        </div>
      </div>


      {/* Features Section - Áo */}
      <div className="py-16 bg-white" id="products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-sans bold text-gray-900 sm:text-4xl border-b-4 border-sky-900 inline-block pb-2">
              Áo Thời Trang Nữ
            </h2>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Product Carousel */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <Product_Ao />
              {/* Thêm nút Xem tất cả */}
              <div className="text-center mt-10">
                <a
                  href="/products/ao"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full
              text-white bg-sky-900 hover:bg-white hover:text-sky-900 hover:border-sky-900 transition-colors duration-200
              shadow-lg hover:shadow-xl transform"
                >
                  Xem tất cả
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>


            {/* Feature 2 */}
            <div className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="space-y-4">
                <ProductCard
                  image="/img/sp1.jpg"
                  name="Áo Kiểu Nữ Cao Cấp"
                  price="599.000đ"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="space-y-4">
                <ProductCard
                  image="/img/sp2.jpg"
                  name="Váy Đầm Dự Tiệc"
                  price="899.000đ"
                />
              </div>
            </div>
          </div>


        </div>
      </div>


      {/* Features Section */}
      <div className="py-16 bg-white" id="products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-sans bold text-gray-900 sm:text-4xl border-b-4 border-sky-900 inline-block pb-2">
              Váy Thời Trang Nữ
            </h2>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Product Carousel */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <Product_Vay />
              {/* Thêm nút Xem tất cả */}
              <div className="text-center mt-10">
                <a
                  href="/products/ao"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full
              text-white bg-sky-900 hover:bg-white hover:text-sky-900 hover:border-sky-900 transition-colors duration-200
              shadow-lg hover:shadow-xl transform"
                >
                  Xem tất cả
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="space-y-4">
                <ProductCard
                  image="/img/sp4.jpg"
                  name="Váy thời trang nữ"
                  price="599.000đ"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="space-y-4">
                <ProductCard
                  image="/img/sp5.jpg"
                  name="Váy thời trang nữ"
                  price="899.000đ"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white" id="products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-sans bold text-gray-900 sm:text-4xl border-b-4 border-sky-900 inline-block pb-2">
              Đầm công sở
            </h2>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Product Carousel */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <Product_Dam />
              {/* Thêm nút Xem tất cả */}
              <div className="text-center mt-10">
                <a
                  href="/products/ao"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full
              text-white bg-sky-900 hover:bg-white hover:text-sky-900 hover:border-sky-900 transition-colors duration-200
              shadow-lg hover:shadow-xl transform"
                >
                  Xem tất cả
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="space-y-4">
                <ProductCard
                  image="/img/sp7.jpg"
                  name="Đầm công sở"
                  price="599.000đ"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="space-y-4">
                <ProductCard
                  image="/img/sp8.jpg"
                  name="Đầm công sở"
                  price="899.000đ"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
