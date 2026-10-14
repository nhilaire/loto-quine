#!/usr/bin/env node
// Draws the app icon, adaptive icon layers, splash image and favicon (self-made, no external asset): a glossy red
// loto ball with a white disc and the number 90, on the app's warm red background.
//   node scripts/generate-icons.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SS = 4; // supersampling per axis

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const clamp = (x) => Math.max(0, Math.min(1, x));

const RED = hex('#E63946');
const DARK_RED = hex('#7A1420');
const WHITE = hex('#FFFDF7');
const INK = hex('#1F1300');
const BG = hex('#9E2A1B');
const BG_DEEP = hex('#6E1A10');

// Signed distances (negative inside).
const circle = (x, y, cx, cy, r) => Math.hypot(x - cx, y - cy) - r;
const ellipseRing = (x, y, cx, cy, rx, ry, w) => Math.abs((Math.hypot((x - cx) / rx, (y - cy) / ry) - 1) * Math.min(rx, ry)) - w / 2;
function capsule(x, y, ax, ay, bx, by, w) {
  const px = x - ax, py = y - ay, dx = bx - ax, dy = by - ay;
  const t = clamp((px * dx + py * dy) / (dx * dx + dy * dy));
  return Math.hypot(px - dx * t, py - dy * t) - w / 2;
}

// "90" inside a disc of radius d centred at (cx, cy).
function digits(x, y, cx, cy, d) {
  const h = d * 0.95; // digit height
  const w = h * 0.52; // digit width
  const s = h * 0.15; // stroke
  const gap = w * 0.22;
  const nx = cx - gap / 2 - w / 2; // centre of 9
  const zx = cx + gap / 2 + w / 2; // centre of 0
  const top = cy - h / 2;
  const nine = Math.min(
    ellipseRing(x, y, nx, top + w / 2, w / 2 - s / 2, w / 2 - s / 2, s),
    capsule(x, y, nx + w / 2 - s / 2, top + w / 2, nx + w / 2 - s / 2 - w * 0.08, cy + h / 2 - s / 2, s),
  );
  const zero = ellipseRing(x, y, zx, cy, w / 2 - s / 2, h / 2 - s / 2, s);
  return Math.min(nine, zero);
}

// Colour (rgb, alpha) of the ball at (x, y); ball of radius r centred at (cx, cy). mono: white silhouette.
function ball(x, y, cx, cy, r, mono = false) {
  const dBall = circle(x, y, cx, cy, r);
  if (dBall > 0) return null;
  const disc = r * 0.62;
  const dDisc = circle(x, y, cx, cy, disc);
  const dDigits = digits(x, y, cx, cy, disc);
  if (mono) {
    if (dDisc < 0 && dDigits > 0) return null; // disc cut out, digits kept
    return [[255, 255, 255], 1];
  }
  if (dDisc < 0) return [dDigits < 0 ? INK : WHITE, 1];
  // Sphere shading: light from the top-left, darker rim, soft specular highlight.
  const lx = (x - (cx - r * 0.35)) / r, ly = (y - (cy - r * 0.4)) / r;
  const light = clamp(1 - Math.hypot(lx, ly) / 1.6);
  let c = mix(DARK_RED, RED, Math.pow(light, 0.6));
  const spec = clamp(1 - Math.hypot(x - (cx - r * 0.42), y - (cy - r * 0.48)) / (r * 0.22));
  c = mix(c, [255, 255, 255], spec * 0.75);
  return [c, 1];
}

function render(size, painter) {
  const px = new Uint8Array(size * size * 4);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const res = painter((i + (sx + 0.5) / SS) / size, (j + (sy + 0.5) / SS) / size);
          if (!res) continue;
          const [c, alpha] = res;
          r += c[0] * alpha; g += c[1] * alpha; b += c[2] * alpha; a += alpha;
        }
      }
      const k = (j * size + i) * 4;
      const n = SS * SS;
      px[k] = a ? Math.round(r / a) : 0;
      px[k + 1] = a ? Math.round(g / a) : 0;
      px[k + 2] = a ? Math.round(b / a) : 0;
      px[k + 3] = Math.round((a / n) * 255);
    }
  }
  return png(size, px);
}

function crc32(buf) {
  let c = ~0;
  for (const byte of buf) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function png(size, rgba) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    Buffer.from(rgba.buffer, y * size * 4, size * 4).copy(raw, y * (size * 4 + 1) + 1);
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const background = (x, y) => [mix(BG, BG_DEEP, clamp(Math.hypot(x - 0.5, y - 0.3) / 0.8)), 1];
const onBackground = (r) => (x, y) => ball(x, y, 0.5, 0.5, r) ?? background(x, y);

const out = (name, buf) => fs.writeFileSync(path.join(ROOT, 'assets', name), buf);
// Adaptive icons: the visible safe zone is the central 66 %; the ball stays inside it.
out('android-icon-foreground.png', render(512, (x, y) => ball(x, y, 0.5, 0.5, 0.3)));
out('android-icon-background.png', render(512, background));
out('android-icon-monochrome.png', render(432, (x, y) => ball(x, y, 0.5, 0.5, 0.3, true)));
out('icon.png', render(1024, onBackground(0.4)));
out('splash-icon.png', render(1024, (x, y) => ball(x, y, 0.5, 0.5, 0.46)));
out('favicon.png', render(48, onBackground(0.44)));
console.log('wrote icon.png, android-icon-*.png, splash-icon.png, favicon.png');
