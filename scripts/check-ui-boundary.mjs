import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourceRoots = ["LocalDesign/src", "LocalCut/src", "DesignLibrary/src"];

async function files(directory) {
  const entries = await readdir(resolve(root, directory), {
    withFileTypes: true,
  });
  return (
    await Promise.all(
      entries.map((entry) => {
        const path = directory + "/" + entry.name;
        return entry.isDirectory()
          ? files(path)
          : /\.tsx?$/.test(path)
            ? [path]
            : [];
      }),
    )
  ).flat();
}

export function uiViolations(text, path) {
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
  const errors = [];
  function report(node, message) {
    const { line } = source.getLineAndCharacterOfPosition(
      node.getStart(source),
    );
    errors.push(path + ":" + (line + 1) + ": " + message);
  }
  function visit(node) {
    if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      /^(button|input|select|textarea|label|progress|dialog|table|details|summary|fieldset|legend)$/.test(
        node.tagName.getText(source),
      )
    )
      report(node, "Use the matching @localapps/ui component.");
    if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      ts.isIdentifier(node.tagName) &&
      /^[a-z]/.test(node.tagName.text)
    ) {
      for (const attribute of node.attributes.properties) {
        if (
          ts.isJsxAttribute(attribute) &&
          attribute.name.getText(source) === "role" &&
          attribute.initializer &&
          ts.isStringLiteral(attribute.initializer) &&
          /^(progressbar|tablist|tab)$/.test(attribute.initializer.text)
        )
          report(node, "Use shared Progress or Tabs for this control role.");
      }
    }
    const specifier =
      ts.isImportDeclaration(node) || ts.isExportDeclaration(node)
        ? node.moduleSpecifier
        : ts.isCallExpression(node) &&
            node.expression.kind === ts.SyntaxKind.ImportKeyword
          ? node.arguments[0]
          : undefined;
    if (
      specifier &&
      ts.isStringLiteralLike(specifier) &&
      /^(?:@base-ui\/|@radix-ui\/|radix-ui$|cmdk$|sonner$)/.test(specifier.text)
    )
      report(node, "Import UI libraries through @localapps/ui.");
    if (
      ts.isCallExpression(node) &&
      /^(?:(?:window|globalThis)\.)?(confirm|alert|prompt)$/.test(
        node.expression.getText(source),
      )
    )
      report(node, "Use a shared dialog instead of a browser prompt.");
    ts.forEachChild(node, visit);
  }
  visit(source);
  return errors;
}

async function checkLibraryCoverage(sources) {
  const entries = await readdir(resolve(root, "packages/ui/src"));
  const missing = entries
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.slice(0, -4))
    .filter(
      (name) =>
        !sources.some(
          (source) =>
            source.includes('"@localapps/ui/' + name + '"') ||
            source.includes("'@localapps/ui/" + name + "'"),
        ),
    );
  if (missing.length)
    throw new Error("Add Design Library examples for: " + missing.join(", "));
  console.log("Design Library examples cover every shared component family.");
}

export async function checkUiBoundary() {
  const groups = await Promise.all(sourceRoots.map(files));
  const contents = new Map(
    await Promise.all(
      groups
        .flat()
        .map(async (path) => [
          path,
          await readFile(resolve(root, path), "utf8"),
        ]),
    ),
  );
  const errors = Array.from(contents, ([path, source]) =>
    uiViolations(source, path),
  ).flat();
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(
    "Shared UI boundary passed for LocalDesign, LocalCut and DesignLibrary.",
  );
  await checkLibraryCoverage(groups[2].map((path) => contents.get(path)));
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await checkUiBoundary();
