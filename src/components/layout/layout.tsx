'use client';
import Header from "./header";
import Navbar from "./navbar";
import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";
import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';

export function Layout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();

    if (pathname.startsWith('/client')) {
        return children;
    }

    return (
        <>
            {session ? (
                <div className="flex min-h-screen h-screen overflow-hidden">
                    <Navbar />
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        <Header />
                        <main className="flex-1 overflow-auto px-4 md:px-8 py-6 mt-16">
                            {children}
                        </main>
                    </div>
                </div>
            ) : (
                pathname === '/register' ? <RegisterPage /> : <LoginPage />
            )}
        </>
    );
}
