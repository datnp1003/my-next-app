'use client';
import Header from "./header";
import Navbar from "./navbar";
import LoginPage from "@/app/login/page";
import { useSession } from "next-auth/react";

export function Layout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    return (
        <>
            {session ? (<div className="flex h-screen">
                <Navbar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 px-8 py-6 mt-16">
                        {children}
                    </main>
                </div>
            </div>) : (<LoginPage />)}
        </>
    );
}