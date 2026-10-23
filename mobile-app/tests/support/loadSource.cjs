/* Executes pure TypeScript source in Node without bundling React Native. */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const sourceRoot = path.resolve(__dirname, "../../src");
const cache = new Map();
function resolve(base) {
  const found = [
    base,
    base + ".ts",
    base + ".tsx",
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ].find((file) => fs.existsSync(file) && fs.statSync(file).isFile());
  if (!found) throw new Error("Cannot resolve " + base);
  return found;
}
function load(filename) {
  const file = resolve(filename);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const source = fs.readFileSync(file, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const localRequire = (specifier) => {
    if (specifier.startsWith("@/")) return load(path.join(sourceRoot, specifier.slice(2)));
    if (specifier.startsWith(".")) return load(path.resolve(path.dirname(file), specifier));
    throw new Error("Pure unit test imported an external dependency: " + specifier);
  };
  const fn = vm.runInThisContext("(function(require,module,exports){" + output + "\n})", {
    filename: file,
  });
  fn(localRequire, module, module.exports);
  return module.exports;
}
exports.loadSource = (relative) => load(path.resolve(sourceRoot, relative));
