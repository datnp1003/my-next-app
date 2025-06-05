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
    console.log('Received request:', {
      role,
      menuItemsCount: menuItems?.length,
      menuItems: JSON.stringify(menuItems, null, 2)
    });

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
          try {
            console.log('Creating menu item:', {
              menuId: item.menuId,
              title: item.title,
              href: item.href,
              icon: iconName,
              order: index,
              role: role,
              canCreate: item.canCreate,
              canUpdate: item.canUpdate,
              canDelete: item.canDelete,
            });
            // Validate input data
            if (!item.menuId || !item.title || !item.href) {
              throw new Error(`Missing required fields for menu item: ${JSON.stringify(item)}`);
            }
            const menuData = {
              menuId: String(item.menuId),
              title: item.title,
              href: item.href,
              icon: iconName,
              order: index,
              role: role,
              canCreate: item.canCreate === true,
              canUpdate: item.canUpdate === true,
              canDelete: item.canDelete === true
            };
            console.log('Creating menu item with data:', JSON.stringify(menuData, null, 2));

            return await tx.menu.create({
              data: menuData
            });
          } catch (err) {
            console.error(`Error creating menu item: ${item.id}`, err);
            throw err; // Re-throw to trigger transaction rollback
          }
        })
      );

      return savedMenus;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving menus:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: 'Error saving menus',
        message: error instanceof Error ? error.message : String(error),
        type: error instanceof Error ? error.constructor.name : typeof error,
      },
      { status: 500 }
    );
  }
}
