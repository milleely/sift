import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../public/icons');
mkdirSync(outDir, { recursive: true });

// Design the S icon as SVG at high resolution (512px) for clean downscaling.
// White S on brand blue (#2E6BE6) rounded rectangle.
// All coordinates on whole-number pixel grid to avoid sub-pixel artifacts.
const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Blue rounded rectangle background -->
  <rect x="16" y="16" width="480" height="480" rx="96" ry="96" fill="#2E6BE6"/>

  <!-- White S letterform — designed on grid, clean geometry -->
  <path d="
    M 168 136
    L 344 136
    Q 368 136 368 160
    L 368 232
    Q 368 256 344 256
    L 192 256
    Q 168 256 168 280
    L 168 352
    Q 168 376 192 376
    L 344 376
    Q 368 376 368 352
    L 368 336

    L 320 336
    L 320 340
    Q 320 344 316 344
    L 220 344
    Q 216 344 216 340
    L 216 284
    Q 216 280 220 280
    L 344 280
    Q 368 280 368 256
    L 368 160
    Q 368 136 344 136

    M 168 136
    L 168 176
    L 316 176
    Q 320 176 320 180
    L 320 228
    Q 320 232 316 232
    L 192 232
    Q 168 232 168 256
    L 168 256
    Z
  " fill="white" fill-rule="evenodd"/>
</svg>`;

// Simpler, bolder S that works well at small sizes
const svgClean = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect x="16" y="16" width="480" height="480" rx="96" ry="96" fill="#2E6BE6"/>
  <text
    x="256" y="390"
    font-family="Arial, Helvetica, sans-serif"
    font-weight="bold"
    font-size="380"
    fill="white"
    text-anchor="middle"
  >S</text>
</svg>`;

const sizes = [16, 24, 32, 48, 128];

async function generate() {
  for (const size of sizes) {
    await sharp(Buffer.from(svgClean))
      .resize(size, size, {
        kernel: sharp.kernel.lanczos3,
        fit: 'contain',
      })
      .png({ effort: 9 })
      .toFile(resolve(outDir, `icon-${size}.png`));

    console.log(`Generated icon-${size}.png`);
  }
}

generate().catch(console.error);
