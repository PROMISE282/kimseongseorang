import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useStore } from '../store/StoreProvider';
import type { Space } from '../store/types';
import { useTheme } from '../theme/ThemeProvider';
import { formatWon } from '../utils/format';

const preview = require('../../assets/ai-space-preview.jpg');

type SpaceCardProps = {
  space: Space;
  onPress: () => void;
  horizontal?: boolean;
};

export function SpaceCard({ space, onPress, horizontal = false }: SpaceCardProps) {
  const { colors, radii, shadow } = useTheme();
  const { state, dispatch } = useStore();
  const favorited = state.favorites.includes(space.id);

  return (
    <View
      style={[
        styles.card,
        shadow,
        { backgroundColor: colors.surface, borderRadius: radii.lg },
        horizontal && styles.horizontal,
      ]}
    >
      {/* Full-bleed tap target sits behind the content so the favorite button
          is a sibling, not a nested interactive element. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${space.title}, 시간당 ${formatWon(space.price)}, 상세보기`}
        onPress={onPress}
        style={({ pressed }) => [StyleSheet.absoluteFill, styles.tap, pressed && styles.pressed]}
      />

      <View
        pointerEvents="none"
        style={[
          styles.imageWrap,
          { backgroundColor: colors.blueSoft },
          horizontal ? styles.horizontalImage : styles.verticalImage,
        ]}
      >
        <Image source={preview} style={styles.image} resizeMode="cover" />
        <View style={[styles.badge, { borderRadius: radii.pill }]}>
          <MaterialCommunityIcons name="check-decagram" size={13} color={colors.blue} />
          <Text style={[styles.badgeText, { color: colors.blueDark }]}>AI 검증 {space.aiConfidence}%</Text>
        </View>
      </View>

      <View style={styles.content} pointerEvents="box-none">
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.ink }]}>
            {space.title}
          </Text>
          <Pressable
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={favorited ? '찜 해제' : '찜하기'}
            accessibilityState={{ selected: favorited }}
            onPress={() => dispatch({ type: 'toggleFavorite', spaceId: space.id })}
          >
            <MaterialCommunityIcons
              name={favorited ? 'heart' : 'heart-outline'}
              size={21}
              color={favorited ? colors.danger : colors.subtle}
            />
          </Pressable>
        </View>

        <Text style={[styles.meta, { color: colors.muted }]} pointerEvents="none">
          {space.area} · {space.walk}
        </Text>

        <View style={styles.infoRow} pointerEvents="none">
          <View style={[styles.dot, { backgroundColor: space.availableFromNow ? colors.green : colors.amber }]} />
          <Text style={[styles.live, { color: space.availableFromNow ? colors.green : colors.amber }]}>
            {space.available}
          </Text>
          <Text style={[styles.response, { color: colors.muted, borderLeftColor: colors.line }]}>
            호스트 {space.responseTime}
          </Text>
        </View>

        <View style={styles.priceRow} pointerEvents="none">
          <Text style={[styles.price, { color: colors.ink }]}>{formatWon(space.price)}</Text>
          <Text style={[styles.unit, { color: colors.muted }]}> / 시간</Text>
          <View style={styles.rating}>
            <MaterialCommunityIcons name="star" size={14} color={colors.amber} />
            <Text style={[styles.ratingText, { color: colors.muted }]}>
              {space.rating} ({space.reviews})
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  tap: { zIndex: 0 },
  horizontal: { flexDirection: 'row', minHeight: 148 },
  imageWrap: { position: 'relative' },
  verticalImage: { height: 178 },
  horizontalImage: { width: 132 },
  image: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    left: 12,
    top: 12,
    minHeight: 28,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  badgeText: { fontSize: 11, fontWeight: '900' },
  content: { flex: 1, padding: 15 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  title: { flex: 1, fontSize: 17, fontWeight: '900', letterSpacing: -0.5 },
  meta: { marginTop: 7, fontSize: 13, fontWeight: '500' },
  infoRow: { marginTop: 11, flexDirection: 'row', alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  live: { fontSize: 12, fontWeight: '800' },
  response: { marginLeft: 8, paddingLeft: 8, borderLeftWidth: 1, fontSize: 12, fontWeight: '600' },
  priceRow: { marginTop: 11, flexDirection: 'row', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: '900' },
  unit: { fontSize: 13, fontWeight: '600' },
  rating: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 12, fontWeight: '700' },
  pressed: { opacity: 0.82 },
});
