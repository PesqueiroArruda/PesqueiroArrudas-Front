import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';

import { Reservation, ReservationFilters, ReservationOperationalStatus } from 'types/Reservation';
import { findReservationConflicts } from 'utils/findReservationConflicts';
import { ReservationsLayout } from './layout';
import ReservationsService from './services/ReservationsService';

const POLL_INTERVAL_MS = 25000;

export const Reservations = () => {
  const router = useRouter();
  const toast = useToast();

  const [isAdmin, setIsAdmin] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ReservationFilters>({ from: DateTime.now().toISODate() as string });
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const conflictIds = useMemo(() => findReservationConflicts(reservations), [reservations]);

  const reloadReservations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await ReservationsService.list(filters);
      setReservations(data);
    } catch (error: any) {
      toast({
        status: 'error',
        title: 'Não foi possível carregar as reservas.',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    reloadReservations();
  }, [reloadReservations]);

  useEffect(() => {
    const isAdminUse = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(isAdminUse);

    if (!isAdminUse) {
      router.push('/commands');
    }
  }, [router]);

  // Não há Socket.IO aqui: esse canal só conhece o backend Express/Mongo, não a tabela
  // de reservas no Supabase. "Tempo real" é feito por polling.
  useEffect(() => {
    const intervalId = setInterval(() => {
      reloadReservations();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [reloadReservations]);

  function handleFilterChange(patch: Partial<ReservationFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function handleOpenDetail(reservation: Reservation) {
    setSelectedReservation(reservation);
  }

  function handleCloseDetail() {
    setSelectedReservation(null);
  }

  async function handleChangeOperationalStatus(id: string, operationalStatus: ReservationOperationalStatus) {
    try {
      setUpdatingId(id);
      const updated = await ReservationsService.updateOperationalStatus(id, operationalStatus);
      setReservations((prev) => prev.map((reservation) => (reservation.id === id ? updated : reservation)));
      setSelectedReservation((prev) => (prev?.id === id ? updated : prev));
    } catch (error: any) {
      toast({
        status: 'error',
        title: 'Não foi possível atualizar o status da reserva.',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUpdatingId(null);
    }
  }

  if (isAdmin) {
    return (
      <ReservationsLayout
        reservations={reservations}
        isLoading={isLoading}
        filters={filters}
        conflictIds={conflictIds}
        selectedReservation={selectedReservation}
        updatingId={updatingId}
        handleFilterChange={handleFilterChange}
        handleOpenDetail={handleOpenDetail}
        handleCloseDetail={handleCloseDetail}
        handleChangeOperationalStatus={handleChangeOperationalStatus}
      />
    );
  }

  return null;
};
