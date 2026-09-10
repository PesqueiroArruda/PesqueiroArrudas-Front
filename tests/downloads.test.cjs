const assert = require('node:assert/strict');
const test = require('node:test');
const loadTypeScript = require('./loadTypeScript.cjs');

test('releases download resources even when the click fails', () => {
  let removed = false;
  let revoked = false;
  let release;
  const anchor = {
    click() {
      throw new Error('click failed');
    },
    remove() {
      removed = true;
    },
  };
  const { downloadFile } = loadTypeScript('src/utils/downloadFile.ts', {
    Blob,
    document: { createElement: () => anchor, body: { appendChild() {} } },
    window: {
      URL: {
        createObjectURL: () => 'blob:test',
        revokeObjectURL(url) {
          assert.equal(url, 'blob:test');
          revoked = true;
        },
      },
      setTimeout(callback) {
        release = callback;
      },
    },
  });
  assert.throws(
    () =>
      downloadFile({
        data: '{}',
        fileName: 'report.json',
        fileType: 'application/json',
      }),
    /click failed/
  );
  assert.equal(removed, true);
  assert.equal(revoked, false);
  release();
  assert.equal(revoked, true);
});
