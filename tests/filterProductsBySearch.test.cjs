const assert = require('node:assert/strict');
const test = require('node:test');
const loadTypeScript = require('./loadTypeScript.cjs');

const { filterProductsBySearch } = loadTypeScript(
  'src/utils/filterProductsBySearch.ts'
);

const products = [
  { name: 'Porção de Tilápia', category: 'porções' },
  { name: 'Tilápia Inteira', category: 'peixes' },
  { name: 'Refrigerante Lata', category: 'bebidas' },
  { name: 'Pastel de Camarão', category: 'pratos' },
];

test('returns everything when the search is empty', () => {
  assert.equal(filterProductsBySearch(products, '  ').length, 4);
});

test('ignores accents and case, and puts names starting with the text first', () => {
  const result = filterProductsBySearch(products, 'TILAPIA');
  assert.deepEqual(
    result.map((product) => product.name),
    ['Tilápia Inteira', 'Porção de Tilápia']
  );
});

test('ignores spaces like the stock search does', () => {
  const result = filterProductsBySearch(products, 'pastelde cam');
  assert.deepEqual(
    result.map((product) => product.name),
    ['Pastel de Camarão']
  );
});

test('also matches by category', () => {
  const result = filterProductsBySearch(products, 'bebid');
  assert.deepEqual(
    result.map((product) => product.name),
    ['Refrigerante Lata']
  );
});

test('returns nothing when there is no match', () => {
  assert.equal(filterProductsBySearch(products, 'pizza').length, 0);
});
