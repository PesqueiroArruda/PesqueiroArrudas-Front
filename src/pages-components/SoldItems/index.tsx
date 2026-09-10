import { useCashierReport } from 'hooks/useCashierReport';
import { ReportError } from 'components/ReportError';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SoldItemsLayout } from './layout';

interface Props {
  cashierId: string;
}

export const SoldItems = ({ cashierId }: Props) => {
  const [search] = useState('');

  const router = useRouter();
  const { cashier, products, isLoading, error, retry } = useCashierReport(
    cashierId,
    true
  );

  useEffect(() => {
    const hasCleanedAuthStorage = localStorage.getItem(
      'hasCleanedAuthStorage_v1'
    );

    if (!hasCleanedAuthStorage) {
      localStorage.removeItem('isLogged');
      localStorage.removeItem('isUser');

      localStorage.setItem('hasCleanedAuthStorage_v1', 'true');

      window.location.href = '/login';
    }
  }, []);

  function handleBackPage() {
    router.back();
  }

  if (error)
    return (
      <ReportError message={error} onRetry={retry} onBack={handleBackPage} />
    );

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
