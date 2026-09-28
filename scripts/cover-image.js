// Makes a project page's header cover from any photo or image: true greyscale,
// dimmed to one shared brightness so every cover sits the same way behind its
// mockup. The original file is left untouched.
//
//   node scripts/cover-image.js <source> <cover-header.jpg>
//
// Brightness is set on the average grey level (0–255). A cover that is already
// darker than the target is left as it is: the treatment only ever lowers it.

const sharp = require("sharp");

const TARGET = 110; // the Jireh Health cover, the first one treated this way
const MAX_WIDTH = 2400; // the site asks for 1920px at most (bgImage filter)

const [src, out] = process.argv.slice(2);
if (!src || !out) {
  console.error("Usage: node scripts/cover-image.js <source> <cover-header.jpg>");
  process.exit(1);
}

(async () => {
  // Transparent areas become black, the same dark the cover would show there
  const grey = () =>
    sharp(src)
      .flatten({ background: "#000" })
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .grayscale();

  const before = (await grey().stats()).channels[0].mean;
  const render = (factor) => grey().linear(factor, 0).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  const mean = async (buffer) => (await sharp(buffer).stats()).channels[0].mean;

  // Greyscale output isn't exactly linear, so adjust and measure again until
  // the result is within 2 levels of the target (never brightening)
  let factor = Math.min(1, TARGET / before);
  let result = await render(factor);
  for (let i = 0; i < 4 && factor < 1 && Math.abs((await mean(result)) - TARGET) > 2; i++) {
    factor = Math.min(1, factor * (TARGET / (await mean(result))));
    result = await render(factor);
  }
  require("fs").writeFileSync(out, result); // already a JPEG: save it as is, no second compression

  const after = await mean(result);
  const { width, height } = await sharp(out).metadata();
  console.log(`${out}: ${width}×${height}, brightness ${before.toFixed(0)} → ${after.toFixed(0)}`);
})();
