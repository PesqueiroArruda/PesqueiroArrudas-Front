const assert = require('node:assert/strict');
const test = require('node:test');
const { DateTime } = require('luxon');
const loadTypeScript = require('./loadTypeScript.cjs');

const { getReservationDatePreset } = loadTypeScript('src/utils/getReservationDatePreset.ts');

test('"today" returns the same date for from and to', () => {
  const reference = DateTime.fromISO('2026-03-15');
  const range = getReservationDatePreset('today', reference);
  assert.equal(range.from, '2026-03-15');
  assert.equal(range.to, '2026-03-15');
});

test('"next7days" spans from the reference date to 7 days later', () => {
  const reference = DateTime.fromISO('2026-03-15');
  const range = getReservationDatePreset('next7days', reference);
  assert.equal(range.from, '2026-03-15');
  assert.equal(range.to, '2026-03-22');
});

test('"thisMonth" spans the full calendar month of the reference date', () => {
  const reference = DateTime.fromISO('2026-03-15');
  const range = getReservationDatePreset('thisMonth', reference);
  assert.equal(range.from, '2026-03-01');
  assert.equal(range.to, '2026-03-31');
});

test('"thisMonth" respects a non-leap February', () => {
  const reference = DateTime.fromISO('2026-02-10');
  const range = getReservationDatePreset('thisMonth', reference);
  assert.equal(range.from, '2026-02-01');
  assert.equal(range.to, '2026-02-28');
});

test('defaults to the current date when no reference is given', () => {
  const range = getReservationDatePreset('today');
  const today = DateTime.now().toISODate();
  assert.equal(range.from, today);
  assert.equal(range.to, today);
});
