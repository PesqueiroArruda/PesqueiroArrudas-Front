const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const ts = require('typescript');

// Compile the actual utility in memory using the project's TypeScript dependency.
module.exports = (relativePath, globals = {}) => {
  const filename = path.resolve(__dirname, '..', relativePath);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2018,
    },
  });
  const context = {
    exports: {},
    require: createRequire(filename),
    ...globals,
  };
  vm.runInNewContext(outputText, context, { filename });
  return context.exports;
};
