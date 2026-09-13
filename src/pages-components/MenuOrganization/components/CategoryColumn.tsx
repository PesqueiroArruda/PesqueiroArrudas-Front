import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { cn } from 'lib/utils';
import { Product } from 'pages-components/Stock/types/Product';
import { MenuItemCard } from './MenuItemCard';

interface Props {
  categoryKey: string;
  title: string;
  items: Product[];
  onRemove: (product: Product) => void;
}

export const CategoryColumn = ({
  categoryKey,
  title,
  items,
  onRemove,
}: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id: categoryKey });
  const itemIds = items.map((item) => item._id as string);

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-card bg-secondary/60 p-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-heading text-sm font-extrabold text-navy">
          {title}
        </h3>
        <span className="text-xs font-semibold text-text-muted">
          {items.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-20 flex-col gap-2 rounded-(--radius) p-1 transition-colors',
          isOver && 'bg-cyan/10 ring-2 ring-cyan/40'
        )}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <MenuItemCard key={item._id} product={item} onRemove={onRemove} />
          ))}
        </SortableContext>

        {items.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-(--radius) border border-dashed border-border py-6 text-center text-xs text-text-muted">
            Arraste itens para cá
          </div>
        )}
      </div>
    </div>
  );
};
