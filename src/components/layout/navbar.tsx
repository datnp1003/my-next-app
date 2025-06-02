"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserCircle2,
  LayoutDashboard,
  Boxes,
  Store,
  Settings
} from "lucide-react";
import { useTranslations } from '@/i18n/client';
import Chat from '@/components/client/chat';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import MenuManager from './menu-manager';

export default function Navbar() {
  const { translate: t } = useTranslations('common');
  const pathname = usePathname();
  const [isManagingMenu, setIsManagingMenu] = useState(false);
  // const { data: session, status } = useSession();
  // const userId = session?.user?.id;
  // const isAdmin = session?.user?.role === 'ADMIN';
  // console.log('userId', userId);
  // console.log('isAdmin', isAdmin);

  const menuItems = [
    {
      title: t('navbar.home'),
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      title: t('navbar.user'),
      href: "/user",
      icon: UserCircle2
    }, {
      title: t('navbar.category'),
      href: "/category",
      icon: Boxes
    },
    {
      title: t('navbar.product'),
      href: "/product",
      icon: Boxes
    },
    {
      title: t('navbar.chat'),
      href: "/chat",
      icon: Store
    }
  ];

  // State để lưu số lượng tin nhắn mới
  const [newMessageCount, setNewMessageCount] = useState(0);

  // Lắng nghe sự kiện tin nhắn mới (giả sử bạn có WebSocket hoặc polling)
  useEffect(() => {
    // Giả lập: mỗi 10s tăng 1 tin nhắn mới (bạn thay bằng logic thực tế)
    // Xóa đoạn này khi dùng WebSocket thực
    // const interval = setInterval(() => setNewMessageCount(c => c + 1), 10000);
    // return () => clearInterval(interval);

    // Nếu dùng WebSocket:
    // ws.onmessage = (event) => {
    //   const msg = JSON.parse(event.data);
    //   if (msg.type === 'new_message_from_customer') {
    //     setNewMessageCount(c => c + 1);
    //   }
    // }
  }, []);

  // Khi mở chat, reset thông báo
  const handleOpenChat = () => setNewMessageCount(0);

  return (
    <div className="relative">
      {isManagingMenu ? (
        <div className="fixed inset-0 bg-white z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold">Quản lý Menu</h1>
            <button 
              onClick={() => setIsManagingMenu(false)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Đóng
            </button>
          </div>
          <MenuManager currentMenuItems={menuItems.map((item, index) => ({
            id: `current-menu-${index}`,
            ...item
          }))} />
        </div>
      ) : (
        <nav className="w-64 h-screen bg-sky-900 shadow-sm flex flex-col relative">
          <div className="border-b border-sky-800">
            <div className="flex items-center justify-between h-16 px-4">
              <Store className="w-10 h-10 text-white" />
              <button
                onClick={() => setIsManagingMenu(true)}
                className="p-2 text-white hover:bg-sky-800 rounded-lg transition-colors"
                title="Quản lý menu"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-2 px-4 py-3 rounded-lg transition-colors
                        ${isActive
                          ? 'text-white bg-sky-950'
                          : 'text-white hover:bg-sky-950 hover:text-white'}
                      `}
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* <div className="absolute bottom-6 left-0 w-full flex justify-center">
            <div className="relative">
              <button
                onClick={handleOpenChat}
                className="bg-sky-950 text-white rounded-full p-3 shadow-lg hover:bg-sky-800 transition relative"
                aria-label="Mở chat"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                </svg>
                {newMessageCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {newMessageCount}
                  </span>
                )}
              </button>
              <Chat
                userId={userId}
                isAdmin={true}
                onNewMessage={() => setNewMessageCount(c => c + 1)}
              />
            </div>
          </div> */}
        </nav>
      )}
    </div>
  );
}