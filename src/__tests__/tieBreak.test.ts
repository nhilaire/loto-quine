import { GameState, newGame, reduce } from '../game/game';
import { seedFrom } from '../game/random';
import { MAX_TIED, MIN_TIED, tieBreakNumbers, tieBreakWinner } from '../game/tieBreak';

function gameWithBalls(seed: number, balls: number): GameState {
  let s = newGame(seedFrom(seed), 0);
  for (let i = 0; i < balls; i++) s = [{ type: 'draw' as const }, { type: 'revealed' as const }].reduce(reduce, s);
  return s;
}

describe('tie-break (AC-38)', () => {
  it('gives k distinct numbers in 1-90 and the highest wins', () => {
    for (let k = MIN_TIED; k <= MAX_TIED; k++) {
      const numbers = tieBreakNumbers(gameWithBalls(42, 20), k);
      expect(numbers).toHaveLength(k);
      expect(new Set(numbers).size).toBe(k);
      numbers.forEach((n) => expect(n >= 1 && n <= 90).toBe(true));
      const winner = tieBreakWinner(numbers);
      expect(numbers[winner]).toBe(Math.max(...numbers));
    }
  });

  it('is reproducible for the same game state and differs with the stage', () => {
    const s = gameWithBalls(42, 20);
    expect(tieBreakNumbers(s, 4)).toEqual(tieBreakNumbers(gameWithBalls(42, 20), 4));
    const later = { ...s, stage: 'double_quine' as const };
    expect(tieBreakNumbers(later, 4)).not.toEqual(tieBreakNumbers(s, 4));
  });

  it('does not change the main draw', () => {
    const s = gameWithBalls(7, 15);
    const copy = JSON.parse(JSON.stringify(s));
    tieBreakNumbers(s, 10);
    expect(s).toEqual(copy);
  });

  it('clamps the number of players to 2-10', () => {
    const s = gameWithBalls(1, 5);
    expect(tieBreakNumbers(s, 1)).toHaveLength(2);
    expect(tieBreakNumbers(s, 50)).toHaveLength(10);
  });

  it('picks the first highest index', () => {
    expect(tieBreakWinner([12, 87, 3])).toBe(1);
  });
});
