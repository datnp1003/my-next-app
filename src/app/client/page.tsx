
import React from 'react';
import Image from 'next/image';
import Header from '@/components/client/header';
import Footer from '@/components/client/footer';
import Product_Blouse from '@/components/client/product_blouse';
import Product_Skirt from '@/components/client/product_skirt';
import Product_Dress from '@/components/client/product_dress';
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
      <Product_Blouse />

      <Product_Skirt />

      <Product_Dress />

      <Footer />
    </div>
  );
};

export default LandingPage;
