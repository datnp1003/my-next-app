'use client';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="mt-4 bg-gray-500 text-s text-white p-2 rounded-md hover:bg-sky-900"
    >
      Sign Out
    </button>
  );
}