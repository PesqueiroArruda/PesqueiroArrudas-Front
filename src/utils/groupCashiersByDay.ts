import { DateTime } from 'luxon';
import { Cashier, CashierByDay } from 'types/Cashier';

export const groupCashiersByDay = (cashiers: Cashier[]): CashierByDay[] => {
  const groups = new Map<string, CashierByDay>();

  cashiers.forEach((cashier) => {
    const date = DateTime.fromISO(cashier.date, {
      zone: 'America/Sao_Paulo',
      setZone: true,
    }).setLocale('pt-BR');
    if (!date.isValid) return;

    const id = date.toFormat('yyyy-MM-dd');
    const previous = groups.get(id);
    groups.set(id, {
      _id: id,
      date: previous?.date || date.toISO() || id,
      total:
        (Math.round((previous?.total || 0) * 100) +
          Math.round(cashier.total * 100)) /
        100,
      payments: [...(previous?.payments || []), ...cashier.payments],
    });
  });

  return [...groups.values()].sort((a, b) => (a._id < b._id ? 1 : -1));
};
