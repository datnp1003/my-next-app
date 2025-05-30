'use client';

import { useSession } from "next-auth/react";
import Chat from "@/components/client/chat";

export default function ChatPage() {
    const { data: session, status } = useSession();
    const userId = session?.user?.id;
    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "unauthenticated") {
        return <div>Access Denied</div>;
    }

    return (
        <div className="p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Quản lý Chat</h1>
                <p className="text-gray-600">Quản lý trò chuyện với người dùng</p>
            </div>            
            <div className="fixed bottom-4 right-4">
                <Chat userId={userId} isAdmin={true} />
            </div>
        </div>
    );
}

