#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('Missing optional dependency "sharp". Install it with "npm install sharp" to generate marketing assets.');
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'assets');
const marketingDir = path.join(assetsDir, 'marketing');

const pngSource = path.join(assetsDir, 'source-icon.png');
const svgSource = path.join(assetsDir, 'source-icon.svg');
const sourcePath = fs.existsSync(pngSource)
  ? pngSource
  : fs.existsSync(svgSource)
    ? svgSource
    : pngSource;

const playStoreIconPath = path.join(marketingDir, 'play-store-icon.png');
const featureGraphicPath = path.join(marketingDir, 'feature-graphic.png');

const ensureDir = async (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const loadSource = () => {
  if (!fs.existsSync(sourcePath)) {
    console.error('Missing source icon. Add assets/source-icon.svg or source-icon.png and re-run.');
    process.exit(1);
  }
  return sourcePath;
};

const buildFeatureBackground = () => Buffer.from(`
  <svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="featureGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F8EF2" />
        <stop offset="45%" stop-color="#0E3B84" />
        <stop offset="100%" stop-color="#210B53" />
      </linearGradient>
    </defs>
    <rect width="1024" height="500" fill="url(#featureGradient)" rx="48" />
  </svg>
`);

const buildTextOverlay = () => Buffer.from(`
  <svg width="460" height="300" viewBox="0 0 460 300" xmlns="http://www.w3.org/2000/svg">
    <style>
      .title { font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif; font-size: 88px; font-weight: 700; fill: #FFFFFF; }
      .subtitle { font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif; font-size: 30px; font-weight: 400; fill: #CCDAFF; }
    </style>
    <text x="0" y="120" class="title">Pure Life</text>
    <text x="0" y="190" class="subtitle">Fitness &amp; Nutrition Coach</text>
    <text x="0" y="240" class="subtitle">Planla - Takip et - Gelis</text>
  </svg>
`);

(async () => {
  loadSource();
  await ensureDir(marketingDir);

  try {
    // 512x512 Play Store icon
    await sharp(sourcePath)
      .resize(512, 512, { fit: 'cover' })
      .png()
      .toFile(playStoreIconPath);

    const iconBuffer = await sharp(sourcePath)
      .resize(380, 380, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    const backgroundBuffer = buildFeatureBackground();
    const textOverlay = buildTextOverlay();

    await sharp(backgroundBuffer)
      .png()
      .composite([
        { input: iconBuffer, top: 60, left: 120 },
        { input: textOverlay, top: 110, left: 540 },
      ])
      .toFile(featureGraphicPath);

    console.log('Generated:', playStoreIconPath);
    console.log('Generated:', featureGraphicPath);
  } catch (error) {
    console.error('Failed to generate marketing assets', error);
    process.exit(1);
  }
})();
