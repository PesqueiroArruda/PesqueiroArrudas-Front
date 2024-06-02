import { useContext, useEffect, useState } from 'react';

import { Cashier, CashierByMonth } from 'types/Cashier';
import CashierService from 'pages-components/Home/services/CashierService';
import { useRouter } from 'next/router';
import { SocketContext } from 'pages/_app';
import { DateTime } from 'luxon';
import { downloadFile } from 'utils/downloadFile';
import { SoldItemsLayout } from './layout';

export const SoldItems = () => {
  const [allCashiers, setAllCashiers] = useState<Cashier[]>([]);
  const [cashiersByMonth, _] = useState<CashierByMonth[]>([]);
  const [cashiersFilteredByMonth, __] = useState<CashierByMonth[]>([]);
  const [selectedMonthsFilter, setSelectedMonthsFilter] = useState(false)


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
    socket.on('cashier-created', (newCashier: Cashier) => {
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
    });

    return () => {
      socket.off('cashier-created');
    };
  }, []);

  function handleGoToSoldItemsPage(cashierId: string, cashierByMonthObject: CashierByMonth) {
    localStorage.setItem('cashierByMonthObject', JSON.stringify(cashierByMonthObject));

    router.push(`/sold-items/${cashierId}`);
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


  let filteredCashiers: any = []
  if(!selectedMonthsFilter) {
    filteredCashiers = allCashiers.filter((cashier) => {
      const dt = DateTime.fromISO(cashier.date, {
        zone: 'pt-BR',
        setZone: true,
      }).setLocale('pt-BR');
      const formattedDt = dt.toLocaleString(DateTime.DATE_FULL);

      // This path is when the user wants all the cashiers, it doesn't matter the year and month
      if (month === 'Todos' && year === 'Todos') {
        return true;
      }

      // This path is when the user wants cashiers of all months of some specific year
      if (month === 'Todos' && formattedDt.includes(year.toLowerCase())) {
        return true;
      }

      // This path is when the user wants cashiers of some month of all years
      if (year === 'Todos' && formattedDt.includes(month.toLowerCase())) {
        return true;
      }

      // This path is when the user wants cashiers of some month and year
      if (
        formattedDt.includes(month.toLowerCase()) &&
        formattedDt.includes(year.toLowerCase())
      ) {
        return true;
      }
      return false;
  });
  } else {
    allCashiers.forEach((cashier) => {
      const dt = DateTime.fromISO(cashier.date, {
        zone: 'pt-BR',
        setZone: true,
      }).setLocale('pt-BR');
      const formattedDt = dt.toLocaleString(DateTime.DATE_FULL);
    let monthName = 'janeiro';
    let yearName = '2022';

    if(formattedDt.includes('janeiro')) {
      monthName = 'janeiro'
    }
    if(formattedDt.includes('fevereiro')) {
      monthName = 'fevereiro'
    }
    if(formattedDt.includes('março')) {
      monthName = 'março'
    }
    if(formattedDt.includes('abril')) {
      monthName = 'abril'
    }
    if(formattedDt.includes('maio')) {
      monthName = 'maio'
    }
    if(formattedDt.includes('junho')) {
      monthName = 'junho'
    }
    if(formattedDt.includes('julho')) {
      monthName = 'julho'
    }
    if(formattedDt.includes('agosto')) {
      monthName = 'agosto'
    }
    if(formattedDt.includes('setembro')) {
      monthName = 'setembro'
    }
    if(formattedDt.includes('outubro')) {
      monthName = 'outubro'
    }
    if(formattedDt.includes('novembro')) {
      monthName = 'novembro'
    }
    if(formattedDt.includes('dezembro')) {
      monthName = 'dezembro'
    }
    if(formattedDt.includes('2021')) {
      yearName = '2021'
    }
    if(formattedDt.includes('2022')) {
      yearName = '2022'
    }
    if(formattedDt.includes('2023')) {
      yearName = '2023'
    }
    if(formattedDt.includes('2024')) {
      yearName = '2024'
    }
    if(formattedDt.includes('2025')) {
      yearName = '2025'
    }
    if(formattedDt.includes('2026')) {
      yearName = '2026'
    }
    if(formattedDt.includes('2027')) {
      yearName = '2027'
    }
    if(formattedDt.includes('2028')) {
      yearName = '2028'
    }
    if(formattedDt.includes('2029')) {
      yearName = '2029'
    }
    if(formattedDt.includes('2030')) {
      yearName = '2030'
    }

    cashiersByMonth.push({
      _id: `${Math.random()}`,
      month: monthName,
      payments: cashier.payments,
      total: cashier.total,
      year: yearName
    })

  });


    cashiersByMonth.forEach((cashier) => {
      const foundCashiersByMonthAndYear = cashiersByMonth.filter(cashierByMonth => cashierByMonth.month === cashier.month && cashierByMonth.year === cashier.year)
      const allPayments: any = []
      const alreadyHasMonthAndYear = cashiersFilteredByMonth.find(cashierByMonth => cashierByMonth.month === cashier.month && cashierByMonth.year === cashier.year)


      foundCashiersByMonthAndYear.forEach(cashierByMonth => cashierByMonth.payments.forEach(payment => allPayments.push(payment)))
      

      if(!alreadyHasMonthAndYear){
        cashiersFilteredByMonth.push({
          _id: cashier._id,
          month: cashier.month,
          payments: allPayments,
          total: cashier.total,
          year: cashier.year
        })
      }

    })

  }  

  return (
    <SoldItemsLayout
      allCashiers={filteredCashiers}
      cashiersFilteredByMonth={cashiersFilteredByMonth}
      handleGoToSoldItemsPage={handleGoToSoldItemsPage}
      handleDownloadCashiers={handleDownloadCashiers}
      year={year}
      setYear={setYear}
      month={month}
      setMonth={setMonth}
      selectedMonthsFilter={selectedMonthsFilter}
      setSelectedMonthsFilter={setSelectedMonthsFilter}
    />
  );
};
