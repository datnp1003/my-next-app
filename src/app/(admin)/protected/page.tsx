'use client';

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Chào mừng đến với Dashboard</h1>
        <p>Xin chào, {session.user?.name || session.user?.email}!</p>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="mt-4 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}