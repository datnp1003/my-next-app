// Import các dependencies cần thiết
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import bcrypt from 'bcrypt';

// Xử lý DELETE request để xóa category
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // Lấy id từ URL
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });
        }

        // Kiểm tra category tồn tại
        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            return NextResponse.json({ error: 'Danh mục không tồn tại' }, { status: 404 });
        }

        // Xóa category
        await prisma.category.delete({
            where: { id },
        });

        // Trả về thông báo thành công
        return NextResponse.json({ message: 'Xóa danh mục thành công' });
    } catch (error) {
        // Xử lý lỗi
        console.error('Lỗi khi xóa danh mục:', error);
        return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
    }
}

// Xử lý PUT request để cập nhật category
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        // Lấy id từ URL
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });
        }

        // Parse và validate request body
        const body = await request.json();

        const { name } = body;

        // Kiểm tra category tồn tại
        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            return NextResponse.json({ error: 'Danh mục không tồn tại' }, { status: 404 });
        }
        //nếu k cập nhật password thì giữ nguyên pass, cập nhật nơi khác
        let bodyUpdate: any = { name };
        // Cập nhật thông tin category
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: bodyUpdate,
        });

        // Trả về category đã cập nhật
        return NextResponse.json(updatedCategory);
    } catch (error) {
        // Xử lý lỗi
        console.error('Lỗi khi cập nhật category:', error);
        return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
    }
}

// Xử lý GET request để lấy thông tin category theo id
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });
        }

        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            return NextResponse.json({ error: 'Danh mục không tồn tại' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error('Lỗi khi lấy category:', error);
        return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
    }
}


