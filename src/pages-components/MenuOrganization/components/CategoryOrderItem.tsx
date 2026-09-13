import { GripVertical } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import { cn } from 'lib/utils';

interface Props {
  category: string;
  position: number;
}

export const CategoryOrderItem = ({ category, position }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
      }}
      className={cn(
        'flex items-center gap-2 rounded-(--radius) border border-border bg-card px-3 py-2',
        isDragging ? 'shadow-lg' : 'shadow-sm'
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Arrastar para reordenar categoria"
        className="flex h-7 w-7 shrink-0 cursor-grab items-center justify-center text-text-muted active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-navy">
        {position}
      </span>
      <span className="text-sm font-semibold text-navy">{category}</span>
    </div>
  );
};
