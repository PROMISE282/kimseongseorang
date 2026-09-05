import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

type BrandProps = {
  compact?: boolean;
};

export function Brand({ compact = false }: BrandProps) {
  return (
    <View style={styles.row} accessibilityLabel="주차모아">
      <View style={[styles.mark, compact && styles.compactMark]}>
        <MaterialCommunityIcons name="parking" size={compact ? 17 : 20} color={colors.surface} />
      </View>
      {!compact && <Text style={styles.wordmark}>주차모아</Text>}
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
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  compactMark: { width: 30, height: 34 },
  wordmark: { color: colors.ink, fontSize: 21, fontWeight: '900', letterSpacing: -1 },
});
