import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await prisma.user.findMany({
        });

        if (!user) {
            return NextResponse.json({ error: 'No data' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: '' }, { status: 500 });
    }
}

