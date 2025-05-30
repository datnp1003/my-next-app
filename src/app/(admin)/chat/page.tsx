'use client';

import Chat from "@/components/client/chat";
import { useSession } from "next-auth/react";


export default function Home() {
    const { data: session, status } = useSession();
    const userId = session?.user?.id;

    return (
        <div>
            <h1>Chat Page</h1>
            <Chat
                userId={userId}
                isAdmin={true}
            />
        </div>

    );
}

