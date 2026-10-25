import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { LANGUAGE_NAMES, LANGUAGES, LanguageSetting } from '../i18n';
import { useI18n } from '../i18n/I18nProvider';
import { SettingKey, Settings } from '../storage/settings';
import { Button } from '../ui/Button';
import { Screen } from '../ui/Screen';
import { colors, font, radius, spacing } from '../ui/theme';

type Props = {
  settings: Settings;
  onChange: (key: SettingKey, value: boolean) => void;
  telemetryEnabled: boolean;
  onToggleTelemetry: (granted: boolean) => void;
  onBack: () => void;
};

function Row({ label, help, value, onValueChange, testID }: { label: string; help?: string; value: boolean; onValueChange: (v: boolean) => void; testID: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>
        {help ? <Text style={styles.help}>{help}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label}
        testID={testID}
        trackColor={{ true: colors.accent, false: colors.surfaceStrong }}
        thumbColor={colors.text}
      />
    </View>
  );
}

export function SettingsScreen({ settings, onChange, telemetryEnabled, onToggleTelemetry, onBack }: Props) {
  const { t, setting, setSetting } = useI18n();
  // Each language is named in itself; « Automatique » follows the phone.
  const choices: { value: LanguageSetting; label: string }[] = [
    { value: 'auto', label: t.settings.languageAuto },
    ...LANGUAGES.map((language) => ({ value: language, label: LANGUAGE_NAMES[language] })),
  ];
  return (
    <Screen testID="settings-screen">
      <Text style={styles.title} accessibilityRole="header">
        {t.settings.title}
      </Text>
      <ScrollView contentContainerStyle={styles.list}>
        <Row label={t.settings.voice} help={t.settings.voiceHelp} value={settings.voice} onValueChange={(v) => onChange('voice', v)} testID="settings-voice" />
        <Row
          label={t.settings.nicknames}
          help={t.settings.nicknamesHelp}
          value={settings.nicknames}
          onValueChange={(v) => onChange('nicknames', v)}
          testID="settings-nicknames"
        />
        <Row label={t.settings.sounds} value={settings.sounds} onValueChange={(v) => onChange('sounds', v)} testID="settings-sounds" />
        <Row label={t.settings.vibrations} value={settings.vibrations} onValueChange={(v) => onChange('vibrations', v)} testID="settings-vibrations" />
        <Row label={t.settings.stats} help={t.settings.statsHelp} value={telemetryEnabled} onValueChange={onToggleTelemetry} testID="settings-stats" />
        <View style={styles.group} accessibilityRole="radiogroup" accessibilityLabel={t.settings.language}>
          <Text style={styles.label}>{t.settings.language}</Text>
          {choices.map(({ value, label }) => {
            const selected = value === setting;
            return (
              <Pressable
                key={value}
                testID={`settings-language-${value}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={label}
                onPress={() => setSetting(value)}
                style={[styles.choice, selected && styles.choiceSelected]}
              >
                <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <Button label={t.settings.back} onPress={onBack} variant="secondary" testID="settings-back" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: font.heading, fontWeight: '800' },
  list: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md },
  rowText: { flex: 1, gap: spacing.xs },
  label: { color: colors.text, fontSize: font.body, fontWeight: '700' },
  help: { color: colors.muted, fontSize: font.small },
  group: { gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md },
  choice: { minHeight: 48, justifyContent: 'center', borderRadius: radius.md, borderWidth: 2, borderColor: colors.surfaceStrong, paddingHorizontal: spacing.md },
  choiceSelected: { borderColor: colors.accent, backgroundColor: colors.surfaceStrong },
  choiceText: { color: colors.text, fontSize: font.body },
  choiceTextSelected: { fontWeight: '800' },
});
