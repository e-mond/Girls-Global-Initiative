/**
 * Regenerate favicon / PWA icons from the high-resolution brand logo.
 * Run: npx tsx scripts/generate-favicons.ts
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "public", "brand", "ggi-logo.png");

async function png(size: number, out: string, background?: { r: number; g: number; b: number; alpha: number }) {
  const pipeline = sharp(source).resize(size, size, {
    fit: "contain",
    background: background ?? { r: 255, g: 255, b: 255, alpha: 1 },
  });
  await pipeline.png().toFile(path.join(root, out));
  console.log(`wrote ${out} (${size}x${size})`);
}

async function main() {
  await png(16, "public/icons/favicon-16x16.png");
  await png(32, "public/icons/favicon-32x32.png");
  await png(32, "public/favicon.png");
  // Next.js app/icon is resized by the framework — keep a crisp source.
  await png(512, "app/icon.png");
  await png(180, "public/icons/apple-touch-icon.png");
  await png(180, "app/apple-icon.png");
  await png(192, "public/icons/icon-192.png");
  await png(512, "public/icons/icon-512.png");

  // Build a real multi-size ICO (16 + 32 + 48) — not a renamed PNG.
  const { default: pngToIco } = await import("png-to-ico");
  const icoBuffer = await pngToIco([
    path.join(root, "public/icons/favicon-16x16.png"),
    path.join(root, "public/icons/favicon-32x32.png"),
    await sharp(source)
      .resize(48, 48, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toBuffer(),
  ]);
  writeFileSync(path.join(root, "public/favicon.ico"), icoBuffer);
  console.log("wrote public/favicon.ico (multi-size ICO)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
