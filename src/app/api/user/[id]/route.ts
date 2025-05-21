// Import các dependencies cần thiết
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import bcrypt from 'bcrypt';

// Xử lý DELETE request để xóa user
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // Lấy id từ URL
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });
        }

        // Kiểm tra user tồn tại
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 });
        }

        // Xóa user
        await prisma.user.delete({
            where: { id },
        });

        // Trả về thông báo thành công
        return NextResponse.json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
        // Xử lý lỗi
        console.error('Lỗi khi xóa user:', error);
        return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
    }
}

// Xử lý PUT request để cập nhật user
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        // Lấy id từ URL
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });
        }

        // Parse và validate request body
        const body = await request.json();

        const { email, name, password } = body;

        // Kiểm tra user tồn tại
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 });
        }
        //nếu k cập nhật password thì giữ nguyên pass, cập nhật nơi khác
        let bodyUpdate: any = { name, email };
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            bodyUpdate = { name, email, password: hashedPassword };
        }
        // Cập nhật thông tin user
        const updatedUser = await prisma.user.update({
            where: { id },
            data: bodyUpdate,
        });

        // Trả về user đã cập nhật
        return NextResponse.json(updatedUser);
    } catch (error) {
        // Xử lý lỗi
        console.error('Lỗi khi cập nhật user:', error);
        return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
    }
}

// Xử lý GET request để lấy thông tin user theo id
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Lỗi khi lấy user:', error);
        return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
    }
}


