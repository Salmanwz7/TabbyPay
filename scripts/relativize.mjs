/**
 * Post-export: make out/ work when opened straight from disk (file://).
 *
 * Next writes absolute asset paths ("/_next/…"). Over http from the site root
 * that's fine; over file:// "/" is the drive root, so the page loads with no
 * CSS and no JS. This rewrites them relative to each file, which works both
 * ways. Runs after `next build` (package.json "build").
 *
 * - HTML: every "/_next/ and /tabby-icon.svg, including the escaped copies
 *   inside the inline flight data (\"/_next/…).
 * - JS: the webpack public path (`.p="/_next/"`), so chunks resolve against
 *   the document, and that's all.
 * - CSS: font url()s, relative to the stylesheet's own folder.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, dirname, sep } from "node:path";

const OUT = join(process.cwd(), "out");

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let changed = 0;
for await (const file of walk(OUT)) {
  const src = await readFile(file, "utf8").catch(() => null);
  if (src === null) continue;
  let out = src;

  if (file.endsWith(".html")) {
    // "./" at the root, "../" one folder down (out/404/index.html).
    const up = relative(dirname(file), OUT).split(sep).filter(Boolean).map(() => "..").join("/");
    const base = up ? `${up}/` : "./";
    out = out.replace(/(\\?")\/(_next\/|tabby-icon\.svg)/g, `$1${base}$2`);
  } else if (file.endsWith(".js")) {
    out = out.replace(/\.p="\/_next\/"/g, '.p="./_next/"');
  } else if (file.endsWith(".css")) {
    out = out.replace(/url\(\/_next\/static\/media\//g, "url(../media/");
  }

  if (out !== src) {
    await writeFile(file, out);
    changed++;
  }
}
console.log(`relativize: ${changed} files rewritten`);
