// The grid check, on every page at four widths, down to 320px: fails if a block isn't on a
// mat line or a line of text isn't on the 4px unit. The check itself is
// src/assets/js/grid.js, the one ?grid runs in the browser.
//
//   npm run build && npm run check:grid
//
// Serves the built site (_site) itself, so nothing else needs to be running.
import { createServer } from "node:http";
import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = fileURLToPath(new URL("../_site/", import.meta.url));
const WIDTHS = [320, 390, 975, 1440]; // the smallest phone we test, a phone, a small laptop (the old 62px square), a desktop
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".json": "application/json", ".mp4": "video/mp4" };

// Every page of the built site, except the CMS
async function pages(dir = ROOT, url = "/") {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (["admin", "img", "assets"].includes(entry.name)) continue;
      found.push(...(await pages(join(dir, entry.name), `${url}${entry.name}/`)));
    } else if (entry.name === "index.html") found.push(url);
  }
  return found;
}

const server = createServer(async (req, res) => {
  try {
    let path = normalize(join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname)));
    if (!path.startsWith(normalize(ROOT))) throw new Error("outside the site");
    if ((await stat(path)).isDirectory()) path = join(path, "index.html");
    res.writeHead(200, { "content-type": TYPES[extname(path)] || "application/octet-stream" });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch();
let failures = 0;
for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const url of await pages()) {
    // A page left in _site by an older build (its source since deleted) has no grid check to run
    if (!(await readFile(join(ROOT, url, "index.html"), "utf8")).includes("grid.js")) {
      console.log(`skip  ${String(width).padStart(4)}px  ${url}  stale: built before the grid check (rebuild _site)`);
      continue;
    }
    try {
      await page.goto(`${base}${url}?grid`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => typeof window.gridAudit === "function", null, { timeout: 15000 });
      await page.evaluate(() => document.fonts.ready);
    } catch (error) {
      failures++;
      console.log(`FAIL  ${String(width).padStart(4)}px  ${url}  couldn't run the check: ${error.message.split("\n")[0]}`);
      continue;
    }
    // The CV: check it with every row open too
    const runs = url.startsWith("/resume") ? ["closed", "open"] : ["page"];
    for (const run of runs) {
      const result = await page.evaluate(async (open) => {
        if (open) {
          document.querySelectorAll("details.entry__row").forEach((row) => (row.open = true));
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
        return window.gridAudit();
      }, run === "open");
      const label = `${String(width).padStart(4)}px  ${url}${run === "open" ? " (rows open)" : ""}  square ${result.cell}px`;
      if (!result.problems.length) {
        console.log(`ok    ${label}  ${result.checked} checked`);
        continue;
      }
      failures += result.problems.length;
      console.log(`FAIL  ${label}  ${result.problems.length} of ${result.checked} off the grid`);
      for (const { kind, by, what } of result.problems.slice(0, 12)) console.log(`        ${kind} ${by}px  ${what}`);
      if (result.problems.length > 12) console.log(`        … and ${result.problems.length - 12} more`);
    }
  }
  await page.close();
}
await browser.close();
server.close();
if (failures) {
  console.log(`\n${failures} things off the grid. Open the page with ?grid to see them outlined.`);
  process.exit(1);
}
console.log("\nEverything on the grid.");
