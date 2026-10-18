const assert = require('node:assert/strict');
const test = require('node:test');
const loadTypeScript = require('./loadTypeScript.cjs');

const { getIfoodMappingKey } = loadTypeScript('src/utils/ifoodMappingKey.ts');
const normalizeName = loadTypeScript('src/utils/normalizeName.ts');

const { resolveIfoodItemProduct } = loadTypeScript(
  'src/utils/resolveIfoodItemProduct.ts',
  {
    require: (id) => {
      if (id === './ifoodMappingKey') return { getIfoodMappingKey };
      if (id === './normalizeName') return normalizeName;
      throw new Error(`unexpected require: ${id}`);
    },
  }
);

const products = [
  { _id: 'p1', name: 'Coca-Cola Lata' },
  { _id: 'p2', name: 'Tilápia Inteira' },
];

test('uses the externalCode as the mapping key when present', () => {
  assert.equal(getIfoodMappingKey({ id: 'abc', externalCode: '123' }), '123');
});

test('treats a blank externalCode as missing', () => {
  assert.equal(
    getIfoodMappingKey({ id: 'abc', externalCode: '   ' }),
    'ifood-item:abc'
  );
});

test('falls back to the catalog item id when externalCode is empty', () => {
  assert.equal(
    getIfoodMappingKey({ id: 'abc', externalCode: '' }),
    'ifood-item:abc'
  );
  assert.equal(
    getIfoodMappingKey({ id: 'abc', externalCode: undefined }),
    'ifood-item:abc'
  );
});

test('returns an empty key when there is nothing to key on', () => {
  assert.equal(getIfoodMappingKey({ id: '', externalCode: '' }), '');
});

test('resolves a saved mapping made with the item id fallback', () => {
  const item = { id: 'abc', externalCode: '', name: 'Algo sem nome parecido' };
  const mappings = [{ externalCode: 'ifood-item:abc', productId: 'p2' }];
  assert.equal(resolveIfoodItemProduct(item, products, mappings), 'p2');
});

test('does not match a mapping when the item has no key', () => {
  const item = { id: '', externalCode: '', name: 'Algo sem nome parecido' };
  const mappings = [{ externalCode: '', productId: 'p2' }];
  assert.equal(resolveIfoodItemProduct(item, products, mappings), null);
});

test('leaves the item unlinked when the mapped product no longer exists', () => {
  const item = { id: 'abc', externalCode: '10', name: 'Coca-Cola Lata' };
  const mappings = [{ externalCode: '10', productId: 'apagado' }];
  assert.equal(resolveIfoodItemProduct(item, products, mappings), null);
});

test('keeps the raw externalCode so old mappings saved with spaces still match', () => {
  assert.equal(getIfoodMappingKey({ id: 'abc', externalCode: ' 123 ' }), ' 123 ');
});

test('returns null when neither mapping nor name resolves', () => {
  const item = { id: 'abc', externalCode: '10', name: 'Suco de Uva' };
  assert.equal(resolveIfoodItemProduct(item, products, []), null);
});
