import AsyncStorage from '@react-native-async-storage/async-storage';
import { logEvent } from '@react-native-firebase/analytics';
import { recordError } from '@react-native-firebase/crashlytics';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useKeepAwake } from 'expo-keep-awake';

import App from '../App';
import { setPendingStart } from '../app/testSeed';
import { Feedback, setFeedback } from '../audio/feedback';
import { BALL_COUNT, drawBall, emptyDraw } from '../game/draw';
import { seedFrom } from '../game/random';
import { tieBreakNumbers, tieBreakWinner } from '../game/tieBreak';
import { newGame } from '../game/game';

const NB = ' ';

function sequence(seed: number, count: number): number[] {
  let draw = emptyDraw();
  let rng = seedFrom(seed);
  for (let i = 0; i < count; i++) {
    const r = drawBall(draw, rng)!;
    draw = r.draw;
    rng = r.rng;
  }
  return [...draw];
}

const SEED = 42;
const BALLS = sequence(SEED, BALL_COUNT);
const UNDRAWN_AFTER_5 = BALLS[10];

async function start(consent: 'granted' | 'denied' = 'denied', drawn = 0) {
  await AsyncStorage.setItem('telemetry.consent.v1', consent);
  setPendingStart({ seed: SEED, drawn });
  const view = await render(<App />);
  await fireEvent.press(await screen.findByTestId('home-new-game'));
  return view;
}

async function drawBalls(count: number) {
  for (let i = 0; i < count; i++) {
    await fireEvent.press(screen.getByTestId('game-draw'));
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
  }
}

async function typeNumber(n: number) {
  for (const d of String(n)) await fireEvent.press(screen.getByTestId(`key-${d}`));
  if (n < 10) await fireEvent.press(screen.getByTestId('key-next'));
}

async function enterRow(numbers: number[]) {
  for (const n of numbers) await typeNumber(n);
}

const selected = (n: number) => screen.getByTestId(`board-cell-${n}`).props.accessibilityState?.selected;

// Fake timers drive the 1 s ball roll. Do not switch back to real timers in afterEach: the library cleanup
// (unmount) runs after it and hangs with pending animation frames.
jest.setTimeout(30000);

