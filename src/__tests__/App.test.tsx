import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as Speech from 'expo-speech';

import App from '../App';
import * as telemetry from '../telemetry/telemetry';
import { APP_NAME } from '../config/app';
import { deviceLanguageTags } from '../i18n/deviceLocale';

// render/fireEvent are awaited: asynchronous in React Native Testing Library 14+, harmless before.
// The phone is French unless a test says otherwise (jest.setup.js mocks deviceLanguageTags).
describe('App', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.mocked(deviceLanguageTags).mockReturnValue(['fr-FR']);
  });

  it('asks for consent in French on first launch, then shows the home screen', async () => {
    await render(<App />);
    expect(await screen.findByText('Statistiques anonymes')).toBeTruthy();
    await fireEvent.press(screen.getByText('Refuser'));
    expect(await screen.findByText('Nouvelle partie')).toBeTruthy();
    expect(screen.getByText(APP_NAME)).toBeTruthy();
  });

  it('resuming a game left during the roll shows the ball without replaying the roll or the voice (AC-14)', async () => {
    await AsyncStorage.setItem('telemetry.consent.v1', 'denied');
    await render(<App />);
    await fireEvent.press(await screen.findByTestId('home-new-game'));
    await fireEvent.press(await screen.findByTestId('game-draw'));
    jest.mocked(Speech.speak).mockClear();
    await fireEvent.press(screen.getByTestId('game-home'));
    await fireEvent.press(await screen.findByTestId('home-resume'));
    expect(await screen.findByText('Boule n°1')).toBeTruthy();
    expect(Speech.speak).not.toHaveBeenCalled();
  });

  it('closes the consent screen even when saving the choice fails (AC-02)', async () => {
    // The storage mock's setItem is already a jest.fn: a one-shot rejection, no restore (it would drop its implementation).
    jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error('disk full'));
    await render(<App />);
    await fireEvent.press(await screen.findByText('Refuser'));
    expect(await screen.findByText('Nouvelle partie')).toBeTruthy();
  });

  it('closes the consent screen even when applying the choice throws (AC-02)', async () => {
    const apply = jest.spyOn(telemetry, 'applyConsent').mockRejectedValueOnce(new Error('native module'));
    await render(<App />);
    await fireEvent.press(await screen.findByText('Accepter'));
    expect(await screen.findByText('Nouvelle partie')).toBeTruthy();
    apply.mockRestore();
  });

  it('does not ask again once the player has chosen', async () => {
    await AsyncStorage.setItem('telemetry.consent.v1', 'denied');
    await render(<App />);
    expect(await screen.findByText('Nouvelle partie')).toBeTruthy();
    expect(screen.queryByText('Statistiques anonymes')).toBeNull();
  });
});

describe('languages (AC-42, AC-43)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.mocked(deviceLanguageTags).mockReturnValue(['fr-FR']);
  });

  it('speaks English on an English phone', async () => {
    jest.mocked(deviceLanguageTags).mockReturnValue(['en-GB']);
    await render(<App />);
    expect(await screen.findByText('Anonymous statistics')).toBeTruthy();
    await fireEvent.press(screen.getByText('Decline'));
    expect(await screen.findByText('New game')).toBeTruthy();
  });

  it('uses English on a phone in an unsupported language', async () => {
    jest.mocked(deviceLanguageTags).mockReturnValue(['it-IT']);
    await AsyncStorage.setItem('telemetry.consent.v1', 'denied');
    await render(<App />);
    expect(await screen.findByText('New game')).toBeTruthy();
  });

  it('switches language from the settings at once and remembers the choice', async () => {
    await AsyncStorage.setItem('telemetry.consent.v1', 'denied');
    await render(<App />);
    await fireEvent.press(await screen.findByTestId('home-settings'));
    await fireEvent.press(screen.getByTestId('settings-language-en'));
    expect(await screen.findByText('Settings')).toBeTruthy();
    expect(screen.getByText('Voice')).toBeTruthy();
    expect(await AsyncStorage.getItem('settings.language.v1')).toBe('en');

    await screen.unmount();
    await render(<App />);
    expect(await screen.findByText('New game')).toBeTruthy();
  });

  it('goes back to the phone language with the automatic choice', async () => {
    await AsyncStorage.multiSet([
      ['telemetry.consent.v1', 'denied'],
      ['settings.language.v1', 'en'],
    ]);
    await render(<App />);
    await fireEvent.press(await screen.findByTestId('home-settings'));
    await fireEvent.press(screen.getByTestId('settings-language-auto'));
    expect(await screen.findByText('Paramètres')).toBeTruthy();
  });

  it('switching the language keeps the game in progress', async () => {
    await AsyncStorage.setItem('telemetry.consent.v1', 'denied');
    await render(<App />);
    await fireEvent.press(await screen.findByTestId('home-new-game'));
    expect(await screen.findByText('Quine')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('game-home'));
    await fireEvent.press(screen.getByTestId('home-settings'));
    await fireEvent.press(screen.getByTestId('settings-language-en'));
    await fireEvent.press(screen.getByTestId('settings-back'));
    await fireEvent.press(await screen.findByTestId('home-resume'));
    expect(await screen.findByText('One line')).toBeTruthy();
  });
});
