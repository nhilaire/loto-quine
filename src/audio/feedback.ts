// Voice, sound and haptic feedback. The implementation is installed by `setFeedback` (expo modules in the app, a
// recording fake in tests). Default: silent. The policy functions below apply the host's settings and never throw:
// a failing voice or sound must not change the game.
import { announcement } from '../game/announce';
import { DICTIONARIES, Language } from '../i18n';
import type { Settings } from '../storage/settings';
import { reportError } from '../telemetry/telemetry';

export type Effect = 'roll' | 'win';
export type Haptic = 'reveal' | 'win';

export type Feedback = {
  speak(text: string, locale: string): void; // stops the previous announcement first; locale: BCP 47 voice language
  stopSpeech(): void;
  sound(effect: Effect): void;
  haptic(kind: Haptic): void;
};

const silent: Feedback = { speak: () => {}, stopSpeech: () => {}, sound: () => {}, haptic: () => {} };

let current: Feedback = silent;

export function setFeedback(f: Feedback | null): void {
  current = f ?? silent;
}

export function feedback(): Feedback {
  return current;
}

function safe(context: string, fn: () => void): void {
  try {
    fn();
  } catch (error) {
    reportError(error, context);
  }
}

export function onRollStart(settings: Settings, fb: Feedback = current): void {
  if (settings.sounds) safe('sound_roll', () => fb.sound('roll'));
}

// The voice speaks the game's language (fr-FR or en-GB, the dictionary's locale).
export function onReveal(ball: number, settings: Settings, language: Language, fb: Feedback = current): void {
  if (settings.voice) safe('speech', () => fb.speak(announcement(ball, settings.nicknames, language).spoken, DICTIONARIES[language].locale));
  if (settings.vibrations) safe('haptic_reveal', () => fb.haptic('reveal'));
}

export function onWinValidated(settings: Settings, fb: Feedback = current): void {
  if (settings.sounds) safe('sound_win', () => fb.sound('win'));
  if (settings.vibrations) safe('haptic_win', () => fb.haptic('win'));
}

export function stopAnnouncements(fb: Feedback = current): void {
  safe('speech_stop', () => fb.stopSpeech());
}

// Tie-break: each player's number is announced plainly.
export function onTieReveal(n: number, settings: Settings, language: Language, fb: Feedback = current): void {
  if (settings.voice) safe('speech', () => fb.speak(announcement(n, false, language).spoken, DICTIONARIES[language].locale));
  if (settings.vibrations) safe('haptic_reveal', () => fb.haptic('reveal'));
}
