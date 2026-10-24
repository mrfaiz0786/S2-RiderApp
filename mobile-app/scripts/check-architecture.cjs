const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const sourceRoot = path.join(root, "src");
const errors = [];
const graph = new Map();
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(dir, entry.name))
        : /\.tsx?$/.test(entry.name)
          ? [path.join(dir, entry.name)]
          : [],
    );
}
const files = walk(sourceRoot);
const rel = (file) => path.relative(sourceRoot, file).replace(/\\/g, "/");
function resolve(from, specifier) {
  const base = specifier.startsWith("@/")
    ? path.join(sourceRoot, specifier.slice(2))
    : path.resolve(path.dirname(from), specifier);
  return [
    base,
    base + ".ts",
    base + ".tsx",
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ].find((item) => fs.existsSync(item) && fs.statSync(item).isFile());
}
for (const file of files) {
  const name = rel(file);
  const text = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const dependencies = [];
  function visit(node) {
    if (node.kind === ts.SyntaxKind.AnyKeyword)
      errors.push(name + ": explicit any weakens the typed boundary");
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      const specifier = node.moduleSpecifier?.text;
      if (specifier && (specifier.startsWith("@/") || specifier.startsWith("."))) {
        const target = resolve(file, specifier);
        if (!target) errors.push(name + ": unresolved import " + specifier);
        else {
          const destination = rel(target);
          if (name.startsWith("shared/") && /^(features|app|navigation)\//.test(destination))
            errors.push(name + ": shared code imports a higher layer " + destination);
          if (name.startsWith("services/") && /^(features|app|navigation)\//.test(destination))
            errors.push(name + ": service imports presentation " + destination);
          if (name.startsWith("features/") && destination.startsWith("app/"))
            errors.push(name + ": feature imports app composition " + destination);
          const feature = name.match(/^features\/([^/]+)/)?.[1];
          const other = destination.match(/^features\/([^/]+)/)?.[1];
          if (feature && other && feature !== other && /\/(screens|components)\//.test(destination))
            errors.push(name + ": cross-feature UI import " + destination);
          const typeOnly = node.isTypeOnly || node.importClause?.isTypeOnly;
          const bindings = node.importClause?.namedBindings;
          const allTypeBindings =
            bindings &&
            ts.isNamedImports(bindings) &&
            !node.importClause.name &&
            bindings.elements.length > 0 &&
            bindings.elements.every((element) => element.isTypeOnly);
          if (!typeOnly && !allTypeBindings) dependencies.push(target);
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  graph.set(file, dependencies);
  if (/src\/components|src\/data\/sampleData/.test(text))
    errors.push(name + ": references a retired source location");
}
const active = new Set(),
  done = new Set();
function checkCycle(file, chain = []) {
  if (active.has(file)) {
    errors.push("Runtime import cycle: " + [...chain, file].map(rel).join(" -> "));
    return;
  }
  if (done.has(file)) return;
  active.add(file);
  for (const dependency of graph.get(file) || [])
    if (graph.has(dependency)) checkCycle(dependency, [...chain, file]);
  active.delete(file);
  done.add(file);
}
for (const file of files) checkCycle(file);
const screenCount = files.filter((file) => rel(file).includes("/screens/")).length;
if (screenCount !== 22)
  errors.push("Expected 22 rider screens, including COD payment; found " + screenCount);
const entry = fs.readFileSync(path.join(root, "App.tsx"), "utf8");
if (entry.split("\n").length > 10)
  errors.push("App.tsx should remain a small bootstrap entry point.");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  "Architecture checks passed: " +
    files.length +
    " source modules, " +
    screenCount +
    " screens; no unresolved local imports, prohibited UI dependencies, runtime cycles or explicit any.",
);
