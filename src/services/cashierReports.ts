import { Cashier } from 'types/Cashier';
import { groupCashiersByMonth } from '../utils/groupCashiersByMonth';
import { serverApi } from './serverApi';

export const getCashierReport = async (id: string): Promise<Cashier> => {
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(id)) {
    const { data } = await serverApi.get<Cashier[]>('/cashiers');
    const report = groupCashiersByMonth(data).find((group) => group._id === id);
    if (!report) throw new Error('No cashier report exists for this month.');
    return { ...report, date: undefined };
  }

  if (!/^[a-f\d]{24}$/i.test(id)) {
    throw new Error(
      'Invalid report link. Open the report from the reports list.'
    );
  }

  const { data } = await serverApi.get<{ cashier: Cashier }>(`/cashiers/${id}`);
  if (!data.cashier) throw new Error('Cashier report not found.');
  return data.cashier;
};
