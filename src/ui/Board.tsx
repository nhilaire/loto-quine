// The 1-90 board: 10 columns x 9 rows. Drawn numbers are filled with their ball colour, the last one is outlined.
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ALL_BALLS } from '../game/draw';
import { ballColor, colors } from './theme';

type Props = { drawn: ReadonlySet<number>; last: number | null; width: number };

const Cell = memo(function Cell({ n, isDrawn, isLast, size }: { n: number; isDrawn: boolean; isLast: boolean; size: number }) {
  return (
    <View
      testID={`board-cell-${n}`}
      accessibilityState={{ selected: isDrawn }}
      style={[
        styles.cell,
        { width: size - 3, height: size * 0.78 - 3 },
        isDrawn && { backgroundColor: ballColor(n) },
        isLast && styles.last,
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.42 }, isDrawn && styles.drawnText]}>{n}</Text>
    </View>
  );
});

export function Board({ drawn, last, width }: Props) {
  const size = width / 10;
  return (
    <View testID="board" style={[styles.board, { width }]}>
      {ALL_BALLS.map((n) => (
        <Cell key={n} n={n} isDrawn={drawn.has(n)} isLast={n === last} size={size} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, alignSelf: 'center' },
  cell: { borderRadius: 6, backgroundColor: colors.boardCell, alignItems: 'center', justifyContent: 'center' },
  last: { borderWidth: 3, borderColor: colors.text },
  text: { color: colors.boardText, fontWeight: '700', includeFontPadding: false },
  drawnText: { color: '#FFFFFF', fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.35)', textShadowRadius: 2 },
});
