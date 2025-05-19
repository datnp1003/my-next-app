'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  UserCircle2, 
  LayoutDashboard, 
  Boxes,
  Store
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Quản lý người dùng",
    href: "/user",
    icon: UserCircle2
  },
  {
    title: "Quản lý sản phẩm",
    href: "/products",
    icon: Boxes
  }
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 h-screen bg-sky-900 shadow-sm flex flex-col">
      <div className="border-b border-sky-800">
        <div className="flex items-center justify-center h-16">
          <Store className="w-10 h-10 text-white" />
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
    </nav>
  );
}