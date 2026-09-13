import { Loader2 } from 'lucide-react';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';

import { AppShell } from 'components/AppShell';
import { MENU_CATEGORIES, Product } from 'pages-components/Stock/types/Product';
import { AddToMenuPanel } from './components/AddToMenuPanel';
import { CategoryColumn } from './components/CategoryColumn';
import { UNCATEGORIZED } from './constants';

interface Props {
  isLoading: boolean;
  groupedByCategory: Record<string, Product[]>;
  itemsNotInMenu: Product[];
  handleDragEnd: (event: DragEndEvent) => void;
  handleAddToMenu: (product: Product, category: string) => void;
  handleRemoveFromMenu: (product: Product) => void;
  handleGoToStock: () => void;
}

export const MenuOrganizationLayout = ({
  isLoading,
  groupedByCategory,
  itemsNotInMenu,
  handleDragEnd,
  handleAddToMenu,
  handleRemoveFromMenu,
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

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {MENU_CATEGORIES.map((category) => (
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
          </DndContext>
        )}
      </div>
    </AppShell>
  );
};
