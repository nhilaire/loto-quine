import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Linking, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { parseSeedLink, setPendingStart, takePendingStart } from './app/testSeed';
import { onReveal, onRollStart, onTieReveal, onWinValidated, stopAnnouncements } from './audio/feedback';
import { GameAction, GameState, WinChoice, lastBall, newGame, reduce } from './game/game';
import { randomSeed, seedFrom } from './game/random';
import { TrackCall, startEvents, transitionEvents } from './game/telemetryRules';
import { fr } from './i18n/fr';
import { AboutScreen } from './screens/AboutScreen';
import { CheckScreen } from './screens/CheckScreen';
import { ConsentScreen } from './screens/ConsentScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { GameScreen } from './screens/GameScreen';
import { HomeScreen } from './screens/HomeScreen';
import { RulesScreen } from './screens/RulesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { loadGame, saveGame } from './storage/gameStore';
import { DEFAULT_SETTINGS, SettingKey, Settings, loadSettings, saveSettings } from './storage/settings';
import { Consent, loadConsent, saveConsent } from './telemetry/consentStore';
import { applyConsent, track } from './telemetry/telemetry';
import { Button } from './ui/Button';
import { Dialog } from './ui/Dialog';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { colors } from './ui/theme';

type Route = 'home' | 'game' | 'check' | 'over' | 'rules' | 'settings' | 'about';
type Confirm = null | 'end' | 'replace';

function send(calls: TrackCall[]): void {
  for (const call of calls) track(call.name, call.params as never);
}

