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
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
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
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const role = session?.user?.role as Role || 'ADMIN';
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isMobile = useIsMobile();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const isAdmin = session?.user?.role === 'ADMIN';
  const [selectedRole, setSelectedRole] = useState<Role>(role);

  useEffect(() => {
    if (!isMobile) {
      setIsNavOpen(true);
    } else {
      setIsNavOpen(false);
    }
  }, [isMobile]);
  useEffect(() => {
    // Load menu from database when component mounts
    const loadMenus = async () => {
      try {
        // Nếu là ADMIN sẽ dùng selectedRole, ngược lại dùng role hiện tại của user
        const roleToUse = isAdmin ? selectedRole : role;
        const response = await fetch(`/api/menu?role=${roleToUse}`);
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const loadedMenus = data.map(item => ({
            id: item.menuId,
            title: item.title,
            href: item.href,
            icon: iconMap[item.icon] || Store
          }));
          setMenuItems(loadedMenus);
        } else {
          setMenuItems([]); // Set empty array if no data
        }
      } catch (error) {
        console.error('Error loading menus:', error);
        setMenuItems([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    loadMenus();
  }, [session, role, isAdmin, selectedRole]);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="relative">
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

        {/* Icon Section */}
        <div className="flex flex-col items-center pt-3">
          <div className="flex justify-center items-center mb-4">
            <Store className="w-12 h-12 text-white" />
          </div>
          <div className="w-16 h-[1px] bg-sky-800/30"></div>
        </div>
        
        {/* Admin Controls Section */}
        {isAdmin && (
          <div className="flex flex-col gap-4 px-4 pb-5 border-b border-sky-800">
            <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as Role)}
                    className="w-full px-3 py-2 text-sm bg-sky-800 text-white border border-sky-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SALES">Sales</option>
                    <option value="WAREHOUSE">Warehouse</option>
            </select>
            <Link
              href="/menu"
              className="w-full flex items-center justify-center gap-2 px-3 py-3 text-white bg-sky-800 hover:bg-sky-700 rounded-lg transition-colors"
              title="Quản lý menu"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm">Quản lý Menu</span>
            </Link>
          </div>
        )}

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-white">
              Đang tải menu...
            </div>
          ) : (
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
          )}
        </div>
      </nav>
    </div>
  );
}