import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  secondary?: boolean;
  danger?: boolean;
  style?: ViewStyle;
};

export function PrimaryButton({
  label,
  onPress,
  icon,
  disabled = false,
  loading = false,
  secondary = false,
  danger = false,
  style,
}: PrimaryButtonProps) {
  const { colors, radii } = useTheme();
  const isDisabled = disabled || loading;

  const bg = secondary ? colors.blueSoft : danger ? colors.danger : colors.blue;
  const fg = secondary ? colors.blue : colors.onAccent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, borderRadius: radii.md },
        secondary && { borderWidth: 1, borderColor: colors.blue },
        isDisabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon && <MaterialCommunityIcons name={icon} size={19} color={fg} />}
          <Text style={[styles.label, { color: fg }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: { fontSize: 16, fontWeight: '900', letterSpacing: -0.3 },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
});
