'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [activeItem, setActiveItem] = useState('home');
  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center">
            <Image
              src="//file.hstatic.net/1000003969/file/logo-svg.svg"
              alt="Logo"
              width={100}
              height={100}
              className="mr-2"
            />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href=""
              className={`relative px-4 py-2 group ${
                activeItem === 'home' ? 'text-sky-900' : 'text-gray-600 hover:text-sky-900'
              }`}
              onClick={() => setActiveItem('home')}
            >
              <span>Trang chủ</span>
              <span className={`absolute bottom-0 left-1/2 h-0.5 bg-sky-900 transition-all duration-300 ${
                activeItem === 'home' ? 'w-1/2' : 'w-0 group-hover:w-1/2'
              }`}></span>
              <span className={`absolute bottom-0 right-1/2 h-0.5 bg-sky-900 transition-all duration-300 ${
                activeItem === 'home' ? 'w-1/2' : 'w-0 group-hover:w-1/2'
              }`}></span>
            </Link>
            <Link 
              href="#categories" 
              className={`relative px-4 py-2 group ${
                activeItem === 'categories' ? 'text-sky-900' : 'text-gray-600 hover:text-sky-900'
              }`}
              onClick={() => setActiveItem('categories')}
            >
              <span>Danh mục</span>
              <span className={`absolute bottom-0 left-1/2 h-0.5 bg-sky-900 transition-all duration-300 ${
                activeItem === 'categories' ? 'w-1/2' : 'w-0 group-hover:w-1/2'
              }`}></span>
              <span className={`absolute bottom-0 right-1/2 h-0.5 bg-sky-900 transition-all duration-300 ${
                activeItem === 'categories' ? 'w-1/2' : 'w-0 group-hover:w-1/2'
              }`}></span>
            </Link>
            <Link 
              href="#products" 
              className={`relative px-4 py-2 group ${
                activeItem === 'products' ? 'text-sky-900' : 'text-gray-600 hover:text-sky-900'
              }`}
              onClick={() => setActiveItem('products')}
            >
              <span>Sản phẩm</span>
              <span className={`absolute bottom-0 left-1/2 h-0.5 bg-sky-900 transition-all duration-300 ${
                activeItem === 'products' ? 'w-1/2' : 'w-0 group-hover:w-1/2'
              }`}></span>
              <span className={`absolute bottom-0 right-1/2 h-0.5 bg-sky-900 transition-all duration-300 ${
                activeItem === 'products' ? 'w-1/2' : 'w-0 group-hover:w-1/2'
              }`}></span>
            </Link>
            <Link 
              href="#contact" 
              className={`relative px-4 py-2 group ${
                activeItem === 'contact' ? 'text-sky-900' : 'text-gray-600 hover:text-sky-900'
              }`}
              onClick={() => setActiveItem('contact')}
            >
              <span>Liên hệ</span>
              <span className={`absolute bottom-0 left-1/2 h-0.5 bg-sky-900 transition-all duration-300 ${
                activeItem === 'contact' ? 'w-1/2' : 'w-0 group-hover:w-1/2'
              }`}></span>
              <span className={`absolute bottom-0 right-1/2 h-0.5 bg-sky-900 transition-all duration-300 ${
                activeItem === 'contact' ? 'w-1/2' : 'w-0 group-hover:w-1/2'
              }`}></span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-sky-900 text-white rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
