import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

type ChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Chip({ label, active = false, onPress, style }: ChipProps) {
  const { colors, radii } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          borderRadius: radii.pill,
          borderColor: active ? colors.blue : colors.line,
          backgroundColor: active ? colors.blue : colors.surface,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, { color: active ? colors.onAccent : colors.muted }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    paddingHorizontal: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.72 },
});
