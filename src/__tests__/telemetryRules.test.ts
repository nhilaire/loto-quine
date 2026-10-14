import { GameAction, GameState, newGame, reduce } from '../game/game';
import { seedFrom } from '../game/random';
import { startEvents, transitionEvents } from '../game/telemetryRules';

const T0 = 1_700_000_000_000;

function step(state: GameState, action: GameAction, now = T0) {
  const next = reduce(state, action);
  return { next, calls: transitionEvents(state, action, next, now) };
}

function drawn(count: number): GameState {
  let s = newGame(seedFrom(42), T0);
  for (let i = 0; i < count; i++) s = reduce(reduce(s, { type: 'draw' }), { type: 'revealed' });
  return s;
}

describe('telemetry rules (AC-25)', () => {
  it('game_start for a new game, game_end replaced when a game was in progress', () => {
    expect(startEvents(null, T0)).toEqual([{ name: 'game_start', params: {} }]);
    expect(startEvents(drawn(3), T0 + 5 * 60000)).toEqual([
      { name: 'game_end', params: { result: 'replaced', stage: 'quine', duration_min: 5 } },
      { name: 'game_start', params: {} },
    ]);
  });

  it('stage_won is sent when the choice is made, with the balls of the draw', () => {
    const s = drawn(17);
    const validated = step(s, { type: 'validateWin', now: T0 });
    expect(validated.calls).toEqual([]);
    expect(step(validated.next, { type: 'choose', choice: 'new_draw' }).calls).toEqual([
      { name: 'stage_won', params: { stage: 'quine', balls: 17, choice: 'new_draw' } },
    ]);
    expect(step(validated.next, { type: 'choose', choice: 'continue' }).calls).toEqual([
      { name: 'stage_won', params: { stage: 'quine', balls: 17, choice: 'continue' } },
    ]);
  });

  it('carton plein sends stage_won end and game_end completed', () => {
    let s = drawn(40);
    s = reduce(reduce(s, { type: 'validateWin', now: T0 }), { type: 'choose', choice: 'continue' });
    s = reduce(reduce(s, { type: 'validateWin', now: T0 }), { type: 'choose', choice: 'continue' });
    const end = step(s, { type: 'validateWin', now: T0 + 42 * 60000 }, T0 + 42 * 60000);
    expect(end.calls).toEqual([
      { name: 'stage_won', params: { stage: 'carton_plein', balls: 40, choice: 'end' } },
      { name: 'game_end', params: { result: 'completed', stage: 'carton_plein', duration_min: 42 } },
    ]);
  });

  it('stop sends game_end stopped; draws send nothing', () => {
    const s = drawn(2);
    expect(step(s, { type: 'draw' }).calls).toEqual([]);
    expect(step(s, { type: 'stop', now: T0 + 61000 }, T0 + 61000).calls).toEqual([
      { name: 'game_end', params: { result: 'stopped', stage: 'quine', duration_min: 1 } },
    ]);
  });
});
