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
