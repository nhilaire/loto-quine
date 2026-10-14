// Seeded pseudo-random generator (mulberry32). Its state is a plain 32-bit integer so that it can be saved with
// the game and restored exactly. Pure: the next value and the next state are returned, nothing is mutated.

export type RngState = number;

export function seedFrom(seed: number): RngState {
  return seed >>> 0;
}

export function randomSeed(): RngState {
  return Math.floor(Math.random() * 2 ** 32) >>> 0;
}

export function nextRandom(state: RngState): { value: number; state: RngState } {
  const next = (state + 0x6d2b79f5) >>> 0;
  let t = next;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { value, state: next };
}

// Uniform integer in [0, max).
export function nextInt(state: RngState, max: number): { value: number; state: RngState } {
  const r = nextRandom(state);
  return { value: Math.floor(r.value * max), state: r.state };
}
