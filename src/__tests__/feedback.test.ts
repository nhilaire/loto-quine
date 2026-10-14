import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';

import { createExpoFeedback } from '../audio/expoFeedback';
import { Feedback, onReveal, onRollStart, onWinValidated } from '../audio/feedback';
import { DEFAULT_SETTINGS, Settings } from '../storage/settings';

const NB = ' ';
const OFF: Settings = { voice: false, nicknames: false, sounds: false, vibrations: false };

function recorder(): Feedback & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    speak: (t) => calls.push(`speak:${t}`),
    stopSpeech: () => calls.push('stop'),
    sound: (e) => calls.push(`sound:${e}`),
    haptic: (h) => calls.push(`haptic:${h}`),
  };
}

describe('feedback policy (AC-21, AC-22)', () => {
  it('AC-21: speaks the plain number or the nickname depending on settings', () => {
    const fb = recorder();
    onReveal(22, { ...DEFAULT_SETTINGS, nicknames: false }, fb);
    onReveal(22, DEFAULT_SETTINGS, fb);
    expect(fb.calls.filter((c) => c.startsWith('speak'))).toEqual([`speak:22${NB}!`, `speak:22, les deux cocottes${NB}!`]);
  });

  it('AC-21: says nothing with the voice off', () => {
    const fb = recorder();
    onReveal(22, { ...DEFAULT_SETTINGS, voice: false }, fb);
    expect(fb.calls.some((c) => c.startsWith('speak'))).toBe(false);
  });

  it('AC-21: a speech failure does not throw', () => {
    const fb = { ...recorder(), speak: () => { throw new Error('no TTS engine'); } };
    expect(() => onReveal(5, DEFAULT_SETTINGS, fb)).not.toThrow();
  });

  it('AC-22: roll sound, reveal vibration, win sound and vibration when on; nothing when off', () => {
    const on = recorder();
    onRollStart(DEFAULT_SETTINGS, on);
    onReveal(5, { ...DEFAULT_SETTINGS, voice: false }, on);
    onWinValidated(DEFAULT_SETTINGS, on);
    expect(on.calls).toEqual(['sound:roll', 'haptic:reveal', 'sound:win', 'haptic:win']);
    const off = recorder();
    onRollStart(OFF, off);
    onReveal(5, OFF, off);
    onWinValidated(OFF, off);
    expect(off.calls).toEqual([]);
  });
});

describe('expo feedback (AC-21)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('stops the previous announcement and speaks in fr-FR', () => {
    createExpoFeedback().speak(`47${NB}!`);
    expect(Speech.stop).toHaveBeenCalled();
    expect(Speech.speak).toHaveBeenCalledWith(`47${NB}!`, expect.objectContaining({ language: 'fr-FR' }));
  });

  it('vibrates lightly on reveal and with a success pattern on win', () => {
    const fb = createExpoFeedback();
    fb.haptic('reveal');
    fb.haptic('win');
    expect(Haptics.impactAsync).toHaveBeenCalled();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });
});
