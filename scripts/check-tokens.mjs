/**
 * Token discipline check, run before every build (spec §0.1).
 *
 * Tailwind v4 can drop its default theme (globals.css does) but it cannot
 * switch OFF arbitrary values: `text-[#333]` still compiles. So the rules the
 * compiler can't enforce are enforced here, against the source:
 *
 *   1. No arbitrary Tailwind values: `-[...]` inside a class string.
 *   2. No physical direction utilities: ml- mr- pl- pr- left- right-
 *      (logical ms- me- ps- pe- start- end- only).
 *   3. No raw hex colour outside app/tokens.css.
 *
 * Token references in Tailwind's variable shorthand, `duration-(--t-micro)`,
 * are allowed: they name a token, they don't invent a value.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOTS = ["app", "components", "lib"];
const EXT = /\.(tsx?|css)$/;

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXT.test(name)) files.push(p);
  }
};
ROOTS.forEach(walk);

const problems = [];
const CLASS_ATTR = /className=(?:"([^"]*)"|\{`([^`]*)`\})/g;

for (const file of files) {
  const rel = relative(".", file).replaceAll("\\", "/");
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");

  lines.forEach((line, i) => {
    const at = `${rel}:${i + 1}`;

    if (rel.endsWith(".tsx")) {
      for (const m of line.matchAll(CLASS_ATTR)) {
        const classes = (m[1] ?? m[2]).split(/\s+/);
        for (const c of classes) {
          if (/-\[/.test(c)) problems.push(`${at}  arbitrary value: ${c}`);
          if (/^(?:[a-z-]+:)*-?(ml|mr|pl|pr|left|right)-/.test(c))
            problems.push(`${at}  physical direction: ${c}`);
        }
      }
    }

    if (rel !== "app/tokens.css" && /#[0-9a-fA-F]{3,8}\b/.test(line) && !/^\s*(\/\/|\*|\/\*)/.test(line)) {
      problems.push(`${at}  raw hex outside tokens.css`);
    }
  });
}

if (problems.length) {
  console.error(`Token check failed (${problems.length}):\n` + problems.join("\n"));
  process.exit(1);
}
console.log(`Token check clean: ${files.length} files.`);
