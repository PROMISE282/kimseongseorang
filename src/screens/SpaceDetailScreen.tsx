import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/PrimaryButton';
import { Pill } from '../components/Pill';
import { useSpace, useStore, usePrimaryVehicle } from '../store/StoreProvider';
import { useTheme } from '../theme/ThemeProvider';
import { computeFit } from '../utils/fit';
import { formatWon, vehicleClassLabel } from '../utils/format';
import type { RootStackParamList } from '../navigation/types';

const preview = require('../../assets/ai-space-preview.jpg');
type Nav = NativeStackNavigationProp<RootStackParamList>;
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const featureIcon = (feature: string): IconName => {
  if (feature.includes('CCTV') || feature.includes('보안') || feature.includes('번호판')) return 'cctv';
  if (feature.includes('조명') || feature.includes('야간')) return 'weather-night';
  if (feature.includes('충전') || feature.includes('전기')) return 'ev-station';
  if (feature.includes('실내')) return 'garage';
  if (feature.includes('넓') || feature.includes('대형')) return 'arrow-expand-all';
  if (feature.includes('조망') || feature.includes('한강')) return 'image-filter-hdr';
  if (feature.includes('경사')) return 'slope-uphill';
  if (feature.includes('평지')) return 'road-variant';
  if (feature.includes('독립') || feature.includes('전용')) return 'shield-home-outline';
  return 'checkbox-marked-circle-outline';
};

