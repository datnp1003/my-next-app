'use client';

import { useState, useEffect } from 'react';
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
} from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';
import {
  UserCircle2,
  LayoutDashboard,
  Boxes,
  Settings,
  Store,
  FileBarChart,
  Users,
  ShoppingCart
} from "lucide-react";
import { useTranslations } from '@/i18n/client';

type MenuItem = {
  id: string;
  title: string;
  href: string;
  icon: any;
};

type Role = 'ADMIN' | 'SALES' | 'WAREHOUSE';

type MenuManagerProps = {
  currentMenuItems: MenuItem[];
  onSave: (items: MenuItem[], role: Role) => void;
};

function DroppableArea({ 
  id, 
  items,
  onReturnToAvailable 
}: { 
  id: string, 
  items: MenuItem[],
  onReturnToAvailable?: (item: MenuItem) => void 
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

export default function MenuManager({ currentMenuItems, onSave }: MenuManagerProps) {
  const { translate: t } = useTranslations('common');
  
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
      href: "/reports",
      icon: FileBarChart
    },
    {
      id: '7',
      title: 'Customers',
      href: "/customers",
      icon: Users
    },
    {
      id: '8',
      title: 'Orders',
      href: "/orders",
      icon: ShoppingCart
    }
  ];

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedMenus, setSelectedMenus] = useState<MenuItem[]>(currentMenuItems);
  const [selectedRole, setSelectedRole] = useState<Role>('ADMIN');
  const [isLoading, setIsLoading] = useState(false);
    // Setup initial available menus
  const [availableMenus, setAvailableMenus] = useState<MenuItem[]>(availableDefaultMenus);

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

  // Load menu khi role thay đổi
  useEffect(() => {
    const loadMenuForRole = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/menu?role=${selectedRole}`);
        const data = await response.json();        
        if (Array.isArray(data) && data.length > 0) {
          const loadedMenus = data.map(item => ({
            id: item.menuId, // Giữ nguyên id gốc
            title: item.title,
            href: item.href,
            icon: iconMap[item.icon] || Store
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
    setAvailableMenus(newSourceItems);

    // Add to selected container
    if (overId) {
      // Add at specific position in selected
      const overIndex = selectedMenus.findIndex(item => item.id === overId);
      const newSelectedItems = [...selectedMenus];
      if (overIndex !== -1) {
        newSelectedItems.splice(overIndex, 0, itemToMove);
      } else {
        newSelectedItems.push(itemToMove);
      }
      setSelectedMenus(newSelectedItems);
    } else {
      // Add to end of selected if no specific position
      setSelectedMenus(prev => [...prev, itemToMove]);
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };  const handleSave = () => {
    // Lưu menu và role mà không thêm prefix
    onSave(selectedMenus, selectedRole);
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
          className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? 'Đang tải...' : 'Lưu thay đổi'}
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
              ) : (                <DroppableArea 
                  id="selected" 
                  items={selectedMenus}
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
