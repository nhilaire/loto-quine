// Testing aid (PRD): the deep link lotoquine://seed/<n> sets an in-memory seed used by the next new game, so that
// e2e flows are reproducible. Not saved: cleared when the app is killed.
let pendingSeed: number | null = null;

export function parseSeedLink(url: string | null | undefined): number | null {
  const match = /^lotoquine:\/\/seed\/(\d{1,10})\/?$/.exec(url ?? '');
  if (!match) return null;
  const seed = Number(match[1]);
  return seed <= 0xffffffff ? seed : null;
}

export function setPendingSeed(seed: number | null): void {
  pendingSeed = seed;
}

// Returns the pending seed once, then forgets it.
export function takePendingSeed(): number | null {
  const seed = pendingSeed;
  pendingSeed = null;
  return seed;
}
