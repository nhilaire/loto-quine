// English translation of fr.ts (same keys, enforced by the Strings type). Tone: neutral « you ». British bingo
// vocabulary (one line, two lines, full house). English typography: no space before ": ! ?", “quotes”.
import type { Strings } from './types';

// English plural rule: singular for 1 only.
function plural(n: number, one: string, other: string): string {
  return n === 1 ? one : other;
}

export const en: Strings = {
  locale: 'en-GB',
  consent: {
    title: 'Anonymous statistics',
    body:
      'To improve the app, Loto Quine can send anonymous statistics (games played, stages won, crashes). ' +
      'No personal data. You can change your mind in the settings.',
    accept: 'Accept',
    refuse: 'Decline',
  },
  home: {
    pitch: 'Your bingo caller in your pocket!',
    newGame: 'New game',
    resume: 'Resume game',
    rules: 'Rules',
    settings: 'Settings',
    about: 'About',
  },
  about: {
    title: 'About',
    storyTitle: 'The story of this game',
    story: [
      'As a child, I sometimes went to the loto night at my school: the packed hall, the cards, the counters, the ' +
        'caller announcing each ball with its nickname, and that little silence before someone shouted “Quine!”. ' +
        'I wanted to bring that atmosphere back home, to play as a family with my children, without a ball cage or a bag of balls.',
    ],
    authorTitle: 'A word from the author',
    author: [
      'This game does not come from a studio: I imagined and programmed it in my free time, as a passionate developer, without pretension.',
      'So it is far from perfect and probably not free of bugs. If a ball misbehaves or the voice mangles a call, ' +
        'thank you in advance for your patience. Above all: enjoy the game!',
    ],
    dataTitle: 'Your data',
    data: [
      'No account, no ads. Anonymous statistics (games played, stages won, crashes) are only sent if you agreed. ' +
        'You can change your mind in the settings.',
    ],
    version: (version: string) => `Version ${version}`,
    back: 'Back',
  },
  stage: {
    quine: 'One line',
    double_quine: 'Two lines',
    carton_plein: 'Full house',
  },
  game: {
    counter: (n: number) => `Ball no. ${n}`,
    noBall: 'Tap the ball to start',
    draw: 'Draw a ball',
    lastBalls: 'Last balls',
    allOut: 'All the balls are out',
    check: 'Check',
    end: 'End the game',
    endConfirm: 'End the game?',
    replaceConfirm: 'A game is in progress. Start a new one?',
    ballLabel: (n: number) => `Ball ${n}`,
  },
  common: {
    yes: 'Yes',
    no: 'No',
    back: 'Back',
    home: 'Home',
  },
  check: {
    title: {
      quine: 'Check one line',
      double_quine: 'Check two lines',
      carton_plein: 'Check a full house',
    },
    need: {
      quine: 'Enter only the winning line.',
      double_quine: 'Enter only the 2 winning lines.',
      carton_plein: 'Enter the 3 lines of the card.',
    },
    next: 'Next',
    erase: 'Erase',
    verify: 'Check',
    drawn: 'out',
    missingNumber: 'missing',
    win: 'Winner!',
    notYet: 'Not yet…',
    missing: (n: number) => plural(n, `${n} number missing`, `${n} numbers missing`),
    rowLabel: (row: number) => `Line ${row}`,
    validate: 'Confirm the winner',
    errorRange: 'Number between 1 and 90',
    errorDuplicate: 'Duplicate number',
    errorIncomplete: 'Incomplete line',
    errorEmpty: 'Enter at least one line',
  },
  win: {
    title: 'Well done!',
    continue: 'Continue the draw',
    newDraw: 'New draw',
  },
  tie: {
    open: 'Break the tie',
    title: 'Break the tie',
    count: 'Number of winners',
    player: (k: number) => `Player ${k}`,
    draw: 'Draw',
    winner: (k: number, n: number) => `Player ${k} wins with ${n}!`,
  },
  over: {
    completed: 'Game over!',
    stopped: 'Game stopped',
    balls: (n: number) => plural(n, `${n} ball drawn`, `${n} balls drawn`),
    duration: (n: number) => `Duration: ${n} min`,
  },
  rules: {
    title: 'Rules',
    body: [
      'Each player has one or more cards of 3 lines of 5 numbers. When a number is called, mark it on your card.',
      'One line: the first player to complete a line shouts “Line!”.',
      'Two lines: two complete lines.',
      'Full house: all three lines.',
      'The caller checks with “Check one line” (then two lines, full house): only the winning lines are entered. ' +
        'If several players win on the same ball, each one draws a number: the highest wins.',
    ],
  },
  settings: {
    title: 'Settings',
    voice: 'Voice',
    voiceHelp: 'Calls out each ball aloud.',
    nicknames: 'Bingo calls',
    nicknamesHelp: 'Adds the traditional call for the number.',
    sounds: 'Sounds',
    vibrations: 'Vibrations',
    stats: 'Anonymous statistics',
    statsHelp: 'Helps fix bugs and improve the app. No personal data.',
    language: 'Language',
    languageAuto: 'Automatic (phone language)',
    back: 'Back',
  },
  voice: {
    plain: (n: number) => `${n}!`,
    // British callers say the call first, then the number.
    nickname: (n: number, nickname: string) => `${nickname}, ${n}!`,
  },
  errors: {
    title: 'Oops',
    body: 'Something went wrong. Restart the app.',
    retry: 'Try again',
  },
};
