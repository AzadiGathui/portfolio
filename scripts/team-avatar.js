// Makes a team avatar from a photo, the same for every case study: the 224px square the
// team faces expect (style.css, ".face__img": 48px shown out of 56, the margin cropped by
// the circle), with the grey ring built in. Measured from the Jireh avatars:
// 224px canvas on the mat colour, a #4c4c4c ring 192px across and 8px thick, the photo in a circle inside it.
//
//   node scripts/team-avatar.js <photo> <avatar.png> [top|center|bottom]
//
// The photo is cropped square; the third argument says which part to keep (default top, for portraits).

const sharp = require("sharp");

const [src, out, position = "top"] = process.argv.slice(2);
if (!src || !out) {
  console.error("Usage: node scripts/team-avatar.js <photo> <avatar.png> [top|center|bottom]");
  process.exit(1);
}

const svg = (body, size = 224) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${body}</svg>`);

(async () => {
  const photo = await sharp(src)
    .resize(176, 176, { fit: "cover", position })
    .composite([{ input: svg(`<circle cx="88" cy="88" r="88" fill="#fff"/>`, 176), blend: "dest-in" }])
    .png()
    .toBuffer();
  await sharp({ create: { width: 224, height: 224, channels: 3, background: "#121212" } })
    .composite([{ input: svg(`<circle cx="112" cy="112" r="96" fill="#4c4c4c"/>`) }, { input: photo, left: 24, top: 24 }])
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`${out}: 224×224 avatar`);
})();
