'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { Layout } from '@/components/layout/layout';


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