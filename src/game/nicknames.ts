// Loto nicknames, family-friendly. Only numbers with a well-known nickname or association have one; the others are
// announced plainly. Draft list, reviewed by the user before release (docs/NICKNAMES.md, AC-31).
export const NICKNAMES: Readonly<Record<number, string>> = {
  2: 'le petit canard',
  3: 'les trois petits cochons',
  4: 'les quatre saisons',
  5: 'les cinq doigts de la main',
  7: 'les sept nains',
  8: 'le bonhomme de neige',
  9: 'tout neuf',
  10: 'les dix doigts',
  11: 'les deux jambes',
  12: 'la douzaine',
  13: 'le porte-bonheur',
  14: 'la fête nationale',
  18: 'la majorité',
  20: 'vingt sur vingt',
  22: 'les deux cocottes',
  24: 'les heures de la journée',
  25: 'Noël',
  31: 'le réveillon',
  33: "l'âge du Christ",
  36: 'les trente-six chandelles',
  40: 'la quarantaine',
  44: 'les deux chaises',
  77: 'les deux drapeaux',
  80: 'le tour du monde',
  88: 'les deux bonshommes de neige',
  89: 'la Révolution',
  90: 'le pépé',
};

export function nicknameOf(ball: number): string | null {
  return NICKNAMES[ball] ?? null;
}
