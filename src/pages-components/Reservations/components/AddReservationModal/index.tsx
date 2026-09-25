import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useToast } from '@chakra-ui/react';

import {
  ReservationCreateInput,
  ReservationEnvironment,
} from 'types/Reservation';
import ReservationsService from '../../services/ReservationsService';
import { AddReservationInputs, AddReservationModalLayout } from './layout';

type Props = {
  isModalOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export const AddReservationModal = ({
  isModalOpen,
  onClose,
  onCreated,
}: Props) => {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddReservationInputs>({
    defaultValues: {
      environment: 'interno',
      paymentStatus: 'paid',
      partySize: 1,
    },
  });

  const toast = useToast();

  function handleCloseModal() {
    reset();
    setIsAdding(false);
    onClose();
  }

  const handleAddReservation: SubmitHandler<AddReservationInputs> = async ({
    customerName,
    customerPhone,
    reservationDate,
    reservationTime,
    partySize,
    environment,
    paymentStatus,
    notes,
  }) => {
    try {
      if (isAdding) return;
      setIsAdding(true);

      const input: ReservationCreateInput = {
        customerName,
        customerPhone,
        reservationDate,
        reservationTime,
        partySize: Number(partySize) || 1,
        environment: environment as ReservationEnvironment,
        paymentStatus: paymentStatus as 'paid' | 'pending',
        notes: notes || undefined,
      };

      await ReservationsService.create(input);

      onCreated();

      toast.closeAll();
      toast({
        status: 'success',
        title: 'Reserva criada com sucesso.',
        duration: 2000,
        isClosable: true,
      });

      handleCloseModal();
    } catch (error: any) {
      setIsAdding(false);
      toast.closeAll();
      toast({
        status: 'error',
        title:
          error?.response?.data?.message || 'Não foi possível criar a reserva.',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <AddReservationModalLayout
      isModalOpen={isModalOpen}
      handleCloseModal={handleCloseModal}
      handleAddReservation={handleAddReservation}
      rhfHandleSubmit={handleSubmit}
      rhfRegister={register}
      rhfErrors={errors}
      isAdding={isAdding}
    />
  );
};
