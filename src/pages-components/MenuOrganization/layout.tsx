import { Loader2 } from 'lucide-react';
import {
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCorners,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';

import { AppShell } from 'components/AppShell';
import { Product } from 'pages-components/Stock/types/Product';
import { AddToMenuPanel } from './components/AddToMenuPanel';
import { CategoryColumn } from './components/CategoryColumn';
import { CategoryOrderList } from './components/CategoryOrderList';
import { MenuItemDragPreview } from './components/MenuItemDragPreview';
import { UNCATEGORIZED } from './constants';

// closestCorners sozinho pode "perder" o destino em grades de várias
// colunas lado a lado (o item volta pro lugar de origem mesmo depois de
// solto sobre outra categoria). Prioriza onde o ponteiro está de fato,
// caindo pra interseção de retângulos e só depois pra distância de cantos.
const collisionDetectionStrategy: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) return pointerCollisions;

  const intersections = rectIntersection(args);
  if (intersections.length > 0) return intersections;

  return closestCorners(args);
};

interface Props {
  isLoading: boolean;
  categoryOrder: string[];
  groupedByCategory: Record<string, Product[]>;
  itemsNotInMenu: Product[];
  activeProduct: Product | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
  handleAddToMenu: (product: Product, category: string) => void;
  handleRemoveFromMenu: (product: Product) => void;
  handleReorderCategories: (categoryOrder: string[]) => void;
  handleGoToStock: () => void;
}

export const MenuOrganizationLayout = ({
  isLoading,
  categoryOrder,
  groupedByCategory,
  itemsNotInMenu,
  activeProduct,
  handleDragStart,
  handleDragEnd,
  handleDragCancel,
  handleAddToMenu,
  handleRemoveFromMenu,
  handleReorderCategories,
  handleGoToStock,
}: Props) => {
  const hasUncategorized = groupedByCategory[UNCATEGORIZED]?.length > 0;

  return (
    <AppShell hasBackPageBtn handleBackPage={handleGoToStock}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-xl font-extrabold text-navy sm:text-2xl">
            Organização do Cardápio
          </h1>
          <p className="text-sm text-text-muted">
            Arraste os itens para reordenar ou mover entre categorias. As
            alterações são salvas automaticamente.
          </p>
        </div>

        <AddToMenuPanel
          itemsNotInMenu={itemsNotInMenu}
          onAdd={handleAddToMenu}
        />

        <CategoryOrderList
          categoryOrder={categoryOrder}
          onReorder={handleReorderCategories}
        />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : (
          <DndContext
            collisionDetection={collisionDetectionStrategy}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {categoryOrder.map((category) => (
                <CategoryColumn
                  key={category}
                  categoryKey={category}
                  title={category}
                  items={groupedByCategory[category] || []}
                  onRemove={handleRemoveFromMenu}
                />
              ))}
              {hasUncategorized && (
                <CategoryColumn
                  categoryKey={UNCATEGORIZED}
                  title="Sem categoria padrão"
                  items={groupedByCategory[UNCATEGORIZED] || []}
                  onRemove={handleRemoveFromMenu}
                />
              )}
            </div>
            <DragOverlay>
              {activeProduct && <MenuItemDragPreview product={activeProduct} />}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </AppShell>
  );
};
