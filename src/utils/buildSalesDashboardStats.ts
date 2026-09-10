import { DateTime } from 'luxon';
import { Cashier, CashierPayment } from 'types/Cashier';
import { Product } from 'types/Product';
import { groupCashiersByMonth } from './groupCashiersByMonth';

export interface ItemStat {
  name: string;
  quantity: number;
  estimatedRevenue: number;
}

export interface MonthStat {
  label: string;
  total: number;
}

export interface HourStat {
  hour: number;
  concurrentCount: number;
}

export interface WeekdayStat {
  weekday: string;
  total: number;
}

export interface ShareStat {
  label: string;
  total: number;
  percentage: number;
}

export interface SalesDashboardStats {
  totalRevenue: number;
  paidCommandsCount: number;
  averageTicket: number;
  averageTicketPerPerson: number;
  bestSellingItems: ItemStat[];
  worstSellingItems: ItemStat[];
  neverSoldProducts: { name: string; category?: string }[];
  monthsRanked: MonthStat[];
  peakHours: HourStat[];
  weekdaysRanked: WeekdayStat[];
  paymentTypeBreakdown: ShareStat[];
  restaurantVsFishing: ShareStat[];
  categoryBreakdown: { category: string; quantity: number }[];
  waiterRanking: ShareStat[];
}

const WEEKDAYS_PT = ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo'];

function allPayments(cashiers: Cashier[]): CashierPayment[] {
  return cashiers.flatMap((cashier) => cashier.payments || []);
}

