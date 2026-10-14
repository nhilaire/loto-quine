import { StyleSheet, Text, View } from 'react-native';

import { GameState, durationMinutes } from '../game/game';
import { fr } from '../i18n/fr';
import { Button } from '../ui/Button';
import { Confetti } from '../ui/Confetti';
import { Screen } from '../ui/Screen';
import { colors, font, spacing } from '../ui/theme';

type Props = { game: GameState; now: number; onNewGame: () => void; onHome: () => void };

export function GameOverScreen({ game, now, onNewGame, onHome }: Props) {
  const completed = game.result === 'completed';
  return (
    <Screen testID="over-screen">
      <View style={styles.center}>
        <Text style={styles.title} accessibilityRole="header" testID="over-title">
          {completed ? fr.over.completed : fr.over.stopped}
        </Text>
        <Text style={styles.line}>{fr.over.balls(game.draw.length)}</Text>
        <Text style={styles.line}>{fr.over.duration(durationMinutes(game, now))}</Text>
      </View>
      <Button label={fr.home.newGame} onPress={onNewGame} large testID="over-new-game" />
      <Button label={fr.common.home} onPress={onHome} variant="secondary" testID="over-home" />
      {completed && <Confetti />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  title: { color: colors.accent, fontSize: font.title, fontWeight: '900', textAlign: 'center' },
  line: { color: colors.text, fontSize: font.heading, fontWeight: '600' },
});
