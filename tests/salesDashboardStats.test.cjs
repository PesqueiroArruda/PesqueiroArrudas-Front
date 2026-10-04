const assert = require('node:assert/strict');
const test = require('node:test');
const loadTypeScript = require('./loadTypeScript.cjs');

const groupCashiersByDay = loadTypeScript('src/utils/groupCashiersByDay.ts');
const groupCashiersByMonth = loadTypeScript('src/utils/groupCashiersByMonth.ts');
const normalizeName = loadTypeScript('src/utils/normalizeName.ts');

const { buildSalesDashboardStats } = loadTypeScript('src/utils/buildSalesDashboardStats.ts', {
  require(id) {
    if (id === './groupCashiersByDay') return groupCashiersByDay;
    if (id === './groupCashiersByMonth') return groupCashiersByMonth;
    if (id === './normalizeName') return normalizeName;
    return require(id);
  },
});

const products = [
  { name: 'Cerveja', unitPrice: 10 },
  { name: 'Porção de peixe', unitPrice: 50 },
  { name: 'Refrigerante', unitPrice: 5 },
];

function makeCashier(date, products_) {
  return {
    _id: date,
    date,
    total: 0,
    payments: [
      {
        _id: `${date}-p1`,
        paymentTypes: ['Dinheiro'],
        totalPayed: 0,
        command: { _id: `${date}-c1`, table: 'Mesa 1', waiter: 'Diego', total: 0, waiterExtra: 0, products: products_ },
      },
    ],
  };
}

test('breaks best sellers down per day instead of only the aggregated period', () => {
  const cashiers = [
    makeCashier('2031-01-02T12:00:00-03:00', [
      { _id: '1', name: 'Cerveja', amount: 10 },
      { _id: '2', name: 'Refrigerante', amount: 2 },
    ]),
    makeCashier('2031-01-03T12:00:00-03:00', [{ _id: '3', name: 'Porção de peixe', amount: 3 }]),
  ];

  const stats = buildSalesDashboardStats(cashiers, products);
  assert.equal(stats.bestSellingItemsByDay.length, 2);

  const [mostRecent, oldest] = stats.bestSellingItemsByDay;
  assert.equal(mostRecent.date, '2031-01-03');
  assert.equal(mostRecent.items.length, 1);
  assert.equal(mostRecent.items[0].name, 'Porção de peixe');
  assert.equal(mostRecent.items[0].quantity, 3);
  assert.equal(mostRecent.items[0].estimatedRevenue, 150);

  assert.equal(oldest.date, '2031-01-02');
  assert.equal(oldest.items[0].name, 'Cerveja');
  assert.equal(oldest.items[0].quantity, 10);
  assert.equal(oldest.items[0].estimatedRevenue, 100);
});

test('lists every item sold in a day sorted by quantity', () => {
  const dayProducts = Array.from({ length: 7 }, (_, index) => ({
    _id: String(index),
    name: `Produto ${index}`,
    amount: index + 1,
  }));
  const cashiers = [makeCashier('2031-02-01T12:00:00-03:00', dayProducts)];
  const stats = buildSalesDashboardStats(cashiers, []);

  assert.equal(stats.bestSellingItemsByDay.length, 1);
  const { items } = stats.bestSellingItemsByDay[0];
  assert.equal(items.length, 7);
  assert.equal(items[0].name, 'Produto 6');
  assert.equal(items[6].name, 'Produto 0');
});

test('includes the open cashier only in the by-day list, flagged as open', () => {
  const closed = [makeCashier('2031-04-01T12:00:00-03:00', [{ _id: '1', name: 'Cerveja', amount: 2 }])];
  const open = makeCashier('2031-04-02T12:00:00-03:00', [{ _id: '2', name: 'Cerveja', amount: 5 }]);
  const stats = buildSalesDashboardStats(closed, products, open);

  assert.equal(stats.bestSellingItemsByDay.length, 2);
  assert.equal(stats.bestSellingItemsByDay[0].date, '2031-04-02');
  assert.match(stats.bestSellingItemsByDay[0].label, /\(em aberto\)/);
  assert.equal(stats.bestSellingItems[0].quantity, 2);
});

test('excludes days without any items sold', () => {
  const cashiers = [
    { _id: 'a', date: '2031-03-01T12:00:00-03:00', total: 0, payments: [] },
    makeCashier('2031-03-02T12:00:00-03:00', [{ _id: '1', name: 'Cerveja', amount: 1 }]),
  ];
  const stats = buildSalesDashboardStats(cashiers, products);
  assert.equal(stats.bestSellingItemsByDay.length, 1);
  assert.equal(stats.bestSellingItemsByDay[0].date, '2031-03-02');
});
