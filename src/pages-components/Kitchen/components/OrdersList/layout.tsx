// OrdersListLayout.tsx
import { useContext, useMemo } from 'react';
import { Flex, Heading, Icon, Stack, Switch } from '@chakra-ui/react';
import { RiZzzFill } from 'react-icons/ri';
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
    <>
      <Switch isChecked={isKitchen} onChange={(e) => setIsKitchen(e.target.checked)}>
        {isKitchen ? 'Cozinha' : 'Bar'}
      </Switch>

      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={visibleIds} strategy={verticalListSortingStrategy}>
          <Stack gap={[2, 4]} alignItems={visibleOrders.length === 0 ? 'center' : 'auto'}>
            {visibleOrders.length > 0 &&
              visibleOrders.map(order => <DraggableOrder order={order} key={order._id} />)}

            {visibleOrders.length === 0 && (
              <Flex
                gap={2}
                mt={4}
                align="center"
                justify="center"
                bg="blue.50"
                p={[2, 4]}
                boxShadow="sm"
                rounded={4}
              >
                <Icon as={RiZzzFill} fontSize={[20, 24]} color="blue.800" />
                <Heading color="blue.800" fontSize={[20, 24]} textAlign="center">
                  Nenhum pedido a ser preparado
                </Heading>
              </Flex>
            )}
          </Stack>
        </SortableContext>
      </DndContext>
    </>
  );
};
