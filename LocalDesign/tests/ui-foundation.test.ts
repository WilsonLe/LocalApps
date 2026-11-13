import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

it("keeps editor CSS below component utilities so it cannot override their variants", () => {
  const css = readFileSync("src/style.css", "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();
  expect(css.startsWith("@layer components {")).toBe(true);
  let depth = 0;
  for (let i = css.indexOf("{"); i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") depth--;
    if (!depth)
      expect(i, "All editor CSS must stay inside its layer").toBe(
        css.length - 1,
      );
  }
  expect(depth).toBe(0);
  expect(
    css.match(/#[\da-f]{6}\b/gi),
    "Use semantic theme tokens for editor colors",
  ).toBeNull();
});
