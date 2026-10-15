// Maestro flows (.maestro/*.yaml), generated from one place so that the seeded ball values stay consistent.
// The engine is deterministic: with seed 42 the first balls are SEED_42_BALLS; a Jest test (e2e-flows.test.ts)
// recomputes them from the engine and checks every flow file for drift.
//   node scripts/flows.mjs          writes the flows
//   node scripts/flows.mjs --check  exits 1 if a flow file differs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SEED = 42;
export const SEED_42_BALLS = [55, 40, 78, 61, 16, 47];
const [B1, B2, B3, B4, B5, B6] = SEED_42_BALLS;
const WIN_ROW = [B1, B2, B3, B4, B5];
const NOT_YET_ROW = [B1, B2, B3, B4, B6];

const APP = 'appId: io.github.nhilaire.lotoquine';
// French typography in the app: no-break space before ! ? : (the flows must match the exact text).
const nb = (text) => text.replace(/ ([!?:])/g, ' $1');
const tap = (id) => [`- tapOn:`, `    id: "${id}"`];
const seeId = (id, extra = {}) => [`- assertVisible:`, `    id: "${id}"`, ...Object.entries(extra).map(([k, v]) => `    ${k}: ${typeof v === 'string' ? `"${nb(v)}"` : v}`)];
const see = (text) => [`- assertVisible: "${nb(text)}"`];
const shot = (name) => [`- takeScreenshot: ${name}`];
const waitId = (id) => [`- extendedWaitUntil:`, `    visible:`, `      id: "${id}"`, `    timeout: 20000`];

const fresh = () => [`- launchApp:`, `    clearState: true`, ...waitId('consent-screen')];
const start = (consent = 'refuse', drawn = 0) => [
  ...fresh(),
  // The link must come after the first screen: opened earlier it reaches the app before its listener.
  `- openLink: "lotoquine://seed/${SEED}${drawn ? `/drawn/${drawn}` : ''}"`,
  ...tap(`consent-${consent}`),
  ...tap('home-new-game'),
  ...see('Touche la boule pour commencer'),
];
const draw = (n) => [...tap('game-draw'), `- extendedWaitUntil:`, `    visible: "Boule n°${n}"`, `    timeout: 5000`];
const draws = (count) => Array.from({ length: count }, (_, i) => draw(i + 1)).flat();
const typeRow = (numbers) =>
  numbers.flatMap((n) => [...String(n)].flatMap((d) => tap(`key-${d}`)).concat(n < 10 ? tap('key-next') : []));
const winRow = () => [...tap('game-check'), ...seeId('check-title', { text: 'Vérifier une quine' }),
  ...see('Saisis seulement la ligne gagnante.'), ...typeRow(WIN_ROW), ...tap('check-verify'), ...see('Gagné !')];

function flow(name, tags, steps) {
  return [APP, `name: ${name}`, 'tags:', ...tags.map((t) => `  - ${t}`), '---', ...steps].join('\n') + '\n';
}

