import { Cashier as CashierProps } from 'types/Cashier';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Product } from 'types/Product';
import { SoldItemsLayout } from './layout';
import CashierService from './services/CashierService';
import StockService from '../Stock/services/index';

interface Props {
  cashierId: string;
}

export const SoldItems = ({ cashierId }: Props) => {
  const [cashier, setCashier] = useState<CashierProps>({} as CashierProps);
  const [products, setProducts] = useState<Product[]>([] as Product[]);
  const [isLoading, setIsLoading] = useState(true);
  const [search] = useState('');

  const router = useRouter();

   useEffect(() => {

    (async () => {
       const storedData = localStorage.getItem('cashierByMonthObject');
        if (storedData !== 'undefined' && storedData !== null) {
          setCashier(JSON.parse(storedData));
        }
        const allProducts = await StockService.getAllProducts();
        setProducts(allProducts)
        setIsLoading(false);
      })();
   
  }, []);


  useEffect(() => {
    const storedData = localStorage.getItem('cashierByMonthObject');
    if (storedData === 'undefined' ) {
      (async () => {
        const { cashier: cashierFound } = await CashierService.getOne(cashierId);
        const allProducts = await StockService.getAllProducts();
        setProducts(allProducts)
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
    <SoldItemsLayout
      cashier={cashier}
      products={products}
      handleBackPage={handleBackPage}
      isLoading={isLoading}
      payments={filteredBySearchPayments}
    />
  );
};
