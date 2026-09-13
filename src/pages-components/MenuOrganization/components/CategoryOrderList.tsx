import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CategoryOrderItem } from './CategoryOrderItem';

interface Props {
  categoryOrder: string[];
  onReorder: (categoryOrder: string[]) => void;
}

export const CategoryOrderList = ({ categoryOrder, onReorder }: Props) => {
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categoryOrder.indexOf(String(active.id));
    const newIndex = categoryOrder.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(categoryOrder, oldIndex, newIndex));
  }

  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-4 shadow-sm">
      <div>
        <h2 className="font-heading text-sm font-extrabold text-navy">
          Ordem das categorias
        </h2>
        <p className="text-xs text-text-muted">
          Arraste para definir qual categoria aparece primeiro no cardápio
          digital e na tela de organização.
        </p>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={categoryOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {categoryOrder.map((category, index) => (
              <CategoryOrderItem
                key={category}
                category={category}
                position={index + 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
