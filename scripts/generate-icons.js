#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'assets');
const source = path.join(assetsDir, 'source-icon.png');
const iosIcon = path.join(assetsDir, 'icon.png');
const adaptiveIcon = path.join(assetsDir, 'adaptive-icon.png');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function generate() {
  if (!fs.existsSync(source)) {
    console.error(`Source image not found: ${source}`);
    console.error('Please place your source icon (the image you attached) at assets/source-icon.png');
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
