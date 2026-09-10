import { useContext, useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';

import { Cashier } from 'types/Cashier';
import { Product } from 'types/Product';
import CashierService from 'pages-components/Home/services/CashierService';
import ProductsService from 'pages-components/Commands/services/ProductsService';
import { SocketContext } from 'pages/_app';
import { buildSalesDashboardStats } from 'utils/buildSalesDashboardStats';
import { SalesDashboardLayout } from './layout';

export const SalesDashboard = () => {
  const [allCashiers, setAllCashiers] = useState<Cashier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [month, setMonth] = useState('Todos');
  const [year, setYear] = useState('Todos');

  const { socket } = useContext(SocketContext);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
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
  }, [socket]);

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

  return (
    <SalesDashboardLayout
      stats={stats}
      isLoading={isLoading}
      month={month}
      setMonth={setMonth}
      year={year}
      setYear={setYear}
    />
  );
};
