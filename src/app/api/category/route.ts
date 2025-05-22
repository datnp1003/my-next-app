import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';


export async function GET(req: NextRequest) {
    try {
        const categories = await prisma.category.findMany({
        });

        if (!categories) {
            return NextResponse.json({ error: 'No data' }, { status: 404 });
        }

        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: '' }, { status: 500 });
    }
}

//hàm thêm category
export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json();
        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const existingCategory = await prisma.category.findFirst({ where: { name } });
        if (existingCategory) {
            return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: { name },
        });

        return NextResponse.json({ message: 'Category created successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    } 
}



