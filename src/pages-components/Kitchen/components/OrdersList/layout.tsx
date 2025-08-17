import { useContext, useMemo } from 'react';
import { Flex, Heading, Icon, Stack, Switch } from '@chakra-ui/react';
import { RiZzzFill } from 'react-icons/ri';

import { KitchenContext } from 'pages-components/Kitchen';
import { Order as OrderProps } from '../../../../types/Order';

// dnd-kit
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { DraggableOrder } from '../DraggableOrder';
import KitchenOrdersService from 'pages-components/Kitchen/services/KitchenOrdersService';

interface Props {
  orders: OrderProps[];
  onReorder?: (nextOrders: OrderProps[]) => void;
}

export const OrdersListLayout = ({ orders, onReorder }: Props) => {
  const { isKitchen, setIsKitchen, reloadOrders } = useContext(KitchenContext);
  const category = isKitchen ? 'kitchen' : 'bar';

  const visibleOrders = useMemo(
    () => orders.filter((o) => !o.isMade && o.orderCategory === category),
    [orders, category]
  );
  const visibleIds = useMemo(() => visibleOrders.map((o) => o._id), [visibleOrders]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = visibleIds.indexOf(String(active.id));
    const newIndex = visibleIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    const movedVisible = arrayMove(visibleOrders, oldIndex, newIndex);
    const nextIds = movedVisible.map((o) => o._id);

    // Optimistic UI (opcional)
    const inVisible = new Set(nextIds);
    const otherGroup = orders.filter((o) => !inVisible.has(o._id));
    const nextOrders = [...movedVisible, ...otherGroup];
    onReorder?.(nextOrders);

    try {
      await KitchenOrdersService.reorder({ category, ids: nextIds });
      await reloadOrders(); // << refetch garantido depois de persistir
    } catch (err) {
      console.error('Falha ao reordenar:', err);
      // se quiser, reverter o optimistic aqui
    }
  };

  return (
    <>
      <Switch
        isChecked={isKitchen}
        onChange={(e) => setIsKitchen(e.target.checked)}
      >
        {isKitchen ? 'Cozinha' : 'Bar'}
      </Switch>

      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={visibleIds} strategy={verticalListSortingStrategy}>
          <Stack gap={[2, 4]} alignItems={visibleOrders.length === 0 ? 'center' : 'auto'}>
            {visibleOrders.length > 0 &&
              visibleOrders.map((order) => <DraggableOrder order={order} key={order._id} />)}

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
