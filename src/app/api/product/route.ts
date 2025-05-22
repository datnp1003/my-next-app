import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';


export async function GET(req: NextRequest) {
    try {
        const products = await prisma.product.findMany({
        });

        if (!products) {
            return NextResponse.json({ error: 'No data' }, { status: 404 });
        }

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: '' }, { status: 500 });
    }
}

//hàm thêm product
export async function POST(req: NextRequest) {
    try {
        const { name, price, images, categoryId, description } = await req.json();
        const product = await prisma.product.create({
            data: { name, price, images, categoryId, description },
        });

        return NextResponse.json({ message: 'Product created successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    } 
}



