'use client';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="mt-4 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
    >
      Đăng xuất
    </button>
  );
}