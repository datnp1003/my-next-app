'use client';

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableItemProps = {
  id: string;
  item: {
    icon: any;
    title: string;
  };
};

export function SortableItem({ id, item }: SortableItemProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        flex items-center gap-2 p-3 mb-2 bg-white rounded shadow-sm border select-none cursor-move
        ${isDragging ? 'opacity-50 shadow-lg border-sky-500' : 'border-gray-200'}
        hover:bg-gray-50 transition-all
      `}
    >
      <item.icon className="w-5 h-5" />
      <span>{item.title}</span>
    </div>
  );
}
