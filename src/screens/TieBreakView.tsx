import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GameState } from '../game/game';
import { MAX_TIED, MIN_TIED, tieBreakNumbers, tieBreakWinner } from '../game/tieBreak';
import { useI18n } from '../i18n/I18nProvider';
import { Ball } from '../ui/Ball';
import { Button } from '../ui/Button';
import { Screen } from '../ui/Screen';
import { colors, font, radius, spacing } from '../ui/theme';

type Props = { game: GameState; onBack: () => void; onValidate: () => void; onReveal: (n: number) => void };

// Several winners on the same ball: each player draws a number in turn, the highest wins.
export function TieBreakView({ game, onBack, onValidate, onReveal }: Props) {
  const { t } = useI18n();
  const [players, setPlayers] = useState(MIN_TIED);
  const [revealed, setRevealed] = useState(0);
  const numbers = useMemo(() => tieBreakNumbers(game, players), [game, players]);
  const done = revealed >= players;
  const winner = done ? tieBreakWinner(numbers) : -1;
  const locked = revealed > 0;

  const change = (delta: number) => setPlayers((p) => Math.min(MAX_TIED, Math.max(MIN_TIED, p + delta)));

  return (
    <Screen testID="tie-screen" gap={spacing.sm}>
      <Text style={styles.title} accessibilityRole="header">
        {t.tie.title}
      </Text>
      <View style={styles.stepper}>
        <Text style={styles.label}>{t.tie.count}</Text>
        <Pressable testID="tie-minus" accessibilityRole="button" accessibilityLabel="−" disabled={locked} onPress={() => change(-1)} style={[styles.stepButton, locked && styles.dim]}>
          <Text style={styles.stepText}>−</Text>
        </Pressable>
        <Text style={styles.count} testID="tie-count">
          {players}
        </Text>
        <Pressable testID="tie-plus" accessibilityRole="button" accessibilityLabel="+" disabled={locked} onPress={() => change(1)} style={[styles.stepButton, locked && styles.dim]}>
          <Text style={styles.stepText}>+</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {numbers.map((n, i) => (
          <View key={i} style={[styles.player, i === winner && styles.winner]}>
            <Text style={styles.playerName}>{t.tie.player(i + 1)}</Text>
            {i < revealed ? (
              <Ball number={n} rolling={false} size={52} testID={`tie-ball-${i + 1}`} accessibilityLabel={t.game.ballLabel(n)} />
            ) : (
              <View style={styles.drawButton}>
                <Button
                  label={t.tie.draw}
                  disabled={i !== revealed}
                  onPress={() => {
                    setRevealed(i + 1);
                    onReveal(n);
                  }}
                  testID={`tie-draw-${i + 1}`}
                />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      {done ? (
        <>
          <Text style={styles.result} testID="tie-winner">
            {t.tie.winner(winner + 1, numbers[winner])}
          </Text>
          <Button label={t.check.validate} onPress={onValidate} large testID="tie-validate" />
        </>
      ) : null}
      <Button label={t.common.back} onPress={onBack} variant="secondary" testID="tie-back" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: font.heading, fontWeight: '800' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  label: { flex: 1, color: colors.text, fontSize: font.body, fontWeight: '700' },
  stepButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  dim: { opacity: 0.4 },
  stepText: { color: colors.text, fontSize: 26, fontWeight: '900' },
  count: { color: colors.accent, fontSize: 28, fontWeight: '900', minWidth: 36, textAlign: 'center' },
  list: { gap: spacing.sm },
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 64,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  winner: { borderColor: colors.accent },
  playerName: { color: colors.text, fontSize: font.body, fontWeight: '700' },
  drawButton: { width: 120 },
  result: { color: colors.accent, fontSize: 22, fontWeight: '900', textAlign: 'center' },
});
