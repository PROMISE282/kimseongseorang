import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

type Tone = 'blue' | 'green' | 'amber' | 'danger' | 'neutral';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export function Pill({
  label,
  tone = 'neutral',
  icon,
  style,
}: {
  label: string;
  tone?: Tone;
  icon?: IconName;
  style?: ViewStyle;
}) {
  const { colors, radii } = useTheme();
  const map: Record<Tone, { bg: string; fg: string }> = {
    blue: { bg: colors.blueSoft, fg: colors.blueDark },
    green: { bg: colors.greenSoft, fg: colors.green },
    amber: { bg: colors.amberSoft, fg: colors.amber },
    danger: { bg: colors.dangerSoft, fg: colors.danger },
    neutral: { bg: colors.surfaceAlt, fg: colors.muted },
  };
  const { bg, fg } = map[tone];
  return (
    <View style={[styles.pill, { backgroundColor: bg, borderRadius: radii.pill }, style]}>
      {icon && <MaterialCommunityIcons name={icon} size={13} color={fg} />}
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    minHeight: 26,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 11, fontWeight: '900' },
});
