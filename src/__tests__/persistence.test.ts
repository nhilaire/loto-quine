import AsyncStorage from '@react-native-async-storage/async-storage';

import { GameAction, GameState, newGame, reduce } from '../game/game';
import { seedFrom } from '../game/random';
import { parseGame, serializeGame } from '../game/serialize';
import { clearGame, loadGame, saveGame } from '../storage/gameStore';

const T0 = 1_700_000_000_000;

function play(state: GameState, ...actions: GameAction[]): GameState {
  return actions.reduce(reduce, state);
}

function drawn(count: number): GameState {
  let s = newGame(seedFrom(42), T0);
  for (let i = 0; i < count; i++) s = play(s, { type: 'draw' }, { type: 'revealed' });
  return s;
}

describe('game persistence (AC-12, AC-33)', () => {
  it('restores stage, draw order, counter, generator state and start time', () => {
    const s = play(drawn(17), { type: 'validateWin', now: T0 }, { type: 'choose', choice: 'continue' });
    const restored = parseGame(serializeGame(s));
    expect(restored).toEqual(s);
  });

  it('draws the same next ball after a save and restore', () => {
    const s = drawn(30);
    const restored = parseGame(serializeGame(s))!;
    expect(play(restored, { type: 'draw' }).draw).toEqual(play(s, { type: 'draw' }).draw);
  });

  it('restores a ball interrupted before its reveal as drawn, without animation', () => {
    const s = play(drawn(3), { type: 'draw' });
    expect(s.animating).toBe(true);
    const restored = parseGame(serializeGame(s))!;
    expect(restored.draw).toEqual(s.draw);
    expect(restored.draw).toHaveLength(4);
    expect(restored.animating).toBe(false);
  });

  it('AC-33: keeps a pending win', () => {
    const s = play(drawn(8), { type: 'validateWin', now: T0 });
    expect(parseGame(serializeGame(s))!.pendingWin).toBe(true);
  });

  it.each([null, '', 'not json', '{"version":2}', '{"version":1,"status":"playing"}'])('rejects invalid data %p', (text) => {
    expect(parseGame(text)).toBeNull();
  });

  it('rejects a draw with duplicates or out-of-range balls', () => {
    const s = drawn(3);
    expect(parseGame(JSON.stringify({ ...s, draw: [5, 5] }))).toBeNull();
    expect(parseGame(JSON.stringify({ ...s, draw: [91] }))).toBeNull();
  });
});

describe('game store', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('saves and loads the game in progress, forgets a finished one', async () => {
    expect(await loadGame()).toBeNull();
    const s = drawn(5);
    await saveGame(s);
    expect(await loadGame()).toEqual(s);
    await saveGame(play(s, { type: 'stop', now: T0 }));
    expect(await loadGame()).toBeNull();
    await saveGame(s);
    await clearGame();
    expect(await loadGame()).toBeNull();
  });
});
