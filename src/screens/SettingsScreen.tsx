import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { fr } from '../i18n/fr';
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
  return (
    <Screen testID="settings-screen">
      <Text style={styles.title} accessibilityRole="header">
        {fr.settings.title}
      </Text>
      <ScrollView contentContainerStyle={styles.list}>
        <Row label={fr.settings.voice} help={fr.settings.voiceHelp} value={settings.voice} onValueChange={(v) => onChange('voice', v)} testID="settings-voice" />
        <Row
          label={fr.settings.nicknames}
          help={fr.settings.nicknamesHelp}
          value={settings.nicknames}
          onValueChange={(v) => onChange('nicknames', v)}
          testID="settings-nicknames"
        />
        <Row label={fr.settings.sounds} value={settings.sounds} onValueChange={(v) => onChange('sounds', v)} testID="settings-sounds" />
        <Row label={fr.settings.vibrations} value={settings.vibrations} onValueChange={(v) => onChange('vibrations', v)} testID="settings-vibrations" />
        <Row label={fr.settings.stats} help={fr.settings.statsHelp} value={telemetryEnabled} onValueChange={onToggleTelemetry} testID="settings-stats" />
      </ScrollView>
      <Button label={fr.settings.back} onPress={onBack} variant="secondary" testID="settings-back" />
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
});
