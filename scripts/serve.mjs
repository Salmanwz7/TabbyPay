/**
 * Zero-dependency static server for out/ (spec §0.1 presentation safety).
 * `node scripts/serve.mjs [port]` serves the static export with no network,
 * no Next server and no npm packages. Node alone is enough.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = join(process.cwd(), "out");
const PORT = Number(process.argv[2] || 4173);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".woff2": "font/woff2", ".svg": "image/svg+xml", ".json": "application/json",
  ".txt": "text/plain; charset=utf-8", ".ico": "image/x-icon", ".png": "image/png",
};

createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  let file = normalize(join(ROOT, url));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(PORT, () => console.log(`Serving out/ on http://localhost:${PORT}`));
