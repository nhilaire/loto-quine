import { ReactNode } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from './theme';

// Full-screen container that keeps content clear of the status bar and the navigation bar (Android edge-to-edge).
export function Screen({ children, testID, gap = spacing.md }: { children: ReactNode; testID?: string; gap?: number }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      testID={testID}
      style={[
        styles.screen,
        { gap, paddingTop: Math.max(insets.top, StatusBar.currentHeight ?? 0) + spacing.md, paddingBottom: insets.bottom + spacing.md },
      ]}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    experimental_backgroundImage: `radial-gradient(circle at 50% 20%, ${colors.background} 0%, ${colors.backgroundDeep} 100%)`,
    paddingHorizontal: spacing.md,
  },
});
