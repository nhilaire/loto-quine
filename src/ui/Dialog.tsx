// Modal dialog. `onRequestClose` is what Android back does; pass a no-op to make the dialog non-dismissible.
import { ReactNode } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { colors, font, radius, spacing } from './theme';

type Props = { visible: boolean; title: string; onRequestClose: () => void; children: ReactNode; testID?: string; decoration?: ReactNode };

export function Dialog({ visible, title, onRequestClose, children, testID, decoration }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose} statusBarTranslucent navigationBarTranslucent>
      <View style={styles.backdrop}>
        {decoration}
        <View style={styles.card} testID={testID}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(30, 6, 2, 0.7)', alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  card: { alignSelf: 'stretch', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md, borderWidth: 2, borderColor: colors.accent },
  title: { color: colors.text, fontSize: font.heading, fontWeight: '800', textAlign: 'center' },
});
