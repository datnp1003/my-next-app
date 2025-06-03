import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/menu - Lấy danh sách menu
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    const menus = await prisma.menu.findMany({
      where: role ? {
        role: role
      } : undefined,
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
    const { menuItems, role } = await req.json();

    if (!role || !Array.isArray(menuItems)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Bắt đầu transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Xóa tất cả menu cũ cho role này
      await tx.menu.deleteMany({
        where: {
          role: role
        }
      });

      // 2. Tạo menu mới với thứ tự cho role
      const savedMenus = await Promise.all(
        menuItems.map(async (item: any, index: number) => {
          const iconName = item.icon || 'Store';
          // Add role prefix to menuId to ensure uniqueness across roles
          const uniqueMenuId = `${role}-${item.id}`;

          try {
            return await tx.menu.create({
              data: {
                menuId: uniqueMenuId,
                title: item.title,
                href: item.href,
                icon: iconName,
                order: index,
                role: role
              },
            });
          } catch (err) {
            console.error(`Error creating menu item: ${uniqueMenuId}`, err);
            throw err; // Re-throw to trigger transaction rollback
          }
        })
      );

      return savedMenus;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving menus:', error);
    return NextResponse.json(
      { error: 'Error saving menus', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
