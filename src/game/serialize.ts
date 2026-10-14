// Saving and restoring the game in progress. A restored game is never animating: a ball drawn just before the app
// was killed comes back as drawn and is shown without animation or voice.
import { BALL_COUNT } from './draw';
import { GameState, STAGES } from './game';

export function serializeGame(state: GameState): string {
  return JSON.stringify(state);
}

function isBallList(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length <= BALL_COUNT &&
    value.every((n) => Number.isInteger(n) && n >= 1 && n <= BALL_COUNT) &&
    new Set(value).size === value.length
  );
}

// Returns null for anything that is not a valid saved game (corrupt data, older format).
export function parseGame(text: string | null): GameState | null {
  if (!text) return null;
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (!raw || typeof raw !== 'object' || raw.version !== 1) return null;
  const { status, stage, draw, rng, startedAt, endedAt, result, pendingWin } = raw;
  if (status !== 'playing' && status !== 'finished') return null;
  if (!STAGES.includes(stage as never)) return null;
  if (!isBallList(draw)) return null;
  if (typeof rng !== 'number' || !Number.isInteger(rng) || rng < 0 || rng > 0xffffffff) return null;
  if (typeof startedAt !== 'number' || !Number.isFinite(startedAt)) return null;
  if (endedAt !== null && typeof endedAt !== 'number') return null;
  if (result !== null && result !== 'completed' && result !== 'stopped') return null;
  if (typeof pendingWin !== 'boolean') return null;
  return {
    version: 1,
    status,
    stage: stage as GameState['stage'],
    draw,
    rng,
    startedAt,
    endedAt: endedAt as number | null,
    result: result as GameState['result'],
    pendingWin,
    animating: false,
  };
}
