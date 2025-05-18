'use client';

import { useRouter } from 'next/navigation';

export default function Protected() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Protected Page</h1>
                <p className="mb-4">This is a protected page. You are logged in!</p>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}