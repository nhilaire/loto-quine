import { ScrollView, StyleSheet, Text } from 'react-native';

import { fr } from '../i18n/fr';
import { Button } from '../ui/Button';
import { Screen } from '../ui/Screen';
import { colors, font, spacing } from '../ui/theme';

export function RulesScreen({ onBack }: { onBack: () => void }) {
  return (
    <Screen testID="rules-screen">
      <Text style={styles.title} accessibilityRole="header">
        {fr.rules.title}
      </Text>
      <ScrollView contentContainerStyle={styles.body}>
        {fr.rules.body.map((paragraph) => (
          <Text key={paragraph} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </ScrollView>
      <Button label={fr.common.back} onPress={onBack} variant="secondary" testID="rules-back" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: font.heading, fontWeight: '800' },
  body: { gap: spacing.md },
  paragraph: { color: colors.text, fontSize: font.body, lineHeight: 25 },
});
