import { DateTime } from 'luxon';
import { Cashier, CashierByMonth } from 'types/Cashier';

export const groupCashiersByMonth = (cashiers: Cashier[]): CashierByMonth[] => {
  const groups = new Map<string, CashierByMonth>();

  cashiers.forEach((cashier) => {
    const date = DateTime.fromISO(cashier.date, {
      zone: 'America/Sao_Paulo',
      setZone: true,
    }).setLocale('pt-BR');
    if (!date.isValid) return;

    const id = date.toFormat('yyyy-MM');
    const previous = groups.get(id);
    groups.set(id, {
      _id: id,
      month: date.toFormat('LLLL'),
      year: String(date.year),
      total:
        (Math.round((previous?.total || 0) * 100) +
          Math.round(cashier.total * 100)) /
        100,
      payments: [...(previous?.payments || []), ...cashier.payments],
    });
  });

  return [...groups.values()];
};
