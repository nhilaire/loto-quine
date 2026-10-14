#!/usr/bin/env node
// Synthesises the sound effects (self-made, no sample): assets/sounds/roll.wav and win.wav.
//   node scripts/generate-sounds.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RATE = 22050;

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2));
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

// Deterministic noise so that the file is identical at every run.
let seed = 12345;
const noise = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 2 ** 32) * 2 - 1;

// Balls rattling in the cage: short wooden clicks, fast then slowing down, over ~0.95 s.
function roll() {
  const length = Math.round(0.95 * RATE);
  const out = new Float32Array(length);
  let t = 0;
  let gap = 0.035;
  while (t < 0.9) {
    const start = Math.round(t * RATE);
    const pitch = 900 + 900 * Math.abs(noise());
    const n = Math.round(0.025 * RATE);
    for (let i = 0; i < n && start + i < length; i++) {
      const env = Math.exp(-i / (0.004 * RATE));
      out[start + i] += 0.35 * env * (0.6 * Math.sin((2 * Math.PI * pitch * i) / RATE) + 0.4 * noise());
    }
    t += gap * (0.7 + 0.6 * Math.abs(noise()));
    gap *= 1.06;
  }
  return Array.from(out);
}

// Festive arpeggio with a bright octave.
function win() {
  const notes = [[523.25, 0.1], [659.25, 0.1], [783.99, 0.1], [1046.5, 0.12], [783.99, 0.08], [1046.5, 0.5]];
  const samples = [];
  for (const [f, d] of notes) {
    const n = Math.round(d * RATE);
    for (let i = 0; i < n; i++) {
      const t = i / RATE;
      const env = Math.min(1, i / (0.01 * RATE)) * Math.exp(-2.5 * (t / d));
      samples.push((0.35 * env * (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(4 * Math.PI * f * t))) / 1.35);
    }
  }
  return samples;
}

const out = path.join(ROOT, 'assets', 'sounds');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'roll.wav'), wav(roll()));
fs.writeFileSync(path.join(out, 'win.wav'), wav(win()));
console.log('wrote assets/sounds/roll.wav, win.wav');
