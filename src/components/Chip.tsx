import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radii } from '../theme';

type ChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Chip({ label, active = false, onPress, style }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.base, active && styles.active, pressed && styles.pressed, style]}
    >
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 40,
    paddingHorizontal: 15,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { borderColor: colors.blue, backgroundColor: colors.blue },
  label: { color: colors.muted, fontSize: 14, fontWeight: '700' },
  activeLabel: { color: colors.surface },
  pressed: { opacity: 0.72 },
});