function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function withPercentages(entries: { label: string; total: number }[]): ShareStat[] {
  const grandTotal = entries.reduce((sum, entry) => sum + entry.total, 0);
  return entries
    .map((entry) => ({
      ...entry,
      total: round2(entry.total),
      percentage: grandTotal > 0 ? round2((entry.total / grandTotal) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export function buildSalesDashboardStats(cashiers: Cashier[], products: Product[]): SalesDashboardStats {
  const payments = allPayments(cashiers);

  const totalRevenue = round2(cashiers.reduce((sum, cashier) => sum + (cashier.total || 0), 0));
  const paidCommandsCount = payments.length;
  const averageTicket = paidCommandsCount > 0 ? round2(totalRevenue / paidCommandsCount) : 0;

  const totalPeopleServed = payments.reduce(
    (sum, payment) => sum + (payment.command?.peopleCount || 1),
    0
  );
  const averageTicketPerPerson = totalPeopleServed > 0 ? round2(totalRevenue / totalPeopleServed) : 0;

  // Itens vendidos: quantidade é exata (vem do snapshot), receita é estimativa
  // pelo preço ATUAL do catálogo (o snapshot não guarda preço histórico).
  const productByName = new Map(products.map((product) => [product.name, product]));
  const quantityByName = new Map<string, number>();
  payments.forEach((payment) => {
    payment.command?.products?.forEach((product) => {
      quantityByName.set(product.name, (quantityByName.get(product.name) || 0) + product.amount);
    });
  });

  const itemStats: ItemStat[] = [...quantityByName.entries()].map(([name, quantity]) => ({
    name,
    quantity: round2(quantity),
    estimatedRevenue: round2(quantity * (productByName.get(name)?.unitPrice || 0)),
  }));
  const bestSellingItems = [...itemStats].sort((a, b) => b.quantity - a.quantity).slice(0, 10);
  const worstSellingItems = [...itemStats].sort((a, b) => a.quantity - b.quantity).slice(0, 10);

  const neverSoldProducts = products
    .filter((product) => !quantityByName.has(product.name))
    .map((product) => ({ name: product.name, category: product.category }));

  const monthsRanked: MonthStat[] = groupCashiersByMonth(cashiers)
    .map((group) => ({ label: `${group.month} de ${group.year}`, total: round2(group.total) }))
    .sort((a, b) => b.total - a.total);

  // Horário de pico: pra cada intervalo [abertura da comanda, pagamento],
  // marca cada hora cheia coberta como "1 comanda aberta" e soma entre todas
  // as comandas do período. Só considera pagamentos com os dois timestamps
  // (caixas fechados antes dessa funcionalidade não têm esse dado).
  const hourCounts = new Array(24).fill(0);
  payments.forEach((payment) => {
    const openedAtRaw = payment.command?.createdAt;
    const closedAtRaw = payment.createdAt;
    if (!openedAtRaw || !closedAtRaw) return;

    const openedAt = DateTime.fromISO(openedAtRaw, { zone: 'America/Sao_Paulo', setZone: true });
    const closedAt = DateTime.fromISO(closedAtRaw, { zone: 'America/Sao_Paulo', setZone: true });
    if (!openedAt.isValid || !closedAt.isValid || closedAt < openedAt) return;

    const openedHour = openedAt.hour;
    const closedHour = closedAt.hour;
    let hour = openedHour;
    for (let guard = 0; guard <= 24; guard += 1) {
      hourCounts[hour] += 1;
      if (hour === closedHour) break;
      hour = (hour + 1) % 24;
    }
  });
  const peakHours: HourStat[] = hourCounts
    .map((concurrentCount, hour) => ({ hour, concurrentCount }))
    .filter((entry) => entry.concurrentCount > 0)
    .sort((a, b) => b.concurrentCount - a.concurrentCount)
    .slice(0, 5);

  const weekdayTotals = new Array(7).fill(0);
  cashiers.forEach((cashier) => {
    const date = DateTime.fromISO(cashier.date, { zone: 'America/Sao_Paulo', setZone: true });
    if (!date.isValid) return;
    weekdayTotals[date.weekday - 1] += cashier.total || 0;
  });
  const weekdaysRanked: WeekdayStat[] = weekdayTotals
    .map((total, index) => ({ weekday: WEEKDAYS_PT[index], total: round2(total) }))
    .sort((a, b) => b.total - a.total);

  // O total de um pagamento pode estar associado a mais de uma forma de
  // pagamento (pagamento parcial em mais de uma vez); sem o valor exato de
  // cada parte, divide o total igualmente entre as formas listadas.
  const paymentTypeTotals = new Map<string, number>();
  payments.forEach((payment) => {
    const types = payment.paymentTypes?.length ? payment.paymentTypes : ['Não informado'];
    const share = (payment.totalPayed || 0) / types.length;
    types.forEach((type) => {
      paymentTypeTotals.set(type, (paymentTypeTotals.get(type) || 0) + share);
    });
  });
  const paymentTypeBreakdown = withPercentages(
    [...paymentTypeTotals.entries()].map(([label, total]) => ({ label, total }))
  );

  const restaurantVsFishingTotals = { Restaurante: 0, Pesqueiro: 0 };
  payments.forEach((payment) => {
    const bucket = payment.command?.fishingType ? 'Pesqueiro' : 'Restaurante';
    restaurantVsFishingTotals[bucket] += payment.totalPayed || 0;
  });
  const restaurantVsFishing = withPercentages(
    Object.entries(restaurantVsFishingTotals).map(([label, total]) => ({ label, total }))
  );

  const categoryQuantities = new Map<string, number>();
  quantityByName.forEach((quantity, name) => {
    const category = productByName.get(name)?.category || 'Sem categoria';
    categoryQuantities.set(category, (categoryQuantities.get(category) || 0) + quantity);
  });
  const categoryBreakdown = [...categoryQuantities.entries()]
    .map(([category, quantity]) => ({ category, quantity: round2(quantity) }))
    .sort((a, b) => b.quantity - a.quantity);

  const waiterTotals = new Map<string, number>();
  payments.forEach((payment) => {
    const waiter = payment.command?.waiter || 'Não informado';
    waiterTotals.set(waiter, (waiterTotals.get(waiter) || 0) + (payment.totalPayed || 0));
  });
  const waiterRanking = withPercentages(
    [...waiterTotals.entries()].map(([label, total]) => ({ label, total }))
  );

  return {
    totalRevenue,
    paidCommandsCount,
    averageTicket,
    averageTicketPerPerson,
    bestSellingItems,
    worstSellingItems,
    neverSoldProducts,
    monthsRanked,
    peakHours,
    weekdaysRanked,
    paymentTypeBreakdown,
    restaurantVsFishing,
    categoryBreakdown,
    waiterRanking,
  };
}
