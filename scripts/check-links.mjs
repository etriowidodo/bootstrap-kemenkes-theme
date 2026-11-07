import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const exDir = path.join(root, "examples");
const files = fs.readdirSync(exDir).filter((f) => f.endsWith(".html"));
const missing = [];
const skip = /^(?:https?:)?\/\/|^#|^mailto:|^javascript:|^data:|^tel:/i;

function check(baseDir, ref, from) {
  if (skip.test(ref)) return;
  const clean = ref.split("?")[0].split("#")[0];
  if (!clean) return;
  const target = path.resolve(baseDir, clean);
  if (!fs.existsSync(target)) missing.push({ from, ref });
}

for (const f of files) {
  const file = path.join(exDir, f);
  const html = fs.readFileSync(file, "utf8");
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) check(exDir, m[1], f);
}

// CSS url() refs
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});
for (const p of walk(root).filter((p) => p.endsWith(".css") && !p.includes("node_modules"))) {
  if (!p.startsWith(path.join(root, "dist")) && !p.startsWith(path.join(root, "examples"))) continue;
  const css = fs.readFileSync(p, "utf8");
  for (const m of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    if (m[1].startsWith("data:")) continue;
    check(path.dirname(p), m[1], path.relative(root, p));
  }
}

if (missing.length) {
  console.error("MISSING (" + missing.length + "):");
  for (const x of missing.slice(0, 200)) console.error(" -", x.from, "->", x.ref);
  process.exit(1);
}
console.log("OK: semua link/aset lokal valid (" + files.length + " halaman).");
