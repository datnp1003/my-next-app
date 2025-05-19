'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';
import Link from 'next/link';
import { SessionProvider } from 'next-auth/react';

// export const metadata = {
//   title: 'Auth App',
//   description: 'Next.js Auth with Prisma and JWT',
// };

const queryClient = new QueryClient();
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <header className="bg-blue-600 text-white p-4">
              <nav className="container mx-auto flex justify-between">
                <h1 className="text-2xl font-bold">Auth App</h1>
                <ul className="flex space-x-4">
                  <li><Link href="/register" className="hover:underline">Register</Link></li>
                  <li><Link href="/login" className="hover:underline">Login</Link></li>
                  <li><Link href="/protected" className="hover:underline">Protected</Link></li>
                </ul>
              </nav>
            </header>
            <main className="container mx-auto p-4">{children}</main>
          </QueryClientProvider></SessionProvider>
      </body>
    </html>
  );
}