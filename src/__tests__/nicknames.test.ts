import fs from 'node:fs';
import path from 'node:path';

import { announcement } from '../game/announce';
import { NICKNAMES } from '../game/nicknames';
import { typographyProblems } from '../i18n/typography';

const NB = ' ';

describe('nicknames (AC-21, AC-23, AC-30, AC-31)', () => {
  it('AC-23: every key is a ball 1-90 and every nickname is non-empty', () => {
    const entries = Object.entries(NICKNAMES);
    expect(entries.length).toBeGreaterThan(15);
    for (const [key, nickname] of entries) {
      const n = Number(key);
      expect(Number.isInteger(n) && n >= 1 && n <= 90).toBe(true);
      expect(nickname.trim().length).toBeGreaterThan(0);
    }
  });

  it('AC-21: plain announcement with nicknames off, nickname with them on', () => {
    expect(announcement(22, false)).toEqual({ spoken: `22${NB}!`, nickname: null });
    expect(announcement(22, true)).toEqual({ spoken: `22, les deux cocottes${NB}!`, nickname: 'les deux cocottes' });
    expect(announcement(47, true)).toEqual({ spoken: `47${NB}!`, nickname: null });
  });

  it('AC-23: the nickname shown equals the spoken one', () => {
    for (let n = 1; n <= 90; n++) {
      const a = announcement(n, true);
      if (a.nickname) expect(a.spoken).toContain(a.nickname);
    }
  });

  it('AC-30: announcements follow French typography', () => {
    const texts = Array.from({ length: 90 }, (_, i) => announcement(i + 1, true).spoken);
    expect(typographyProblems(texts)).toEqual([]);
  });

  it('AC-31: the review sheet lists every nickname', () => {
    const sheet = fs.readFileSync(path.join(__dirname, '../../docs/NICKNAMES.md'), 'utf8');
    for (const [key, nickname] of Object.entries(NICKNAMES)) {
      expect(sheet).toContain(`| ${key} | ${nickname} |`);
    }
  });
});
