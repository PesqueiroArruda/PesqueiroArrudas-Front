import { useToast } from '@chakra-ui/react';
import { KitchenContext } from 'pages-components/Kitchen';
import KitchenOrdersService from 'pages-components/Kitchen/services/KitchenOrdersService';
import { OrderProduct } from 'types/OrderProduct';
import { useContext, useCallback } from 'react';
import { Order as OrderProps } from '../../../../types/Order';
import { OrderLayout } from './layout';

interface Props {
  order: OrderProps;
  listeners: any;
  isDragging: boolean;
}

export const Order = ({ order, listeners, isDragging }: Props) => {
  const { allOrdersDispatch, setIsCheckOrderModalOpen, setOrderToCheck } =
    useContext(KitchenContext);

  const toast = useToast();

  const handleCheckOneProduct = useCallback(
    async (product: OrderProduct) => {
      try {
        const oldProducts = order.products;
        const newProducts = oldProducts.map((oldProduct) => {
          if (oldProduct._id === product._id) {
            return { ...oldProduct, isMade: true };
          }
          return oldProduct;
        });

        await KitchenOrdersService.checkOneOrderProduct({
          orderId: order._id,
          products: newProducts as OrderProduct[],
        });

        allOrdersDispatch({
          type: 'CHECK-ONE-PRODUCT',
          payload: { orderId: order._id, productId: product._id },
        });
      } catch (error: any) {
        toast.closeAll();
        toast({
          status: 'error',
          title: error?.response?.data?.message,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [order, allOrdersDispatch]
  );

  const handleDefrostOneProduct = useCallback(
    async (product: OrderProduct) => {
      try {
        const oldProducts = order.products;
        const newProducts = oldProducts.map((oldProduct) => {
          if (oldProduct._id === product._id) {
            return { ...oldProduct, isThawed: true }; // <-- seta só este item
          }
          return oldProduct;
        });

        await KitchenOrdersService.defrostOneOrderProduct({
          orderId: order._id,
          products: newProducts as OrderProduct[],
        });

        allOrdersDispatch({
          type: 'DEFROST-ONE-PRODUCT',
          payload: { orderId: order._id, productId: product._id },
        });
      } catch (error: any) {
        toast.closeAll();
        toast({
          status: 'error',
          title: error?.response?.data?.message,
        });
      }
    },
    [order, allOrdersDispatch]
  );

  const handleOpenCheckOrderModal = useCallback(
    (orderToCheck: OrderProps) => {
      setIsCheckOrderModalOpen(true);
      setOrderToCheck(orderToCheck);
    },
    [setIsCheckOrderModalOpen, setOrderToCheck]
  );

  return (
    <OrderLayout
      order={order}
      handleCheckOneProduct={handleCheckOneProduct}
      handleDefrostOneProduct={handleDefrostOneProduct}
      handleOpenCheckOrderModal={handleOpenCheckOrderModal}
      listeners={listeners}
      isDragging={isDragging}
    />
  );
};
