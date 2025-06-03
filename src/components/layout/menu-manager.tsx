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
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '../layout/sortable-item';
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

export default function MenuManager({ currentMenuItems, onSave }: MenuManagerProps) {
  const { translate: t } = useTranslations('common');
  
  // Menu có sẵn được set cứng
  const availableDefaultMenus: MenuItem[] = [
    {
      id: 'menu-6',
      title: 'Settings',
      href: "/settings",
      icon: Settings
    },
    {
      id: 'menu-7',
      title: 'Reports',
      href: "/reports",
      icon: FileBarChart
    },
    {
      id: 'menu-8',
      title: 'Analytics',
      href: "/analytics", 
      icon: Store
    },
    {
      id: 'menu-9',
      title: 'Customers',
      href: "/customers",
      icon: Users
    },
    {
      id: 'menu-10',
      title: 'Orders',
      href: "/orders",
      icon: ShoppingCart
    }
  ];

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedMenus, setSelectedMenus] = useState<MenuItem[]>(currentMenuItems);
  const [selectedRole, setSelectedRole] = useState<Role>('ADMIN');
  
  // Lọc bỏ những menu đã có trong selectedMenus
  const filteredAvailableMenus = availableDefaultMenus.filter(availableItem => 
    !selectedMenus.some(selectedItem => selectedItem.href === availableItem.href)
  );
  
  const [availableMenus, setAvailableMenus] = useState<MenuItem[]>(filteredAvailableMenus);

  // Cập nhật availableMenus khi selectedMenus thay đổi
  useEffect(() => {
    const newAvailableMenus = availableDefaultMenus.filter(availableItem => 
      !selectedMenus.some(selectedItem => selectedItem.href === availableItem.href)
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
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Xác định container nguồn và đích
    const activeContainer = active.data.current?.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId;

    if (activeContainer === overContainer) {
      // Sắp xếp trong cùng một container
      const items = activeContainer === 'selected' ? selectedMenus : availableMenus;
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === overId);

      const newItems = arrayMove(items, oldIndex, newIndex);

      if (activeContainer === 'selected') {
        setSelectedMenus(newItems);
      } else {
        setAvailableMenus(newItems);
      }
    } else {
      // Di chuyển giữa các container
      const sourceItems = activeContainer === 'selected' ? selectedMenus : availableMenus;
      const destItems = activeContainer === 'selected' ? availableMenus : selectedMenus;

      // Tìm item để di chuyển và giữ nguyên thông tin icon
      const itemToMove = sourceItems.find((item) => item.id === activeId);
      if (!itemToMove) return;

      // Xóa item khỏi container nguồn
      const sourceNewItems = sourceItems.filter((item) => item.id !== activeId);

      // Thêm item vào container đích
      const destNewItems = [...destItems];
      const overIndex = destItems.findIndex((item) => item.id === overId);
      
      if (overIndex >= 0) {
        destNewItems.splice(overIndex, 0, {
          ...itemToMove,
          icon: itemToMove.icon // Giữ nguyên icon gốc
        });
      } else {
        destNewItems.push({
          ...itemToMove,
          icon: itemToMove.icon // Giữ nguyên icon gốc
        });
      }

      if (activeContainer === 'selected') {
        setSelectedMenus(sourceNewItems);
        setAvailableMenus(destNewItems);
      } else {
        setSelectedMenus(destNewItems);
        setAvailableMenus(sourceNewItems);
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleSave = () => {
    onSave(selectedMenus, selectedRole);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Quản lý Menu</h1>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as Role)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ADMIN">Quản trị viên</option>
            <option value="SALES">Nhân viên bán hàng</option>
            <option value="WAREHOUSE">Nhân viên kho</option>
          </select>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          Lưu thay đổi
        </button>
      </div>

      <div className="flex gap-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          {/* Cột menu đã chọn bên trái */}
          <div className="w-1/2 border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Menu đang hiển thị</h2>
            <div className="min-h-[500px] border-2 border-dashed p-2 rounded border-gray-200">
              <SortableContext
                items={selectedMenus.map(item => item.id)}
                id="selected"
                strategy={verticalListSortingStrategy}
              >
                {selectedMenus.map((item) => (
                  <SortableItem key={item.id} id={item.id} item={item} />
                ))}
              </SortableContext>
            </div>
          </div>

          {/* Cột menu có sẵn bên phải */}
          <div className="w-1/2 border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Menu có sẵn</h2>
            <div className="min-h-[500px] border-2 border-dashed p-2 rounded border-gray-200">
              <SortableContext
                items={availableMenus.map(item => item.id)}
                id="available"
                strategy={verticalListSortingStrategy}
              >
                {availableMenus.map((item) => (
                  <SortableItem key={item.id} id={item.id} item={item} />
                ))}
              </SortableContext>
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
    </div>
  );
}
