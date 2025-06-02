"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserCircle2,
  LayoutDashboard,
  Boxes,
  Store,
  Settings,
  FileBarChart,
  Users,
  ShoppingCart
} from "lucide-react";
import { useTranslations } from '@/i18n/client';
import Chat from '@/components/client/chat';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import MenuManager from './menu-manager';

// Map các tên icon sang component
const iconMap: { [key: string]: any } = {
  LayoutDashboard,
  UserCircle2,
  Boxes,
  Store,
  Settings,
  FileBarChart,
  Users,
  ShoppingCart
};

type MenuItem = {
  id: string;
  title: string;
  href: string;
  icon: any;
};

export default function Navbar() {
  const { translate: t } = useTranslations('common');
  const pathname = usePathname();
  const [isManagingMenu, setIsManagingMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Default menu items khi chưa có dữ liệu từ DB
  const defaultMenuItems: MenuItem[] = [
    {
      id: 'menu-1',
      title: t('navbar.home'),
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      id: 'menu-2',
      title: t('navbar.user'),
      href: "/user",
      icon: UserCircle2
    },
    {
      id: 'menu-3',
      title: t('navbar.category'),
      href: "/category",
      icon: Boxes
    },
    {
      id: 'menu-4',
      title: t('navbar.product'),
      href: "/product",
      icon: Boxes
    },
    {
      id: 'menu-5',
      title: t('navbar.chat'),
      href: "/chat",
      icon: Store
    }
  ];
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);

  // Load menu từ database khi component mount
  useEffect(() => {
    const loadMenus = async () => {
      try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const loadedMenus = data.map(item => ({
            id: item.menuId,
            title: item.title,
            href: item.href,
            icon: iconMap[item.icon] || Store
          }));
          setMenuItems(loadedMenus);
        }
      } catch (error) {
        console.error('Error loading menus:', error);
        setMenuItems(defaultMenuItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenus();
  }, []);

  const handleSaveMenu = async (newMenuItems: MenuItem[]) => {
    try {
      const menuItemsToSave = newMenuItems.map(item => {
        // Get icon type name directly
        let iconName = '';
        for (const [key, value] of Object.entries(iconMap)) {
          if (value === item.icon) {
            iconName = key;
            break;
          }
        }

        return {
          id: item.id,
          title: item.title,
          href: item.href,
          icon: iconName || 'Store'
        };
      });

      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItemsToSave)
      });

      if (!response.ok) {
        throw new Error('Failed to save menu');
      }

      // Cập nhật state và đóng menu manager
      setMenuItems(newMenuItems);
      setIsManagingMenu(false);
    } catch (error) {
      console.error('Error saving menus:', error);
      alert('Có lỗi khi lưu menu. Vui lòng thử lại.');
    }
  };

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
          <MenuManager 
            currentMenuItems={menuItems} 
            onSave={handleSaveMenu}
          />
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