const assert = require('node:assert/strict');
const test = require('node:test');
const loadTypeScript = require('./loadTypeScript.cjs');
const { groupCashiersByMonth } = loadTypeScript(
  'src/utils/groupCashiersByMonth.ts'
);

const cashiers = Object.freeze([
  Object.freeze({
    _id: 'a',
    date: '2031-01-02',
    total: 0.1,
    payments: Object.freeze([{ _id: 'p1' }]),
  }),
  Object.freeze({
    _id: 'b',
    date: '2031-01-03',
    total: 0.2,
    payments: Object.freeze([{ _id: 'p2' }]),
  }),
  Object.freeze({
    _id: 'c',
    date: '2032-01-03',
    total: 4,
    payments: Object.freeze([]),
  }),
]);

test('groups by month and year with stable IDs and summed totals', () => {
  const groups = groupCashiersByMonth(cashiers);
  assert.equal(groups.length, 2);
  assert.equal(groups[0]._id, '2031-01');
  assert.equal(groups[0].month, 'janeiro');
  assert.equal(groups[0].total, 0.3);
  assert.equal(groups[0].payments.length, 2);
  assert.equal(groups[1].year, '2032');
});

test('repeated calculation neither mutates input nor accumulates payments', () => {
  const first = groupCashiersByMonth(cashiers);
  const second = groupCashiersByMonth(cashiers);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.equal(cashiers[0].payments.length, 1);
  const refreshed = groupCashiersByMonth(cashiers.slice(0, 1));
  assert.equal(refreshed[0].payments.length, 1);
  assert.equal(refreshed[0].total, 0.1);
});

test('ignores invalid dates instead of creating misleading month groups', () => {
  assert.equal(
    groupCashiersByMonth([{ date: 'invalid', total: 10, payments: [] }]).length,
    0
  );
});
