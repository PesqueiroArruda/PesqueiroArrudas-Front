const assert = require('node:assert/strict');
const test = require('node:test');
const loadTypeScript = require('./loadTypeScript.cjs');
const { calculatePayment } = loadTypeScript('src/utils/calculatePayment.ts');

test('rejects empty, zero, negative, non-finite and malformed payment amounts', () => {
  [
    '',
    ' ',
    '0',
    '-1',
    'NaN',
    'Infinity',
    'abc',
    '1,2,3',
    '1.001',
    '1e2',
  ].forEach((receivedValue) => {
    const payment = calculatePayment({
      receivedValue,
      totalDue: 100,
      isCash: true,
    });
    assert.equal(payment.isValid, false, receivedValue);
    assert.equal(payment.amount, 0);
    assert.equal(payment.change, 0);
  });
});

test('accepts decimal commas and computes cash change in cents', () => {
  const payment = calculatePayment({
    receivedValue: '20,00',
    totalDue: 19.9,
    isCash: true,
  });
  assert.equal(payment.isValid, true);
  assert.equal(payment.amount, 19.9);
  assert.equal(payment.change, 0.1);
});

test('revalidates overpayment when switching from cash to another method', () => {
  const input = { receivedValue: '20', totalDue: 10 };
  assert.equal(calculatePayment({ ...input, isCash: true }).isValid, true);
  assert.equal(calculatePayment({ ...input, isCash: false }).isValid, false);
});

test('clears change after reducing the received value and allows partial payments', () => {
  assert.equal(
    calculatePayment({ receivedValue: '50', totalDue: 30, isCash: true })
      .change,
    20
  );
  const payment = calculatePayment({
    receivedValue: '10',
    totalDue: 30,
    isCash: true,
  });
  assert.equal(payment.isValid, true);
  assert.equal(payment.amount, 10);
  assert.equal(payment.change, 0);
});

test('rejects payments when there is no valid outstanding balance', () => {
  [0, -1, NaN, Infinity].forEach((totalDue) => {
    assert.equal(
      calculatePayment({ receivedValue: '10', totalDue, isCash: true }).isValid,
      false
    );
  });
});
