import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, font, radius, spacing } from './theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  large?: boolean;
  testID?: string;
};

export function Button({ label, onPress, variant = 'primary', disabled = false, large = false, testID }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        large && styles.large,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, large && styles.largeLabel, variant === 'primary' ? styles.primaryLabel : styles.otherLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 52, borderRadius: radius.md, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' },
  large: { minHeight: 64, borderRadius: radius.lg },
  primary: { backgroundColor: colors.accent, boxShadow: '0px 4px 0px #B8860B' },
  secondary: { backgroundColor: colors.surface, borderWidth: 2, borderColor: 'rgba(255, 200, 61, 0.45)' },
  ghost: { backgroundColor: 'transparent', minHeight: 44, paddingHorizontal: spacing.sm, alignSelf: 'auto' },
  pressed: { transform: [{ translateY: 2 }], opacity: 0.9 },
  disabled: { opacity: 0.4 },
  label: { fontSize: font.body, fontWeight: '800', textAlign: 'center' },
  largeLabel: { fontSize: 21 },
  primaryLabel: { color: colors.accentText },
  otherLabel: { color: colors.text },
});
