// A draw: balls 1-90 taken without replacement, kept in draw order.
import { RngState, nextInt } from './random';

export const BALL_COUNT = 90;
export const ALL_BALLS: readonly number[] = Array.from({ length: BALL_COUNT }, (_, i) => i + 1);

export type Draw = readonly number[];

export function emptyDraw(): Draw {
  return [];
}

// Draws one ball uniformly among the balls not drawn yet. Returns null when every ball is out.
export function drawBall(draw: Draw, rng: RngState): { draw: Draw; rng: RngState; ball: number } | null {
  const drawn = new Set(draw);
  const remaining = ALL_BALLS.filter((n) => !drawn.has(n));
  if (remaining.length === 0) return null;
  const pick = nextInt(rng, remaining.length);
  const ball = remaining[pick.value];
  return { draw: [...draw, ball], rng: pick.state, ball };
}

// Most recent first.
export function lastBalls(draw: Draw, count = 5): number[] {
  return draw.slice(-count).reverse();
}

export function allOut(draw: Draw): boolean {
  return draw.length >= BALL_COUNT;
}
