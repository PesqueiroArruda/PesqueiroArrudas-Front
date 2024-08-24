import { Cashier as CashierProps } from 'types/Cashier';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CustomersLayout } from './layout';
import CashierService from './services/CashierService';

interface Props {
  cashierId: string;
}

export const Customers = ({ cashierId }: Props) => {
  const [cashier, setCashier] = useState<CashierProps>({} as CashierProps);
  const [isLoading, setIsLoading] = useState(true);
  const [search] = useState('');

  const router = useRouter();

   useEffect(() => {

    (async () => {
       const storedData = localStorage.getItem('cashierByMonthObject');
        if (storedData !== 'undefined' && storedData !== null) {
          setCashier(JSON.parse(storedData));
        }
        setIsLoading(false);
      })();
   
  }, []);


  useEffect(() => {
    const storedData = localStorage.getItem('cashierByMonthObject');
    if (storedData === 'undefined' ) {
      (async () => {
        const { cashier: cashierFound } = await CashierService.getOne(cashierId);
        setIsLoading(false);
        setCashier(cashierFound);
        setIsLoading(false);
      })();
    }
    
  }, [cashierId]);

  function handleBackPage() {
    router.back();
  }

  const { payments } = cashier;

  const filteredBySearchPayments = payments?.filter((payment) => {
    const productsStr = payment.command.products
      .map((product) => Object.values(product).join(''))
      .join('');
    const commandStr = Object.values(payment.command)
      .join('')
      .replaceAll('[object Object]', '');

    const paymentStr = Object.values(payment)
      .join('')
      .replaceAll('[object Object]', '');

    const allStr = (productsStr + commandStr + paymentStr).toLowerCase();

    if (allStr?.includes(search.toLowerCase())) {
      return true;
    }
    return false;
  });

  return (
    <CustomersLayout
      cashier={cashier}
      handleBackPage={handleBackPage}
      isLoading={isLoading}
      payments={filteredBySearchPayments}
    />
  );
};
