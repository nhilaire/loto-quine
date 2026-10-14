import { StyleSheet, Text, View } from 'react-native';

import { fr } from '../i18n/fr';
import { ballColor, colors, font, spacing } from './theme';

// The last balls in draw order, most recent first.
export function LastBalls({ balls }: { balls: readonly number[] }) {
  return (
    <View style={styles.row} testID="game-last-balls">
      <Text style={styles.label}>{fr.game.lastBalls}</Text>
      <View style={styles.balls}>
        {balls.map((n, i) => (
          <View key={n} style={[styles.ball, { backgroundColor: ballColor(n), opacity: 1 - i * 0.12 }]}>
            <Text style={styles.text}>{n}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, minHeight: 36 },
  label: { color: colors.muted, fontSize: font.small, fontWeight: '600' },
  balls: { flexDirection: 'row', gap: 6 },
  ball: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFDF7' },
  text: { color: '#FFFFFF', fontWeight: '900', fontSize: 14, textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 2 },
});
