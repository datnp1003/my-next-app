'use client';

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableItemProps = {
  id: string;
  item: {
    icon: any;
    title: string;
    href: string;
  };
  containerId?: string;
  onReturnToAvailable?: (item: { id: string; title: string; href: string; icon: any }) => void;
};

export function SortableItem({ id, item, containerId, onReturnToAvailable }: SortableItemProps) {
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
        flex items-center justify-between gap-2 p-3 mb-2 bg-white rounded shadow-sm border select-none
        ${isDragging ? 'opacity-50 shadow-lg border-sky-500' : 'border-gray-200'}
        hover:bg-gray-50 transition-all
      `}
    >
      <div {...attributes} {...listeners} className="flex items-center gap-2 flex-1 cursor-move">
        <item.icon className="w-5 h-5" />
        <span>{item.title}</span>
      </div>
      {containerId === 'selected' && (
        <button
          onClick={handleReturn}
          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
          title="Trả về menu có sẵn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"></path>
            <path d="M3 12h18"></path>
            <path d="M12 3l-4 4 4 4"></path>
          </svg>
        </button>
      )}
    </div>
  );
}
