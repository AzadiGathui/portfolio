// Takes the flat backdrop off a piece exported on the mat, so it can lie on
// something else. The collages (partials/jireh/) lay their pieces over the
// edges of a white phone screen on a narrow page, and a piece exported with
// the mat's #121212 behind it would carry that as a black box.
//
//   node scripts/cutout.js <piece.png> [<cutout.png>]      (in place if no second name)
//   node scripts/cutout.js --tolerance 12 <piece.png>      (how far from the backdrop still counts as it; 8 by default)
//
// The backdrop is the colour of the top-left pixel, and only what joins the
// image's edge through that colour is cleared: a dark outline, or the same
// colour enclosed inside a shape, stays. Edges stay hard; a piece is drawn at
// a fraction of its size, so a one-pixel fringe in the export disappears.
// Safe to run twice.

const sharp = require("sharp");

const args = process.argv.slice(2);
let tolerance = 8;
const at = args.indexOf("--tolerance");
if (at !== -1) tolerance = Number(args.splice(at, 2)[1]);
const [src, out = src] = args;
if (!src || !Number.isFinite(tolerance)) {
  console.error("Usage: node scripts/cutout.js [--tolerance 8] <piece.png> [<cutout.png>]");
  process.exit(1);
}

(async () => {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  if (data[3] < 10) {
    console.log(`${src}: already has a transparent corner, left as it is`);
    return;
  }

  const key = [data[0], data[1], data[2]];
  const backdrop = (p) => {
    const i = p * 4;
    return data[i + 3] < 10 || (Math.abs(data[i] - key[0]) <= tolerance && Math.abs(data[i + 1] - key[1]) <= tolerance && Math.abs(data[i + 2] - key[2]) <= tolerance);
  };

  // Flood in from the edge, over every pixel that is backdrop and touches the last
  const cleared = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  let top = 0;
  const visit = (p) => { if (!cleared[p] && backdrop(p)) { cleared[p] = 1; stack[top++] = p; } };
  for (let x = 0; x < w; x++) { visit(x); visit((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { visit(y * w); visit(y * w + w - 1); }
  while (top) {
    const p = stack[--top];
    const x = p % w;
    if (x > 0) visit(p - 1);
    if (x < w - 1) visit(p + 1);
    if (p >= w) visit(p - w);
    if (p < w * (h - 1)) visit(p + w);
  }

  let count = 0;
  for (let p = 0; p < w * h; p++) if (cleared[p]) { data[p * 4 + 3] = 0; count++; }
  const share = count / (w * h);
  if (share > 0.9) console.warn(`${src}: ${(share * 100).toFixed(0)}% cleared, check that the piece isn't the backdrop's own colour`);

  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png({ compressionLevel: 9 }).toFile(out);
  console.log(`${out}: ${w}x${h}, backdrop rgb(${key.join(",")}) cleared from ${(share * 100).toFixed(0)}% of it`);
})();
