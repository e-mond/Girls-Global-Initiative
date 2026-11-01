/**
 * Regenerate favicon / PWA icons from the high-resolution brand logo.
 * Run: npm run generate:favicons
 *
 * Source: public/brand/ggi-logo.png (approved circular GGI mark).
 * Small sizes get cream padding + black-bg removal so the mark stays readable.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "public", "brand", "ggi-logo.png");
const cream = { r: 253, g: 246, b: 236, alpha: 1 }; // --bg-base
const white = { r: 255, g: 255, b: 255, alpha: 1 };
const ICON_VERSION = "20261101f";

/** Turn near-black logo canvas into transparency, then trim. */
async function markPng(paddingRatio = 0.08): Promise<Buffer> {
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Source art sits on a solid black field — punch it out.
    if (r < 18 && g < 18 && b < 18) {
      data[i + 3] = 0;
    }
  }

  const transparent = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 8 })
    .png()
    .toBuffer();

  const meta = await sharp(transparent).metadata();
  const w = meta.width ?? 512;
  const h = meta.height ?? 512;
  const side = Math.max(w, h);
  const pad = Math.round(side * paddingRatio);
  const canvas = side + pad * 2;

  return sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: transparent,
        left: Math.round((canvas - w) / 2),
        top: Math.round((canvas - h) / 2),
      },
    ])
    .png()
    .toBuffer();
}

async function writeSized(
  mark: Buffer,
  size: number,
  out: string,
  background: { r: number; g: number; b: number; alpha: number },
) {
  const abs = path.join(root, out);
  mkdirSync(path.dirname(abs), { recursive: true });
  const resized = await sharp(mark)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  // Flatten onto a solid brand field so transparent logo corners do not show as
  // browser-default black/empty chrome in tabs and shortcuts.
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: resized, left: 0, top: 0 }])
    .png()
    .toFile(abs);
  console.log(`wrote ${out} (${size}x${size})`);
}

async function writeMaskable(mark: Buffer, size: number, out: string) {
  // Safe-zone padding (~20%) for Android maskable icons.
  const inner = Math.round(size * 0.72);
  const resized = await sharp(mark)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  const abs = path.join(root, out);
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: cream,
    },
  })
    .composite([
      {
        input: resized,
        left: Math.round((size - inner) / 2),
        top: Math.round((size - inner) / 2),
      },
    ])
    .png()
    .toFile(abs);
  console.log(`wrote ${out} (maskable ${size}x${size})`);
}

function writeSafariPinnedTab() {
  // Monochrome mark for Safari pinned tabs (browser recolors the black fills).
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="img" aria-label="Girls Global Initiative">
  <circle cx="8" cy="8" r="7.25" fill="none" stroke="#000" stroke-width="0.6"/>
  <!-- Simplified empowerment silhouette + petal base -->
  <path fill="#000" d="M8.1 3.1c-.55.05-1.05.45-1.25 1.05-.25.75.05 1.45.55 1.85-.55.2-1 .7-1.1 1.35-.15.95.35 1.8 1.15 2.15v1.55c-.95.2-1.7.85-2.05 1.75-.15.4.15.8.55.8h4.1c.4 0 .7-.4.55-.8-.35-.9-1.1-1.55-2.05-1.75V9.5c.8-.35 1.3-1.2 1.15-2.15-.1-.65-.55-1.15-1.1-1.35.5-.4.8-1.1.55-1.85-.2-.6-.7-1-1.25-1.05z"/>
  <path fill="#000" d="M4.2 12.2c.55-.75 1.35-1.15 2.2-1.25-.15.45-.2.95-.15 1.45-.85.1-1.5.45-2.05 1.05-.2.2-.05.55.25.55.25 0 .5-.15.75-.35.3-.25.65-.4 1-.45.1.4.3.75.55 1.05H5.1c-.55 0-.95-.5-.9-1.05z"/>
  <path fill="#000" d="M11.8 12.2c-.55-.75-1.35-1.15-2.2-1.25.15.45.2.95.15 1.45.85.1 1.5.45 2.05 1.05.2.2.05.55-.25.55-.25 0-.5-.15-.75-.35-.3-.25-.65-.4-1-.45-.1.4-.3.75-.55 1.05h1.65c.55 0 .95-.5.9-1.05z"/>
  <path fill="#000" d="M9.55 4.55c.2-.05.45.05.55.3.15.35 0 .7-.25.9-.15-.45-.35-.85-.3-1.2z"/>
</svg>
`;
  const out = path.join(root, "public/icons/safari-pinned-tab.svg");
  writeFileSync(out, svg, "utf8");
  console.log("wrote public/icons/safari-pinned-tab.svg");
}

async function main() {
  const mark = await markPng(0.06);
  // Extra padding for tiny tab icons so petals/fist stay legible.
  const smallMark = await markPng(0.12);

  await writeSized(smallMark, 16, "public/icons/favicon-16x16.png", cream);
  await writeSized(smallMark, 32, "public/icons/favicon-32x32.png", cream);
  await writeSized(smallMark, 32, "public/favicon.png", cream);
  await writeSized(smallMark, 48, "public/icons/favicon-48x48.png", cream);

  await writeSized(mark, 180, "public/icons/apple-touch-icon.png", white);
  await writeSized(mark, 180, "app/apple-icon.png", white);
  await writeSized(mark, 192, "public/icons/icon-192.png", cream);
  await writeSized(mark, 512, "public/icons/icon-512.png", cream);
  await writeSized(mark, 512, "app/icon.png", cream);

  await writeMaskable(mark, 192, "public/icons/icon-192-maskable.png");
  await writeMaskable(mark, 512, "public/icons/icon-512-maskable.png");

  const { default: pngToIco } = await import("png-to-ico");
  const icoBuffer = await pngToIco([
    path.join(root, "public/icons/favicon-16x16.png"),
    path.join(root, "public/icons/favicon-32x32.png"),
    path.join(root, "public/icons/favicon-48x48.png"),
  ]);
  // Keep app/ and public/ identical — production currently serves app/favicon.ico.
  writeFileSync(path.join(root, "public/favicon.ico"), icoBuffer);
  writeFileSync(path.join(root, "app/favicon.ico"), icoBuffer);
  console.log("wrote public/favicon.ico and app/favicon.ico (16/32/48 ICO)");

  writeSafariPinnedTab();

  writeFileSync(
    path.join(root, "public/icons/VERSION"),
    `${ICON_VERSION}\n`,
    "utf8",
  );
  console.log(`icon package version ${ICON_VERSION}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
