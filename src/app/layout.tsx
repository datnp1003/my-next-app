'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';
import Link from 'next/link';
import { SessionProvider } from 'next-auth/react';
import Header from "@/components/layout/header";
import Navbar from "@/components/layout/navbar";


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
        
        <div className="flex h-screen">
            <Navbar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 px-8 py-6 mt-16">
                {children}
              </main>
            </div>
          </div>
        </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}