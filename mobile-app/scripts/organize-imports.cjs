/* Explicit maintenance command. Removes unused imports and sorts the remaining ones. */
const ts = require("typescript");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const filename = path.join(root, "tsconfig.json");
const config = ts.readConfigFile(filename, ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, " "));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const host = {
  getScriptFileNames: () => parsed.fileNames,
  getScriptVersion: (file) => (fs.existsSync(file) ? String(fs.statSync(file).mtimeMs) : "0"),
  getScriptSnapshot: (file) =>
    fs.existsSync(file) ? ts.ScriptSnapshot.fromString(fs.readFileSync(file, "utf8")) : undefined,
  getCurrentDirectory: () => root,
  getCompilationSettings: () => parsed.options,
  getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
  fileExists: ts.sys.fileExists,
  readFile: ts.sys.readFile,
  readDirectory: ts.sys.readDirectory,
  directoryExists: ts.sys.directoryExists,
  getDirectories: ts.sys.getDirectories,
};
const service = ts.createLanguageService(host);
let count = 0;
for (const file of parsed.fileNames) {
  const edits = service.organizeImports({ type: "file", fileName: file }, {}, {});
  for (const edit of edits) {
    let source = fs.readFileSync(edit.fileName, "utf8");
    for (const change of [...edit.textChanges].sort((a, b) => b.span.start - a.span.start))
      source =
        source.slice(0, change.span.start) +
        change.newText +
        source.slice(change.span.start + change.span.length);
    fs.writeFileSync(edit.fileName, source);
    count++;
  }
}
service.dispose();
console.log("Organized imports in " + count + " file(s).");
