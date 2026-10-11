const assert = require('node:assert/strict');
const test = require('node:test');
const loadTypeScript = require('./loadTypeScript.cjs');

const { normalizeSearch } = loadTypeScript('src/utils/normalizeSearch.ts');

test('ignores accents, case and spaces', () => {
  assert.equal(normalizeSearch('Pão de  Alho'), 'paodealho');
  assert.equal(normalizeSearch('  coração '), 'coracao');
});

test('handles empty and nullish values', () => {
  assert.equal(normalizeSearch(''), '');
  assert.equal(normalizeSearch(undefined), '');
});
