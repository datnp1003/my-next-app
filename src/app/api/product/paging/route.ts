import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { page, pageSize, filter } = body;
        //lấy thông tin field từ filter và gán vào where
        const [name] = Object.keys(filter);
        const [nameValue] = Object.values(filter);
        const categories = await prisma.product.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: {
                AND: [
                    {
                        [name]: {
                            contains: nameValue || ''
                        },
                    },
                ],
            },
        });
        const totalItem = await prisma.product.count();
        const totalPage = Math.ceil(totalItem / pageSize);

        if (!categories) {
            return NextResponse.json({ error: 'No data' }, { status: 404 });
        }
        const response = {
            page,
            pageSize,
            totalItem,
            totalPage,
            data: categories,
            filter: {
                [name]: nameValue,
            },
        };
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: '' }, { status: 500 });
    }
}