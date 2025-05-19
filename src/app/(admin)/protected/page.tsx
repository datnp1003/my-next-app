import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';
import SignOutButton from '@/components/layout/SignOutButton';
export default async function DashboardPage() {
  /**
   * getServerSession chỉ thực hiện trên server
   * không dùng use client được
   * tạo riêng button đăng xuất
   * để có thể dùng use client
   */
  const session = await getServerSession();

  if (!session) {
    redirect('/login?redirect=/protected');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Chào mừng đến với Dashboard</h1>
        <p>Xin chào, {session.user?.name || session.user?.email}!</p>
        <SignOutButton />
      </div>
    </div>
  );
}