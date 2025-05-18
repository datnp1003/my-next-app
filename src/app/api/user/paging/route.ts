import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { page, pageSize, filter } = body;
        //lấy thông tin field từ filter và gán vào where
        const [email, name] = Object.keys(filter);
        const [emailValue, nameValue] = Object.values(filter);
        const users = await prisma.user.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {
                AND: [
                    {
                        [email]: {
                            contains: emailValue || ''
                        },
                    },
                    {
                        [name]: {
                            contains: nameValue || ''
                        },
                    },
                ],
            },
        });
        const totalItem = await prisma.user.count();
        const totalPage = Math.ceil(totalItem / pageSize);

        if (!users) {
            return NextResponse.json({ error: 'No data' }, { status: 404 });
        }
        const response = {
            page,
            pageSize,
            totalItem,
            totalPage,
            data: users,
            filter: {
                [email]: emailValue,
                [name]: nameValue,
            },
        };
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: '' }, { status: 500 });
    }
}