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
  const [payedCommandsDateISO, setPayedCommandsDateISO] = useState(
    get10PastDays()[0].date.toISODate() as string
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
    const currentDate = DateTime.fromISO(payedCommandsDateISO, {
      zone: 'America/Sao_Paulo',
    });
    const receivedPayments = new Map<string, Payment>();

    const onPaymentCreated = (paymentCreated: Payment) => {
      const paymentDate = DateTime.fromISO(paymentCreated.createdAt)
        .setZone('UTC-3')
        .toISODate();
      if (paymentDate !== currentDate.toISODate()) return;

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
          const commandDt = DateTime.fromISO(createdAt, {
            zone: 'America/Sao_Paulo',
            setZone: true,
          });

          if (commandDt.toISODate() && commandDt.toISODate() !== payedCommandsDateISO) {
            otherDates.add(commandDt.setLocale('pt-BR').toLocaleString(DateTime.DATE_FULL));
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
  }, [payedCommandsDateISO, socket, toast]);
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

      const newISODate = DateTime.fromISO(paymentInfos.createdAt, {
        zone: 'America/Sao_Paulo',
        setZone: true,
      }).toISODate();

      setPayments((previous) => {
        if (newISODate !== payedCommandsDateISO) {
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
  }, [editingPaymentId, editingDate, payedCommandsDateISO, toast, handleCancelEditDate]);

  const tempTotal = payments.reduce(
    (total, payment) =>
      Math.round((total + payment.totalPayed + Number.EPSILON) * 100) / 100,
    0
  );

  return (
    <>
      <PayedCommandsLayout
        payedCommandsDateISO={payedCommandsDateISO}
        setPayedCommandsDateISO={setPayedCommandsDateISO}
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
        payedCommandsDateISO={payedCommandsDateISO}
      />
    </>
  );
};
