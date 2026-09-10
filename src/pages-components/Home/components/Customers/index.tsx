import { useContext, useEffect, useState } from 'react';

import { Cashier, CashierByMonth } from 'types/Cashier';
import CashierService from 'pages-components/Home/services/CashierService';
import { useRouter } from 'next/router';
import { SocketContext } from 'pages/_app';
import { DateTime } from 'luxon';
import { downloadFile } from 'utils/downloadFile';
import { groupCashiersByMonth } from 'utils/groupCashiersByMonth';
import { CustomersLayout } from './layout';

export const Customers = () => {
  const [allCashiers, setAllCashiers] = useState<Cashier[]>([]);
  const selectedMonthsFilter = true;

  const [month, setMonth] = useState('Todos');
  const [year, setYear] = useState('Todos');

  const { socket } = useContext(SocketContext);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const cashiers = await CashierService.getAll();
      setAllCashiers(cashiers);
    })();
  }, []);

  useEffect(() => {
    const onCashierCreated = (newCashier: Cashier) => {
      setAllCashiers((prevCashiers) => {
        const cashierAlreadyExists = prevCashiers.find((prevCashier) => {
          const prevDt = DateTime.fromISO(prevCashier.date, {
            zone: 'pt-BR',
            setZone: true,
          }).setLocale('pt-BR');
          const newCashierDt = DateTime.fromISO(newCashier.date, {
            zone: 'pt-BR',
            setZone: true,
          }).setLocale('pt-BR');

          if (
            prevDt.day === newCashierDt.day &&
            prevDt.month === newCashierDt.month &&
            prevDt.year === newCashierDt.year
          ) {
            return true;
          }
          return false;
        });

        if (cashierAlreadyExists) {
          const newCashiers = prevCashiers.filter(
            (prevCashier) => prevCashier._id !== cashierAlreadyExists._id
          );
          return [...newCashiers, newCashier];
        }

        return [...prevCashiers, newCashier];
      });
    };
    socket.on('cashier-created', onCashierCreated);

    return () => {
      socket.off('cashier-created', onCashierCreated);
    };
  }, [socket]);

  function handleGoToCustomersPage(
    cashierId: string,
    cashierByMonthObject?: CashierByMonth
  ) {
    router.push(`/customers/${cashierByMonthObject?._id || cashierId}`);
  }

  function handleDownloadCashiers(e: any) {
    e.preventDefault();

    const dt = DateTime.local().setZone('UTC-3').setLocale('pt-BR');

    downloadFile({
      data: JSON.stringify(allCashiers),
      fileName: `caixas-${dt.day}-${dt.month}-${dt.year}.json`,
      fileType: 'text/json',
    });
  }

  const filteredCashiers = selectedMonthsFilter
    ? []
    : allCashiers.filter((cashier) => {
        const date = DateTime.fromISO(cashier.date, {
          zone: 'America/Sao_Paulo',
          setZone: true,
        }).setLocale('pt-BR');
        return (
          (month === 'Todos' ||
            date.toFormat('LLLL') === month.toLowerCase()) &&
          (year === 'Todos' || String(date.year) === year)
        );
      });
  const cashiersFilteredByMonth = selectedMonthsFilter
    ? groupCashiersByMonth(allCashiers).filter(
        (cashier) =>
          (month === 'Todos' || cashier.month === month.toLowerCase()) &&
          (year === 'Todos' || cashier.year === year)
      )
    : [];
  return (
    <CustomersLayout
      allCashiers={filteredCashiers}
      cashiersFilteredByMonth={cashiersFilteredByMonth}
      handleGoToCustomersPage={handleGoToCustomersPage}
      handleDownloadCashiers={handleDownloadCashiers}
      year={year}
      setYear={setYear}
      month={month}
      setMonth={setMonth}
      selectedMonthsFilter={selectedMonthsFilter}
    />
  );
};