// Back navigation for Android (dialogs handle back themselves through Modal.onRequestClose).
const BACK: Partial<Record<Route, Route>> = { game: 'home', check: 'game', over: 'home', rules: 'home', settings: 'home', about: 'home' };

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [consent, setConsentState] = useState<Consent>('unknown');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [route, setRoute] = useState<Route>('home');
  const [game, setGame] = useState<GameState | null>(null);
  const [finished, setFinished] = useState<GameState | null>(null);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const gameRef = useRef<GameState | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    let alive = true;
    (async () => {
      const [storedConsent, storedSettings, storedGame] = await Promise.all([loadConsent(), loadSettings(), loadGame()]);
      if (storedConsent !== 'unknown') await applyConsent(storedConsent === 'granted');
      if (!alive) return;
      setConsentState(storedConsent);
      setSettings(storedSettings);
      gameRef.current = storedGame;
      setGame(storedGame);
      // A game in progress reopens directly, exactly as it was (no animation, no voice).
      if (storedGame) setRoute('game');
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Testing aid: lotoquine://seed/<n> (cold start URL or link opened while running).
  useEffect(() => {
    const handle = (url: string | null) => {
      const start = parseSeedLink(url);
      if (start !== null) setPendingStart(start);
    };
    void Linking.getInitialURL().then(handle).catch(() => {});
    const sub = Linking.addEventListener('url', ({ url }) => handle(url));
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const target = BACK[route];
      if (!target) return false;
      if (route === 'game') stopAnnouncements();
      setRoute(target);
      return true;
    });
    return () => sub.remove();
  }, [route]);

  // Every state change is saved at once: a ball is saved when it is drawn, before its animation.
  const commit = useCallback((next: GameState) => {
    gameRef.current = next.status === 'playing' ? next : null;
    setGame(gameRef.current);
    if (next.status === 'finished') setFinished(next);
    void saveGame(next);
  }, []);

  const dispatch = useCallback(
    (action: GameAction): GameState | null => {
      const prev = gameRef.current;
      if (!prev) return null;
      const next = reduce(prev, action);
      if (next === prev) return null;
      send(transitionEvents(prev, action, next, Date.now()));
      commit(next);
      return next;
    },
    [commit],
  );

  const startGame = useCallback(() => {
    const now = Date.now();
    send(startEvents(gameRef.current, now));
    stopAnnouncements();
    const test = takePendingStart();
    let game = newGame(test ? seedFrom(test.seed) : randomSeed(), now);
    // Testing aid only: pre-drawn balls, without telemetry, sound or animation.
    for (let i = 0; i < (test?.drawn ?? 0); i++) game = reduce(reduce(game, { type: 'draw' }), { type: 'revealed' });
    commit(game);
    setFinished(null);
    setConfirm(null);
    setRoute('game');
  }, [commit]);

  const decide = useCallback(async (granted: boolean) => {
    const value = granted ? 'granted' : 'denied';
    await saveConsent(value);
    await applyConsent(granted);
    setConsentState(value);
  }, []);

  const changeSetting = useCallback((key: SettingKey, value: boolean) => {
    setSettings((current) => {
      const next = { ...current, [key]: value };
      void saveSettings(next);
      return next;
    });
    if (key === 'voice' && !value) stopAnnouncements();
  }, []);

  const draw = useCallback(() => {
    if (dispatch({ type: 'draw' })) onRollStart(settingsRef.current);
  }, [dispatch]);

  const revealed = useCallback(() => {
    const next = dispatch({ type: 'revealed' });
    const ball = next ? lastBall(next) : null;
    if (ball !== null) onReveal(ball, settingsRef.current);
  }, [dispatch]);

  const validateWin = useCallback(() => {
    const next = dispatch({ type: 'validateWin', now: Date.now() });
    if (!next) return;
    onWinValidated(settingsRef.current);
    setRoute(next.status === 'finished' ? 'over' : 'game');
  }, [dispatch]);

  const choose = useCallback((choice: WinChoice) => dispatch({ type: 'choose', choice }), [dispatch]);

  const endGame = useCallback(() => {
    stopAnnouncements();
    const next = dispatch({ type: 'stop', now: Date.now() });
    setConfirm(null);
    if (next) setRoute('over');
  }, [dispatch]);

  let content: React.ReactNode;
  if (!loaded) {
    content = (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  } else if (consent === 'unknown') {
    content = <ConsentScreen onDecision={decide} />;
  } else if (route === 'game' && game) {
    content = (
      <GameScreen
        game={game}
        nicknames={settings.nicknames}
        onDraw={draw}
        onRevealed={revealed}
        onCheck={() => setRoute('check')}
        onHome={() => {
          stopAnnouncements();
          setRoute('home');
        }}
        onEnd={() => setConfirm('end')}
        onChoose={choose}
      />
    );
  } else if (route === 'check' && game) {
    content = (
      <CheckScreen
        game={game}
        onBack={() => setRoute('game')}
        onValidate={validateWin}
        onTieReveal={(n) => onTieReveal(n, settingsRef.current)}
      />
    );
  } else if (route === 'over' && finished) {
    content = <GameOverScreen game={finished} now={Date.now()} onNewGame={startGame} onHome={() => setRoute('home')} />;
  } else if (route === 'about') {
    content = <AboutScreen onBack={() => setRoute('home')} />;
  } else if (route === 'rules') {
    content = <RulesScreen onBack={() => setRoute('home')} />;
  } else if (route === 'settings') {
    content = (
      <SettingsScreen
        settings={settings}
        onChange={changeSetting}
        telemetryEnabled={consent === 'granted'}
        onToggleTelemetry={decide}
        onBack={() => setRoute('home')}
      />
    );
  } else {
    content = (
      <HomeScreen
        hasGame={game !== null}
        onNewGame={() => (game ? setConfirm('replace') : startGame())}
        onResume={() => setRoute('game')}
        onRules={() => setRoute('rules')}
        onAbout={() => setRoute('about')}
        onSettings={() => setRoute('settings')}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        {content}
        <Dialog
          visible={confirm !== null}
          title={confirm === 'replace' ? fr.game.replaceConfirm : fr.game.endConfirm}
          onRequestClose={() => setConfirm(null)}
          testID="confirm-dialog"
        >
          <Button label={fr.common.yes} onPress={confirm === 'replace' ? startGame : endGame} testID="confirm-yes" />
          <Button label={fr.common.no} onPress={() => setConfirm(null)} variant="secondary" testID="confirm-no" />
        </Dialog>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});
