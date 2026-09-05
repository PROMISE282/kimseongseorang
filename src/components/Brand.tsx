import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

export function Brand({ compact = false }: { compact?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="주차모아">
      <View
        style={[
          styles.mark,
          compact && styles.compactMark,
          { backgroundColor: colors.blue },
        ]}
      >
        <MaterialCommunityIcons name="parking" size={compact ? 17 : 20} color="#FFFFFF" />
      </View>
      {!compact && <Text style={[styles.wordmark, { color: colors.ink }]}>주차모아</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  mark: {
    width: 34,
    height: 39,
    borderRadius: 18,
    borderBottomLeftRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  compactMark: { width: 30, height: 34 },
  wordmark: { fontSize: 21, fontWeight: '900', letterSpacing: -1 },
});
