import { useToast } from '@chakra-ui/react';
import { KitchenContext } from 'pages-components/Kitchen';
import KitchenOrdersService from 'pages-components/Kitchen/services/KitchenOrdersService';
import { Order } from 'types/Order';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { CheckOrderModalLayout } from './layout';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  order: Order;
}

export const CheckOrderModal = ({
  isModalOpen,
  setIsModalOpen,
  order,
}: Props) => {
  const [isSending, setIsSending] = useState(false);
  const { allOrdersDispatch } = useContext(KitchenContext);

  const toast = useToast();

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setIsSending(false);
  }, [setIsModalOpen]);

  const handleCheckOrder = useCallback(async () => {
    try {
      if(order.products.some(product => product.isMade === false)){
        toast.closeAll();
        toast({
          status: 'error',
          title: 'Baixe todos os itens antes de baixar o pedido!',
          duration: 1000,
          isClosable: true,
        });
        handleCloseModal();

        return
      }
      if (isSending) {
        return;
      }
      setIsSending(true);

      await KitchenOrdersService.checkOneOrder({
        orderId: order._id as string,
        isMade: true,
      });

      allOrdersDispatch({
        type: 'REMOVE-ONE-ORDER',
        payload: { order: { _id: order._id } },
      });

      toast.closeAll();
      toast({
        status: 'success',
        title: 'Pedido finalizado!',
        duration: 1000,
        isClosable: true,
      });

      handleCloseModal();
    } catch (error: any) {
      setIsSending(false);
      toast.closeAll();
      toast({
        status: 'error',
        title: error?.response?.data?.message,
        duration: 1000,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, isSending]);

  return (
    <CheckOrderModalLayout
      isModalOpen={isModalOpen}
      handleCloseModal={handleCloseModal}
      handleCheckOrder={handleCheckOrder}
      isSending={isSending}
    />
  );
};
