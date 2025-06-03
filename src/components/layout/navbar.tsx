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
  ShoppingCart,
  Menu as MenuIcon,
  X
} from "lucide-react";
import { useTranslations } from '@/i18n/client';
import Chat from '@/components/client/chat';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import MenuManager from './menu-manager';
import { useIsMobile } from "@/hooks/use-mobile";

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

type Role = 'ADMIN' | 'SALES' | 'WAREHOUSE';

export default function Navbar() {
  const { translate: t } = useTranslations('common');
  const pathname = usePathname();
  const [isManagingMenu, setIsManagingMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const [selectedRole, setSelectedRole] = useState<Role>((session?.user?.role as Role) || 'ADMIN');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isMobile = useIsMobile();

  const isAdmin = session?.user?.role === 'ADMIN';
  
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

  useEffect(() => {
    if (!isMobile) {
      setIsNavOpen(true);
    } else {
      setIsNavOpen(false);
    }
  }, [isMobile]);

  // Load menu from database when component mounts
  useEffect(() => {
    const loadMenus = async () => {
      try {
        const role = isAdmin ? selectedRole : session?.user?.role || 'ADMIN';
        const response = await fetch(`/api/menu?role=${role}`);
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const loadedMenus = data.map(item => ({
            id: item.menuId.replace(`${role}-`, ''), // Remove role prefix from menuId
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
  }, [session, selectedRole, isAdmin]);

  const handleSaveMenu = async (newMenuItems: MenuItem[], role: Role) => {
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
        body: JSON.stringify({
          menuItems: menuItemsToSave,
          role: role
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save menu');
      }

      const result = await response.json();

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

  // Lắng nghe sự kiện tin nhắn mới
  useEffect(() => {
    // Your existing message handling code...
  }, []);

  // Khi mở chat, reset thông báo
  const handleOpenChat = () => setNewMessageCount(0);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

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
            onSave={handleSaveMenu as (items: MenuItem[], role: Role) => void}
          />
        </div>
      ) : (
        <>
          {/* Mobile Menu Button */}
          <button
            onClick={toggleNav}
            className="md:hidden fixed top-4 left-4 z-50 p-2 bg-sky-900 text-white rounded-md hover:bg-sky-800"
            aria-label={isNavOpen ? "Close menu" : "Open menu"}
          >
            {isNavOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>

          {/* Backdrop for mobile */}
          {isMobile && isNavOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsNavOpen(false)}
            />
          )}

          {/* Navigation */}
          <nav
            className={`${
              isNavOpen ? "translate-x-0" : "-translate-x-full"
            } transform md:translate-x-0 transition-transform duration-200 ease-in-out fixed md:sticky top-0 left-0 w-64 h-screen bg-sky-900 shadow-sm flex flex-col z-50`}
          >
            {/* Close button for mobile */}
            {isMobile && (
              <button
                onClick={() => setIsNavOpen(false)}
                className="md:hidden absolute top-4 right-4 p-2 text-white hover:bg-sky-800 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="border-b border-sky-800">
              <div className="flex items-center h-16 px-4">
                <Store className="w-10 h-10 text-white" />
                <div className="flex items-center gap-2 ml-2">
                  {isAdmin && (
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as Role)}
                      className="px-2 py-1 text-sm bg-sky-800 text-white border border-sky-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="SALES">Sales</option>
                      <option value="WAREHOUSE">Warehouse</option>
                    </select>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => setIsManagingMenu(true)}
                      className="p-2 text-white hover:bg-sky-800 rounded-lg transition-colors"
                      title="Quản lý menu"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
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
                        onClick={() => isMobile && setIsNavOpen(false)}
                      >
                        {item.icon && <item.icon className="w-5 h-5" />}
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}