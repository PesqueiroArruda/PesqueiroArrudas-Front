const assert = require('node:assert/strict');
const test = require('node:test');
const loadTypeScript = require('./loadTypeScript.cjs');
const { getCommandBalance } = loadTypeScript('src/utils/getCommandBalance.ts');

test('recognizes a fully paid discounted command despite floating-point representation', () => {
  assert.equal(
    getCommandBalance({ total: 0.3, totalPayed: 0.1, discount: 0.2 }),
    0
  );
});

test('preserves outstanding cents and supports commands without an explicit discount', () => {
  assert.equal(
    getCommandBalance({ total: 100, totalPayed: 70, discount: 20 }),
    10
  );
  assert.equal(getCommandBalance({ total: 1, totalPayed: 0.99 }), 0.01);
});

test('recognizes the backend closing response which sets totalPayed to the gross total', () => {
  assert.equal(
    getCommandBalance({ total: 100, totalPayed: 100, discount: 20 }),
    0
  );
});

test('missing, invalid and negative amounts cannot be mistaken for a paid command', () => {
  for (const command of [
    {},
    { total: 100 },
    { total: NaN, totalPayed: 0 },
    { total: 100, totalPayed: Infinity },
    { total: 100, totalPayed: -1 },
    { total: 100, totalPayed: 0, discount: 101 },
    { total: 100, totalPayed: '100' },
  ]) {
    assert.equal(getCommandBalance(command), null);
  }
});
