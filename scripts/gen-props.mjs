// Extracts component props (name, type, default, description) from src/components/*.tsx
// into src/docs/props.json for the docs PropsTable. Uses TypeScript 5's compiler API
// (installed as "ts5") because the project's TypeScript 7 has no JS API.
import ts from "ts5";
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = join(root, "src/components");
const outFile = join(root, "src/docs/props.json");

const files = readdirSync(componentsDir)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => join(componentsDir, f));

const program = ts.createProgram(files, {
  jsx: ts.JsxEmit.ReactJSX,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  skipLibCheck: true,
});
const checker = program.getTypeChecker();
const isOwn = (sf) => resolve(sf.fileName).startsWith(componentsDir);

/** Collect `name = default` pairs from the first destructuring pattern inside a node. */
function collectDefaults(node) {
  const defaults = {};
  const visit = (n) => {
    if (ts.isObjectBindingPattern(n)) {
      for (const el of n.elements) {
        if (el.initializer && ts.isIdentifier(el.name)) {
          const key = el.propertyName && ts.isIdentifier(el.propertyName) ? el.propertyName.text : el.name.text;
          defaults[key] ??= el.initializer.getText();
        }
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return defaults;
}

/** Map component name -> declaration node (const X = ..., function X(...)). */
function componentNodes(sf) {
  const map = {};
  for (const st of sf.statements) {
    if (ts.isFunctionDeclaration(st) && st.name) map[st.name.text] = st;
    if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) {
        if (ts.isIdentifier(d.name)) map[d.name.text] = d;
      }
    }
  }
  return map;
}

const FLAGS = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType;

/** Expand aliased unions ("ButtonVariant" -> "'solid' | 'bordered' | ..."), drop undefined. */
function typeText(type) {
  if (type.isUnion()) {
    let parts = type.types.map((t) => checker.typeToString(t, undefined, FLAGS)).filter((t) => t !== "undefined");
    if (parts.includes("true") && parts.includes("false")) {
      parts = ["boolean", ...parts.filter((t) => t !== "true" && t !== "false")];
    }
    return parts.join(" | ");
  }
  return checker.typeToString(type, undefined, FLAGS);
}

/** Declared text for most types; expand only aliases declared in our own components (literal unions). */
function displayType(decl, type) {
  const node = decl.type;
  if (!node) return typeText(type);
  if (ts.isTypeReferenceNode(node) && !node.typeArguments) {
    let sym = checker.getSymbolAtLocation(node.typeName);
    if (sym && sym.flags & ts.SymbolFlags.Alias) sym = checker.getAliasedSymbol(sym); // imported alias
    const aliasDecl = sym?.getDeclarations()?.[0];
    if (aliasDecl && ts.isTypeAliasDeclaration(aliasDecl) && isOwn(aliasDecl.getSourceFile())) return typeText(type);
  }
  return node.getText().replace(/\s+/g, " ");
}

/** `group?.size ?? "md"` -> `"md"` */
const cleanDefault = (d) => (d == null ? null : d.includes("??") ? d.split("??").pop().trim() : d);

const result = {};
for (const sf of program.getSourceFiles()) {
  if (!isOwn(sf)) continue;
  const nodes = componentNodes(sf);
  for (const st of sf.statements) {
    if (!ts.isInterfaceDeclaration(st) || !/(Props|Options)$/.test(st.name.text)) continue;
    if (!st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
    const component = st.name.text.replace(/Props$/, "");
    const defaults = nodes[component] ? collectDefaults(nodes[component]) : {};
    const type = checker.getTypeAtLocation(st);
    const props = [];
    for (const sym of checker.getPropertiesOfType(type)) {
      const decls = sym.getDeclarations() ?? [];
      if (!decls.some((d) => isOwn(d.getSourceFile()))) continue; // skip inherited HTML attrs
      const decl = decls.find((d) => isOwn(d.getSourceFile()));
      const propType = checker.getTypeOfSymbolAtLocation(sym, decl);
      props.push({
        name: sym.getName(),
        type: displayType(decl, propType),
        required: !(sym.flags & ts.SymbolFlags.Optional),
        default: cleanDefault(defaults[sym.getName()]),
        description: ts.displayPartsToString(sym.getDocumentationComment(checker)) || null,
      });
    }
    result[component] = props;
  }
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(result, null, 2) + "\n");
console.log(`gen-props: ${Object.keys(result).length} components → src/docs/props.json`);
