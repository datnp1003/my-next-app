'use client';

import { useState } from 'react';
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

type MenuManagerProps = {
  currentMenuItems: MenuItem[];
};

export default function MenuManager({ currentMenuItems }: MenuManagerProps) {
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
  const [availableMenus, setAvailableMenus] = useState<MenuItem[]>(availableDefaultMenus);

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

      const itemToMove = sourceItems.find((item) => item.id === activeId);
      if (!itemToMove) return;

      const sourceNewItems = sourceItems.filter((item) => item.id !== activeId);
      const destNewItems = [...destItems];

      const overIndex = destItems.findIndex((item) => item.id === overId);
      if (overIndex >= 0) {
        destNewItems.splice(overIndex, 0, itemToMove);
      } else {
        destNewItems.push(itemToMove);
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

  return (
    <div className="flex gap-4 p-4">
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
  );
}