describe('screens and navigation', () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it('AC-13: three draws show the stage, the counter, the last ball and the board', async () => {
    await start();
    expect(screen.getByText('Touche la boule pour commencer')).toBeTruthy();
    await drawBalls(3);
    expect(screen.getByTestId('game-stage')).toHaveTextContent('Quine');
    expect(screen.getByTestId('game-counter')).toHaveTextContent('Boule n°3');
    expect(screen.getByTestId('game-ball').props.accessibilityLabel).toBe(`Boule ${BALLS[2]}`);
    for (const n of BALLS.slice(0, 3)) expect(selected(n)).toBe(true);
    expect(selected(BALLS[3])).toBe(false);
  });

  it('AC-06: the draw button is disabled while the ball rolls', async () => {
    await start();
    await fireEvent.press(screen.getByTestId('game-draw'));
    expect(screen.getByTestId('game-draw').props.accessibilityState.disabled).toBe(true);
    await fireEvent.press(screen.getByTestId('game-draw'));
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('game-counter')).toHaveTextContent('Boule n°1');
  });

  it('AC-14: a relaunch reopens the game exactly where it was', async () => {
    const first = await start();
    await drawBalls(3);
    await first.unmount();
    await render(<App />);
    expect(await screen.findByTestId('game-screen')).toBeTruthy();
    expect(screen.getByTestId('game-counter')).toHaveTextContent('Boule n°3');
    expect(screen.getByTestId('game-ball').props.accessibilityLabel).toBe(`Boule ${BALLS[2]}`);
    for (const n of BALLS.slice(0, 3)) expect(selected(n)).toBe(true);
  });

  it('AC-15: a winning row is validated, then the draw continues at double quine', async () => {
    await start();
    await drawBalls(5);
    await fireEvent.press(screen.getByTestId('game-check'));
    expect(screen.getByTestId('check-title')).toHaveTextContent('Vérifier une quine');
    expect(screen.getByText('Saisis seulement la ligne gagnante.')).toBeTruthy();
    await enterRow(BALLS.slice(0, 5));
    await fireEvent.press(screen.getByTestId('check-verify'));
    expect(screen.getByTestId('check-verdict')).toHaveTextContent(`Gagné${NB}!`);
    await fireEvent.press(screen.getByTestId('check-validate'));
    expect(screen.getByText('Continuer le tirage')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('win-continue'));
    expect(screen.getByTestId('game-stage')).toHaveTextContent('Double quine');
    expect(screen.getByTestId('game-counter')).toHaveTextContent('Boule n°5');
    expect(screen.getByText('Vérifier une double quine')).toBeTruthy();
  });

  it('AC-16: a row with an undrawn number is not yet a win, Retour changes nothing', async () => {
    await start();
    await drawBalls(5);
    await fireEvent.press(screen.getByTestId('game-check'));
    await enterRow([...BALLS.slice(0, 4), UNDRAWN_AFTER_5]);
    await fireEvent.press(screen.getByTestId('check-verify'));
    expect(screen.getByText('Pas encore…')).toBeTruthy();
    expect(screen.getByText('Il manque 1 numéro')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('check-back'));
    expect(screen.getByTestId('game-counter')).toHaveTextContent('Boule n°5');
    expect(screen.getByTestId('game-stage')).toHaveTextContent('Quine');
  });

  it('AC-08: entry errors are shown in French', async () => {
    await start();
    await drawBalls(1);
    await fireEvent.press(screen.getByTestId('game-check'));
    await fireEvent.press(screen.getByTestId('check-verify'));
    expect(screen.getByText('Saisis au moins une ligne')).toBeTruthy();
    await enterRow([95, 12]);
    await fireEvent.press(screen.getByTestId('check-verify'));
    expect(screen.getByText('Numéro entre 1 et 90')).toBeTruthy();
    expect(screen.getByText('Ligne incomplète')).toBeTruthy();
  });

  it('AC-17: a new draw after the quine clears the board', async () => {
    await start();
    await drawBalls(5);
    await fireEvent.press(screen.getByTestId('game-check'));
    await enterRow(BALLS.slice(0, 5));
    await fireEvent.press(screen.getByTestId('check-verify'));
    await fireEvent.press(screen.getByTestId('check-validate'));
    await fireEvent.press(screen.getByTestId('win-new-draw'));
    expect(screen.getByTestId('game-stage')).toHaveTextContent('Double quine');
    expect(screen.getByText('Touche la boule pour commencer')).toBeTruthy();
    for (const n of BALLS.slice(0, 5)) expect(selected(n)).toBe(false);
  });

  it('AC-18: ending the game shows « Partie arrêtée » and Home has nothing to resume', async () => {
    await start();
    await drawBalls(2);
    await fireEvent.press(screen.getByTestId('game-end'));
    expect(screen.getByText(`Terminer la partie${NB}?`)).toBeTruthy();
    await fireEvent.press(screen.getByTestId('confirm-yes'));
    expect(screen.getByText('Partie arrêtée')).toBeTruthy();
    expect(screen.getByText('2 boules tirées')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('over-home'));
    expect(screen.queryByText('Reprendre la partie')).toBeNull();
  });

  it('AC-19: starting a new game while one is in progress asks first', async () => {
    await start();
    await drawBalls(1);
    await fireEvent.press(screen.getByTestId('game-home'));
    expect(screen.getByText('Reprendre la partie')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('home-new-game'));
    expect(screen.getByText(`Une partie est en cours. En commencer une nouvelle${NB}?`)).toBeTruthy();
    await fireEvent.press(screen.getByTestId('confirm-no'));
    await fireEvent.press(screen.getByTestId('home-resume'));
    expect(screen.getByTestId('game-counter')).toHaveTextContent('Boule n°1');
  });

  it('AC-24: the rules page explains the three stages', async () => {
    await AsyncStorage.setItem('telemetry.consent.v1', 'denied');
    await render(<App />);
    await fireEvent.press(await screen.findByTestId('home-rules'));
    expect(screen.getByText(`Quine${NB}: le premier à compléter une ligne crie «${NB}Quine${NB}!${NB}».`)).toBeTruthy();
    expect(screen.getByText(`Double quine${NB}: deux lignes complètes.`)).toBeTruthy();
    expect(screen.getByText(`Carton plein${NB}: les trois lignes.`)).toBeTruthy();
  });

  it('AC-37: after 90 balls drawing is disabled and a card can still be checked', async () => {
    await start('denied', 88);
    expect(screen.getByTestId('game-counter')).toHaveTextContent('Boule n°88');
    await drawBalls(2);
    expect(screen.getByText('Toutes les boules sont sorties')).toBeTruthy();
    expect(screen.getByTestId('game-draw').props.accessibilityState.disabled).toBe(true);
    await fireEvent.press(screen.getByTestId('game-check'));
    expect(screen.getByTestId('check-screen')).toBeTruthy();
  });

  it('AC-39: the tie-break names the player with the highest number, then the win is validated', async () => {
    await start();
    await drawBalls(5);
    await fireEvent.press(screen.getByTestId('game-check'));
    await enterRow(BALLS.slice(0, 5));
    await fireEvent.press(screen.getByTestId('check-verify'));
    await fireEvent.press(screen.getByTestId('check-tie'));
    expect(screen.getByTestId('tie-count')).toHaveTextContent('2');
    await fireEvent.press(screen.getByTestId('tie-draw-1'));
    await fireEvent.press(screen.getByTestId('tie-draw-2'));
    const state = { ...newGame(seedFrom(SEED), 0), draw: BALLS.slice(0, 5) };
    // The tie-break seed depends on the generator state after 5 draws: rebuild it the same way as the app.
    let rng = seedFrom(SEED);
    let draw = emptyDraw();
    for (let i = 0; i < 5; i++) ({ draw, rng } = drawBall(draw, rng)!);
    const numbers = tieBreakNumbers({ ...state, rng }, 2);
    const w = tieBreakWinner(numbers);
    expect(screen.getByTestId('tie-winner')).toHaveTextContent(`Le joueur ${w + 1} gagne avec le ${numbers[w]}${NB}!`);
    await fireEvent.press(screen.getByTestId('tie-validate'));
    expect(screen.getByText('Continuer le tirage')).toBeTruthy();
  });

  it('AC-36: the screen is kept awake on Game and Check', async () => {
    await start();
    expect(useKeepAwake).toHaveBeenCalled();
    (useKeepAwake as jest.Mock).mockClear();
    await fireEvent.press(screen.getByTestId('game-check'));
    expect(useKeepAwake).toHaveBeenCalled();
  });

  it('AC-25: game_start, stage_won and game_end are logged after consent', async () => {
    await start('granted');
    await drawBalls(5);
    await fireEvent.press(screen.getByTestId('game-check'));
    await enterRow(BALLS.slice(0, 5));
    await fireEvent.press(screen.getByTestId('check-verify'));
    await fireEvent.press(screen.getByTestId('check-validate'));
    await fireEvent.press(screen.getByTestId('win-continue'));
    await fireEvent.press(screen.getByTestId('game-end'));
    await fireEvent.press(screen.getByTestId('confirm-yes'));
    const names = (logEvent as jest.Mock).mock.calls.map((c) => [c[1], c[2]]);
    expect(names).toEqual([
      ['game_start', {}],
      ['stage_won', { stage: 'quine', balls: 5, choice: 'continue' }],
      ['game_end', { result: 'stopped', stage: 'double_quine', duration_min: 0 }],
    ]);
  });

  it('AC-26: nothing is logged when consent is refused', async () => {
    await start('denied');
    await drawBalls(2);
    await fireEvent.press(screen.getByTestId('game-end'));
    await fireEvent.press(screen.getByTestId('confirm-yes'));
    expect(logEvent).not.toHaveBeenCalled();
  });

  it('AC-08: a duplicate and an out-of-range number are shown in French, with no verdict', async () => {
    await start();
    await drawBalls(1);
    await fireEvent.press(screen.getByTestId('game-check'));
    await enterRow([55, 55, 40, 78, 61]);
    await fireEvent.press(screen.getByTestId('check-verify'));
    expect(screen.getByText('Numéro en double')).toBeTruthy();
    expect(screen.queryByTestId('check-verdict')).toBeNull();
    await fireEvent.press(screen.getByTestId('check-back'));
    await fireEvent.press(screen.getByTestId('game-check'));
    for (const d of ['0', '0']) await fireEvent.press(screen.getByTestId(`key-${d}`));
    await enterRow([40, 78, 61, 16]);
    await fireEvent.press(screen.getByTestId('check-verify'));
    expect(screen.getByText('Numéro entre 1 et 90')).toBeTruthy();
    expect(screen.queryByTestId('check-verdict')).toBeNull();
  });

  it('AC-14: the restored ball is not announced again', async () => {
    const spoken: string[] = [];
    const recorder: Feedback = { speak: (t) => spoken.push(t), stopSpeech: () => {}, sound: () => {}, haptic: () => {} };
    setFeedback(recorder);
    try {
      const first = await start();
      await drawBalls(3);
      expect(spoken).toHaveLength(3);
      await first.unmount();
      await render(<App />);
      expect(await screen.findByTestId('game-screen')).toBeTruthy();
      await act(async () => {
        jest.advanceTimersByTime(3000);
      });
      expect(spoken).toHaveLength(3);
    } finally {
      setFeedback(null);
    }
  });

  it('AC-26: nothing is logged once statistics are turned off in the settings', async () => {
    await AsyncStorage.setItem('telemetry.consent.v1', 'granted');
    setPendingStart({ seed: SEED, drawn: 0 });
    await render(<App />);
    await fireEvent.press(await screen.findByTestId('home-settings'));
    await fireEvent(screen.getByTestId('settings-stats'), 'valueChange', false);
    await fireEvent.press(screen.getByTestId('settings-back'));
    (logEvent as jest.Mock).mockClear();
    await fireEvent.press(screen.getByTestId('home-new-game'));
    await drawBalls(2);
    await fireEvent.press(screen.getByTestId('game-end'));
    await fireEvent.press(screen.getByTestId('confirm-yes'));
    expect(logEvent).not.toHaveBeenCalled();
  });

  it('AC-33: Android back on the win choice changes nothing', async () => {
    await start('granted');
    await drawBalls(5);
    await fireEvent.press(screen.getByTestId('game-check'));
    await enterRow(BALLS.slice(0, 5));
    await fireEvent.press(screen.getByTestId('check-verify'));
    await fireEvent.press(screen.getByTestId('check-validate'));
    await fireEvent(screen.getByTestId('win-dialog-modal'), 'requestClose');
    expect(screen.getByText('Continuer le tirage')).toBeTruthy();
    expect(screen.getByTestId('game-stage')).toHaveTextContent('Quine');
    expect((logEvent as jest.Mock).mock.calls.map((c) => c[1])).toEqual(['game_start']);
  });

  it('AC-21: a failing voice does not change the game, the error is reported', async () => {
    const failing: Feedback = {
      speak: () => {
        throw new Error('no French voice');
      },
      stopSpeech: () => {},
      sound: () => {},
      haptic: () => {},
    };
    setFeedback(failing);
    try {
      await start('granted');
      await drawBalls(2);
      expect(screen.getByTestId('game-counter')).toHaveTextContent('Boule n°2');
      expect(screen.getByTestId('game-ball').props.accessibilityLabel).toBe(`Boule ${BALLS[1]}`);
      expect(screen.getByTestId('game-draw').props.accessibilityState.disabled).toBe(false);
      expect(recordError).toHaveBeenCalledTimes(2);
    } finally {
      setFeedback(null);
    }
  });
});
