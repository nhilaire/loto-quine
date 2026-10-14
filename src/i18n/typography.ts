// French typography checks used by tests (AC-30): no-break space before ? ! : ; and inside « », … not ...
const NB = '[  ]';

export function typographyProblems(texts: readonly string[]): string[] {
  const p: string[] = [];
  for (const t of texts) {
    if (/(^|[^  ])[?!:;]/.test(t)) p.push(`missing no-break space before ? ! : ; in "${t}"`);
    if (new RegExp(`«(?!${NB})`).test(t) || new RegExp(`(?<!${NB})»`).test(t)) p.push(`missing no-break space inside « » in "${t}"`);
    if (t.includes('...')) p.push(`use … instead of ... in "${t}"`);
  }
  return p;
}
