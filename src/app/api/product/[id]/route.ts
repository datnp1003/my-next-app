// Import các dependencies cần thiết
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import bcrypt from 'bcrypt';

// Xử lý DELETE request để xóa product
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // Lấy id từ URL
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });
        }

        // Kiểm tra product tồn tại
        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            return NextResponse.json({ error: 'Sản phẩm không tồn tại' }, { status: 404 });
        }

        // Xóa product
        await prisma.product.delete({
            where: { id },
        });

        // Trả về thông báo thành công
        return NextResponse.json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        // Xử lý lỗi
        console.error('Lỗi khi xóa sản phẩm:', error);
        return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
    }
}

// Xử lý PUT request để cập nhật sản phẩm
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        // Lấy id từ URL
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });
        }

        // Parse và validate request body
        const body = await request.json();

        const { name, price, images, categoryId, description } = body;

        // Kiểm tra sản phẩm tồn tại
        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            return NextResponse.json({ error: 'Sản phẩm không tồn tại' }, { status: 404 });
        }
        let bodyUpdate: any = { name, price, images, categoryId, description };
        // Cập nhật thông tin sản phẩm
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: bodyUpdate,
        });

        // Trả về sản phẩm đã cập nhật
        return NextResponse.json(updatedProduct);
    } catch (error) {
        // Xử lý lỗi
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
    }
}

// Xử lý GET request để lấy thông tin sản phẩm theo id
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return NextResponse.json({ error: 'Sản phẩm không tồn tại' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
    }
}


