'use client';

import React from 'react';
import Image from 'next/image';
import Header from '@/components/client/header';
import Footer from '@/components/client/footer';
import Product_Blouse from '@/components/client/product_blouse';
import Product_Skirt from '@/components/client/product_skirt';
import Product_Dress from '@/components/client/product_dress';
import Chat from '@/components/client/chat';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';

const LandingPage = () => {
  const { t } = useTranslation('common');
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <div className="min-h-screen pt-16">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gray-900 h-[600px]">
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
            {t('home.hero.title', 'Thời Trang Nữ Sang Trọng & Đẳng Cấp')}
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            {t('home.hero.description', 'Khám phá bộ sưu tập mới nhất với những thiết kế độc đáo và tinh tế.')}
          </p>
          <div className="mt-10 space-x-4">
            <a
              href="#products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 transition-all duration-300"
            >
              {t('home.hero.explore', 'Tìm hiểu thêm')}
            </a>
            {!session && (
              <a
                href="/auth/signin"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                {t('home.hero.signin', 'Đăng nhập')}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <main id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Product_Blouse />
          <Product_Skirt />
          <Product_Dress />
        </div>
      </main>

      <Footer />
      
      {/* Chat widget only shows for logged in users or admin */}
      {(session || isAdmin) && <Chat userId={userId} isAdmin={isAdmin} />}
    </div>
  );
};

export default LandingPage;
