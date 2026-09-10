import { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';
import { DateTime } from 'luxon';

import { get10PastDays } from 'utils/get10PastDays';
import { Payment } from 'pages-components/Home/types/Payment';
import PaymentsService from 'pages-components/Home/services/PaymentsService';
import { SocketContext } from 'pages/_app';
import { PayedCommandsLayout } from './layout';
import { CloseCashier } from '../CloseCahier';

export const PayedCommands = ({ isAdmin }: { isAdmin: boolean }) => {
  const [payedCommandsDate, setPayedCommandsDate] = useState(
    get10PastDays()[0].formatted
  );
  const [payments, setPayments] = useState<Payment[]>([]);

  const [isGettingPayments, setIsGettingPayments] = useState(true);
  const [isCloseCashierModalOpen, setIsCloseCashierModalOpen] = useState(false);

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
        handleGoToCommandPage={handleGoToCommandPage}
        handleCloseCashier={handleCloseCashier}
        isGettingPayments={isGettingPayments}
        total={tempTotal}
        isAdmin={isAdmin}
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
