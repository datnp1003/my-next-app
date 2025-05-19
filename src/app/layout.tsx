'use client';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';
import Link from 'next/link';
import { SessionProvider } from 'next-auth/react';
import Header from "@/components/layout/header";
import Navbar from "@/components/layout/navbar";
import { Layout } from '@/components/layout/layout';


const { data: session, status } = useSession();

    if (!session) {
        redirect('/login');
    }


const queryClient = new QueryClient();
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <Layout children={children} />
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}