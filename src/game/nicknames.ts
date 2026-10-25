import type { Language } from '../i18n';

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

// What the French voice reads when the shown nickname would be mispronounced (phone test 2026-10-14: the voice read
// « six » the French way). Keys must also be in NICKNAMES.
export const SPOKEN_NICKNAMES: Readonly<Record<number, string>> = {
  67: 'sixe sévène',
};

// English (v0.2.0): traditional British bingo calls given by two sources, family-friendly only (docs/NICKNAMES.md,
// approved by the user on 2026-10-25).
export const CALLS_EN: Readonly<Record<number, string>> = {
  1: "Kelly's eye",
  2: 'one little duck',
  3: 'cup of tea',
  4: 'knock at the door',
  5: 'man alive',
  6: 'half a dozen',
  7: 'lucky seven',
  8: 'garden gate',
  9: "doctor's orders",
  11: 'legs eleven',
  12: 'one dozen',
  13: 'unlucky for some',
  14: "Valentine's Day",
  15: 'young and keen',
  16: 'sweet sixteen',
  17: 'dancing queen',
  18: 'coming of age',
  19: 'goodbye teens',
  20: 'one score',
  21: 'key of the door',
  22: 'two little ducks',
  23: 'thee and me',
  24: 'two dozen',
  25: 'duck and dive',
  26: 'pick and mix',
  27: 'gateway to heaven',
  29: 'rise and shine',
  31: 'get up and run',
  32: 'buckle my shoe',
  34: 'ask for more',
  35: 'jump and jive',
  36: 'three dozen',
  37: 'more than eleven',
  38: 'Christmas cake',
  39: 'all the steps',
  41: 'time for fun',
  43: 'down on your knees',
  44: 'all the fours',
  45: 'halfway there',
  46: 'up to tricks',
  47: 'four and seven',
  48: 'four dozen',
  50: 'half a century',
  51: 'tweak of the thumb',
  53: 'stuck in the tree',
  54: 'clean the floor',
  55: 'snakes alive',
  58: 'make them wait',
  59: 'Brighton line',
  60: 'five dozen',
  61: "baker's bun",
  62: 'turn the screw',
  63: 'tickle me',
  64: 'red raw',
  65: 'old age pension',
  66: 'clickety click',
  67: 'made in heaven',
  68: 'saving grace',
  70: 'three score and ten',
  71: 'bang on the drum',
  72: 'six dozen',
  73: 'queen bee',
  74: 'candy store',
  75: 'strive and strive',
  76: 'trombones',
  78: "heaven's gate",
  79: 'one more time',
  80: 'eight and blank',
  81: 'stop and run',
  82: 'straight on through',
  83: 'time for tea',
  85: 'staying alive',
  86: 'between the sticks',
  89: 'nearly there',
  90: 'top of the shop',
};

type Nicknames = { shown: Readonly<Record<number, string>>; spoken: Readonly<Record<number, string>> };

export const NICKNAMES_BY_LANGUAGE: Record<Language, Nicknames> = {
  fr: { shown: NICKNAMES, spoken: SPOKEN_NICKNAMES },
  en: { shown: CALLS_EN, spoken: {} },
};

export function nicknameOf(ball: number, language: Language = 'fr'): string | null {
  return NICKNAMES_BY_LANGUAGE[language].shown[ball] ?? null;
}

// What the voice reads for this nickname (a pronunciation fix, or the nickname itself).
export function spokenNicknameOf(ball: number, language: Language = 'fr'): string | null {
  const { shown, spoken } = NICKNAMES_BY_LANGUAGE[language];
  return spoken[ball] ?? shown[ball] ?? null;
}
