import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const directory = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");
const { base } = JSON.parse(
  await readFile(join(directory, "release.json"), "utf8"),
);
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".wasm": "application/wasm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
};
const port = Number(process.env.PORT ?? 4188);
export const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    if (url.pathname === "/" || url.pathname === base.slice(0, -1)) {
      response.writeHead(302, { Location: base + url.search + url.hash }).end();
      return;
    }
    if (!url.pathname.startsWith(base)) throw new Error("Outside site base");
    let file = resolve(
      directory,
      decodeURIComponent(url.pathname.slice(base.length)),
    );
    if (file !== directory && !file.startsWith(directory + sep))
      throw new Error("Outside site root");
    try {
      if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    } catch {
      file = join(directory, "404.html");
      response.statusCode = 404;
    }
    response.setHeader(
      "Content-Type",
      types[extname(file)] ?? "application/octet-stream",
    );
    response.setHeader("Cache-Control", "no-cache");
    response.end(await readFile(file));
  } catch {
    response.writeHead(404).end("Not found");
  }
});
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  server.listen(port, "127.0.0.1", () =>
    console.log(`LocalApps: http://127.0.0.1:${port}${base}`),
  );
}
