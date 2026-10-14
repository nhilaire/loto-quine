import AsyncStorage from '@react-native-async-storage/async-storage';

import { GameState } from '../game/game';
import { parseGame, serializeGame } from '../game/serialize';
import { reportError } from '../telemetry/telemetry';

const KEY = 'game.current.v1';

// The game in progress, or null (none saved, finished, or unreadable).
export async function loadGame(): Promise<GameState | null> {
  try {
    const game = parseGame(await AsyncStorage.getItem(KEY));
    return game && game.status === 'playing' ? game : null;
  } catch (error) {
    reportError(error, 'load_game');
    return null;
  }
}

export async function saveGame(state: GameState): Promise<void> {
  try {
    if (state.status === 'playing') await AsyncStorage.setItem(KEY, serializeGame(state));
    else await AsyncStorage.removeItem(KEY);
  } catch (error) {
    reportError(error, 'save_game');
  }
}

export async function clearGame(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (error) {
    reportError(error, 'clear_game');
  }
}
