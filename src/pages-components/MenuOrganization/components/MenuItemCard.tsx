import { GripVertical, X } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import { cn } from 'lib/utils';
import { parseToBRL } from 'utils/parseToBRL';
import { Product } from 'pages-components/Stock/types/Product';

interface Props {
  product: Product;
  onRemove: (product: Product) => void;
}

export const MenuItemCard = ({ product, onRemove }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product._id as string });

  const imageUrl = product.menu?.imageKey
    ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL}/${product.menu.imageKey}`
    : product.imageURL;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
      }}
      className={cn(
        'flex items-center gap-2 rounded-card border border-border bg-card p-2.5',
        isDragging ? 'shadow-lg' : 'shadow-sm'
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Arrastar para reordenar"
        className="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center text-text-muted active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={product.name}
          className="h-10 w-10 shrink-0 rounded-md object-cover"
        />
      ) : (
        <div className="h-10 w-10 shrink-0 rounded-md bg-secondary" />
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy">
          {product.name}
        </p>
        <p className="text-xs text-text-muted">
          {parseToBRL(product.unitPrice || 0)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(product)}
        aria-label="Remover do cardápio"
        className="flex h-8 w-8 shrink-0 items-center justify-center text-text-muted hover:text-destructive"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
