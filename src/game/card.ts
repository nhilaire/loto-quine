// Card check: the host types a classic French card (3 rows of 5 numbers) and the app checks it against the draw.
import { BALL_COUNT, Draw } from './draw';
import { REQUIRED_ROWS, Stage } from './game';

export const ROWS = 3;
export const COLS = 5;
const MAX_DIGITS = 2;

export type CardEntry = readonly (readonly string[])[];
export type Cursor = { row: number; col: number };

export function emptyCard(): CardEntry {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ''));
}

const index = (c: Cursor) => c.row * COLS + c.col;
const cursorAt = (i: number): Cursor => ({ row: Math.floor(i / COLS), col: i % COLS });
const LAST = ROWS * COLS - 1;

function setCell(card: CardEntry, c: Cursor, value: string): CardEntry {
  return card.map((row, r) => (r === c.row ? row.map((cell, k) => (k === c.col ? value : cell)) : row));
}

export function nextCell(c: Cursor): Cursor {
  return cursorAt(Math.min(index(c) + 1, LAST));
}

export function previousCell(c: Cursor): Cursor {
  return cursorAt(Math.max(index(c) - 1, 0));
}

// Appends a digit to the current cell; after 2 digits the cursor moves to the next cell. When the current cell is
// already full the digit goes into the next cell (ignored on the last cell).
export function typeDigit(card: CardEntry, cursor: Cursor, digit: number): { card: CardEntry; cursor: Cursor } {
  let c = cursor;
  if (card[c.row][c.col].length >= MAX_DIGITS) {
    if (index(c) === LAST) return { card, cursor: c };
    c = nextCell(c);
  }
  const value = card[c.row][c.col] + String(digit);
  const updated = setCell(card, c, value);
  return { card: updated, cursor: value.length >= MAX_DIGITS ? nextCell(c) : c };
}

// Erases the last digit of the current cell, or goes back one cell when it is empty.
export function erase(card: CardEntry, cursor: Cursor): { card: CardEntry; cursor: Cursor } {
  const value = card[cursor.row][cursor.col];
  if (value.length > 0) return { card: setCell(card, cursor, value.slice(0, -1)), cursor };
  return { card, cursor: previousCell(cursor) };
}

export type CellError = 'range' | 'duplicate';
export type CellResult = { value: number; drawn: boolean };
export type RowResult = { filled: boolean; complete: boolean; missing: number; cells: CellResult[] };

export type CheckResult =
  | { kind: 'empty' }
  | { kind: 'errors'; cellErrors: (CellError | null)[][]; incompleteRows: number[] }
  | { kind: 'verdict'; win: boolean; completeRows: number; rows: RowResult[] };

export function checkCard(card: CardEntry, draw: Draw, stage: Stage): CheckResult {
  const filledCount = card.map((row) => row.filter((cell) => cell !== '').length);
  if (filledCount.every((n) => n === 0)) return { kind: 'empty' };

  const values = card.map((row) => row.map((cell) => (cell === '' ? null : parseInt(cell, 10))));
  const occurrences = new Map<number, number>();
  for (const v of values.flat()) if (v !== null) occurrences.set(v, (occurrences.get(v) ?? 0) + 1);

  const cellErrors = values.map((row) =>
    row.map((v): CellError | null => {
      if (v === null) return null;
      if (v < 1 || v > BALL_COUNT) return 'range';
      if ((occurrences.get(v) ?? 0) > 1) return 'duplicate';
      return null;
    }),
  );
  const incompleteRows = filledCount.flatMap((n, r) => (n > 0 && n < COLS ? [r] : []));
  if (incompleteRows.length > 0 || cellErrors.flat().some((e) => e !== null)) {
    return { kind: 'errors', cellErrors, incompleteRows };
  }

  const drawn = new Set(draw);
  const rows = values.map((row): RowResult => {
    const cells = row.flatMap((v) => (v === null ? [] : [{ value: v, drawn: drawn.has(v) }]));
    const filled = cells.length === COLS;
    const missing = cells.filter((c) => !c.drawn).length;
    return { filled, complete: filled && missing === 0, missing, cells };
  });
  const completeRows = rows.filter((r) => r.complete).length;
  return { kind: 'verdict', win: completeRows >= REQUIRED_ROWS[stage], completeRows, rows };
}
