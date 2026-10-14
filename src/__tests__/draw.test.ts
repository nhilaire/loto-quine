import { ALL_BALLS, BALL_COUNT, allOut, drawBall, emptyDraw, lastBalls } from '../game/draw';
import { nextRandom, seedFrom } from '../game/random';

function drawAll(seed: number): readonly number[] {
  let draw = emptyDraw();
  let rng = seedFrom(seed);
  for (let i = 0; i < BALL_COUNT; i++) {
    const result = drawBall(draw, rng);
    if (!result) throw new Error('draw refused early');
    draw = result.draw;
    rng = result.rng;
  }
  return draw;
}

describe('random generator', () => {
  it('is deterministic and stays in [0, 1)', () => {
    let a = seedFrom(7);
    let b = seedFrom(7);
    for (let i = 0; i < 1000; i++) {
      const ra = nextRandom(a);
      const rb = nextRandom(b);
      expect(ra.value).toBe(rb.value);
      expect(ra.value).toBeGreaterThanOrEqual(0);
      expect(ra.value).toBeLessThan(1);
      a = ra.state;
      b = rb.state;
    }
  });
});

describe('draw (AC-03, AC-04, AC-05, AC-11)', () => {
  it('AC-03: 90 balls give every number 1-90 exactly once, a 91st draw is refused', () => {
    for (const seed of [1, 42, 123456, 2 ** 31 - 1]) {
      let draw = emptyDraw();
      let rng = seedFrom(seed);
      for (let i = 0; i < BALL_COUNT; i++) {
        const result = drawBall(draw, rng)!;
        draw = result.draw;
        rng = result.rng;
      }
      expect([...draw].sort((x, y) => x - y)).toEqual(ALL_BALLS);
      expect(drawBall(draw, rng)).toBeNull();
    }
  });

  it('AC-04: same seed gives the same sequence', () => {
    expect(drawAll(42)).toEqual(drawAll(42));
    expect(drawAll(42)).not.toEqual(drawAll(43));
  });

  it('AC-04: over 1000 seeds the first ball covers 1-90 with no value above 3x its expected frequency', () => {
    const counts = new Array(BALL_COUNT + 1).fill(0);
    for (let seed = 1; seed <= 1000; seed++) {
      counts[drawBall(emptyDraw(), seedFrom(seed))!.ball]++;
    }
    const expected = 1000 / BALL_COUNT;
    for (let n = 1; n <= BALL_COUNT; n++) {
      expect(counts[n]).toBeGreaterThan(0);
      expect(counts[n]).toBeLessThanOrEqual(3 * expected);
    }
  });

  it('AC-05: a draw increments the counter and appends the ball; last 5 are most recent first', () => {
    let draw = emptyDraw();
    let rng = seedFrom(5);
    const seen: number[] = [];
    for (let i = 1; i <= 7; i++) {
      const result = drawBall(draw, rng)!;
      expect(result.draw.length).toBe(draw.length + 1);
      expect(result.draw[result.draw.length - 1]).toBe(result.ball);
      expect(draw).not.toContain(result.ball);
      seen.push(result.ball);
      draw = result.draw;
      rng = result.rng;
    }
    expect(lastBalls(draw)).toEqual(seen.slice(-5).reverse());
    expect(lastBalls(draw.slice(0, 2))).toEqual(seen.slice(0, 2).reverse());
  });

  it('AC-11: all balls out is reported only after 90 draws', () => {
    const draw = drawAll(9);
    expect(allOut(draw)).toBe(true);
    expect(allOut(draw.slice(0, 89))).toBe(false);
  });
});
