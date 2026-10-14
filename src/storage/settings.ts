import AsyncStorage from '@react-native-async-storage/async-storage';

import { reportError } from '../telemetry/telemetry';

// Local host settings (the statistics choice is the telemetry consent, stored separately).
export type Settings = { voice: boolean; nicknames: boolean; sounds: boolean; vibrations: boolean };
export type SettingKey = keyof Settings;

export const DEFAULT_SETTINGS: Settings = { voice: true, nicknames: true, sounds: true, vibrations: true };

const KEY = 'settings.v1';

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Record<SettingKey, unknown>>;
    const pick = (k: SettingKey) => (typeof parsed[k] === 'boolean' ? (parsed[k] as boolean) : DEFAULT_SETTINGS[k]);
    return { voice: pick('voice'), nicknames: pick('nicknames'), sounds: pick('sounds'), vibrations: pick('vibrations') };
  } catch (error) {
    reportError(error, 'load_settings');
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(settings));
  } catch (error) {
    reportError(error, 'save_settings');
  }
}
