import { CardEntry, CheckResult, checkCard, emptyCard, erase, typeDigit } from '../game/card';

function card(...rows: string[][]): CardEntry {
  const c = emptyCard().map((r) => [...r]);
  rows.forEach((row, r) => row.forEach((v, k) => (c[r][k] = v)));
  return c;
}

const DRAW = [3, 14, 27, 35, 48, 52, 61, 70, 88, 90, 7];
const ROW_DRAWN = ['3', '14', '27', '35', '48'];
const ROW_DRAWN_2 = ['52', '61', '70', '88', '90'];
const ROW_ONE_MISSING = ['7', '19', '52', '61', '70'];

function verdict(result: CheckResult) {
  if (result.kind !== 'verdict') throw new Error(`expected a verdict, got ${result.kind}`);
  return result;
}

describe('card check (AC-07)', () => {
  it('marks each number drawn or missing and counts complete rows', () => {
    const r = verdict(checkCard(card(ROW_DRAWN, ROW_ONE_MISSING), DRAW, 'quine'));
    expect(r.rows[0]).toMatchObject({ filled: true, complete: true, missing: 0 });
    expect(r.rows[1]).toMatchObject({ filled: true, complete: false, missing: 1 });
    expect(r.rows[1].cells.find((c) => c.value === 19)).toEqual({ value: 19, drawn: false });
    expect(r.rows[2]).toMatchObject({ filled: false, complete: false, cells: [] });
    expect(r.completeRows).toBe(1);
    expect(r.win).toBe(true);
  });

  it('wins exactly when complete rows reach 1 / 2 / 3 for the stage', () => {
    const one = card(ROW_DRAWN, ROW_ONE_MISSING);
    const two = card(ROW_DRAWN, ROW_DRAWN_2);
    const three = card(ROW_DRAWN, ROW_DRAWN_2, ['1', '2', '4', '5', '6']);
    expect(verdict(checkCard(one, DRAW, 'quine')).win).toBe(true);
    expect(verdict(checkCard(one, DRAW, 'double_quine')).win).toBe(false);
    expect(verdict(checkCard(two, DRAW, 'double_quine')).win).toBe(true);
    expect(verdict(checkCard(two, DRAW, 'carton_plein')).win).toBe(false);
    expect(verdict(checkCard(three, [...DRAW, 1, 2, 4, 5, 6], 'carton_plein')).win).toBe(true);
    expect(verdict(checkCard(card(ROW_ONE_MISSING), DRAW, 'quine')).win).toBe(false);
  });

  it('accepts a leading zero (05 = 5)', () => {
    const r = verdict(checkCard(card(['03', '14', '27', '35', '48']), DRAW, 'quine'));
    expect(r.win).toBe(true);
  });
});

describe('card validation (AC-08)', () => {
  it.each(['0', '00', '91', '99'])('rejects %s as out of range', (bad) => {
    const r = checkCard(card([bad, '14', '27', '35', '48']), DRAW, 'quine');
    expect(r.kind).toBe('errors');
    if (r.kind === 'errors') expect(r.cellErrors[0][0]).toBe('range');
  });

  it('rejects a number entered twice, on both cells', () => {
    const r = checkCard(card(['3', '14', '27', '35', '48'], ['52', '61', '3', '88', '90']), DRAW, 'quine');
    expect(r.kind).toBe('errors');
    if (r.kind === 'errors') {
      expect(r.cellErrors[0][0]).toBe('duplicate');
      expect(r.cellErrors[1][2]).toBe('duplicate');
    }
  });

  it('rejects a row with 1 to 4 numbers', () => {
    for (let n = 1; n <= 4; n++) {
      const r = checkCard(card(ROW_DRAWN, ROW_DRAWN_2.slice(0, n)), DRAW, 'quine');
      expect(r).toEqual(expect.objectContaining({ kind: 'errors', incompleteRows: [1] }));
    }
  });

  it('rejects an empty grid', () => {
    expect(checkCard(emptyCard(), DRAW, 'quine')).toEqual({ kind: 'empty' });
  });
});

describe('keypad entry', () => {
  it('moves to the next cell after 2 digits and erases back', () => {
    let s = { card: emptyCard(), cursor: { row: 0, col: 0 } };
    s = typeDigit(s.card, s.cursor, 4);
    expect(s.cursor).toEqual({ row: 0, col: 0 });
    s = typeDigit(s.card, s.cursor, 7);
    expect(s.card[0][0]).toBe('47');
    expect(s.cursor).toEqual({ row: 0, col: 1 });
    s = typeDigit(s.card, s.cursor, 5);
    s = erase(s.card, s.cursor);
    expect(s.card[0][1]).toBe('');
    s = erase(s.card, s.cursor);
    expect(s.cursor).toEqual({ row: 0, col: 0 });
    expect(s.card[0][0]).toBe('47');
  });

  it('wraps from the end of a row to the next row and stops at the last cell', () => {
    let s = { card: emptyCard(), cursor: { row: 0, col: 4 } };
    s = typeDigit(s.card, s.cursor, 1);
    s = typeDigit(s.card, s.cursor, 2);
    expect(s.cursor).toEqual({ row: 1, col: 0 });
    s = { card: s.card, cursor: { row: 2, col: 4 } };
    s = typeDigit(s.card, s.cursor, 8);
    s = typeDigit(s.card, s.cursor, 9);
    expect(s.card[2][4]).toBe('89');
    expect(s.cursor).toEqual({ row: 2, col: 4 });
    const same = typeDigit(s.card, s.cursor, 1);
    expect(same.card[2][4]).toBe('89');
  });
});
