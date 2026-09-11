const assert = require('node:assert/strict');
const test = require('node:test');
const loadTypeScript = require('./loadTypeScript.cjs');

const { findReservationConflicts } = loadTypeScript('src/utils/findReservationConflicts.ts');

function reservation(overrides) {
  return {
    id: '1',
    reservationDate: '2026-09-20',
    reservationTime: '20:00:00',
    environment: 'interno',
    paymentStatus: 'paid',
    ...overrides,
  };
}

test('flags two paid reservations at the same date, time and environment', () => {
  const reservations = [
    reservation({ id: '1' }),
    reservation({ id: '2' }),
  ];
  const conflicts = findReservationConflicts(reservations);
  assert.deepEqual(Array.from(conflicts).sort(), ['1', '2']);
});

test('does not flag the same date and time in different environments', () => {
  const reservations = [
    reservation({ id: '1', environment: 'interno' }),
    reservation({ id: '2', environment: 'externo' }),
  ];
  const conflicts = findReservationConflicts(reservations);
  assert.equal(conflicts.size, 0);
});

test('ignores reservations that are not paid', () => {
  const reservations = [
    reservation({ id: '1', paymentStatus: 'paid' }),
    reservation({ id: '2', paymentStatus: 'pending' }),
  ];
  const conflicts = findReservationConflicts(reservations);
  assert.equal(conflicts.size, 0);
});

test('only flags the members of the conflicting group', () => {
  const reservations = [
    reservation({ id: '1', reservationTime: '20:00:00' }),
    reservation({ id: '2', reservationTime: '20:00:00' }),
    reservation({ id: '3', reservationTime: '21:00:00' }),
  ];
  const conflicts = findReservationConflicts(reservations);
  assert.deepEqual(Array.from(conflicts).sort(), ['1', '2']);
});

test('returns an empty set for an empty list', () => {
  const conflicts = findReservationConflicts([]);
  assert.equal(conflicts.size, 0);
});

test('does not flag different times on the same date', () => {
  const reservations = [
    reservation({ id: '1', reservationTime: '19:00:00' }),
    reservation({ id: '2', reservationTime: '21:00:00' }),
  ];
  const conflicts = findReservationConflicts(reservations);
  assert.equal(conflicts.size, 0);
});
