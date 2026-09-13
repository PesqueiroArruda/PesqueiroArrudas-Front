import { GripVertical } from 'lucide-react';

import { parseToBRL } from 'utils/parseToBRL';
import { Product } from 'pages-components/Stock/types/Product';

interface Props {
  product: Product;
}

// Card "fantasma" mostrado dentro do DragOverlay do dnd-kit — sem os hooks
// de useSortable, já que aqui ele só acompanha o cursor, não representa
// mais uma posição real na lista.
export const MenuItemDragPreview = ({ product }: Props) => {
  const imageUrl = product.menu?.imageKey
    ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL}/${product.menu.imageKey}`
    : product.imageURL;

  return (
    <div className="flex cursor-grabbing items-center gap-2 rounded-card border border-border bg-card p-2.5 shadow-lg">
      <GripVertical className="h-4 w-4 shrink-0 text-text-muted" />

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
    </div>
  );
};
