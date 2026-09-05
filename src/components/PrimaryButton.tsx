import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radii } from '../theme';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  disabled?: boolean;
  secondary?: boolean;
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, icon, disabled = false, secondary = false, style }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.base, secondary && styles.secondary, disabled && styles.disabled, pressed && styles.pressed, style]}
    >
      {icon && <MaterialCommunityIcons name={icon} size={19} color={secondary ? colors.blue : colors.surface} />}
      <Text style={[styles.label, secondary && styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 54, paddingHorizontal: 20, borderRadius: radii.md, backgroundColor: colors.blue, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondary: { backgroundColor: colors.blueSoft, borderWidth: 1, borderColor: '#C9DBFF' },
  label: { color: colors.surface, fontSize: 16, fontWeight: '900', letterSpacing: -0.3 },
  secondaryLabel: { color: colors.blue },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.74, transform: [{ scale: 0.99 }] },
});
