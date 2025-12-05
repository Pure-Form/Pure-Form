#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('Missing optional dependency "sharp". Install it with "npm install sharp" to run this script.');
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'assets');
const pngSource = path.join(assetsDir, 'source-icon.png');
const svgSource = path.join(assetsDir, 'source-icon.svg');
const source = fs.existsSync(pngSource)
  ? pngSource
  : fs.existsSync(svgSource)
    ? svgSource
    : pngSource;
const iosIcon = path.join(assetsDir, 'icon.png');
const adaptiveIcon = path.join(assetsDir, 'adaptive-icon.png');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function generate() {
  if (!fs.existsSync(source)) {
    console.error(`Source image not found. Place a PNG or SVG at ${pngSource} or ${svgSource}.`);
    console.error('Example: drop your square logo as source-icon.png and re-run this script.');
    process.exit(2);
  }

  await ensureDir(assetsDir);

  try {
    // iOS / App Store icon: 1024x1024 PNG (square, no alpha recommended)
    await sharp(source)
      .resize(1024, 1024, { fit: 'cover' })
      .png()
      .toFile(iosIcon);

    // Android adaptive icon foreground: keep transparency, 432x432 recommended
    await sharp(source)
      .resize(432, 432, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(adaptiveIcon);

    console.log('Generated:', iosIcon);
    console.log('Generated:', adaptiveIcon);
    console.log('Now run `npx expo start` or rebuild your native app to see the new icon.');
    process.exit(0);
  } catch (err) {
    console.error('Error generating icons:', err);
    process.exit(1);
  }
}

generate();