export function SpaceDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'SpaceDetail'>>();
  const { colors, radii, shadow } = useTheme();
  const insets = useSafeAreaInsets();
  const space = useSpace(params.spaceId);
  const vehicle = usePrimaryVehicle();
  const { state, dispatch } = useStore();

  if (!space) {
    return (
      <View style={[styles.missing, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons name="map-marker-off" size={34} color={colors.subtle} />
        <Text style={[styles.missingText, { color: colors.ink }]}>공간을 찾을 수 없어요</Text>
        <PrimaryButton label="뒤로 가기" icon="arrow-left" secondary onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const favorited = state.favorites.includes(space.id);
  const fit = computeFit(space, vehicle);
  const difficultyTone = space.entryDifficulty === 'easy' ? 'green' : space.entryDifficulty === 'normal' ? 'amber' : 'danger';
  const difficultyLabel = space.entryDifficulty === 'easy' ? '진입 쉬움' : space.entryDifficulty === 'normal' ? '진입 보통' : '진입 주의';

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.imageWrap, { backgroundColor: colors.blueSoft }]}>
          <Image source={preview} style={styles.image} resizeMode="cover" />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="뒤로"
            onPress={() => navigation.goBack()}
            style={[styles.roundButton, shadow, { top: insets.top + 8, left: 18 }]}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#111827" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={favorited ? '찜 해제' : '찜하기'}
            accessibilityState={{ selected: favorited }}
            onPress={() => dispatch({ type: 'toggleFavorite', spaceId: space.id })}
            style={[styles.roundButton, shadow, { top: insets.top + 8, right: 18 }]}
          >
            <MaterialCommunityIcons
              name={favorited ? 'heart' : 'heart-outline'}
              size={22}
              color={favorited ? colors.danger : '#111827'}
            />
          </Pressable>
          <View style={[styles.modelBadge, { borderRadius: radii.pill }]}>
            <MaterialCommunityIcons name="cube-scan" size={16} color={colors.blue} />
            <Text style={[styles.modelBadgeText, { color: colors.blueDark }]}>AI 공간 모델</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.liveRow}>
            <Pill label={space.instant ? '즉시 승인' : '승인 가능'} tone={space.instant ? 'green' : 'blue'} icon="circle-medium" />
            <Text style={[styles.liveTime, { color: colors.muted }]}>호스트 {space.responseTime}</Text>
          </View>
          <Text style={[styles.title, { color: colors.ink }]}>{space.title}</Text>
          <Text style={[styles.location, { color: colors.muted }]}>
            {space.area} · {space.walk}
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.ink }]}>{formatWon(space.price)}</Text>
            <Text style={[styles.unit, { color: colors.muted }]}> / 시간</Text>
            <View style={styles.rating}>
              <MaterialCommunityIcons name="star" size={16} color={colors.amber} />
              <Text style={[styles.ratingText, { color: colors.ink }]}>
                {space.rating} · 후기 {space.reviews}
              </Text>
            </View>
          </View>

          <View style={[styles.aiCard, { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: radii.lg }]}>
            <View style={styles.aiHeader}>
              <View style={[styles.aiIcon, { backgroundColor: colors.blueSoft, borderRadius: radii.md }]}>
                <MaterialCommunityIcons name="auto-fix" size={22} color={colors.blue} />
              </View>
              <View style={styles.aiText}>
                <Text style={[styles.aiTitle, { color: colors.ink }]}>
                  {vehicle ? `${vehicle.name}와 ${fit.score}% 잘 맞아요` : `AI 적합도 ${fit.score}%`}
                </Text>
                <Text style={[styles.aiSub, { color: colors.muted }]}>{fit.summary}</Text>
              </View>
              <Text style={[styles.score, { color: colors.blue }]}>{fit.score}</Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: colors.blueSoft }]}>
              <View style={[styles.progress, { width: `${fit.score}%`, backgroundColor: colors.blue }]} />
            </View>
            <View style={styles.metrics}>
              <Metric icon="arrow-expand-horizontal" label="폭" value={`${space.dimensions.width.toFixed(2)} m`} />
              <Metric icon="arrow-expand-vertical" label="길이" value={`${space.dimensions.length.toFixed(2)} m`} />
              <Metric icon="car-info" label="최대 차량" value={vehicleClassLabel[space.maxClass].replace('까지', '')} last />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.ink }]}>사진보다 정확한 진입 정보</Text>
            <Text style={[styles.sectionBody, { color: colors.muted }]}>
              업로드된 사진을 AI가 공간 모델로 만들고, 차폭과 회전 반경을 기준으로 진입 난이도를 계산했어요.
            </Text>
            <View style={[styles.routeCard, { backgroundColor: colors.surfaceAlt, borderRadius: radii.md }]}>
              <View style={[styles.routeLine, { backgroundColor: colors.blue }]} />
              <View style={[styles.routeStart, { backgroundColor: colors.charcoal }]}>
                <MaterialCommunityIcons name="car" size={18} color="#FFFFFF" />
              </View>
              <View style={[styles.routeEnd, { backgroundColor: colors.blue }]}>
                <MaterialCommunityIcons name="parking" size={20} color="#FFFFFF" />
              </View>
              <Text style={[styles.routeLabel, { color: colors.ink }]}>{space.entryNote}</Text>
              <Pill label={difficultyLabel} tone={difficultyTone} style={styles.routeBadge} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.ink }]}>공간 정보</Text>
            <View style={styles.featureGrid}>
              {space.features.map((feature) => (
                <View key={feature} style={[styles.feature, { backgroundColor: colors.surface, borderRadius: radii.md }]}>
                  <MaterialCommunityIcons name={featureIcon(feature)} size={22} color={colors.blue} />
                  <Text style={[styles.featureText, { color: colors.ink }]}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.hostCard, { backgroundColor: colors.surface, borderRadius: radii.md }]}>
            <View style={[styles.avatar, { backgroundColor: colors.sky }]}>
              <Text style={[styles.avatarText, { color: colors.blueDark }]}>{space.host.initial}</Text>
            </View>
            <View style={styles.hostInfo}>
              <Text style={[styles.hostName, { color: colors.ink }]}>호스트 {space.host.name}님</Text>
              <Text style={[styles.hostMeta, { color: colors.muted }]}>
                {space.host.verified ? '본인·소유권 확인 완료 · ' : ''}승인율 {space.host.approvalRate}%
              </Text>
            </View>
            {space.host.verified && <MaterialCommunityIcons name="check-decagram" size={22} color={colors.blue} />}
          </View>

          <View style={[styles.notice, { backgroundColor: colors.greenSoft, borderRadius: radii.md }]}>
            <MaterialCommunityIcons name="shield-check-outline" size={22} color={colors.green} />
            <View style={styles.noticeText}>
              <Text style={[styles.noticeTitle, { color: colors.ink }]}>승인 후에만 결제돼요</Text>
              <Text style={[styles.noticeBody, { color: colors.muted }]}>
                호스트가 차량 정보를 확인한 뒤 승인합니다. 승인된 공간은 도착 시 체크인까지 보장하고,
                상세 주소는 승인 후 공개됩니다.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, shadow, { backgroundColor: colors.surface, borderTopColor: colors.line, paddingBottom: insets.bottom + 14 }]}>
        <View>
          <Text style={[styles.bottomPrice, { color: colors.ink }]}>{formatWon(space.price)}</Text>
          <Text style={[styles.bottomUnit, { color: colors.muted }]}>1시간 기준</Text>
        </View>
        <PrimaryButton
          label={space.ownedByMe ? '내가 등록한 공간' : '승인 요청하기'}
          icon="arrow-right"
          disabled={space.ownedByMe}
          onPress={() => navigation.navigate('Booking', { spaceId: space.id })}
          style={styles.bookButton}
        />
      </View>
    </View>
  );
}

