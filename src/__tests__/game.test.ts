import { BALL_COUNT } from '../game/draw';
import { GameAction, GameState, canDraw, durationMinutes, lastBall, newGame, reduce } from '../game/game';
import { seedFrom } from '../game/random';

const T0 = 1_700_000_000_000;

function play(state: GameState, ...actions: GameAction[]): GameState {
  return actions.reduce(reduce, state);
}

function drawRevealed(state: GameState, count: number): GameState {
  let s = state;
  for (let i = 0; i < count; i++) s = play(s, { type: 'draw' }, { type: 'revealed' });
  return s;
}

describe('game flow (AC-06, AC-09, AC-10, AC-11, AC-33)', () => {
  it('starts at quine with no ball', () => {
    const s = newGame(seedFrom(42), T0);
    expect(s.stage).toBe('quine');
    expect(s.draw).toEqual([]);
    expect(lastBall(s)).toBeNull();
    expect(canDraw(s)).toBe(true);
  });

  it('AC-06: a draw request during the animation is ignored', () => {
    const s1 = play(newGame(seedFrom(42), T0), { type: 'draw' });
    expect(s1.draw.length).toBe(1);
    expect(s1.animating).toBe(true);
    const s2 = play(s1, { type: 'draw' }, { type: 'draw' });
    expect(s2).toBe(s1);
    const s3 = play(s2, { type: 'revealed' }, { type: 'draw' });
    expect(s3.draw.length).toBe(2);
  });

  it('AC-09: continue keeps the draw and moves to the next stage', () => {
    const s = drawRevealed(newGame(seedFrom(42), T0), 12);
    const won = play(s, { type: 'validateWin', now: T0 + 1000 });
    expect(won.pendingWin).toBe(true);
    expect(canDraw(won)).toBe(false);
    const next = play(won, { type: 'choose', choice: 'continue' });
    expect(next.stage).toBe('double_quine');
    expect(next.draw).toEqual(s.draw);
    expect(next.pendingWin).toBe(false);
  });

  it('AC-09: new draw resets the balls and moves to the next stage', () => {
    const s = drawRevealed(newGame(seedFrom(42), T0), 12);
    const next = play(s, { type: 'validateWin', now: T0 }, { type: 'choose', choice: 'new_draw' });
    expect(next.stage).toBe('double_quine');
    expect(next.draw).toEqual([]);
    expect(canDraw(next)).toBe(true);
    const after = play(next, { type: 'choose', choice: 'continue' });
    expect(after).toBe(next);
  });

  it('AC-10: a win at carton plein finishes the game as completed', () => {
    let s = drawRevealed(newGame(seedFrom(1), T0), 10);
    s = play(s, { type: 'validateWin', now: T0 }, { type: 'choose', choice: 'continue' });
    s = play(s, { type: 'validateWin', now: T0 }, { type: 'choose', choice: 'continue' });
    expect(s.stage).toBe('carton_plein');
    s = play(s, { type: 'validateWin', now: T0 + 25 * 60000 + 59000 });
    expect(s.status).toBe('finished');
    expect(s.result).toBe('completed');
    expect(durationMinutes(s, T0 + 99 * 60000)).toBe(25);
    expect(play(s, { type: 'draw' })).toBe(s);
  });

  it('AC-10: stop finishes the game as stopped', () => {
    const s = play(drawRevealed(newGame(seedFrom(1), T0), 3), { type: 'stop', now: T0 + 59999 });
    expect(s.status).toBe('finished');
    expect(s.result).toBe('stopped');
    expect(durationMinutes(s, T0)).toBe(0);
  });

  it('AC-11: after 90 balls drawing is disabled, validating a win stays possible', () => {
    const s = drawRevealed(newGame(seedFrom(3), T0), BALL_COUNT);
    expect(s.draw.length).toBe(BALL_COUNT);
    expect(canDraw(s)).toBe(false);
    expect(play(s, { type: 'draw' })).toBe(s);
    expect(play(s, { type: 'validateWin', now: T0 }).pendingWin).toBe(true);
  });

  it('AC-33: the stage advances only when a choice is made', () => {
    const won = play(drawRevealed(newGame(seedFrom(42), T0), 5), { type: 'validateWin', now: T0 });
    expect(won.stage).toBe('quine');
    expect(play(won, { type: 'validateWin', now: T0 })).toBe(won);
    expect(play(won, { type: 'choose', choice: 'continue' }).stage).toBe('double_quine');
  });
});
