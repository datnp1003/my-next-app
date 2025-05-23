import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white" id='contact'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Địa chỉ: 123 Đường ABC, Quận XYZ</li>
              <li>Email: info@example.com</li>
              <li>Điện thoại: (123) 456-7890</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="#categories" className="text-gray-400 hover:text-white">
                  Danh mục
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-gray-400 hover:text-white">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-white">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ khách hàng</h3>
            <p className="text-gray-400">
              Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email hoặc điện thoại.<br />
              0952.315.841
            </p>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Juno
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
