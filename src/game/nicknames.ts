// Traditional loto nicknames (« annonces » of the caller), family-friendly. Only nicknames confirmed by at least two
// independent sources are kept (docs/NICKNAMES.md); other numbers are announced plainly. Approved by the user on
// 2026-10-14 (AC-31).
export const NICKNAMES: Readonly<Record<number, string>> = {
  1: 'le petit',
  2: 'ils font la paire',
  4: 'la chaise',
  5: 'la pleine main',
  6: 'le facteur part en tournée',
  7: 'la semaine',
  8: 'la cacahuète',
  9: 'le facteur revient de tournée',
  10: 'disputez-vous',
  11: 'les jambes de ma grand-mère',
  12: 'lève la blouse',
  14: "l'homme fort",
  18: 'la majorité',
  20: 'sans eau',
  21: "l'ancienne majorité",
  22: 'les deux petits canards',
  25: 'Noël',
  29: 'les chapeaux ronds',
  31: 'les violettes',
  33: "l'âge du Christ",
  36: 'les chandelles',
  37: 'la bonne température',
  45: 'la moitié du jeu',
  47: 'les pruneaux',
  65: 'les miracles',
  67: 'six-seven',
  80: 'dans un coin',
  87: 'la porcelaine',
  88: 'les deux cacahuètes',
  89: 'la mamé',
  90: 'le papé',
};

export function nicknameOf(ball: number): string | null {
  return NICKNAMES[ball] ?? null;
}
