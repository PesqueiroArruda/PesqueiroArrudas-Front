const assert = require('node:assert/strict');
const test = require('node:test');
const loadTypeScript = require('./loadTypeScript.cjs');
const { groupCashiersByDay } = loadTypeScript('src/utils/groupCashiersByDay.ts');

const cashiers = Object.freeze([
  Object.freeze({
    _id: 'a',
    date: '2031-01-02T12:00:00-03:00',
    total: 0.1,
    payments: Object.freeze([{ _id: 'p1' }]),
  }),
  Object.freeze({
    _id: 'b',
    date: '2031-01-02T20:00:00-03:00',
    total: 0.2,
    payments: Object.freeze([{ _id: 'p2' }]),
  }),
  Object.freeze({
    _id: 'c',
    date: '2031-01-03T12:00:00-03:00',
    total: 4,
    payments: Object.freeze([]),
  }),
]);

test('groups by exact day, summing totals and merging payments', () => {
  const groups = groupCashiersByDay(cashiers);
  assert.equal(groups.length, 2);
  const jan2 = groups.find((g) => g._id === '2031-01-02');
  assert.equal(jan2.total, 0.3);
  assert.equal(jan2.payments.length, 2);
});

test('sorts from the most recent day to the oldest', () => {
  const groups = groupCashiersByDay(cashiers);
  assert.equal(groups[0]._id, '2031-01-03');
  assert.equal(groups[1]._id, '2031-01-02');
});

test('repeated calculation neither mutates input nor accumulates payments', () => {
  const first = groupCashiersByDay(cashiers);
  const second = groupCashiersByDay(cashiers);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.equal(cashiers[0].payments.length, 1);
  const refreshed = groupCashiersByDay(cashiers.slice(0, 1));
  assert.equal(refreshed[0].payments.length, 1);
  assert.equal(refreshed[0].total, 0.1);
});

test('ignores invalid dates instead of creating misleading day groups', () => {
  assert.equal(
    groupCashiersByDay([{ date: 'invalid', total: 10, payments: [] }]).length,
    0
  );
});
