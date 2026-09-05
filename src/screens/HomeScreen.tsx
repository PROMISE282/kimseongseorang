import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Brand } from '../components/Brand';
import { Chip } from '../components/Chip';
import { MapCanvas } from '../components/MapCanvas';
import { SpaceCard } from '../components/SpaceCard';
import { spaces } from '../data';
import { colors, radii } from '../theme';
import type { Space, TabKey } from '../types';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const trustItems: { icon: IconName; label: string }[] = [
  { icon: 'cube-scan', label: 'AI 실측' },
  { icon: 'account-check-outline', label: '호스트 승인' },
  { icon: 'shield-check-outline', label: '체크인 보장' },
];

type HomeScreenProps = {
  onOpenSpace: (space: Space) => void;
  onOpenTab: (tab: TabKey) => void;
};

export function HomeScreen({ onOpenSpace, onOpenTab }: HomeScreenProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('전체');
  const [selected, setSelected] = useState(spaces[0]);
  const [view, setView] = useState<'map' | 'list'>('map');

  const visibleSpaces = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const searched = normalized
      ? spaces.filter((space) => `${space.title} ${space.area} ${space.walk}`.toLowerCase().includes(normalized))
      : spaces;
    if (filter === 'SUV') return searched.filter((space) => space.vehicle.includes('SUV'));
    if (filter === '즉시 승인') return searched.filter((space) => space.responseTime.includes('즉시'));
    if (filter === '2천원대') return searched.filter((space) => space.price < 3000);
    return searched;
  }, [filter, query]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Brand />
        <View style={styles.headerActions}>
          <Pressable accessibilityRole="button" accessibilityLabel="현재 위치 성수동, 지도 열기" style={styles.location} onPress={() => onOpenTab('map')}>
            <MaterialCommunityIcons name="map-marker" size={16} color={colors.blue} />
            <Text style={styles.locationText}>성수동</Text>
            <MaterialCommunityIcons name="chevron-down" size={16} color={colors.ink} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="새 알림 1개" onPress={() => Alert.alert('새 알림 1개', '민지님의 공간 이용 요청이 도착했어요.')} style={styles.iconButton}>
            <MaterialCommunityIcons name="bell-outline" size={22} color={colors.ink} />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={23} color={colors.subtle} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="동네·장소·주소로 찾아보세요"
          placeholderTextColor={colors.subtle}
          style={styles.searchInput}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable accessibilityLabel="검색어 지우기" onPress={() => setQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={19} color={colors.subtle} />
          </Pressable>
        )}
      </View>

      <LinearGradient colors={['#1267F7', '#0E4DCE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroPill}>
          <MaterialCommunityIcons name="cube-scan" size={14} color={colors.blue} />
          <Text style={styles.heroPillText}>AI로 먼저 확인하는 사유지 주차</Text>
        </View>
        <Text style={styles.heroTitle}>빈 공간을 찍으면,{`\n`}안심 주차가 시작돼요.</Text>
        <Text style={styles.heroBody}>실측 모델과 호스트 승인으로{`\n`}도착 후의 불확실함까지 줄였습니다.</Text>
        <Pressable accessibilityRole="button" style={styles.heroButton} onPress={() => onOpenTab('register')}>
          <Text style={styles.heroButtonText}>내 공간 등록하기</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color={colors.blue} />
        </Pressable>
        <View style={styles.heroDecoration}>
          <MaterialCommunityIcons name="car" size={49} color="rgba(255,255,255,0.95)" />
          <View style={styles.parkingLine} />
        </View>
      </LinearGradient>

      <View style={styles.trustRow}>
        {trustItems.map(({ icon, label }) => (
          <View key={label} style={styles.trustItem}>
            <MaterialCommunityIcons name={icon} size={19} color={colors.blue} />
            <Text style={styles.trustLabel}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>지금 승인 가능한 공간</Text>
        <View style={styles.segment}>
          <Pressable accessibilityRole="button" accessibilityLabel="지도 보기" accessibilityState={{ selected: view === 'map' }} onPress={() => setView('map')} style={[styles.segmentItem, view === 'map' && styles.segmentActive]}>
            <MaterialCommunityIcons name="map-outline" size={17} color={view === 'map' ? colors.blue : colors.subtle} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="목록 보기" accessibilityState={{ selected: view === 'list' }} onPress={() => setView('list')} style={[styles.segmentItem, view === 'list' && styles.segmentActive]}>
            <MaterialCommunityIcons name="format-list-bulleted" size={17} color={view === 'list' ? colors.blue : colors.subtle} />
          </Pressable>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {['전체', '즉시 승인', 'SUV', '2천원대'].map((label) => (
          <Chip key={label} label={label} active={filter === label} onPress={() => setFilter(label)} />
        ))}
      </ScrollView>

      {visibleSpaces.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="map-marker-off-outline" size={30} color={colors.subtle} />
          <Text style={styles.emptyTitle}>일치하는 공간이 없어요</Text>
          <Text style={styles.emptyBody}>다른 동네 이름이나 필터를 시도해보세요.</Text>
        </View>
      ) : view === 'map' ? (
        <>
          <MapCanvas spaces={visibleSpaces} selectedId={selected.id} onSelect={setSelected} />
          <View style={styles.cardGap}>
            <SpaceCard space={visibleSpaces.find((space) => space.id === selected.id) ?? visibleSpaces[0]} onPress={() => onOpenSpace(visibleSpaces.find((space) => space.id === selected.id) ?? visibleSpaces[0])} horizontal />
          </View>
        </>
      ) : (
        <View style={styles.list}>
          {visibleSpaces.map((space) => <SpaceCard key={space.id} space={space} onPress={() => onOpenSpace(space)} horizontal />)}
        </View>
      )}

      <Pressable accessibilityRole="button" accessibilityLabel="체크인 보장 안내 열기" style={styles.promise} onPress={() => onOpenTab('requests')}>
        <View style={styles.promiseIcon}>
          <MaterialCommunityIcons name="shield-check" size={22} color={colors.green} />
        </View>
        <View style={styles.promiseText}>
          <Text style={styles.promiseTitle}>도착했는데 주차할 수 없다면?</Text>
          <Text style={styles.promiseBody}>체크인 보장으로 즉시 대체 공간을 연결해요.</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.subtle} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 112 },
  header: { minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 3, minHeight: 38, paddingHorizontal: 10, borderRadius: radii.pill, backgroundColor: colors.surface },
  locationText: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notificationDot: { position: 'absolute', right: 10, top: 9, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.danger, borderWidth: 1, borderColor: colors.surface },
  searchBar: { height: 54, borderRadius: radii.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInput: { flex: 1, color: colors.ink, fontSize: 15, fontWeight: '600', paddingVertical: 0 },
  hero: { marginTop: 18, minHeight: 256, padding: 22, borderRadius: radii.xl, overflow: 'hidden' },
  heroPill: { alignSelf: 'flex-start', minHeight: 29, paddingHorizontal: 10, borderRadius: radii.pill, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 5 },
  heroPillText: { color: colors.blueDark, fontSize: 11, fontWeight: '900' },
  heroTitle: { marginTop: 18, color: colors.surface, fontSize: 27, lineHeight: 36, letterSpacing: -0.7, fontWeight: '900' },
  heroBody: { marginTop: 9, color: '#DCE8FF', fontSize: 13, lineHeight: 20, fontWeight: '600' },
  heroButton: { marginTop: 18, width: 150, minHeight: 43, paddingHorizontal: 14, borderRadius: 13, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, zIndex: 2 },
  heroButtonText: { color: colors.blueDark, fontSize: 13, fontWeight: '900' },
  heroDecoration: { position: 'absolute', right: 13, bottom: 10, width: 132, height: 92, alignItems: 'center', justifyContent: 'center' },
  parkingLine: { position: 'absolute', left: 4, right: 4, bottom: 4, height: 52, borderWidth: 3, borderTopWidth: 0, borderColor: 'rgba(255,255,255,0.22)', transform: [{ skewX: '-12deg' }] },
  trustRow: { marginTop: 12, paddingVertical: 15, paddingHorizontal: 12, borderRadius: radii.md, backgroundColor: colors.surface, flexDirection: 'row', justifyContent: 'space-around' },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  trustLabel: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  sectionHeading: { marginTop: 30, marginBottom: 14, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionTitle: { color: colors.ink, fontSize: 22, fontWeight: '900', letterSpacing: -0.6 },
  segment: { padding: 3, borderRadius: 11, backgroundColor: '#EAEDF1', flexDirection: 'row' },
  segmentItem: { width: 36, height: 31, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  segmentActive: { backgroundColor: colors.surface },
  filters: { gap: 8, paddingBottom: 14 },
  cardGap: { marginTop: 12 },
  list: { gap: 12 },
  empty: { height: 230, borderRadius: radii.lg, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { marginTop: 12, color: colors.ink, fontSize: 16, fontWeight: '900' },
  emptyBody: { marginTop: 5, color: colors.muted, fontSize: 13, textAlign: 'center' },
  promise: { marginTop: 18, minHeight: 78, padding: 14, borderRadius: radii.md, backgroundColor: colors.greenSoft, flexDirection: 'row', alignItems: 'center', gap: 11 },
  promiseIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  promiseText: { flex: 1 },
  promiseTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  promiseBody: { marginTop: 4, color: colors.muted, fontSize: 11, lineHeight: 16, fontWeight: '600' },
});
