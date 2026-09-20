import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import CashierService from 'pages-components/Home/services/CashierService';
import { Payment } from 'pages-components/Home/types/Payment';
import { useToast } from '@chakra-ui/react';
import CommandService from 'pages-components/Home/services/CommandService';
import { DateTime } from 'luxon';
import { CloseCashierLayout } from './layout';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  payments: Payment[];
  payedCommandsDateISO: string;
}

export const CloseCashier = ({
  isModalOpen,
  setIsModalOpen,
  payments,
  payedCommandsDateISO,
}: Props) => {
  const [isSending, setIsSending] = useState(false);

  const toast = useToast();

  function handleCloseModal() {
    setIsModalOpen(false);
    setIsSending(false);
  }

  const handleCloseCashier = useCallback(async () => {
    try {
      if (isSending) {
        return;
      }
      setIsSending(true);

      // Verify if there are open commands
      const activeCommands = await CommandService.getTodayCommands({
        isActive: 'true',
      });

      const todayISODate = DateTime.local().setZone('America/Sao_Paulo').toISODate();

      if (activeCommands?.length > 0 && todayISODate === payedCommandsDateISO) {
        toast.closeAll();
        handleCloseModal();
        toast({
          status: 'warning',
          title: 'Há comandas ativas. Exclua ou pague-as para fechar o caixa. ',
          isClosable: true,
          duration: 5000,
        });
        return;
      }

      const currentDate = DateTime.fromISO(payedCommandsDateISO, {
        zone: 'America/Sao_Paulo',
      });

      const currentDateISO = currentDate.toISO();

      const { message } = await CashierService.closeCashier({
        date: currentDateISO,
        payments,
      });

      toast.closeAll();
      toast({
        status: 'success',
        title: message,
        duration: 2000,
      });
      handleCloseModal();
    } catch (error: any) {
      handleCloseModal();
      toast.closeAll();
      toast({
        status: 'error',
        title: error?.response?.data?.message,
        duration: 2000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payedCommandsDateISO, payments]);

  return (
    <CloseCashierLayout
      isModalOpen={isModalOpen}
      handleCloseModal={handleCloseModal}
      handleCloseCashier={handleCloseCashier}
      isSending={isSending}
    />
  );
};
