import { spawnSync, execFileSync } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "dist");
const base = process.env.LOCALAPPS_BASE_PATH ?? "/LocalApps/";
if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(base)) {
  throw new Error(
    "LOCALAPPS_BASE_PATH must be an absolute directory path ending in /.",
  );
}

function run(command, args, app, env = {}) {
  const result = spawnSync(command, args, {
    cwd: join(root, app),
    env: { ...process.env, ...env },
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`${app} build failed (${result.status ?? result.signal}).`);
}

if (!process.argv.includes("--assemble-only")) {
  run("pnpm", ["run", "build", `--base=${base}LocalDesign/`], "LocalDesign");
  run("pnpm", ["run", "build"], "LocalCut", {
    LOCALCUT_BASE_PATH: `${base}LocalCut/`,
  });
  run(
    "pnpm",
    ["run", "build", `--base=${base}DesignLibrary/`],
    "DesignLibrary",
  );
}

// Refuse mismatched builds before replacing the previous combined artifact.
for (const app of ["LocalDesign", "LocalCut", "DesignLibrary"]) {
  const html = await readFile(join(root, app, "dist/index.html"), "utf8");
  if (!html.includes(`${base}${app}/assets/`))
    throw new Error(`${app} was built for a different base path.`);
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of [
  "index.html",
  "portal.css",
  "favicon.svg",
  "404.html",
  "route-fallback.js",
]) {
  const source = await readFile(join(root, "portal", name), "utf8");
  await writeFile(join(output, name), source.replaceAll("__BASE_PATH__", base));
}
const restore = await readFile(join(root, "portal/restore-route.js"), "utf8");
const apps = {};
for (const app of ["LocalDesign", "LocalCut"]) {
  const appOutput = join(output, app);
  await cp(join(root, app, "dist"), appOutput, { recursive: true });
  const html = await readFile(join(appOutput, "index.html"), "utf8");
  const bootstrap = `<script id="localapps-route">${restore.replaceAll("__APP_BASE__", `${base}${app}/`)}</script>`;
  const entry = html.replace("<head>", `<head>\n${bootstrap}`);
  if (entry === html) throw new Error(`Missing HTML head in ${app}.`);
  await writeFile(join(appOutput, "index.html"), entry);
  await writeFile(join(appOutput, "404.html"), entry);
  for (const name of ["LICENSE", "THIRD_PARTY_NOTICES.md"]) {
    await cp(join(root, app, name), join(appOutput, name));
  }
  const { version } = JSON.parse(
    await readFile(join(root, app, "package.json"), "utf8"),
  );
  apps[app] = { path: `${base}${app}/`, version };
}
const libraryOutput = join(output, "DesignLibrary");
await cp(join(root, "DesignLibrary", "dist"), libraryOutput, {
  recursive: true,
});
for (const name of ["DesignLibrary", "LocalDesign", "LocalCut"]) {
  await cp(
    join(root, "packages/ui/LICENSE"),
    join(output, name, "SHADCN_LICENSE.txt"),
  );
}
const sha = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: root,
  encoding: "utf8",
}).trim();
const release = { sha, base, apps, designLibrary: `${base}DesignLibrary/` };
await writeFile(join(output, "release.json"), JSON.stringify(release) + "\n");
const { bundleVersion: skillBundleVersion } = JSON.parse(
  await readFile(join(output, "LocalDesign/skills/manifest.json"), "utf8"),
);
if (typeof skillBundleVersion !== "string" || !skillBundleVersion) {
  throw new Error("LocalDesign skill manifest has no bundle version.");
}
await writeFile(
  join(output, "LocalDesign/release.json"),
  JSON.stringify({ sha, ...apps.LocalDesign, skillBundleVersion }) + "\n",
);
await writeFile(join(output, ".nojekyll"), "");
console.log(`Built LocalApps at ${base} (${sha}).`);
