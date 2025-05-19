'use client';

import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Protected() {
    const router = useRouter();
    const { data: session } = useSession();

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
    };

    /**
     * if (session) {
        return (
            <div>
                <p>Xin chào, {session.user!.email}!</p>
                <button onClick={() => signOut()}>Đăng xuất</button>
            </div>
        );
    }

    return (
        <div>
            <p>Bạn chưa đăng nhập.</p>
            <Link href="/login">Đi đến trang đăng nhập</Link>
        </div>
    );
     */
    if (!session) {
        return (<div>
            <p>Bạn chưa đăng nhập.</p>
            <Link href="/login">Đi đến trang đăng nhập</Link>
        </div>)
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Protected Page</h1>
                <p className="mb-4">This is a protected page. You are logged in! {session!.user?.email}</p>
                <button
                    onClick={() => signOut()}
                    className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}