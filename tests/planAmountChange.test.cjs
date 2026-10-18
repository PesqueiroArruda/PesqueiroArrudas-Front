const assert = require('node:assert/strict');
const test = require('node:test');
const loadTypeScript = require('./loadTypeScript.cjs');

const { planAmountChange } = loadTypeScript('src/utils/planAmountChange.ts');

test('five quick plus clicks become one stock diminish of 5', () => {
  const r = planAmountChange(2, 7);
  assert.equal(r.delta, 5);
  assert.equal(r.operation, 'diminish');
});

test('minus clicks become one stock increase', () => {
  const r = planAmountChange(4, 2);
  assert.equal(r.delta, 2);
  assert.equal(r.operation, 'increase');
});

test('clicks that cancel each other call nothing', () => {
  const r = planAmountChange(3, 3);
  assert.equal(r.delta, 0);
  assert.equal(r.operation, null);
});
