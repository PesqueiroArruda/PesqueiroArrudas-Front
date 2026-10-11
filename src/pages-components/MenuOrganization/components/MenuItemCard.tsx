import { ChangeEvent, useRef } from 'react';
import { GripVertical, Loader2, Pencil, X } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import { cn } from 'lib/utils';
import { parseToBRL } from 'utils/parseToBRL';
import { Product } from 'pages-components/Stock/types/Product';

interface Props {
  product: Product;
  isUploadingImage: boolean;
  onRemove: (product: Product) => void;
  onChangeImage: (product: Product, file: File) => void;
}

export const MenuItemCard = ({
  product,
  isUploadingImage,
  onRemove,
  onChangeImage,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
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

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onChangeImage(product, file);
    e.target.value = '';
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
      }}
      className={cn(
        'flex cursor-grab items-center gap-2 rounded-card border border-border bg-card p-2.5 active:cursor-grabbing',
        isDragging ? 'shadow-lg' : 'shadow-sm'
      )}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-text-muted" />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onPointerDown={(e) => e.stopPropagation()}
        disabled={isUploadingImage}
        aria-label="Trocar foto do item"
        className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-secondary"
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        )}
        <span
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity',
            isUploadingImage
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
          )}
        >
          {isUploadingImage ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <Pencil className="h-4 w-4 text-white" />
          )}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileInputChange}
      />

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
        onPointerDown={(e) => e.stopPropagation()}
        aria-label="Remover do cardápio"
        className="flex h-8 w-8 shrink-0 items-center justify-center text-text-muted hover:text-destructive"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
