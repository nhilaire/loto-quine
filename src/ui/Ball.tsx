// The loto ball: glossy coloured sphere with a white disc and the number. While rolling it shakes and cycles
// through the ball colours; at reveal it pops in with the number.
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { ballColor, colors } from './theme';

type Props = { number: number | null; rolling: boolean; size: number; testID?: string; accessibilityLabel?: string };

const ROLL_COLORS = [5, 15, 25, 35, 45, 55, 65, 75, 85];

export function Ball({ number, rolling, size, testID, accessibilityLabel }: Props) {
  const shake = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;
  const [colorIndex, setColorIndex] = useState(0);

  // Finite on purpose (4 shakes of 280 ms, 12 colour steps): the roll lasts about as long as ROLL_MS and never
  // leaves a timer running.
  useEffect(() => {
    if (!rolling) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 70, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 140, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 70, easing: Easing.linear, useNativeDriver: true }),
      ]),
      { iterations: 4, resetBeforeIteration: true },
    );
    loop.start();
    const timers = Array.from({ length: 12 }, (_, step) =>
      setTimeout(() => setColorIndex((step + 1) % ROLL_COLORS.length), (step + 1) * 85),
    );
    return () => {
      loop.stop();
      timers.forEach(clearTimeout);
      shake.setValue(0);
    };
  }, [rolling, shake]);

  useEffect(() => {
    if (rolling || number === null) return;
    pop.setValue(0.6);
    Animated.spring(pop, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }).start();
  }, [number, rolling, pop]);

  const color = rolling ? ballColor(ROLL_COLORS[colorIndex]) : number === null ? colors.surfaceStrong : ballColor(number);
  const rotate = shake.interpolate({ inputRange: [-1, 1], outputRange: ['-14deg', '14deg'] });
  const translateX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-size * 0.05, size * 0.05] });
  const disc = size * 0.66;

  return (
    <Animated.View
      testID={testID}
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.ball,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          experimental_backgroundImage: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.75) 0%, ${color} 38%, rgba(0,0,0,0.45) 100%)`,
          transform: [{ translateX }, { rotate }, { scale: pop }],
        },
      ]}
    >
      <View style={[styles.disc, { width: disc, height: disc, borderRadius: disc / 2 }]}>
        {number !== null && !rolling ? (
          <Text style={[styles.number, { fontSize: size * 0.4, lineHeight: size * 0.48 }]} adjustsFontSizeToFit numberOfLines={1}>
            {number}
          </Text>
        ) : (
          <Text style={[styles.number, styles.placeholder, { fontSize: size * 0.3 }]}>{rolling ? '' : '?'}</Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ball: { alignItems: 'center', justifyContent: 'center', boxShadow: '0px 10px 18px rgba(0, 0, 0, 0.45)' },
  disc: { backgroundColor: '#FFFDF7', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0px 3px 6px rgba(0, 0, 0, 0.25)' },
  number: { color: '#1F1300', fontWeight: '900', textAlign: 'center', includeFontPadding: false },
  placeholder: { color: '#C9B8A3' },
});
