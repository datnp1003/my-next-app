import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/menu - Lấy danh sách menu
export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(menus);
  } catch (error) {
    console.error('Error loading menus:', error);
    return NextResponse.json(
      { error: 'Error loading menus' },
      { status: 500 }
    );
  }
}

// POST /api/menu - Lưu danh sách menu
export async function POST(req: Request) {
  try {
    const menuItems = await req.json();

    // Bắt đầu transaction
    await prisma.$transaction(async (tx) => {
      // 1. Xóa tất cả menu cũ
      await tx.menu.deleteMany();

      // 2. Tạo menu mới với thứ tự
      await tx.menu.createMany({
        data: menuItems.map((item: any, index: number) => ({
          menuId: item.id,
          title: item.title,
          href: item.href,
          icon: item.icon.type?.name || item.icon.name || 'Store', // Lấy tên icon từ component
          order: index,
        })),
      });
    });

    // Trả về menu đã được sắp xếp
    const savedMenus = await prisma.menu.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(savedMenus);
  } catch (error) {
    console.error('Error saving menus:', error);
    return NextResponse.json(
      { error: 'Error saving menus', details: error },
      { status: 500 }
    );
  }
}
