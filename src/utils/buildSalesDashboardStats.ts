import { DateTime } from 'luxon';
import { Cashier, CashierPayment } from 'types/Cashier';
import { Product } from 'types/Product';
import { groupCashiersByMonth } from './groupCashiersByMonth';
import { normalizeName, stripStrayPunctuation } from './normalizeName';

export interface ItemStat {
  name: string;
  quantity: number;
  estimatedRevenue: number;
}

export interface MonthStat {
  label: string;
  total: number;
}

export interface RepeatCustomerStat {
  name: string;
  visits: number;
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
  repeatCustomers: RepeatCustomerStat[];
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

// Corrige apelidos/erros de digitação conhecidos de nomes de garçom antes de
// agrupar (chave = nome normalizado). Complete aqui conforme forem aparecendo
// novas duplicatas na lista de "Desempenho por garçom".
const WAITER_NAME_ALIASES: Record<string, string> = {
  giovani: 'Giovanni',
  giovane: 'Giovanni',
  giovannk: 'Giovanni',
  deigo: 'Diego',
  diegi: 'Diego',
  diegio: 'Diego',
  diwego: 'Diego',
  diegp: 'Diego',
  dieog: 'Diego',
  euo: 'Euso',
  eusi: 'Euso',
  julcio: 'Julio',
  juliop: 'Julio',
  juliio: 'Julio',
  stevfe: 'Steve',
  luu: 'Lu',
  lui: 'Lu',
  li: 'Lu',
  pri: 'Priscila',
  pti: 'Priscila',
  tiago: 'Thiago',
  vianca: 'Bianca',
  grazy: 'Grazyele',
  grazi: 'Grazyele',
  grazyele: 'Grazyele',
  paty: 'Patricia',
};

function canonicalWaiterName(rawName: string) {
  const cleaned = stripStrayPunctuation(rawName.trim());
  const alias = WAITER_NAME_ALIASES[normalizeName(cleaned)];
  return alias || cleaned;
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

  const cashiersByMonth = groupCashiersByMonth(cashiers);

  const monthsRanked: MonthStat[] = cashiersByMonth
    .map((group) => ({ label: `${group.month} de ${group.year}`, total: round2(group.total) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Clientes recorrentes: agrupa pelo nome da mesa/cliente (normalizado —
  // sem acento, minúsculo, sem espaço sobrando), contando quantas vezes uma
  // comanda com esse nome foi paga. Não usa os aliases dos garçons aqui de
  // propósito: com nomes de cliente é melhor deixar variações comuns (ex.
  // "Thiago"/"Tiago") como entradas separadas do que arriscar juntar gente
  // diferente.
  const customerTotals = new Map<string, { name: string; visits: number; total: number }>();
  payments.forEach((payment) => {
    const rawName = stripStrayPunctuation((payment.command?.table || 'Não informado').trim());
    const key = normalizeName(rawName);
    const existing = customerTotals.get(key);
    customerTotals.set(key, {
      name: existing?.name || rawName,
      visits: (existing?.visits || 0) + 1,
      total: round2((existing?.total || 0) + (payment.totalPayed || 0)),
    });
  });
  // Só entram aqui clientes com mais de uma visita no período — é o que
  // "recorrente" quer dizer; cliente de visita única não é o foco da seção.
  const repeatCustomers: RepeatCustomerStat[] = [...customerTotals.values()]
    .filter((entry) => entry.visits > 1)
    .sort((a, b) => {
      if (b.visits !== a.visits) return b.visits - a.visits;
      return b.total - a.total;
    })
    .slice(0, 20);

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

  // Agrupa por nome normalizado (sem acento, minúsculo, sem pontuação perdida)
  // e aplica os aliases conhecidos, pra juntar duplicatas como
  // "José"/"jose"/"JOSÉ" ou "Diegp"/"Dieog" (erro de digitação de "Diego").
  const waiterTotals = new Map<string, { label: string; total: number }>();
  payments.forEach((payment) => {
    const waiterName = canonicalWaiterName(payment.command?.waiter || 'Não informado');
    const key = normalizeName(waiterName);
    const existing = waiterTotals.get(key);
    waiterTotals.set(key, {
      label: existing?.label || waiterName,
      total: (existing?.total || 0) + (payment.totalPayed || 0),
    });
  });
  const waiterRanking = withPercentages([...waiterTotals.values()]);

  return {
    totalRevenue,
    paidCommandsCount,
    averageTicket,
    averageTicketPerPerson,
    bestSellingItems,
    worstSellingItems,
    neverSoldProducts,
    monthsRanked,
    repeatCustomers,
    peakHours,
    weekdaysRanked,
    paymentTypeBreakdown,
    restaurantVsFishing,
    categoryBreakdown,
    waiterRanking,
  };
}
