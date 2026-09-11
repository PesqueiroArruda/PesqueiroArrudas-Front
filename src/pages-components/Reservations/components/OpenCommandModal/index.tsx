import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import CommandsService from 'pages-components/Commands/services/CommandsService';
import { Reservation } from 'types/Reservation';
import { OpenCommandModalLayout } from './layout';

interface Props {
  isOpen: boolean;
  reservation: Reservation | null;
  onClose: () => void;
}

export const OpenCommandModal = ({ isOpen, reservation, onClose }: Props) => {
  const router = useRouter();
  const toast = useToast();
  const [waiter, setWaiter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleClose() {
    setWaiter('');
    onClose();
  }

  async function handleConfirm() {
    if (!reservation || !waiter.trim()) return;

    try {
      setIsSubmitting(true);

      const existingCommand = await CommandsService.findByReservationId(reservation.id);
      if (existingCommand) {
        toast({
          status: 'info',
          title: 'Essa reserva já tem uma comanda aberta.',
          duration: 2500,
          isClosable: true,
        });
        router.push(`/command/${existingCommand._id}`);
        handleClose();
        return;
      }

      const { command } = await CommandsService.storeCommand({
        table: `${reservation.customerName} Reserva`,
        waiter,
        fishingType: 'Nenhum',
        peopleCount: reservation.partySize,
        reservationId: reservation.id,
      });

      router.push(`/command/${command._id}`);
      handleClose();
    } catch (error: any) {
      toast({
        status: 'error',
        title: error?.response?.data?.message || 'Não foi possível abrir a comanda.',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <OpenCommandModalLayout
      isOpen={isOpen}
      reservation={reservation}
      waiter={waiter}
      isSubmitting={isSubmitting}
      handleChangeWaiter={setWaiter}
      handleClose={handleClose}
      handleConfirm={handleConfirm}
    />
  );
};
