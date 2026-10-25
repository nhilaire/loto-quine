// Real feedback: the phone's text-to-speech in the game's language (expo-speech, offline), bundled sound effects (expo-audio) and
// vibrations (expo-haptics). Errors are reported (if consented) and never crash the game.
import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';

import { reportError } from '../telemetry/telemetry';
import { Effect, Feedback } from './feedback';

const EFFECTS: Record<Effect, number> = {
  roll: require('../../assets/sounds/roll.wav'),
  win: require('../../assets/sounds/win.wav'),
};

export function createExpoFeedback(): Feedback {
  const players: Partial<Record<Effect, AudioPlayer>> = {};

  return {
    speak: (text, locale) => {
      void Speech.stop();
      Speech.speak(text, { language: locale, onError: (error) => reportError(error, 'speech') });
    },
    stopSpeech: () => {
      void Speech.stop();
    },
    sound: (effect) => {
      let player = players[effect];
      if (!player) {
        player = createAudioPlayer(EFFECTS[effect]);
        players[effect] = player;
      }
      void player.seekTo(0);
      player.play();
    },
    haptic: (kind) => {
      if (kind === 'reveal') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      else void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  };
}
