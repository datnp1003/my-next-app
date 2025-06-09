'use client';

import { useState, useEffect } from 'react';
import { ProductList } from '@/components/layout/ProductList';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  stock?: number;
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Cà phê sữa đá',
    price: 29000,
    image: '/img/sp1.jpg',
    stock: 100
  },
  {
    id: '2',
    name: 'Trà sữa trân châu',
    price: 35000,
    image: '/img/sp2.jpg',
    stock: 50
  },
  {
    id: '3',
    name: 'Nước ép cam',
    price: 25000,
    image: '/img/sp3.jpg',
    stock: 30
  },
  {
    id: '4',
    name: 'Sinh tố bơ',
    price: 35000,
    image: '/img/sp4.jpg',
    stock: 40
  },
  {
    id: '5',
    name: 'Matcha đá xay',
    price: 45000,
    image: '/img/sp5.jpg',
    stock: 25
  },
  {
    id: '6',
    name: 'Chocolate đá',
    price: 39000,
    image: '/img/sp6.jpg',
    stock: 60
  }
];

export default function POSPage() {
  const [cart, setCart] = useState<{product: Product; quantity: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };
  const [showCart, setShowCart] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Header Mobile */}
      <div className="lg:hidden bg-sky-900 text-white p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold">POS System</h1>
        <button
          onClick={() => setShowCart(true)}
          className="relative p-2 hover:bg-sky-800 rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        {/* Danh sách sản phẩm */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-span-12 md:col-span-9 lg:col-span-8 gap-4">
            <ProductList
              products={sampleProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              onAddToCart={addToCart}
            />
          </div>
        </div>

      {/* Giỏ hàng Desktop */}
      <div className="hidden lg:block w-96 bg-white border-l">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Giỏ hàng</h2>
          
          <div className="flex-1 overflow-auto mb-4 max-h-[calc(100vh-250px)]">
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center justify-between py-2 border-b">
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-gray-600">{item.product.price.toLocaleString()}đ</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="ml-2 text-red-500"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Tổng cộng:</span>
              <span className="font-bold">{calculateTotal().toLocaleString()}đ</span>
            </div>            
            <button
              onClick={() => {/* Xử lý thanh toán */}}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>

      {/* Giỏ hàng Mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 lg:hidden ${showCart ? 'block' : 'hidden'}`}
        onClick={() => setShowCart(false)}
      />
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          showCart ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 bg-sky-900 text-white flex justify-between items-center">
            <h2 className="text-xl font-bold">Giỏ hàng</h2>
            <button
              onClick={() => setShowCart(false)}
              className="p-2 hover:bg-sky-800 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center justify-between py-2 border-b">
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-gray-600">{item.product.price.toLocaleString()}đ</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="ml-2 text-red-500"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Tổng cộng:</span>
              <span className="font-bold">{calculateTotal().toLocaleString()}đ</span>
            </div>
            <button
              onClick={() => {/* Xử lý thanh toán */}}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>

      {/* Close the main flex container */}
      </div>
    </div>
  );
}
