// Tie-break between players who win on the same ball: each player draws one number, the highest wins.
// Numbers are drawn from 1-90 without replacement, so two players never get the same number.
// It has its own generator derived from the game state: the main draw is never touched.
import { drawBall, emptyDraw } from './draw';
import { GameState, STAGES } from './game';
import { RngState } from './random';

export const MIN_TIED = 2;
export const MAX_TIED = 10;

export function tieBreakSeed(state: GameState): RngState {
  const stageIndex = STAGES.indexOf(state.stage) + 1;
  return (state.rng ^ Math.imul(stageIndex, 0x9e3779b9) ^ state.draw.length) >>> 0;
}

// One number per player, in player order.
export function tieBreakNumbers(state: GameState, players: number): number[] {
  const count = Math.min(MAX_TIED, Math.max(MIN_TIED, Math.floor(players)));
  let draw = emptyDraw();
  let rng = tieBreakSeed(state);
  for (let i = 0; i < count; i++) {
    const result = drawBall(draw, rng)!;
    draw = result.draw;
    rng = result.rng;
  }
  return [...draw];
}

// Index (0-based) of the player with the highest number.
export function tieBreakWinner(numbers: readonly number[]): number {
  return numbers.reduce((best, n, i) => (n > numbers[best] ? i : best), 0);
}
