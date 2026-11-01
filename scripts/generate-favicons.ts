/**
 * Regenerate favicon / PWA icons from the high-resolution brand logo.
 * Run: npm run generate:favicons
 *
 * Source: public/brand/ggi-logo.png (approved circular GGI mark).
 * Output: circular mark with Vivid Sky Blue ring (matches navbar rounded logo).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "public", "brand", "ggi-logo.png");
const cream = { r: 253, g: 246, b: 236, alpha: 1 }; // --bg-base
const white = { r: 255, g: 255, b: 255, alpha: 1 };
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
/** Vivid Sky Blue — visible blue ring on browser tabs (navbar circular treatment). */
const BORDER_HEX = "#00b0f2";
const ICON_VERSION = "20261101g";

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

  const punched = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 8 })
    .png()
    .toBuffer();

  const meta = await sharp(punched).metadata();
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
      background: transparent,
    },
  })
    .composite([
      {
        input: punched,
        left: Math.round((canvas - w) / 2),
        top: Math.round((canvas - h) / 2),
      },
    ])
    .png()
    .toBuffer();
}

function borderWidthFor(size: number): number {
  // Keep the ring readable at 16px without eating the mark.
  if (size <= 16) return 1;
  if (size <= 32) return 2;
  if (size <= 48) return 3;
  return Math.max(4, Math.round(size * 0.055));
}

async function svgPng(svg: string): Promise<Buffer> {
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/**
 * Circular favicon: white disk + sky-blue ring + logo, transparent outside.
 * Optional opaqueBackdrop flattens corners (Apple / maskable fields).
 */
async function buildCircular(
  mark: Buffer,
  size: number,
  opaqueBackdrop: { r: number; g: number; b: number; alpha: number } | null,
): Promise<Buffer> {
  const border = borderWidthFor(size);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 0.5;
  const innerR = Math.max(1, outerR - border);
  const contentPad = Math.max(1, Math.round(innerR * 0.08));
  const markSize = Math.max(1, Math.round(innerR * 2 - contentPad * 2));

  const resized = await sharp(mark)
    .resize(markSize, markSize, {
      fit: "contain",
      background: transparent,
    })
    .png()
    .toBuffer();

  const disk = await svgPng(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <circle cx="${cx}" cy="${cy}" r="${innerR}" fill="#ffffff"/>
      <circle cx="${cx}" cy="${cy}" r="${outerR - border / 2}" fill="none" stroke="${BORDER_HEX}" stroke-width="${border}"/>
    </svg>`,
  );

  const markLeft = Math.round((size - markSize) / 2);
  const baseBg = opaqueBackdrop ?? transparent;

  const composited = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: baseBg,
    },
  })
    .composite([
      { input: disk, left: 0, top: 0 },
      { input: resized, left: markLeft, top: markLeft },
    ])
    .png()
    .toBuffer();

  if (opaqueBackdrop) {
    return composited;
  }

  // Clip to outer circle so browser tabs show a round mark, not a square tile.
  const mask = await svgPng(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <circle cx="${cx}" cy="${cy}" r="${outerR}" fill="#ffffff"/>
    </svg>`,
  );
  return sharp(composited)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function writeCircular(
  mark: Buffer,
  size: number,
  out: string,
  opaqueBackdrop: { r: number; g: number; b: number; alpha: number } | null,
) {
  const abs = path.join(root, out);
  mkdirSync(path.dirname(abs), { recursive: true });
  await sharp(await buildCircular(mark, size, opaqueBackdrop)).toFile(abs);
  console.log(`wrote ${out} (${size}x${size}, circular + sky border)`);
}

async function writeMaskable(mark: Buffer, size: number, out: string) {
  // Safe-zone padding (~20%) for Android maskable icons; circular mark centered.
  const inner = Math.round(size * 0.72);
  const circular = await buildCircular(mark, inner, null);
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
        input: circular,
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
  <circle cx="8" cy="8" r="7.25" fill="none" stroke="#000" stroke-width="0.85"/>
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
  const mark = await markPng(0.04);
  const smallMark = await markPng(0.1);

  // Browser-tab icons: true circles with transparent corners + sky border.
  await writeCircular(smallMark, 16, "public/icons/favicon-16x16.png", null);
  await writeCircular(smallMark, 32, "public/icons/favicon-32x32.png", null);
  await writeCircular(smallMark, 32, "public/favicon.png", null);
  await writeCircular(smallMark, 48, "public/icons/favicon-48x48.png", null);

  // Apple / app icons: circular mark on opaque field (hosts may round themselves).
  await writeCircular(mark, 180, "public/icons/apple-touch-icon.png", white);
  await writeCircular(mark, 180, "app/apple-icon.png", white);
  await writeCircular(mark, 192, "public/icons/icon-192.png", cream);
  await writeCircular(mark, 512, "public/icons/icon-512.png", cream);
  await writeCircular(mark, 512, "app/icon.png", cream);

  await writeMaskable(mark, 192, "public/icons/icon-192-maskable.png");
  await writeMaskable(mark, 512, "public/icons/icon-512-maskable.png");

  const { default: pngToIco } = await import("png-to-ico");
  const icoBuffer = await pngToIco([
    path.join(root, "public/icons/favicon-16x16.png"),
    path.join(root, "public/icons/favicon-32x32.png"),
    path.join(root, "public/icons/favicon-48x48.png"),
  ]);
  // App Router only — a matching public/favicon.ico conflicts and 500s /favicon.ico.
  writeFileSync(path.join(root, "app/favicon.ico"), icoBuffer);
  console.log("wrote app/favicon.ico (16/32/48 ICO)");

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
