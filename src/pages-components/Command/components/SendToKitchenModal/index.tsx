import { useToast } from '@chakra-ui/react';
import { CommandContext } from 'pages-components/Command';
import KitchenService from 'pages-components/Command/services/KitchenService';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Order as OrderProps } from 'types/Order';

import capitalizeFirstLetter from 'utils/capitalizeFirstLetter';
import { SendToKitchenModalLayout } from './layout';
import { OrderActions } from './OrderActions';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export interface StoreKitchen {
  commandId: string;
  table: string;
  waiter: string;
  products: { _id: string; name: string; amount: number }[];
  observation: string;
  orderCategory: string;
  orderWaiter: string;
}

const categoriesToBarPrepare = [
  'pesca',
  'peixes',
  'bebidas',
  'doses',
  'sobremesas',
  'misturas congeladas',
]
const categoriesToKitchenPrepare = ['pratos', 'porções', 'bebidas-cozinha'];

export const SendToKitchenModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const [isSending, setIsSending] = useState(false);
  const [observation, setObservation] = useState('');

  const [isOrderActionsModalOpen, setIsOrderActionsModalOpen] = useState(false);
  const [kitchenOrderSended, setKitchenOrderSended] = useState<OrderProps>(
    {} as OrderProps
  );

  const { command } = useContext(CommandContext);
  const toast = useToast();

  function handleCloseModal() {
    setIsModalOpen(false);
    setIsSending(false);
    setObservation('');
  }

  const handleSendToKitchen = useCallback(async () => {
    try {
      if (isSending) {
        return;
      }
      setIsSending(true);

      const { _id: commandId, table, waiter, products } = command;

      const productsToPrepareKitchen = products?.filter(({ category }) =>
        categoriesToKitchenPrepare.some(
          (categ) => category?.toLowerCase() === categ
        )
      );
      const productsToPrepareBar = products?.filter(({ category }) =>
        categoriesToBarPrepare.some(
          (categ) => category?.toLowerCase() === categ
        )
      );

      
      const loggedUser = capitalizeFirstLetter(localStorage.getItem('loggedUser'))

      const { kitchenOrder } = await KitchenService.storeKitchenOrder({
        commandId,
        table,
        waiter,
        products: productsToPrepareKitchen,
        observation,
        orderCategory: 'kitchen',
        orderWaiter: loggedUser
      } as StoreKitchen);

      const { kitchenOrder: barOrder } = await KitchenService.storeKitchenOrder({
        commandId,
        table,
        waiter,
        products: productsToPrepareBar,
        observation,
        orderCategory: 'bar',
        orderWaiter: loggedUser
      } as StoreKitchen);
      setKitchenOrderSended(kitchenOrder || barOrder);
      handleCloseModal();

      setIsOrderActionsModalOpen(true);
      toast.closeAll();
      toast({
        status: 'success',
        title: 'Pedido enviado à cozinha!',
      });
    } catch (error: any) {
      setIsSending(false);
      toast.closeAll();
      toast({
        status: 'error',
        title: error?.response?.data?.message || 'Erro em mandar para cozinha',
        duration: 2000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command, isSending, observation]);

  return (
    <>
      <SendToKitchenModalLayout
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        handleSendToKitchen={handleSendToKitchen}
        isSending={isSending}
        observation={observation}
        setObservation={setObservation}
      />
      <OrderActions
        kitchenOrder={kitchenOrderSended}
        isModalOpen={isOrderActionsModalOpen}
        setIsModalOpen={setIsOrderActionsModalOpen}
      />
    </>
  );
};
