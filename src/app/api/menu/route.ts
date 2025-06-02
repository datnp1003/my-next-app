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
    const result = await prisma.$transaction(async (tx) => {
      // 1. Xóa tất cả menu cũ
      await tx.menu.deleteMany();

      // 2. Tạo menu mới với thứ tự
      const savedMenus = await Promise.all(
        menuItems.map(async (item: any, index: number) => {
          const iconName = item.icon || 'Store';

          return tx.menu.create({
            data: {
              menuId: item.id,
              title: item.title,
              href: item.href,
              icon: iconName,
              order: index,
            },
          });
        })
      );

      return savedMenus;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving menus:', error);
    return NextResponse.json(
      { error: 'Error saving menus', details: error },
      { status: 500 }
    );
  }
}
