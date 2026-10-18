// Saves the CV page as a PDF, using the page's own A4 print styles, for the
// site's "Download CV" buttons (site.json → cvPdf).
//
// Run it with the dev server going (npm start), after any CV change:
//   npm run cv:pdf
// Optional: CV_URL=http://localhost:3000/experiment/resume/ BROWSER=/path/to/chrome
//
// It drives an installed Chromium browser (Edge or Chrome) in headless mode,
// so nothing new needs installing.
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const url = process.env.CV_URL || "http://localhost:3000/experiment/resume/";
const out = path.resolve(__dirname, "../src/assets/files/azadi-gathui-cv.pdf");

const candidates = [
  process.env.BROWSER,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const browser = candidates.find((p) => fs.existsSync(p));
if (!browser) {
  console.error("No Edge or Chrome found. Set BROWSER=/path/to/browser and try again.");
  process.exit(1);
}

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.rmSync(out, { force: true }); // so a stale file can't pass for a new one
execFileSync(browser, [
  "--headless=new",
  "--disable-gpu",
  // its own profile, so an Edge or Chrome window that is already open doesn't take the job
  `--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(), "cv-pdf-"))}`,
  "--no-pdf-header-footer",        // no date, URL or page numbers from the browser
  "--virtual-time-budget=8000",    // let fonts and images finish loading first
  `--print-to-pdf=${out}`,
  url,
], { stdio: "inherit" });

// The browser's launcher can return before the headless page has finished
// writing, so wait (up to 30 s) for the file to appear and stop growing.
const deadline = Date.now() + 30000;
let lastSize = -1;
(function wait() {
  const size = fs.existsSync(out) ? fs.statSync(out).size : -1;
  if (size > 0 && size === lastSize) {
    console.log(`Saved ${path.relative(process.cwd(), out)} from ${url}`);
    return;
  }
  if (Date.now() > deadline) {
    console.error("No PDF after 30 seconds. Is the dev server running at " + url + "?");
    process.exit(1);
  }
  lastSize = size;
  setTimeout(wait, 500);
})();
