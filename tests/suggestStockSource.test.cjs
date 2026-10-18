const assert = require('node:assert/strict');
const test = require('node:test');
const loadTypeScript = require('./loadTypeScript.cjs');

const { suggestStockSource, listIfoodSuggestions, hasIfoodToken } = loadTypeScript(
  'src/utils/suggestStockSource.ts'
);

const products = [
  { _id: '1', name: 'Marmitex de Tilápia' },
  { _id: '2', name: 'Marmitex de Tilápia IFOOD' },
  { _id: '3', name: 'Tilápia Espalmada 2 pessoas (Vermelho)' },
  { _id: '4', name: 'Tilápia Espalmada Ifood 2 pessoas (Vermelho)' },
  { _id: '5', name: 'Tilápia Espalmada 3 pessoas' },
  { _id: '6', name: 'Pudim' },
];

test('detects the IFOOD word on its own, ignoring case and accents', () => {
  assert.equal(hasIfoodToken('Marmitex de Tilápia IFOOD'), true);
  assert.equal(hasIfoodToken('Tilápia Espalmada Ifood 2 pessoas'), true);
  assert.equal(hasIfoodToken('Marmitex de Tilápia'), false);
});

test('links the IFOOD product to the same name without IFOOD', () => {
  const suggestion = suggestStockSource(products[1], products);
  assert.equal(suggestion.sourceId, '1');
  assert.equal(suggestion.confidence, 'exact');
});

test('works with IFOOD in the middle of the name and with punctuation', () => {
  const suggestion = suggestStockSource(products[3], products);
  assert.equal(suggestion.sourceId, '3');
  assert.equal(suggestion.confidence, 'exact');
});

test('does not mix variations that differ only by number', () => {
  const ifood = { _id: '9', name: 'Tilápia Espalmada 4 pessoas IFOOD' };
  assert.equal(suggestStockSource(ifood, [...products, ifood]), null);
});

test('suggests a close name as similar, never as exact', () => {
  const ifood = { _id: '9', name: 'Marmitex de Tilapia Frita IFOOD' };
  const catalog = [{ _id: '1', name: 'Marmitex de Tilápia Fritas' }, ifood];
  const suggestion = suggestStockSource(ifood, catalog);
  assert.equal(suggestion.sourceId, '1');
  assert.equal(suggestion.confidence, 'similar');
});

test('marks as similar when two products have the same name', () => {
  const ifood = { _id: '9', name: 'Pudim IFOOD' };
  const catalog = [
    { _id: '1', name: 'Pudim' },
    { _id: '2', name: 'pudim' },
    ifood,
  ];
  assert.equal(suggestStockSource(ifood, catalog).confidence, 'similar');
});

test('does not suggest products that already use another stock or are IFOOD', () => {
  const ifood = { _id: '9', name: 'Pudim IFOOD' };
  const catalog = [
    { _id: '1', name: 'Pudim', stockSourceId: '7' },
    { _id: '2', name: 'Pudim IFOOD' },
    ifood,
  ];
  assert.equal(suggestStockSource(ifood, catalog), null);
});

test('listIfoodSuggestions only lists unlinked IFOOD products', () => {
  const catalog = [
    ...products,
    { _id: '8', name: 'Pudim IFOOD', stockSourceId: '6' },
  ];
  const result = listIfoodSuggestions(catalog);
  assert.deepEqual(
    result.map(({ product }) => product._id),
    ['2', '4']
  );
  assert.equal(result[0].suggestion.sourceId, '1');
});
