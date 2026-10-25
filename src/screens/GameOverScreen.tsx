import { StyleSheet, Text, View } from 'react-native';

import { GameState, durationMinutes } from '../game/game';
import { useI18n } from '../i18n/I18nProvider';
import { Button } from '../ui/Button';
import { Confetti } from '../ui/Confetti';
import { Screen } from '../ui/Screen';
import { colors, font, spacing } from '../ui/theme';

type Props = { game: GameState; now: number; onNewGame: () => void; onHome: () => void };

export function GameOverScreen({ game, now, onNewGame, onHome }: Props) {
  const { t } = useI18n();
  const completed = game.result === 'completed';
  return (
    <Screen testID="over-screen">
      <View style={styles.center}>
        <Text style={styles.title} accessibilityRole="header" testID="over-title">
          {completed ? t.over.completed : t.over.stopped}
        </Text>
        <Text style={styles.line}>{t.over.balls(game.draw.length)}</Text>
        <Text style={styles.line}>{t.over.duration(durationMinutes(game, now))}</Text>
      </View>
      <Button label={t.home.newGame} onPress={onNewGame} large testID="over-new-game" />
      <Button label={t.common.home} onPress={onHome} variant="secondary" testID="over-home" />
      {completed && <Confetti />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  title: { color: colors.accent, fontSize: font.title, fontWeight: '900', textAlign: 'center' },
  line: { color: colors.text, fontSize: font.heading, fontWeight: '600' },
});
