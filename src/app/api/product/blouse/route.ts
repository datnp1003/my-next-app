import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const products = await prisma.product.findMany({
            where: {
                categoryId: 3,
            }
        });

        if (!products) {
            return NextResponse.json({ error: 'No data' }, { status: 404 });
        }

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: '' }, { status: 500 });
    }
}



