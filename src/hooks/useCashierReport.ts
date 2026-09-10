import { useEffect, useState } from 'react';
import { Cashier } from 'types/Cashier';
import { Product } from 'types/Product';
import { getCashierReport } from 'services/cashierReports';
import { serverApi } from 'services/serverApi';

const emptyCashier: Cashier = {
  _id: '',
  total: 0,
  date: undefined,
  payments: [],
};

export const useCashierReport = (id: string, includeProducts = false) => {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({
    id,
    cashier: emptyCashier,
    products: [] as Product[],
    isLoading: true,
    error: '',
  });

  useEffect(() => {
    let active = true;
    setState({
      id,
      cashier: emptyCashier,
      products: [],
      isLoading: true,
      error: '',
    });

    const load = async () => {
      try {
        const [cashier, products] = await Promise.all([
          getCashierReport(id),
          includeProducts
            ? serverApi.get<Product[]>('/products').then(({ data }) => data)
            : Promise.resolve([] as Product[]),
        ]);
        if (active) {
          setState({ id, cashier, products, isLoading: false, error: '' });
        }
      } catch {
        if (active) {
          setState({
            id,
            cashier: emptyCashier,
            products: [],
            isLoading: false,
            error: 'Unable to load this report. Check the link and try again.',
          });
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id, includeProducts, attempt]);

  return {
    ...state,
    cashier: state.id === id ? state.cashier : emptyCashier,
    products: state.id === id ? state.products : [],
    isLoading: state.id !== id || state.isLoading,
    error: state.id === id ? state.error : '',
    retry: () => setAttempt((previous) => previous + 1),
  };
};