export const FLOWS = {
  'smoke.yaml': flow('Smoke - consent in French, refuse, no consent screen after a restart (AC-01, AC-02)', ['smoke'], [
    ...fresh(),
    ...see('Statistiques anonymes'),
    ...see('Accepter'),
    ...see('Refuser'),
    ...shot('01-consent'),
    ...tap('consent-refuse'),
    ...seeId('home-screen'),
    ...see('Nouvelle partie'),
    ...shot('02-home'),
    '- stopApp',
    '- launchApp',
    ...waitId('home-screen'),
    '- assertNotVisible:',
    '    id: "consent-screen"',
  ]),
  'draw-resume.yaml': flow('Draw three balls, then resume after the app is killed (AC-13, AC-14)', ['e2e'], [
    ...start(),
    ...shot('10-game-start'),
    ...draws(3),
    ...seeId('game-stage', { text: 'Quine' }),
    ...see(`Boule ${B3}`),
    ...seeId(`board-cell-${B1}`, { selected: true }),
    ...seeId(`board-cell-${B2}`, { selected: true }),
    ...seeId(`board-cell-${B3}`, { selected: true }),
    ...seeId(`board-cell-${B4}`, { selected: false }),
    ...shot('11-three-balls'),
    '- stopApp',
    '- launchApp',
    ...waitId('game-screen'),
    ...see('Boule n°3'),
    ...see(`Boule ${B3}`),
    ...seeId(`board-cell-${B3}`, { selected: true }),
    ...shot('12-resumed'),
  ]),
  'check-win-continue.yaml': flow('Check a winning row, validate, continue the draw at double quine (AC-15)', ['e2e'], [
    ...start(),
    ...draws(5),
    ...winRow(),
    ...shot('20-check-win'),
    ...tap('check-validate'),
    ...see('Continuer le tirage'),
    ...shot('21-win-choice'),
    ...tap('win-continue'),
    ...seeId('game-stage', { text: 'Double quine' }),
    ...see('Boule n°5'),
    ...shot('22-double-quine'),
  ]),
  'check-not-yet.yaml': flow('A row with an undrawn number is not yet a win (AC-16)', ['e2e'], [
    ...start(),
    ...draws(5),
    ...tap('game-check'),
    ...typeRow(NOT_YET_ROW),
    ...tap('check-verify'),
    ...see('Pas encore…'),
    ...see('Il manque 1 numéro'),
    ...shot('30-check-not-yet'),
    ...tap('check-back'),
    ...see('Boule n°5'),
    ...seeId('game-stage', { text: 'Quine' }),
  ]),
  'new-draw.yaml': flow('New draw after a quine clears the board (AC-17)', ['e2e'], [
    ...start(),
    ...draws(5),
    ...winRow(),
    ...tap('check-validate'),
    ...tap('win-new-draw'),
    ...seeId('game-stage', { text: 'Double quine' }),
    ...see('Touche la boule pour commencer'),
    ...seeId(`board-cell-${B1}`, { selected: false }),
    ...shot('40-new-draw'),
  ]),
  'stop.yaml': flow('End the game, then Home has nothing to resume (AC-18)', ['e2e'], [
    ...start(),
    ...draws(2),
    ...tap('game-end'),
    ...see('Terminer la partie ?'),
    ...tap('confirm-yes'),
    ...see('Partie arrêtée'),
    ...see('2 boules tirées'),
    ...shot('50-stopped'),
    ...tap('over-home'),
    ...seeId('home-screen'),
    '- assertNotVisible: "Reprendre la partie"',
  ]),
  'replace-confirm.yaml': flow('Starting a new game while one is in progress asks first (AC-19)', ['e2e'], [
    ...start(),
    ...draws(1),
    ...tap('game-home'),
    ...see('Reprendre la partie'),
    ...tap('home-new-game'),
    ...see('Une partie est en cours. En commencer une nouvelle ?'),
    ...shot('60-replace-confirm'),
    ...tap('confirm-no'),
    ...tap('home-resume'),
    ...see('Boule n°1'),
  ]),
  'settings.yaml': flow('Settings persist after a restart (AC-20)', ['e2e'], [
    ...fresh(),
    ...tap('consent-accept'),
    ...tap('home-settings'),
    ...seeId('settings-voice', { checked: true }),
    ...shot('70-settings-on'),
    ...['voice', 'nicknames', 'sounds', 'vibrations', 'stats'].flatMap((k) => tap(`settings-${k}`)),
    ...shot('71-settings-off'),
    '- stopApp',
    '- launchApp',
    ...waitId('home-screen'),
    ...tap('home-settings'),
    ...['voice', 'nicknames', 'sounds', 'vibrations', 'stats'].flatMap((k) => seeId(`settings-${k}`, { checked: false })),
  ]),
  'rules.yaml': flow('Rules page explains the three stages (AC-24)', ['e2e'], [
    ...fresh(),
    ...tap('consent-refuse'),
    ...tap('home-rules'),
    ...see('Quine : le premier à compléter une ligne.*'),
    ...see('Double quine : deux lignes complètes.'),
    ...see('Carton plein : les trois lignes.'),
    ...shot('80-rules'),
  ]),
  'about.yaml': flow('About screen tells the story, the word from the author and the version (AC-41)', ['e2e'], [
    ...fresh(),
    ...tap('consent-refuse'),
    ...tap('home-about'),
    ...seeId('about-screen'),
    ...see("L'histoire de ce jeu"),
    ...see('.*loto de l.école.*'),
    ...see("Un mot de l'auteur"),
    ...shot('85-about'),
    '- scrollUntilVisible:',
    '    element: "Version 0.1.1"',
    '    timeout: 20000',
    ...see('Version 0.1.1'),
    ...shot('86-about-end'),
    ...tap('about-back'),
    ...seeId('home-screen'),
  ]),
  'all-balls.yaml': flow('Draw all 90 balls, drawing disabled, a card can still be checked (AC-37)', ['e2e'], [
    // The game starts with 88 balls drawn by the engine (testing aid), the last 2 are drawn by hand.
    ...start('refuse', 88).filter((l) => !l.includes('Touche la boule')),
    ...see('Boule n°88'),
    ...draw(89),
    ...draw(90),
    ...see('Toutes les boules sont sorties'),
    ...see('Boule n°90'),
    ...seeId('game-draw', { enabled: false }),
    ...shot('90-all-balls'),
    ...tap('game-check'),
    ...seeId('check-screen'),
  ]),
  'tie-break.yaml': flow('Tie-break between two winners, then validate (AC-39)', ['e2e'], [
    ...start(),
    ...draws(5),
    ...winRow(),
    ...tap('check-tie'),
    ...seeId('tie-count', { text: '2' }),
    ...tap('tie-draw-1'),
    ...tap('tie-draw-2'),
    ...seeId('tie-winner', { text: 'Le joueur [12] gagne avec le [0-9]+ !' }),
    ...shot('95-tie-break'),
    ...tap('tie-validate'),
    ...see('Continuer le tirage'),
  ]),
  'telemetry-consent.yaml': flow(
    'Telemetry - accept consent, win a quine, end the game - events checked in logcat by verify.mjs (AC-27)',
    ['telemetry'],
    [
      ...start('accept'),
      ...draws(5),
      ...winRow(),
      ...tap('check-validate'),
      ...tap('win-continue'),
      ...tap('game-end'),
      ...tap('confirm-yes'),
      ...see('Partie arrêtée'),
      ...shot('telemetry-game-over'),
    ],
  ),
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = path.join(ROOT, '.maestro');
  const check = process.argv.includes('--check');
  let drift = false;
  for (const [file, text] of Object.entries(FLOWS)) {
    const target = path.join(dir, file);
    if (check) {
      if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== text) {
        console.error(`drift: .maestro/${file}`);
        drift = true;
      }
    } else fs.writeFileSync(target, text);
  }
  if (check) process.exit(drift ? 1 : 0);
  console.log(`wrote ${Object.keys(FLOWS).length} flows in .maestro/`);
}
