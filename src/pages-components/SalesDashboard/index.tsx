import { FormEvent, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';

import { AppShell } from 'components/AppShell';
import { Modal } from 'components/Modal';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Cashier } from 'types/Cashier';
import { Product } from 'types/Product';
import CashierService from 'pages-components/Home/services/CashierService';
import AuthService from 'pages-components/Home/services/AuthService';
import ProductsService from 'pages-components/Commands/services/ProductsService';
import { SocketContext } from 'pages/_app';
import { buildSalesDashboardStats } from 'utils/buildSalesDashboardStats';
import { SalesDashboardLayout } from './layout';

export const SalesDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPermitted, setIsPermitted] = useState(false);
  const [isAsksPermitionModalOpen, setIsAsksPermitionModalOpen] = useState(false);
  const password = useRef('');

  const [allCashiers, setAllCashiers] = useState<Cashier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [month, setMonth] = useState('Todos');
  const [year, setYear] = useState('Todos');

  const { socket } = useContext(SocketContext);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const isAdminUse = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(isAdminUse);
    if (!isAdminUse) {
      router.push('/commands');
    }
  }, [router]);

  useEffect(() => {
    if (isAdmin) {
      setIsAsksPermitionModalOpen(true);
    }
  }, [isAdmin]);

  async function handleAccessDashboard(e: FormEvent) {
    e.preventDefault();
    try {
      if (password.current === '') {
        toast({ status: 'warning', title: 'Insira a senha de acesso' });
        return;
      }
      const { isAuthorized } = await AuthService.accessClosedCashiers(password.current);
      if (isAuthorized) {
        setIsPermitted(true);
        setIsAsksPermitionModalOpen(false);
        password.current = '';
      }
    } catch (err: any) {
      toast({
        title: err?.response?.data?.message || 'Request failed. Please try again.',
        status: 'error',
        duration: 1000,
      });
    }
  }

  function handleCloseAsksPermitionModal() {
    setIsAsksPermitionModalOpen(false);
    password.current = '';
  }

  useEffect(() => {
    if (!isPermitted) return;
    (async () => {
      try {
        const [cashiers, allProducts] = await Promise.all([
          CashierService.getAll(),
          ProductsService.getAllProducts(),
        ]);
        setAllCashiers(cashiers);
        setProducts(allProducts);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isPermitted]);

  useEffect(() => {
    if (!isPermitted) return undefined;

    const onCashierCreated = (newCashier: Cashier) => {
      setAllCashiers((prevCashiers) => {
        const cashierAlreadyExists = prevCashiers.find((prevCashier) => {
          const prevDt = DateTime.fromISO(prevCashier.date, { zone: 'pt-BR', setZone: true });
          const newCashierDt = DateTime.fromISO(newCashier.date, { zone: 'pt-BR', setZone: true });
          return (
            prevDt.day === newCashierDt.day &&
            prevDt.month === newCashierDt.month &&
            prevDt.year === newCashierDt.year
          );
        });

        if (cashierAlreadyExists) {
          return [...prevCashiers.filter((c) => c._id !== cashierAlreadyExists._id), newCashier];
        }
        return [...prevCashiers, newCashier];
      });
    };
    socket.on('cashier-created', onCashierCreated);

    return () => {
      socket.off('cashier-created', onCashierCreated);
    };
  }, [socket, isPermitted]);

  const filteredCashiers = useMemo(
    () =>
      allCashiers.filter((cashier) => {
        const date = DateTime.fromISO(cashier.date, { zone: 'America/Sao_Paulo', setZone: true }).setLocale(
          'pt-BR'
        );
        if (!date.isValid) return false;
        return (
          (month === 'Todos' || date.toFormat('LLLL') === month.toLowerCase()) &&
          (year === 'Todos' || String(date.year) === year)
        );
      }),
    [allCashiers, month, year]
  );

  const stats = useMemo(
    () => buildSalesDashboardStats(filteredCashiers, products),
    [filteredCashiers, products]
  );

  if (!isAdmin) {
    return null;
  }

  return (
    <AppShell>
      {isPermitted ? (
        <SalesDashboardLayout
          stats={stats}
          isLoading={isLoading}
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
        />
      ) : (
        <div className="flex justify-center py-16">
          <Button onClick={() => setIsAsksPermitionModalOpen(true)}>Acessar Dashboard</Button>
        </div>
      )}
      <Modal
        isOpen={isAsksPermitionModalOpen}
        onClose={handleCloseAsksPermitionModal}
        title="Senha de acesso"
      >
        <form onSubmit={handleAccessDashboard} className="flex flex-col gap-3">
          <Input
            onChange={(e) => {
              password.current = e.target.value;
            }}
            autoFocus
            type="password"
          />
          <Button type="submit" className="w-full">
            Acessar
          </Button>
        </form>
      </Modal>
    </AppShell>
  );
};
