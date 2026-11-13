import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { server } from "../scripts/serve-pages.mjs";

const output = new URL("../dist/", import.meta.url);
const { base, apps } = JSON.parse(
  await readFile(new URL("release.json", output), "utf8"),
);
const fallback = await readFile(new URL("route-fallback.js", output), "utf8");

test("preview supports WebAssembly streaming for the font engine", async (t) => {
  await new Promise((ready) => server.listen(0, "127.0.0.1", ready));
  t.after(() => new Promise((closed) => server.close(closed)));
  const assets = await readdir(new URL("LocalDesign/assets/", output));
  const wasm = assets.find((name) => name.endsWith(".wasm"));
  assert.ok(wasm, "The font engine must ship its WebAssembly module");
  const response = await fetch(
    `http://127.0.0.1:${server.address().port}${apps.LocalDesign.path}assets/${wasm}`,
  );
  assert.equal(response.headers.get("content-type"), "application/wasm");
  assert.ok(
    (await WebAssembly.compileStreaming(response)) instanceof
      WebAssembly.Module,
  );
});

function navigate(source, href) {
  const location = new URL(href);
  let redirected, restored;
  location.replace = (value) => {
    redirected = value;
  };
  runInNewContext(source, {
    URL,
    location,
    history: {
      replaceState: (_state, _title, value) => {
        restored = value;
      },
    },
  });
  return { redirected, restored };
}

for (const app of ["LocalDesign", "LocalCut"]) {
  test(`${app}: direct workspace links retain encoded identity, query and hash`, async () => {
    const html = await readFile(new URL(`${app}/index.html`, output), "utf8");
    const restore = html.match(
      /<script id="localapps-route">([\s\S]*?)<\/script>/,
    )?.[1];
    assert.ok(restore, "Route restoration must run before app modules");
    assert.ok(
      html.indexOf('id="localapps-route"') < html.indexOf('type="module"'),
    );
    const route = `${apps[app].path}workspace/a%20b%2Fc?keep=a%26b&next=%23value#selection`;
    const first = navigate(fallback, `https://example.test${route}`);
    const target = new URL(first.redirected, "https://example.test");
    assert.equal(target.pathname, apps[app].path);
    assert.equal(target.searchParams.get("__localapps_route"), route);
    assert.equal(navigate(restore, target.href).restored, route);
    assert.equal(
      navigate(restore, `https://example.test${apps[app].path}`).restored,
      undefined,
    );
    for (const invalid of [
      "https://other.test" + route,
      `${base}${app === "LocalCut" ? "LocalDesign" : "LocalCut"}/workspace/other`,
      `${apps[app].path}../other/`,
    ]) {
      assert.equal(
        navigate(
          restore,
          `https://example.test${apps[app].path}?__localapps_route=${encodeURIComponent(invalid)}`,
        ).restored,
        undefined,
      );
    }
  });
}

test("unknown and outside-site routes remain a genuine not-found page", () => {
  for (const path of [
    `${base}missing`,
    "/other/LocalDesign/workspace/id",
    `${base}LocalDesigner/workspace/id`,
  ]) {
    assert.equal(
      navigate(fallback, `https://example.test${path}`).redirected,
      undefined,
    );
  }
});

test("portal links, app base URLs, licenses and packaged fallbacks are complete", async () => {
  const portal = await readFile(new URL("index.html", output), "utf8");
  for (const app of ["LocalDesign", "LocalCut"]) {
    assert.ok(portal.includes(`href="./${app}/"`));
    const html = await readFile(new URL(`${app}/index.html`, output), "utf8");
    assert.equal(
      await readFile(new URL(`${app}/404.html`, output), "utf8"),
      html,
    );
    assert.ok(
      (await readFile(new URL(`${app}/LICENSE`, output), "utf8")).length > 0,
    );
    for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
      const url = new URL(match[1], `https://example.test${apps[app].path}`);
      if (url.origin !== "https://example.test") continue;
      assert.ok(
        url.pathname.startsWith(apps[app].path),
        `Asset escaped app base: ${url.pathname}`,
      );
      await readFile(new URL(url.pathname.slice(base.length), output));
    }
  }
});
