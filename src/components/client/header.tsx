'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { href: "", label: "Trang chủ", id: "home" },
    { href: "#categories", label: "Danh mục", id: "categories" },
    { href: "#products", label: "Sản phẩm", id: "products" },
    { href: "#contact", label: "Liên hệ", id: "contact" },
  ];

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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`relative px-4 py-2 group ${
                  activeItem === item.id ? 'text-sky-900' : 'text-gray-600 hover:text-sky-900'
                }`}
                onClick={() => setActiveItem(item.id)}
              >
                <span>{item.label}</span>
                <span className={`absolute bottom-0 left-1/2 h-0.5 bg-sky-900 transition-all duration-300 ${
                  activeItem === item.id ? 'w-1/2' : 'w-0 group-hover:w-1/2'
                }`}></span>
                <span className={`absolute bottom-0 right-1/2 h-0.5 bg-sky-900 transition-all duration-300 ${
                  activeItem === item.id ? 'w-1/2' : 'w-0 group-hover:w-1/2'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Login/Register Buttons */}
          <div className="hidden md:flex items-center space-x-4">
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    activeItem === item.id
                      ? 'bg-sky-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => {
                    setActiveItem(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-sky-900 text-white hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
