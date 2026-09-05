import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: IconName;
  title: string;
  body?: string;
}) {
  const { colors, radii } = useTheme();
  return (
    <View
      style={[styles.wrap, { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: radii.lg }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.blueSoft, borderRadius: radii.md }]}>
        <MaterialCommunityIcons name={icon} size={26} color={colors.blue} />
      </View>
      <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
      {body && <Text style={[styles.body, { color: colors.muted }]}>{body}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, alignItems: 'center', borderWidth: 1 },
  iconWrap: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  title: { marginTop: 13, fontSize: 15, fontWeight: '900' },
  body: { marginTop: 6, fontSize: 12, lineHeight: 18, textAlign: 'center', fontWeight: '600' },
});
