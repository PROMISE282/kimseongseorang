import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatWon } from '../data';
import { colors, radii, shadow } from '../theme';
import type { Space } from '../types';

const preview = require('../../assets/ai-space-preview.jpg');

type SpaceCardProps = {
  space: Space;
  onPress: () => void;
  horizontal?: boolean;
};

export function SpaceCard({ space, onPress, horizontal = false }: SpaceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${space.title} 상세보기`}
      style={({ pressed }) => [styles.card, horizontal && styles.horizontal, pressed && styles.pressed]}
    >
      <View style={[styles.imageWrap, horizontal && styles.horizontalImage]}>
        <Image source={preview} style={styles.image} resizeMode="cover" />
        <View style={styles.verifiedBadge}>
          <MaterialCommunityIcons name="check-decagram" size={14} color={colors.blue} />
          <Text style={styles.verifiedText}>AI 검증 {space.fitScore}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>{space.title}</Text>
          <MaterialCommunityIcons name="heart-outline" size={21} color={colors.ink} />
        </View>
        <Text style={styles.meta}>{space.walk} · {space.vehicle}</Text>
        <View style={styles.infoRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>{space.available}</Text>
          <Text style={styles.response}>호스트 {space.responseTime}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatWon(space.price)}</Text>
          <Text style={styles.unit}> / 시간</Text>
          <View style={styles.rating}>
            <MaterialCommunityIcons name="star" size={14} color={colors.amber} />
            <Text style={styles.ratingText}>{space.rating} ({space.reviews})</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden', borderRadius: radii.lg, backgroundColor: colors.surface, ...shadow },
  horizontal: { flexDirection: 'row', minHeight: 142 },
  imageWrap: { height: 178, backgroundColor: colors.blueSoft, position: 'relative' },
  horizontalImage: { width: 135, height: 'auto' },
  image: { width: '100%', height: '100%' },
  verifiedBadge: { position: 'absolute', left: 12, top: 12, minHeight: 30, paddingHorizontal: 10, borderRadius: radii.pill, backgroundColor: 'rgba(255,255,255,0.94)', flexDirection: 'row', alignItems: 'center', gap: 5 },
  verifiedText: { color: colors.blueDark, fontSize: 12, fontWeight: '800' },
  content: { flex: 1, padding: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  title: { flex: 1, color: colors.ink, fontSize: 17, fontWeight: '900', letterSpacing: -0.5 },
  meta: { marginTop: 7, color: colors.muted, fontSize: 13, fontWeight: '500' },
  infoRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green, marginRight: 6 },
  liveText: { color: colors.green, fontSize: 12, fontWeight: '800' },
  response: { marginLeft: 8, paddingLeft: 8, borderLeftWidth: 1, borderLeftColor: colors.line, color: colors.muted, fontSize: 12, fontWeight: '600' },
  priceRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
  price: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  unit: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  rating: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  pressed: { opacity: 0.74, transform: [{ scale: 0.99 }] },
});
