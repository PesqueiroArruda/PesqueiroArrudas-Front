const assert = require('node:assert/strict');
const test = require('node:test');
const loadTypeScript = require('./loadTypeScript.cjs');
const grouping = loadTypeScript('src/utils/groupCashiersByMonth.ts');

function createService(get) {
  return loadTypeScript('src/services/cashierReports.ts', {
    require(id) {
      if (id === '../utils/groupCashiersByMonth') return grouping;
      if (id === './serverApi') return { serverApi: { get } };
      throw new Error(`Unexpected dependency: ${id}`);
    },
  });
}

test('daily direct links fetch the requested cashier without browser storage', async () => {
  const id = '507f1f77bcf86cd799439011';
  const report = { _id: id, total: 10, payments: [], date: '2026-09-09' };
  const service = createService(async (url) => {
    assert.equal(url, `/cashiers/${id}`);
    return { data: { cashier: report } };
  });
  assert.equal(await service.getCashierReport(id), report);
});

test('monthly direct links rebuild the requested month from backend cashiers', async () => {
  const service = createService(async (url) => {
    assert.equal(url, '/cashiers');
    return {
      data: [
        {
          _id: 'a',
          date: '2026-09-01T12:00:00-03:00',
          total: 10,
          payments: [{ _id: 'p1' }],
        },
        {
          _id: 'b',
          date: '2026-09-02T12:00:00-03:00',
          total: 20,
          payments: [{ _id: 'p2' }],
        },
        {
          _id: 'c',
          date: '2026-08-02T12:00:00-03:00',
          total: 50,
          payments: [],
        },
      ],
    };
  });
  const report = await service.getCashierReport('2026-09');
  assert.equal(report.total, 30);
  assert.equal(report.payments.length, 2);
  assert.equal(report._id, '2026-09');
  assert.equal(report.month, 'setembro');
  assert.equal(report.date, undefined);
});

test('invalid and old random report IDs do not reach the backend', async () => {
  const service = createService(() => {
    throw new Error('Unexpected HTTP call');
  });
  for (const id of [
    '2026-13',
    '2026-00',
    'undefined',
    '0.1234',
    '../admin',
    '',
  ]) {
    await assert.rejects(service.getCashierReport(id), /Invalid report link/);
  }
});

test('missing months and failed requests do not become empty successful reports', async () => {
  const missing = createService(async () => ({ data: [] }));
  await assert.rejects(
    missing.getCashierReport('2026-09'),
    /No cashier report/
  );
  const failed = createService(async () => {
    throw new Error('Network unavailable');
  });
  await assert.rejects(
    failed.getCashierReport('2026-09'),
    /Network unavailable/
  );
});
