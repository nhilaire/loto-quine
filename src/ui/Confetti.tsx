// Short confetti burst (about 1.6 s) when a winner is validated. Purely decorative.
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';

import { ballColor } from './theme';

const PIECES = 28;

export function Confetti() {
  const { width, height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const pieces = useRef(
    Array.from({ length: PIECES }, (_, i) => ({
      x: ((i * 37) % 100) / 100,
      drift: ((i * 53) % 41) - 20,
      delay: (i % 7) / 14,
      color: ballColor((i * 11) % 90),
      spin: i % 2 === 0 ? 1 : -1,
    })),
  ).current;

  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: 1600, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [progress]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => {
        const local = progress.interpolate({ inputRange: [0, p.delay, 1], outputRange: [0, 0, 1], extrapolate: 'clamp' });
        return (
          <Animated.View
            key={i}
            style={[
              styles.piece,
              {
                left: p.x * width,
                backgroundColor: p.color,
                opacity: local.interpolate({ inputRange: [0, 0.05, 0.85, 1], outputRange: [0, 1, 1, 0] }),
                transform: [
                  { translateY: local.interpolate({ inputRange: [0, 1], outputRange: [-20, height * 0.7] }) },
                  { translateX: local.interpolate({ inputRange: [0, 1], outputRange: [0, p.drift * 4] }) },
                  { rotate: local.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${p.spin * 540}deg`] }) },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', top: 0, width: 10, height: 16, borderRadius: 2 },
});
