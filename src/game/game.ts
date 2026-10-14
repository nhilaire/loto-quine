// Game flow: stages quine -> double quine -> carton plein, draws, pending win, end of game.
// Pure reducer: time and the random generator state are inputs, nothing is read from the environment.
import { Draw, allOut, drawBall, emptyDraw } from './draw';
import { RngState } from './random';

export type Stage = 'quine' | 'double_quine' | 'carton_plein';
export const STAGES: readonly Stage[] = ['quine', 'double_quine', 'carton_plein'];
export const REQUIRED_ROWS: Record<Stage, number> = { quine: 1, double_quine: 2, carton_plein: 3 };

export type WinChoice = 'continue' | 'new_draw';
export type GameResult = 'completed' | 'stopped';

export type GameState = {
  version: 1;
  status: 'playing' | 'finished';
  stage: Stage;
  draw: Draw;
  rng: RngState;
  startedAt: number;
  endedAt: number | null;
  result: GameResult | null;
  // A winner was validated at quine or double quine; the host must choose how to go on.
  pendingWin: boolean;
  // The last ball is drawn but its roll animation is not finished: further draws are ignored.
  animating: boolean;
};

export type GameAction =
  | { type: 'draw' }
  | { type: 'revealed' }
  | { type: 'validateWin'; now: number }
  | { type: 'choose'; choice: WinChoice }
  | { type: 'stop'; now: number };

export function newGame(rng: RngState, now: number): GameState {
  return {
    version: 1,
    status: 'playing',
    stage: 'quine',
    draw: emptyDraw(),
    rng,
    startedAt: now,
    endedAt: null,
    result: null,
    pendingWin: false,
    animating: false,
  };
}

export function nextStage(stage: Stage): Stage | null {
  const index = STAGES.indexOf(stage);
  return index < STAGES.length - 1 ? STAGES[index + 1] : null;
}

export function canDraw(state: GameState): boolean {
  return state.status === 'playing' && !state.animating && !state.pendingWin && !allOut(state.draw);
}

export function lastBall(state: GameState): number | null {
  return state.draw.length > 0 ? state.draw[state.draw.length - 1] : null;
}

function finish(state: GameState, result: GameResult, now: number): GameState {
  return { ...state, status: 'finished', result, endedAt: now, pendingWin: false, animating: false };
}

export function reduce(state: GameState, action: GameAction): GameState {
  if (state.status === 'finished') return state;
  switch (action.type) {
    case 'draw': {
      if (!canDraw(state)) return state;
      const result = drawBall(state.draw, state.rng);
      if (!result) return state;
      return { ...state, draw: result.draw, rng: result.rng, animating: true };
    }
    case 'revealed':
      return state.animating ? { ...state, animating: false } : state;
    case 'validateWin': {
      if (state.pendingWin) return state;
      const base = { ...state, animating: false };
      if (nextStage(state.stage) === null) return finish(base, 'completed', action.now);
      return { ...base, pendingWin: true };
    }
    case 'choose': {
      const stage = nextStage(state.stage);
      if (!state.pendingWin || stage === null) return state;
      const draw = action.choice === 'new_draw' ? emptyDraw() : state.draw;
      return { ...state, stage, draw, pendingWin: false };
    }
    case 'stop':
      return finish(state, 'stopped', action.now);
  }
}

// Whole minutes from start to end (or to `now` while playing), rounded down.
export function durationMinutes(state: GameState, now: number): number {
  const end = state.endedAt ?? now;
  return Math.max(0, Math.floor((end - state.startedAt) / 60000));
}
