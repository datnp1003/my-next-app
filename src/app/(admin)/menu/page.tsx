'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    useDroppable
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import {
    UserCircle2,
    LayoutDashboard,
    Boxes,
    Settings,
    Store,
    FileBarChart,
    Users,
    ShoppingCart,
} from "lucide-react";
import { useTranslations } from '@/i18n/client';
import { CSS } from '@dnd-kit/utilities';

type MenuItem = {
    id: string;
    title: string;
    href: string;
    icon: any;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
};

type Role = 'ADMIN' | 'SALES' | 'WAREHOUSE';

type SortableItemProps = {
    id: string;
    item: {
        icon: any;
        title: string;
        href: string;
        canCreate?: boolean;
        canUpdate?: boolean;
        canDelete?: boolean;
    };
    containerId?: string;
    onReturnToAvailable?: (item: { id: string; title: string; href: string; icon: any }) => void;
    onPermissionChange?: (id: string, permission: 'canCreate' | 'canUpdate' | 'canDelete', value: boolean) => void;
};

function SortableItem({ id, item, containerId, onReturnToAvailable, onPermissionChange }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleReturn = () => {
        if (onReturnToAvailable) {
            onReturnToAvailable({ id, ...item });
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        flex items-center gap-2 p-3 mb-2 bg-white rounded shadow-sm border select-none
        ${isDragging ? 'opacity-50 shadow-lg border-sky-500' : 'border-gray-200'}
        hover:bg-gray-50 transition-all
      `}
        >
            <div {...attributes} {...listeners} className="flex items-center gap-2 flex-1 cursor-move">
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
            </div>

            {containerId === 'selected' && (
                <div className="flex items-center gap-3 mr-2">
                    <label className="flex items-center gap-1 text-sm">
                        <input
                            type="checkbox"
                            className="w-4 h-4 border-gray-300 rounded"
                            checked={item.canCreate}
                            onChange={(e) => onPermissionChange?.(id, 'canCreate', e.target.checked)}
                        />
                        Thêm
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                        <input
                            type="checkbox"
                            className="w-4 h-4 border-gray-300 rounded"
                            checked={item.canUpdate}
                            onChange={(e) => onPermissionChange?.(id, 'canUpdate', e.target.checked)}
                        />
                        Sửa
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                        <input
                            type="checkbox"
                            className="w-4 h-4 border-gray-300 rounded"
                            checked={item.canDelete}
                            onChange={(e) => onPermissionChange?.(id, 'canDelete', e.target.checked)}
                        />
                        Xóa
                    </label>
                </div>
            )}

            {containerId === 'selected' && (
                <button
                    onClick={handleReturn}
                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
                    title="Trả về menu có sẵn"
                >          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18"></path>
                        <path d="M6 6l12 12"></path>
                    </svg>
                </button>
            )}
        </div>
    );
}

function DroppableArea({
    id,
    items,
    onReturnToAvailable,
    onPermissionChange
}: {
    id: string,
    items: MenuItem[],
    onReturnToAvailable?: (item: MenuItem) => void,
    onPermissionChange?: (id: string, permission: 'canCreate' | 'canUpdate' | 'canDelete', value: boolean) => void
}) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <SortableContext
            items={items?.map(item => item.id) || []}
            id={id}
            strategy={verticalListSortingStrategy}
        >
            <div
                ref={setNodeRef}
                className="min-h-full"
                data-droppable={id}
            >
                {items?.length > 0 ? (
                    items.map((item) => (
                        <SortableItem
                            key={item.id}
                            id={item.id}
                            item={item}
                            containerId={id}
                            onReturnToAvailable={onReturnToAvailable}
                            onPermissionChange={onPermissionChange}
                        />
                    ))
                ) : (
                    <div className="flex items-center justify-center h-[450px] text-gray-400">
                        Kéo thả menu từ bên phải vào đây
                    </div>
                )}
            </div>
        </SortableContext>
    );
}

export default function MenuManagerPage() {
    const { translate: t } = useTranslations('common');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    // Map các tên icon sang component
    const iconMap: { [key: string]: any } = {
        LayoutDashboard,
        UserCircle2,
        Boxes,
        Store,
        Settings,
        FileBarChart,
        Users,
        ShoppingCart
    };

    // Menu có sẵn được set cứng
    const availableDefaultMenus: MenuItem[] = [
        {
            id: '1',
            title: t('navbar.home'),
            href: "/dashboard",
            icon: LayoutDashboard
        },
        {
            id: '2',
            title: t('navbar.user'),
            href: "/user",
            icon: UserCircle2
        },
        {
            id: '3',
            title: t('navbar.category'),
            href: "/category",
            icon: Boxes
        },
        {
            id: '4',
            title: t('navbar.product'),
            href: "/product",
            icon: Boxes
        },
        {
            id: '5',
            title: t('navbar.chat'),
            href: "/chat",
            icon: Store
        },
        {
            id: '6',
            title: 'Reports',
            href: "/report",
            icon: FileBarChart
        },
        {
            id: '7',
            title: 'Customers',
            href: "/customer",
            icon: Users
        },
        {
            id: '8',
            title: 'Orders',
            href: "/order",
            icon: ShoppingCart
        }
    ];

    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedMenus, setSelectedMenus] = useState<MenuItem[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role>('ADMIN');
    const [availableMenus, setAvailableMenus] = useState<MenuItem[]>(availableDefaultMenus);

    // Load menu khi role thay đổi
    useEffect(() => {
        const loadMenuForRole = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/menu?role=${selectedRole}`);
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    const loadedMenus = data.map(item => ({
                        id: item.menuId,
                        title: item.title,
                        href: item.href,
                        icon: iconMap[item.icon] || Store,
                        canCreate: item.canCreate,
                        canUpdate: item.canUpdate,
                        canDelete: item.canDelete
                    }));
                    setSelectedMenus(loadedMenus);
                } else {
                    setSelectedMenus([]); // Reset về rỗng nếu role chưa có menu
                }
            } catch (error) {
                console.error('Error loading menus:', error);
                setSelectedMenus([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadMenuForRole();
    }, [selectedRole]);

    // Cập nhật availableMenus khi selectedMenus thay đổi
    useEffect(() => {
        // Lấy tất cả href của menu đã chọn
        const selectedHrefs = new Set(selectedMenus.map(item => item.href));

        // Lọc ra những menu có trong availableDefaultMenus và không có trong selectedMenus
        const defaultMenusNotSelected = availableDefaultMenus.filter(item => !selectedHrefs.has(item.href));

        // Lọc ra những menu hiện tại trong availableMenus mà không có trong selectedMenus
        const currentAvailableNotSelected = (availableMenus || []).filter(item => !selectedHrefs.has(item.href));

        // Gộp lại và loại bỏ trùng lặp
        const newAvailableMenus = [...defaultMenusNotSelected, ...currentAvailableNotSelected]
            .filter((item, index, self) =>
                index === self.findIndex(t => t.href === item.href)
            );

        setAvailableMenus(newAvailableMenus);
    }, [selectedMenus]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        // Determine source and destination containers
        const sourceContainer = active.data.current?.sortable.containerId || 'available';
        const destinationContainer = over.data.current?.sortable.containerId || 'selected';

        if (sourceContainer === destinationContainer) {
            // Only allow reordering within the selected container
            if (sourceContainer === 'selected') {
                const oldIndex = selectedMenus.findIndex(item => item.id === activeId);
                const newIndex = selectedMenus.findIndex(item => item.id === overId);

                if (oldIndex !== -1 && newIndex !== -1) {
                    const newItems = arrayMove(selectedMenus, oldIndex, newIndex);
                    setSelectedMenus(newItems);
                }
            }
            setActiveId(null);
            return;
        }

        // Handle movement between containers (only from available to selected)
        const isMovingToSelected = sourceContainer === 'available' && destinationContainer === 'selected';

        // If the movement is not to selected container, ignore it
        if (!isMovingToSelected) {
            setActiveId(null);
            return;
        }

        const sourceItems = availableMenus || [];
        const itemToMove = sourceItems.find(item => item.id === activeId);

        if (!itemToMove) {
            setActiveId(null);
            return;
        }

        // Check for duplicates when moving between containers
        if (selectedMenus.some(item => item.href === itemToMove.href)) {
            setActiveId(null);
            return;
        }

        // Remove item from source container
        const newSourceItems = sourceItems.filter(item => item.id !== activeId);
        setAvailableMenus(newSourceItems);    // Add to selected container with default permissions
        const itemWithPermissions = {
            ...itemToMove,
            canCreate: false,
            canUpdate: false,
            canDelete: false
        };

        if (overId) {
            // Add at specific position in selected
            const overIndex = selectedMenus.findIndex(item => item.id === overId);
            const newSelectedItems = [...selectedMenus];
            if (overIndex !== -1) {
                newSelectedItems.splice(overIndex, 0, itemWithPermissions);
            } else {
                newSelectedItems.push(itemWithPermissions);
            }
            setSelectedMenus(newSelectedItems);
        } else {
            // Add to end of selected if no specific position
            setSelectedMenus(prev => [...prev, itemWithPermissions]);
        }

        setActiveId(null);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };
    const handlePermissionChange = (menuId: string, permission: 'canCreate' | 'canUpdate' | 'canDelete', value: boolean) => {
        setSelectedMenus(prev => prev.map(menu => {
            if (menu.id === menuId) {
                return {
                    ...menu,
                    [permission]: value
                };
            }
            return menu;
        }));
    };
    const handleSave = async () => {
        try {
            setIsSaving(true);
            const menuItemsToSave = selectedMenus.map(item => {
                let iconName = '';
                for (const [key, value] of Object.entries(iconMap)) {
                    if (value === item.icon) {
                        iconName = key;
                        break;
                    }
                } const menuItem = {
                    menuId: String(item.id), // Đảm bảo menuId luôn là string
                    title: item.title,
                    href: item.href,
                    icon: iconName || 'Store',
                    canCreate: Boolean(item.canCreate),
                    canUpdate: Boolean(item.canUpdate),
                    canDelete: Boolean(item.canDelete)
                };
                console.log('Saving menu item:', menuItem);
                return menuItem;
            });

            const response = await fetch('/api/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    menuItems: menuItemsToSave,
                    role: selectedRole
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save menu');
            }

            await response.json();
            console.log('Menu saved successfully');
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Error saving menus:', error);
            alert(error instanceof Error ? error.message : 'Có lỗi khi lưu menu. Vui lòng thử lại.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(e.target.value as Role);
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold">Quản lý Menu</h1>
                    <select
                        value={selectedRole}
                        onChange={handleRoleChange}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        disabled={isLoading}
                    >
                        <option value="ADMIN">Quản trị viên</option>
                        <option value="SALES">Nhân viên bán hàng</option>
                        <option value="WAREHOUSE">Nhân viên kho</option>
                    </select>
                </div>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-sky-900 text-white rounded-lg border border-sky-900 hover:bg-white hover:text-sky-900 hover:border hover:border-sky-900 transition-colors"
                >
                    Lưu thay đổi
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <div className="flex gap-4">
                    {/* Cột menu đã chọn bên trái */}
                    <div className="w-1/2 border rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-4">Menu đã chọn</h2>
                        <div className="min-h-[500px] border-2 border-dashed p-2 rounded border-gray-200">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Đang tải menu...
                                </div>
                            ) : (<DroppableArea
                                id="selected"
                                items={selectedMenus}
                                onPermissionChange={handlePermissionChange}
                                onReturnToAvailable={(item) => {
                                    const updatedSelectedMenus = selectedMenus.filter(m => m.id !== item.id);
                                    setSelectedMenus(updatedSelectedMenus);

                                    // Tìm menu gốc từ availableDefaultMenus
                                    const originalMenu = availableDefaultMenus.find(m => m.href === item.href) || item;
                                    setAvailableMenus([...availableMenus || [], originalMenu]);
                                }}
                            />
                            )}
                        </div>
                    </div>

                    {/* Cột menu có sẵn bên phải */}
                    <div className="w-1/2 border rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-4">Menu có sẵn</h2>
                        <div className="min-h-[500px] border-2 border-dashed p-2 rounded border-gray-200">
                            <DroppableArea id="available" items={availableMenus} />
                        </div>
                    </div>
                </div>

                <DragOverlay>
                    {activeId ? (
                        <div className="flex items-center gap-2 p-3 mb-2 bg-white rounded shadow-lg border border-sky-500 select-none">
                            {(() => {
                                const item = [...selectedMenus, ...availableMenus].find(
                                    (item) => item.id === activeId
                                );
                                if (!item) return null;
                                return (
                                    <>
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.title}</span>
                                    </>
                                );
                            })()}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}


