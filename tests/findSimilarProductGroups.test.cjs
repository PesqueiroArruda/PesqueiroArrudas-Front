const assert = require('node:assert/strict');
const test = require('node:test');
const loadTypeScript = require('./loadTypeScript.cjs');

const { findSimilarProductGroups } = loadTypeScript('src/utils/findSimilarProductGroups.ts');

test('groups names that only differ by accent, case and spacing', () => {
  const products = [
    { _id: '1', name: 'Coca-Cola' },
    { _id: '2', name: 'coca cola' },
    { _id: '3', name: 'COCA  COLA' },
    { _id: '4', name: 'Guaraná' },
  ];
  const groups = findSimilarProductGroups(products);
  assert.equal(groups.length, 1);
  assert.deepEqual(
    Array.from(groups[0], (p) => p._id).sort(),
    ['1', '2', '3']
  );
});

test('groups simple typos above the similarity threshold', () => {
  const products = [
    { _id: '1', name: 'Refrigerante' },
    { _id: '2', name: 'Refrigirante' },
  ];
  const groups = findSimilarProductGroups(products);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].length, 2);
});

test('never groups the same product name with a different size/number', () => {
  const products = [
    { _id: '1', name: 'Coca-Cola 350ml' },
    { _id: '2', name: 'Coca-Cola 2L' },
    { _id: '3', name: 'Cerveja 600ml' },
    { _id: '4', name: 'Cerveja 350ml' },
  ];
  const groups = findSimilarProductGroups(products);
  assert.equal(groups.length, 0);
});

test('does not group genuinely different products', () => {
  const products = [
    { _id: '1', name: 'Batata Frita' },
    { _id: '2', name: 'Peixe Frito' },
  ];
  const groups = findSimilarProductGroups(products);
  assert.equal(groups.length, 0);
});

test('ignores products with no similar candidate', () => {
  const products = [
    { _id: '1', name: 'Água' },
    { _id: '2', name: 'agua' },
    { _id: '3', name: 'Torresmo' },
  ];
  const groups = findSimilarProductGroups(products);
  assert.equal(groups.length, 1);
  assert.deepEqual(
    Array.from(groups[0], (p) => p._id).sort(),
    ['1', '2']
  );
});
