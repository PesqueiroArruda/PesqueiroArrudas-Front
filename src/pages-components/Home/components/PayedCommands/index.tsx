import { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';
import { DateTime } from 'luxon';

import { get10PastDays } from 'utils/get10PastDays';
import { Payment } from 'pages-components/Home/types/Payment';
import PaymentsService from 'pages-components/Home/services/PaymentsService';
import CommandService from 'pages-components/Home/services/CommandService';
import { SocketContext } from 'pages/_app';
import { PayedCommandsLayout } from './layout';
import { CloseCashier } from '../CloseCahier';

export const PayedCommands = ({ isAdmin }: { isAdmin: boolean }) => {
  const [payedCommandsDate, setPayedCommandsDate] = useState(
    get10PastDays()[0].formatted
  );
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pendingCommandsDates, setPendingCommandsDates] = useState<string[]>([]);

  const [isGettingPayments, setIsGettingPayments] = useState(true);
  const [isCloseCashierModalOpen, setIsCloseCashierModalOpen] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState('');
  const [isSavingDate, setIsSavingDate] = useState(false);

  const { socket } = useContext(SocketContext);

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    let active = true;
    const currentDate = get10PastDays().find(
      ({ formatted }) => formatted === payedCommandsDate
    )?.date;
    const receivedPayments = new Map<string, Payment>();

    const onPaymentCreated = (paymentCreated: Payment) => {
      const paymentDate = DateTime.fromISO(paymentCreated.createdAt)
        .setZone('UTC-3')
        .toISODate();
      if (!currentDate || paymentDate !== currentDate.toISODate()) return;

      receivedPayments.set(paymentCreated._id, paymentCreated);
      setPayments((previous) =>
        previous.some((payment) => payment._id === paymentCreated._id)
          ? previous
          : [...previous, paymentCreated]
      );
    };

    setIsGettingPayments(true);
    setPayments([]);
    socket.on('payment-created', onPaymentCreated);

    const loadPayments = async () => {
      try {
        if (!currentDate) return;
        const paymentsOfDate: Payment[] = await PaymentsService.getAll({
          date: currentDate.toISO(),
        });
        if (active) {
          // Preserve events received while the HTTP snapshot was loading.
          const combined = new Map(
            paymentsOfDate.map((payment) => [payment._id, payment])
          );
          receivedPayments.forEach((payment, id) => combined.set(id, payment));
          setPayments([...combined.values()]);
        }
      } catch {
        if (active) {
          toast({ status: 'error', title: 'Unable to load payments.' });
        }
      } finally {
        if (active) setIsGettingPayments(false);
      }
    };
    loadPayments();

    const loadPendingCommandsDates = async () => {
      try {
        const activeCommands = await CommandService.getTodayCommands({
          isActive: 'true',
        });
        if (!active) return;

        const otherDates = new Set<string>();
        activeCommands?.forEach(({ createdAt }: { createdAt: string }) => {
          const formatted = DateTime.fromISO(createdAt, {
            zone: 'America/Sao_Paulo',
            setZone: true,
          })
            .setLocale('pt-BR')
            .toLocaleString(DateTime.DATE_FULL);

          if (formatted && formatted !== payedCommandsDate) {
            otherDates.add(formatted);
          }
        });
        setPendingCommandsDates([...otherDates]);
      } catch {
        if (active) setPendingCommandsDates([]);
      }
    };
    loadPendingCommandsDates();

    return () => {
      active = false;
      socket.off('payment-created', onPaymentCreated);
    };
  }, [payedCommandsDate, socket, toast]);
  const handleGoToCommandPage = useCallback(
    (commandId: string) => {
      router.push(`/command/${commandId}`);
    },
    [router]
  );

  const handleCloseCashier = useCallback(async () => {
    setIsCloseCashierModalOpen(true);
  }, []);

  const handleStartEditDate = useCallback(
    ({ _id, createdAt }: { _id: string; createdAt: string }) => {
      setEditingPaymentId(_id);
      setEditingDate(
        DateTime.fromISO(createdAt, {
          zone: 'America/Sao_Paulo',
          setZone: true,
        }).toFormat("yyyy-MM-dd'T'HH:mm")
      );
    },
    []
  );

  const handleCancelEditDate = useCallback(() => {
    setEditingPaymentId(null);
    setEditingDate('');
  }, []);

  const handleSaveEditDate = useCallback(async () => {
    if (!editingPaymentId || !editingDate) return;
    setIsSavingDate(true);
    try {
      const { paymentInfos } = await PaymentsService.updateDate({
        id: editingPaymentId,
        paymentDate: editingDate,
      });

      const newFormatted = DateTime.fromISO(paymentInfos.createdAt, {
        zone: 'America/Sao_Paulo',
        setZone: true,
      })
        .setLocale('pt-BR')
        .toLocaleString(DateTime.DATE_FULL);

      setPayments((previous) => {
        if (newFormatted !== payedCommandsDate) {
          return previous.filter((payment) => payment._id !== editingPaymentId);
        }
        return previous.map((payment) =>
          payment._id === editingPaymentId
            ? { ...payment, createdAt: paymentInfos.createdAt }
            : payment
        );
      });

      toast.closeAll();
      toast({ status: 'success', title: 'Data do pagamento atualizada.', duration: 1500 });
      handleCancelEditDate();
    } catch (err: any) {
      toast.closeAll();
      toast({
        status: 'error',
        title: err?.response?.data?.message || 'Não foi possível atualizar a data.',
        duration: 2000,
      });
    } finally {
      setIsSavingDate(false);
    }
  }, [editingPaymentId, editingDate, payedCommandsDate, toast, handleCancelEditDate]);

  const tempTotal = payments.reduce(
    (total, payment) =>
      Math.round((total + payment.totalPayed + Number.EPSILON) * 100) / 100,
    0
  );

  return (
    <>
      <PayedCommandsLayout
        payedCommandsDate={payedCommandsDate}
        setPayedCommandsDate={setPayedCommandsDate}
        payments={payments}
        pendingCommandsDates={pendingCommandsDates}
        handleGoToCommandPage={handleGoToCommandPage}
        handleCloseCashier={handleCloseCashier}
        isGettingPayments={isGettingPayments}
        total={tempTotal}
        isAdmin={isAdmin}
        editingPaymentId={editingPaymentId}
        editingDate={editingDate}
        setEditingDate={setEditingDate}
        isSavingDate={isSavingDate}
        handleStartEditDate={handleStartEditDate}
        handleCancelEditDate={handleCancelEditDate}
        handleSaveEditDate={handleSaveEditDate}
      />
      <CloseCashier
        isModalOpen={isCloseCashierModalOpen}
        setIsModalOpen={setIsCloseCashierModalOpen}
        payments={payments}
        payedCommandsDate={payedCommandsDate}
      />
    </>
  );
};
