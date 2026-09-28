// Makes a project thumbnail from one mobile screen: the screen inside the same
// phone frame the site draws with {% phone %}, on a transparent background.
// Used for the homepage card and the previous/next project links.
//
//   node scripts/phone-thumbnail.js <screen.png> <thumbnail.png>
//
// The frame's colours and radii copy the "PHONE SCREENS" styles in style.css,
// drawn 1.6× larger than on a project page so the thumbnail stays sharp.

const sharp = require("sharp");

const [src, out] = process.argv.slice(2);
if (!src || !out) {
  console.error("Usage: node scripts/phone-thumbnail.js <screen.png> <thumbnail.png>");
  process.exit(1);
}

(async () => {
  const { width, height } = await sharp(src).metadata();

  const scale = 1.6;
  const padding = Math.round(6 * scale); // 0.375rem
  const frameRadius = Math.round(28 * scale); // 1.75rem
  const screenRadius = Math.round(22 * scale); // 1.375rem: the frame's radius minus its padding
  const border = 2;

  // The screen keeps its own shape, as it does on the page
  const screenW = Math.round(240 * scale) - 2 * padding - 2 * border;
  const screenH = Math.round((screenW * height) / width);
  const frameW = screenW + 2 * (padding + border);
  const frameH = screenH + 2 * (padding + border);

  // --color-surface fill and --color-border edge
  const frame = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${frameW}" height="${frameH}">` +
      `<rect x="${border / 2}" y="${border / 2}" width="${frameW - border}" height="${frameH - border}" rx="${frameRadius}" ` +
      `fill="#333333" stroke="rgba(230,230,230,0.31)" stroke-width="${border}"/></svg>`
  );
  const corners = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${screenW}" height="${screenH}">` +
      `<rect width="${screenW}" height="${screenH}" rx="${screenRadius}" fill="#fff"/></svg>`
  );

  const screen = await sharp(src)
    .resize(screenW, screenH)
    .composite([{ input: corners, blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp(frame)
    .composite([{ input: screen, left: border + padding, top: border + padding }])
    .png()
    .toFile(out);

  console.log(`${out}: ${frameW}×${frameH} (screen ${width}×${height})`);
})();
