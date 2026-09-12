import { SetStateAction, Dispatch, useContext, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import { StockContext } from 'pages-components/Stock';
import StockService from '../../services/index';
import { AutoOrderMenuModalLayout } from './layout';

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const AutoOrderMenuModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const [isOrdering, setIsOrdering] = useState(false);
  const { productsDispatch } = useContext(StockContext);
  const toast = useToast();

  function handleCloseModal() {
    setIsModalOpen(false);
    setIsOrdering(false);
  }

  async function handleAutoOrderMenu() {
    try {
      if (isOrdering) {
        return;
      }
      setIsOrdering(true);

      const { message } = await StockService.autoOrderMenu();
      const allProducts = await StockService.getAllProducts();
      productsDispatch({ type: 'ADD-PRODUCTS', payload: allProducts });

      toast.closeAll();
      toast({
        status: 'success',
        title: message,
        duration: 2000,
        isClosable: true,
      });

      handleCloseModal();
    } catch (error: any) {
      setIsOrdering(false);
      toast.closeAll();
      toast({
        status: 'error',
        title:
          error?.response?.data?.message || 'Request failed. Please try again.',
        duration: 2000,
      });
    }
  }

  return (
    <AutoOrderMenuModalLayout
      isModalOpen={isModalOpen}
      handleCloseModal={handleCloseModal}
      handleAutoOrderMenu={handleAutoOrderMenu}
      isOrdering={isOrdering}
    />
  );
};
