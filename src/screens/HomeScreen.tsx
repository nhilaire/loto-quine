import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { APP_NAME } from '../config/app';
import { fr } from '../i18n/fr';
import { Ball } from '../ui/Ball';
import { Button } from '../ui/Button';
import { Screen } from '../ui/Screen';
import { colors, font, spacing } from '../ui/theme';

type Props = {
  hasGame: boolean;
  onNewGame: () => void;
  onResume: () => void;
  onRules: () => void;
  onSettings: () => void;
  onAbout: () => void;
};

export function HomeScreen({ hasGame, onNewGame, onResume, onRules, onSettings, onAbout }: Props) {
  const { width } = useWindowDimensions();
  return (
    <Screen testID="home-screen">
      <View style={styles.hero}>
        <Ball number={90} rolling={false} size={Math.min(width * 0.42, 190)} />
        <Text style={styles.title} accessibilityRole="header">
          {APP_NAME}
        </Text>
        <Text style={styles.pitch}>{fr.home.pitch}</Text>
      </View>
      {hasGame && <Button label={fr.home.resume} onPress={onResume} large testID="home-resume" />}
      <Button label={fr.home.newGame} onPress={onNewGame} large={!hasGame} variant={hasGame ? 'secondary' : 'primary'} testID="home-new-game" />
      <View style={styles.row}>
        <View style={styles.half}>
          <Button label={fr.home.rules} onPress={onRules} variant="secondary" testID="home-rules" />
        </View>
        <View style={styles.half}>
          <Button label={fr.home.settings} onPress={onSettings} variant="secondary" testID="home-settings" />
        </View>
      </View>
      <Button label={fr.home.about} onPress={onAbout} variant="ghost" testID="home-about" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  title: { color: colors.accent, fontSize: 44, fontWeight: '900', textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.35)', textShadowRadius: 6, textShadowOffset: { width: 0, height: 3 } },
  pitch: { color: colors.text, fontSize: font.body, textAlign: 'center' },
  row: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
});
