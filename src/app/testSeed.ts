// Testing aid (PRD): the deep link lotoquine://seed/<n> sets an in-memory seed used by the next new game, so that
// e2e flows are reproducible; lotoquine://seed/<n>/drawn/<k> also starts that game with its first k balls drawn
// (k < 90), so that the 90-balls flow stays short. Not saved: cleared when the app is killed.
export type TestStart = { seed: number; drawn: number };

let pending: TestStart | null = null;

export function parseSeedLink(url: string | null | undefined): TestStart | null {
  const match = /^lotoquine:\/\/seed\/(\d{1,10})(?:\/drawn\/(\d{1,2}))?\/?$/.exec(url ?? '');
  if (!match) return null;
  const seed = Number(match[1]);
  const drawn = match[2] === undefined ? 0 : Number(match[2]);
  return seed <= 0xffffffff && drawn < 90 ? { seed, drawn } : null;
}

export function setPendingStart(start: TestStart | null): void {
  pending = start;
}

// Returns the pending start once, then forgets it.
export function takePendingStart(): TestStart | null {
  const start = pending;
  pending = null;
  return start;
}
