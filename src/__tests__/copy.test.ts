import { en } from '../i18n/en';
import { fr } from '../i18n/fr';
import { typographyProblems } from '../i18n/typography';

// Collects every player-facing string of fr.ts (functions are called with sample arguments).
function strings(node: unknown, out: string[] = []): string[] {
  if (typeof node === 'string') out.push(node);
  else if (typeof node === 'function') {
    for (const n of [0, 1, 2, 47]) out.push(String((node as (...a: unknown[]) => unknown)(n, n === 0 ? 'les deux petits canards' : n)));
  } else if (node && typeof node === 'object') Object.values(node).forEach((v) => strings(v, out));
  return out;
}

describe('French copy (AC-30, AC-34)', () => {
  it('detects a missing no-break space', () => {
    expect(typographyProblems(['Oui ?', 'Oui ?', '« a »', '« a »'])).toHaveLength(2);
  });

  it('fr.ts strings use French typography', () => {
    const texts = strings(fr);
    expect(texts.length).toBeGreaterThan(60);
    expect(typographyProblems(texts)).toEqual([]);
  });

  it('AC-34: singular for 0 and 1, plural from 2', () => {
    expect(fr.check.missing(1)).toBe('Il manque 1 numéro');
    expect(fr.check.missing(2)).toBe('Il manque 2 numéros');
    expect(fr.over.balls(0)).toBe('0 boule tirée');
    expect(fr.over.balls(1)).toBe('1 boule tirée');
    expect(fr.over.balls(5)).toBe('5 boules tirées');
  });

  it('uses tu, never vous', () => {
    const texts = strings(fr).join(' ');
    expect(texts).not.toMatch(/\b(vous|votre|vos)\b/i);
  });
});

describe('check wording follows the stage (AC-40)', () => {
  it('names what is checked and which rows to enter', () => {
    expect(fr.check.title).toEqual({ quine: 'Vérifier une quine', double_quine: 'Vérifier une double quine', carton_plein: 'Vérifier un carton plein' });
    expect(fr.check.need).toEqual({
      quine: 'Saisis seulement la ligne gagnante.',
      double_quine: 'Saisis seulement les 2 lignes gagnantes.',
      carton_plein: 'Saisis les 3 lignes du carton.',
    });
  });
});

describe('English copy (AC-44)', () => {
  it('uses the British bingo stage names', () => {
    expect(en.stage).toEqual({ quine: 'One line', double_quine: 'Two lines', carton_plein: 'Full house' });
    expect(en.check.title.carton_plein).toBe('Check a full house');
  });

  it('singular for 1 only', () => {
    expect(en.check.missing(1)).toBe('1 number missing');
    expect(en.check.missing(2)).toBe('2 numbers missing');
    expect(en.over.balls(0)).toBe('0 balls drawn');
    expect(en.over.balls(1)).toBe('1 ball drawn');
    expect(en.over.balls(5)).toBe('5 balls drawn');
  });

  it('uses English typography: no no-break space, no « » quotes', () => {
    const texts = strings(en);
    expect(texts.filter((t) => /[  «»]/.test(t))).toEqual([]);
  });
});