function Metric({ icon, label, value, last = false }: { icon: IconName; label: string; value: string; last?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.metric, { borderRightColor: colors.line }, last && { borderRightWidth: 0 }]}>
      <MaterialCommunityIcons name={icon} size={18} color={colors.muted} />
      <Text style={[styles.metricLabel, { color: colors.subtle }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: colors.ink }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 },
  missingText: { fontSize: 17, fontWeight: '900' },
  imageWrap: { height: 320, position: 'relative' },
  image: { width: '100%', height: '100%' },
  roundButton: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelBadge: {
    position: 'absolute',
    left: 18,
    bottom: 16,
    minHeight: 34,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modelBadgeText: { fontSize: 12, fontWeight: '900' },
  content: { padding: 20 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  liveTime: { fontSize: 12, fontWeight: '600' },
  title: { marginTop: 14, fontSize: 26, lineHeight: 34, fontWeight: '900', letterSpacing: -0.8 },
  location: { marginTop: 6, fontSize: 14, fontWeight: '600' },
  priceRow: { marginTop: 16, flexDirection: 'row', alignItems: 'center' },
  price: { fontSize: 22, fontWeight: '900' },
  unit: { fontSize: 13, fontWeight: '600' },
  rating: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '800' },
  aiCard: { marginTop: 24, padding: 18, borderWidth: 1 },
  aiHeader: { flexDirection: 'row', alignItems: 'center' },
  aiIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  aiText: { flex: 1, marginLeft: 11 },
  aiTitle: { fontSize: 15, fontWeight: '900' },
  aiSub: { marginTop: 3, fontSize: 11, fontWeight: '600' },
  score: { fontSize: 28, fontWeight: '900' },
  progressTrack: { marginTop: 16, height: 7, borderRadius: 4, overflow: 'hidden' },
  progress: { height: '100%', borderRadius: 4 },
  metrics: { marginTop: 17, flexDirection: 'row' },
  metric: { flex: 1, alignItems: 'center', borderRightWidth: 1 },
  metricLabel: { marginTop: 4, fontSize: 10, fontWeight: '700' },
  metricValue: { marginTop: 2, fontSize: 12, fontWeight: '900' },
  section: { marginTop: 28 },
  sectionTitle: { fontSize: 19, fontWeight: '900', letterSpacing: -0.5 },
  sectionBody: { marginTop: 8, fontSize: 13, lineHeight: 20, fontWeight: '500' },
  routeCard: { marginTop: 15, height: 128, overflow: 'hidden', position: 'relative' },
  routeLine: { position: 'absolute', left: 42, top: 70, width: '62%', height: 4, transform: [{ rotate: '-11deg' }] },
  routeStart: { position: 'absolute', left: 26, bottom: 20, width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  routeEnd: { position: 'absolute', right: 30, top: 20, width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  routeLabel: { position: 'absolute', left: 18, top: 14, right: 90, fontSize: 12, fontWeight: '800' },
  routeBadge: { position: 'absolute', right: 14, bottom: 12 },
  featureGrid: { marginTop: 14, flexDirection: 'row', gap: 8 },
  feature: { flex: 1, minHeight: 88, padding: 10, alignItems: 'center', justifyContent: 'center' },
  featureText: { marginTop: 7, fontSize: 11, fontWeight: '800', textAlign: 'center' },
  hostCard: { marginTop: 28, padding: 16, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '900' },
  hostInfo: { flex: 1, marginLeft: 11 },
  hostName: { fontSize: 14, fontWeight: '900' },
  hostMeta: { marginTop: 4, fontSize: 11, fontWeight: '600' },
  notice: { marginTop: 12, padding: 16, flexDirection: 'row', gap: 11 },
  noticeText: { flex: 1 },
  noticeTitle: { fontSize: 14, fontWeight: '900' },
  noticeBody: { marginTop: 5, fontSize: 11, lineHeight: 17, fontWeight: '600' },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomPrice: { fontSize: 18, fontWeight: '900' },
  bottomUnit: { marginTop: 2, fontSize: 10, fontWeight: '600' },
  bookButton: { flex: 1, marginLeft: 20 },
});
