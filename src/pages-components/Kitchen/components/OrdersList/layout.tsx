// OrdersListLayout.tsx
import { useContext, useMemo } from 'react';
import { Moon } from 'lucide-react';
import { KitchenContext } from 'pages-components/Kitchen';

// dnd-kit
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

import { DraggableOrder } from '../DraggableOrder';
import { Order as OrderProps } from '../../../../types/Order';

interface Props {
  orders: OrderProps[];
  onReorder?: (nextOrders: OrderProps[]) => void; // opcional, se o pai quiser refletir
}

export const OrdersListLayout = ({ orders, onReorder }: Props) => {
  const {
    isKitchen, setIsKitchen,
    frontOrderByCategory, setFrontOrderByCategory,
  } = useContext(KitchenContext);

  const category = isKitchen ? 'kitchen' : 'bar';

  const visibleOrdersRaw = useMemo(
    () => orders.filter(o => !o.isMade && o.orderCategory === category),
    [orders, category]
  );

  // 🔹 Ordena pela ordem local (fallback: mantém ordem natural)
  const orderIds = frontOrderByCategory[category] || [];
  const indexMap = new Map(orderIds.map((id: any, i: any) => [id, i]));
  const visibleOrders = useMemo(
    () =>
      [...visibleOrdersRaw].sort((a, b) => {
        const ia = indexMap.has(a._id) ? (indexMap.get(a._id) as number) : Number.MAX_SAFE_INTEGER;
        const ib = indexMap.has(b._id) ? (indexMap.get(b._id) as number) : Number.MAX_SAFE_INTEGER;
        return ia - ib;
      }),
    [visibleOrdersRaw, orderIds]
  );

  const visibleIds = useMemo(() => visibleOrders.map(o => o._id), [visibleOrders]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = visibleIds.indexOf(String(active.id));
    const newIndex = visibleIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    // Reordena só os visíveis
    const newVisibleOrder = arrayMove(visibleIds, oldIndex, newIndex);

    // Atualiza o array de IDs da categoria:
    // regra: manter outros IDs (que não estão visíveis — ex.: já feitos ou outra categoria) como estão
    const setLocal = new Set(newVisibleOrder);
    const unchanged = orderIds.filter((id:any) => !setLocal.has(id));
    const nextIds = [...newVisibleOrder, ...unchanged];

    setFrontOrderByCategory((prev: any) => ({ ...prev, [category]: nextIds }));

    // Se quiser notificar o pai com a lista completa já “visual-ordenada”:
    if (onReorder) {
      const inVisible = new Set(newVisibleOrder);
      const movedVisible = visibleOrders
        .slice() // cópia já ordenada pelo newVisibleOrder acima
        .sort((a, b) => newVisibleOrder.indexOf(a._id) - newVisibleOrder.indexOf(b._id));
      const otherGroup = orders.filter(o => !inVisible.has(o._id));
      onReorder([...movedVisible, ...otherGroup]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <label htmlFor="kitchen-bar-toggle" className="flex items-center gap-2.5 text-sm font-bold text-navy">
        <span className="relative inline-flex h-5 w-9 items-center">
          <input
            id="kitchen-bar-toggle"
            type="checkbox"
            checked={isKitchen}
            onChange={(e) => setIsKitchen(e.target.checked)}
            className="peer sr-only"
          />
          <span className="absolute inset-0 rounded-full bg-secondary transition-colors peer-checked:bg-gold" />
          <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
        </span>
        {isKitchen ? 'Cozinha' : 'Bar'}
      </label>

      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={visibleIds} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {visibleOrders.map((order) => (
              <DraggableOrder order={order} key={order._id} />
            ))}

            {visibleOrders.length === 0 && (
              <div className="mt-2 flex items-center justify-center gap-2 rounded-card bg-secondary p-4 shadow-sm">
                <Moon className="h-6 w-6 text-navy" />
                <span className="text-center font-heading text-lg font-extrabold text-navy sm:text-xl">
                  Nenhum pedido a ser preparado
                </span>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
