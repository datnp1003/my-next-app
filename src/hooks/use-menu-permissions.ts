'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type MenuPermissions = {
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    isLoading: boolean;
    error: string | null;
};

export function useMenuPermissions(userRole: string) {
    const [permissions, setPermissions] = useState<MenuPermissions>({
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        isLoading: true,
        error: null
    });

    const pathname = usePathname();

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                // Convert pathname to href format (e.g., /category -> /category)
                const href = pathname.replace(/^\/admin/, '');
                
                // Fetch menu permissions for the current page and role
                const response = await fetch(`/api/menu?role=${userRole}`);
                const menus = await response.json();

                // Find the menu item matching current path
                const currentMenu = menus.find((menu: any) => menu.href === href);

                if (currentMenu) {
                    setPermissions({
                        canCreate: currentMenu.canCreate || false,
                        canUpdate: currentMenu.canUpdate || false,
                        canDelete: currentMenu.canDelete || false,
                        isLoading: false,
                        error: null
                    });
                } else {
                    setPermissions({
                        canCreate: false,
                        canUpdate: false,
                        canDelete: false,
                        isLoading: false,
                        error: 'Menu not found'
                    });
                }
            } catch (error) {
                setPermissions(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Failed to fetch permissions'
                }));
            }
        };

        fetchPermissions();
    }, [pathname, userRole]);

    return permissions;
}
