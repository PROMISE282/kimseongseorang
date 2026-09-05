import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { formatWon } from '../data';
import { colors, radii, shadow } from '../theme';
import type { Space } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';

const preview = require('../../assets/ai-space-preview.jpg');

type SpaceDetailScreenProps = {
  space: Space;
  onBack: () => void;
  onBook: () => void;
};

export function SpaceDetailScreen({ space, onBack, onBook }: SpaceDetailScreenProps) {
  const [liked, setLiked] = useState(false);
  const featureIcons: (keyof typeof MaterialCommunityIcons.glyphMap)[] = ['shield-home-outline', 'cctv', 'weather-night'];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageWrap}>
          <Image source={preview} style={styles.image} resizeMode="cover" />
          <Pressable accessibilityRole="button" onPress={onBack} accessibilityLabel="뒤로" style={[styles.roundButton, styles.back]}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.ink} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={liked ? '찜 해제' : '찜하기'} accessibilityState={{ selected: liked }} onPress={() => setLiked((value) => !value)} style={[styles.roundButton, styles.heart]}>
            <MaterialCommunityIcons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? colors.danger : colors.ink} />
          </Pressable>
          <View style={styles.modelBadge}>
            <MaterialCommunityIcons name="cube-scan" size={17} color={colors.blue} />
            <Text style={styles.modelBadgeText}>AI 공간 모델</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.liveRow}>
            <View style={styles.liveBadge}><View style={styles.liveDot} /><Text style={styles.liveText}>승인 가능</Text></View>
            <Text style={styles.liveTime}>호스트 {space.responseTime}</Text>
          </View>
          <Text style={styles.title}>{space.title}</Text>
          <Text style={styles.location}>{space.area} · {space.walk}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatWon(space.price)}</Text><Text style={styles.unit}> / 시간</Text>
            <View style={styles.rating}><MaterialCommunityIcons name="star" size={16} color={colors.amber} /><Text style={styles.ratingText}>{space.rating} · 후기 {space.reviews}</Text></View>
          </View>

          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <View style={styles.aiIcon}><MaterialCommunityIcons name="auto-fix" size={22} color={colors.blue} /></View>
              <View style={styles.aiText}>
                <Text style={styles.aiTitle}>내 차와 {space.fitScore}% 잘 맞아요</Text>
              </View>
              <Text style={styles.score}>{space.fitScore}</Text>
            </View>
            <View style={styles.progressTrack}><View style={[styles.progress, { width: `${space.fitScore}%` }]} /></View>
            <View style={styles.metrics}>
              <Metric icon="arrow-expand-horizontal" label="폭" value="2.48 m" />
              <Metric icon="arrow-expand-vertical" label="길이" value="5.32 m" />
              <Metric icon="car-info" label="차량" value={space.vehicle} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>사진보다 정확한 진입 정보</Text>
            <Text style={styles.sectionBody}>업로드된 사진을 AI가 공간 모델로 만들고, 차폭과 회전 반경을 기준으로 진입 난이도를 계산했어요.</Text>
            <View style={styles.routeCard}>
              <View style={styles.routeLine} />
              <View style={styles.routeStart}><MaterialCommunityIcons name="car" size={19} color={colors.surface} /></View>
              <View style={styles.routeEnd}><MaterialCommunityIcons name="parking" size={22} color={colors.surface} /></View>
              <Text style={styles.routeLabel}>우측 담장을 따라 천천히 진입</Text>
              <View style={styles.routeBadge}><Text style={styles.routeBadgeText}>진입 난이도 쉬움</Text></View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>공간 정보</Text>
            <View style={styles.featureGrid}>
              {space.features.map((feature, index) => {
                return (
                  <View key={feature} style={styles.feature}>
                    <MaterialCommunityIcons name={featureIcons[index]} size={22} color={colors.blue} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.hostCard}>
            <View style={styles.avatar}><Text style={styles.avatarText}>김</Text></View>
            <View style={styles.hostInfo}>
              <Text style={styles.hostName}>호스트 김성호님</Text>
              <Text style={styles.hostMeta}>본인·소유권 확인 완료 · 승인율 98%</Text>
            </View>
            <MaterialCommunityIcons name="check-decagram" size={22} color={colors.blue} />
          </View>

          <View style={styles.notice}>
            <MaterialCommunityIcons name="shield-check-outline" size={22} color={colors.green} />
            <View style={styles.noticeText}>
              <Text style={styles.noticeTitle}>승인 후에만 결제돼요</Text>
              <Text style={styles.noticeBody}>호스트가 차량 정보를 확인한 뒤 승인합니다. 승인된 공간은 도착 시 체크인까지 보장해요.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <View><Text style={styles.bottomPrice}>{formatWon(space.price)}</Text><Text style={styles.bottomUnit}>1시간 기준</Text></View>
        <PrimaryButton label="승인 요청하기" icon="arrow-right" onPress={onBook} style={styles.bookButton} />
      </View>
    </View>
  );
}

function Metric({ icon, label, value }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <MaterialCommunityIcons name={icon} size={18} color={colors.muted} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 118 },
  imageWrap: { height: 300, backgroundColor: colors.blueSoft, position: 'relative' },
  image: { width: '100%', height: '100%' },
  roundButton: { position: 'absolute', top: 18, width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center', ...shadow },
  back: { left: 18 },
  heart: { right: 18 },
  modelBadge: { position: 'absolute', left: 18, bottom: 16, minHeight: 34, paddingHorizontal: 12, borderRadius: radii.pill, backgroundColor: 'rgba(255,255,255,0.95)', flexDirection: 'row', alignItems: 'center', gap: 6 },
  modelBadgeText: { color: colors.blueDark, fontSize: 12, fontWeight: '900' },
  content: { padding: 20 },
  liveRow: { flexDirection: 'row', alignItems: 'center' },
  liveBadge: { minHeight: 29, paddingHorizontal: 10, borderRadius: radii.pill, backgroundColor: colors.greenSoft, flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green },
  liveText: { color: colors.green, fontSize: 12, fontWeight: '900' },
  liveTime: { marginLeft: 9, color: colors.muted, fontSize: 12, fontWeight: '600' },
  title: { marginTop: 14, color: colors.ink, fontSize: 27, lineHeight: 35, fontWeight: '900', letterSpacing: -0.8 },
  location: { marginTop: 6, color: colors.muted, fontSize: 14, fontWeight: '600' },
  priceRow: { marginTop: 17, flexDirection: 'row', alignItems: 'center' },
  price: { color: colors.ink, fontSize: 22, fontWeight: '900' },
  unit: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  rating: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  aiCard: { marginTop: 25, padding: 18, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#E4ECFA' },
  aiHeader: { flexDirection: 'row', alignItems: 'center' },
  aiIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center' },
  aiText: { flex: 1, marginLeft: 11 },
  aiTitle: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  score: { color: colors.blue, fontSize: 29, fontWeight: '900' },
  progressTrack: { marginTop: 16, height: 7, borderRadius: 4, backgroundColor: colors.blueSoft, overflow: 'hidden' },
  progress: { height: '100%', borderRadius: 4, backgroundColor: colors.blue },
  metrics: { marginTop: 17, flexDirection: 'row' },
  metric: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: colors.line },
  metricLabel: { marginTop: 4, color: colors.subtle, fontSize: 10, fontWeight: '700' },
  metricValue: { marginTop: 2, color: colors.ink, fontSize: 12, fontWeight: '900' },
  section: { marginTop: 30 },
  sectionTitle: { color: colors.ink, fontSize: 19, fontWeight: '900', letterSpacing: -0.5 },
  sectionBody: { marginTop: 8, color: colors.muted, fontSize: 13, lineHeight: 20, fontWeight: '500' },
  routeCard: { marginTop: 15, height: 126, overflow: 'hidden', borderRadius: radii.md, backgroundColor: '#E9EDF1', position: 'relative' },
  routeLine: { position: 'absolute', left: 42, top: 68, width: '65%', height: 4, backgroundColor: colors.blue, transform: [{ rotate: '-11deg' }] },
  routeStart: { position: 'absolute', left: 28, bottom: 22, width: 35, height: 35, borderRadius: 18, backgroundColor: colors.charcoal, alignItems: 'center', justifyContent: 'center' },
  routeEnd: { position: 'absolute', right: 33, top: 21, width: 38, height: 38, borderRadius: 19, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  routeLabel: { position: 'absolute', left: 20, top: 16, color: colors.ink, fontSize: 12, fontWeight: '800' },
  routeBadge: { position: 'absolute', right: 16, bottom: 13, paddingVertical: 6, paddingHorizontal: 9, borderRadius: radii.pill, backgroundColor: colors.greenSoft },
  routeBadgeText: { color: colors.green, fontSize: 10, fontWeight: '900' },
  featureGrid: { marginTop: 14, flexDirection: 'row', gap: 8 },
  feature: { flex: 1, minHeight: 86, padding: 10, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  featureText: { marginTop: 7, color: colors.ink, fontSize: 11, fontWeight: '800', textAlign: 'center' },
  hostCard: { marginTop: 30, padding: 16, borderRadius: radii.md, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.blueDark, fontSize: 18, fontWeight: '900' },
  hostInfo: { flex: 1, marginLeft: 11 },
  hostName: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  hostMeta: { marginTop: 4, color: colors.muted, fontSize: 11, fontWeight: '600' },
  notice: { marginTop: 12, padding: 16, borderRadius: radii.md, backgroundColor: colors.greenSoft, flexDirection: 'row', gap: 11 },
  noticeText: { flex: 1 },
  noticeTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  noticeBody: { marginTop: 5, color: colors.muted, fontSize: 11, lineHeight: 17, fontWeight: '600' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 88, paddingHorizontal: 20, paddingVertical: 14, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: 'row', alignItems: 'center', ...shadow },
  bottomPrice: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  bottomUnit: { marginTop: 2, color: colors.muted, fontSize: 10, fontWeight: '600' },
  bookButton: { flex: 1, marginLeft: 22 },
});
