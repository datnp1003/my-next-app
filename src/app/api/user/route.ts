import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';


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

//hàm thêm user
export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }
        const users = await prisma.user.findMany();
        const existingUser = await prisma.user.findFirst({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        });

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    } 
}



