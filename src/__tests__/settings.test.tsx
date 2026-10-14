import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '../App';
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from '../storage/settings';

describe('settings (AC-20)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('defaults to everything on and keeps saved values', async () => {
    expect(await loadSettings()).toEqual(DEFAULT_SETTINGS);
    await saveSettings({ voice: false, nicknames: true, sounds: false, vibrations: true });
    expect(await loadSettings()).toEqual({ voice: false, nicknames: true, sounds: false, vibrations: true });
  });

  it('ignores unreadable data', async () => {
    await AsyncStorage.setItem('settings.v1', '{"voice":"yes"');
    expect(await loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('toggles in the settings screen survive a restart', async () => {
    await AsyncStorage.setItem('telemetry.consent.v1', 'granted');
    const first = await render(<App />);
    await fireEvent.press(await screen.findByText('Paramètres'));
    for (const id of ['settings-voice', 'settings-nicknames', 'settings-sounds', 'settings-vibrations', 'settings-stats']) {
      expect(screen.getByTestId(id).props.value).toBe(true);
      await fireEvent(screen.getByTestId(id), 'valueChange', false);
    }
    await first.unmount();

    await render(<App />);
    await fireEvent.press(await screen.findByText('Paramètres'));
    for (const id of ['settings-voice', 'settings-nicknames', 'settings-sounds', 'settings-vibrations', 'settings-stats']) {
      expect(screen.getByTestId(id).props.value).toBe(false);
    }
  });
});
