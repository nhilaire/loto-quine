import fs from 'node:fs';
import path from 'node:path';

import { announcement } from '../game/announce';
import { CALLS_EN, NICKNAMES, SPOKEN_NICKNAMES } from '../game/nicknames';
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
    expect(announcement(22, true)).toEqual({ spoken: `22, les deux petits canards${NB}!`, nickname: 'les deux petits canards' });
    expect(announcement(46, true)).toEqual({ spoken: `46${NB}!`, nickname: null });
  });

  it('AC-23: the nickname shown equals the spoken one, except the documented pronunciation fixes', () => {
    for (let n = 1; n <= 90; n++) {
      const a = announcement(n, true);
      if (a.nickname) expect(a.spoken).toContain(SPOKEN_NICKNAMES[n] ?? a.nickname);
    }
    expect(Object.keys(SPOKEN_NICKNAMES).every((k) => NICKNAMES[Number(k)] !== undefined)).toBe(true);
  });

  it('AC-23: 67 is shown « six-seven » and spoken « sixe sévène » (French voice, phone test 2026-10-14)', () => {
    expect(announcement(67, true)).toEqual({ spoken: `67, sixe sévène${NB}!`, nickname: 'six-seven' });
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

describe('English bingo calls (AC-23, AC-31, AC-44)', () => {
  it('every key is a ball 1-90 and every call is non-empty', () => {
    const entries = Object.entries(CALLS_EN);
    expect(entries.length).toBeGreaterThan(50);
    for (const [key, call] of entries) {
      const n = Number(key);
      expect(Number.isInteger(n) && n >= 1 && n <= 90).toBe(true);
      expect(call.trim().length).toBeGreaterThan(0);
    }
  });

  it('the call comes first, then the number; numbers without a call are announced plainly', () => {
    expect(announcement(1, true, 'en')).toEqual({ spoken: "Kelly's eye, 1!", nickname: "Kelly's eye" });
    expect(announcement(90, true, 'en')).toEqual({ spoken: 'top of the shop, 90!', nickname: 'top of the shop' });
    expect(announcement(88, true, 'en')).toEqual({ spoken: '88!', nickname: null });
    expect(announcement(11, false, 'en')).toEqual({ spoken: '11!', nickname: null });
  });

  it('the review sheet lists every call', () => {
    const sheet = fs.readFileSync(path.join(__dirname, '../../docs/NICKNAMES.md'), 'utf8');
    for (const [key, call] of Object.entries(CALLS_EN)) {
      expect(sheet).toContain(`| ${key} | ${call} |`);
    }
  });
});
