import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Brand } from '../components/Brand';
import { Chip } from '../components/Chip';
import { EmptyState } from '../components/EmptyState';
import { MapCanvas } from '../components/MapCanvas';
import { Screen } from '../components/Screen';
import { SpaceCard } from '../components/SpaceCard';
import {
  useSpaces,
  useStore,
  useUnreadCount,
  usePrimaryVehicle,
} from '../store/StoreProvider';
import type { Space } from '../store/types';
import { useTheme } from '../theme/ThemeProvider';
import { computeFit } from '../utils/fit';
import { vehicleClassOrder } from '../utils/format';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const trustItems: { icon: IconName; label: string }[] = [
  { icon: 'cube-scan', label: 'AI 실측' },
  { icon: 'account-check-outline', label: '호스트 승인' },
  { icon: 'shield-check-outline', label: '체크인 보장' },
];

const filters = ['전체', '즉시 승인', '내 차 적합', '2천원대'] as const;
type Filter = (typeof filters)[number];

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { colors, radii } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const spaces = useSpaces();
  const vehicle = usePrimaryVehicle();
  const unread = useUnreadCount();
  const { dispatch } = useStore();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('전체');
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selectedId, setSelectedId] = useState<string | undefined>(spaces[0]?.id);

  const visibleSpaces = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = spaces.filter((s) => s.listed);
    if (q) list = list.filter((s) => `${s.title} ${s.area} ${s.walk}`.toLowerCase().includes(q));
    if (filter === '즉시 승인') list = list.filter((s) => s.instant);
    if (filter === '2천원대') list = list.filter((s) => s.price >= 2000 && s.price < 3000);
    if (filter === '내 차 적합' && vehicle) {
      list = list.filter(
        (s) => vehicleClassOrder.indexOf(vehicle.vClass) <= vehicleClassOrder.indexOf(s.maxClass) && computeFit(s, vehicle).fits,
      );
    }
    return list;
  }, [spaces, query, filter, vehicle]);

  const current: Space | undefined =
    visibleSpaces.find((s) => s.id === selectedId) ?? visibleSpaces[0];

  const submitSearch = () => {
    if (query.trim()) dispatch({ type: 'pushRecentSearch', term: query.trim() });
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Brand />
          <View style={styles.headerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="지도에서 성동구 열기"
              style={[styles.location, { backgroundColor: colors.surface, borderRadius: radii.pill }]}
              onPress={() => navigation.navigate('Tabs', { screen: 'Map' })}
            >
              <MaterialCommunityIcons name="map-marker" size={16} color={colors.blue} />
              <Text style={[styles.locationText, { color: colors.ink }]}>성동구</Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color={colors.ink} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={unread > 0 ? `읽지 않은 알림 ${unread}개` : '알림'}
              onPress={() => navigation.navigate('Notifications')}
              style={[styles.iconButton, { backgroundColor: colors.surface }]}
            >
              <MaterialCommunityIcons name="bell-outline" size={22} color={colors.ink} />
              {unread > 0 && (
                <View style={[styles.notificationDot, { backgroundColor: colors.danger, borderColor: colors.surface }]} />
              )}
            </Pressable>
          </View>
        </View>

        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: radii.md }]}>
          <MaterialCommunityIcons name="magnify" size={22} color={colors.subtle} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={submitSearch}
            placeholder="동네·장소·주소로 찾아보세요"
            placeholderTextColor={colors.subtle}
            style={[styles.searchInput, { color: colors.ink }]}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable accessibilityLabel="검색어 지우기" hitSlop={8} onPress={() => setQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={19} color={colors.subtle} />
            </Pressable>
          )}
        </View>

        <LinearGradient
          colors={[colors.blue, colors.blueDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { borderRadius: radii.xl }]}
        >
          <View style={[styles.heroPill, { backgroundColor: colors.surface, borderRadius: radii.pill }]}>
            <MaterialCommunityIcons name="cube-scan" size={13} color={colors.blue} />
            <Text style={[styles.heroPillText, { color: colors.blueDark }]}>AI로 먼저 확인하는 사유지 주차</Text>
          </View>
          <Text style={styles.heroTitle}>빈 공간을 찍으면,{'\n'}안심 주차가 시작돼요.</Text>
          <Text style={styles.heroBody}>실측 모델과 호스트 승인으로{'\n'}도착 후의 불확실함까지 줄였습니다.</Text>
          <Pressable
            accessibilityRole="button"
            style={[styles.heroButton, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('Tabs', { screen: 'Register' })}
          >
            <Text style={[styles.heroButtonText, { color: colors.blueDark }]}>내 공간 등록하기</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={colors.blue} />
          </Pressable>
          <View style={styles.heroDecoration}>
            <MaterialCommunityIcons name="car" size={48} color="rgba(255,255,255,0.95)" />
          </View>
        </LinearGradient>

        <View style={[styles.trustRow, { backgroundColor: colors.surface, borderRadius: radii.md }]}>
          {trustItems.map(({ icon, label }) => (
            <View key={label} style={styles.trustItem}>
              <MaterialCommunityIcons name={icon} size={18} color={colors.blue} />
              <Text style={[styles.trustLabel, { color: colors.ink }]}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeading}>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>지금 승인 가능한 공간</Text>
          <View style={[styles.segment, { backgroundColor: colors.surfaceAlt }]}>
            {(['map', 'list'] as const).map((v) => (
              <Pressable
                key={v}
                accessibilityRole="button"
                accessibilityLabel={v === 'map' ? '지도 보기' : '목록 보기'}
                accessibilityState={{ selected: view === v }}
                onPress={() => setView(v)}
                style={[styles.segmentItem, view === v && { backgroundColor: colors.surface }]}
              >
                <MaterialCommunityIcons
                  name={v === 'map' ? 'map-outline' : 'format-list-bulleted'}
                  size={17}
                  color={view === v ? colors.blue : colors.subtle}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((label) => (
            <Chip
              key={label}
              label={label}
              active={filter === label}
              onPress={() => setFilter((f) => (f === label ? '전체' : label))}
            />
          ))}
        </ScrollView>

        {visibleSpaces.length === 0 ? (
          <EmptyState
            icon="map-marker-off-outline"
            title="일치하는 공간이 없어요"
            body="다른 동네 이름이나 필터를 시도해보세요."
          />
        ) : view === 'map' ? (
          <>
            <MapCanvas
              spaces={visibleSpaces}
              selectedId={current?.id}
              onSelect={(s) => setSelectedId(s.id)}
              onRecenter={() => setSelectedId(visibleSpaces[0]?.id)}
            />
            {current && (
              <View style={styles.cardGap}>
                <SpaceCard
                  space={current}
                  horizontal
                  onPress={() => navigation.navigate('SpaceDetail', { spaceId: current.id })}
                />
              </View>
            )}
          </>
        ) : (
          <View style={styles.list}>
            {visibleSpaces.map((space) => (
              <SpaceCard
                key={space.id}
                space={space}
                horizontal
                onPress={() => navigation.navigate('SpaceDetail', { spaceId: space.id })}
              />
            ))}
          </View>
        )}

        <View style={[styles.promise, { backgroundColor: colors.greenSoft, borderRadius: radii.md }]}>
          <View style={[styles.promiseIcon, { backgroundColor: colors.surface }]}>
            <MaterialCommunityIcons name="shield-check" size={22} color={colors.green} />
          </View>
          <View style={styles.promiseText}>
            <Text style={[styles.promiseTitle, { color: colors.ink }]}>도착했는데 주차할 수 없다면?</Text>
            <Text style={[styles.promiseBody, { color: colors.muted }]}>
              체크인 보장으로 즉시 대체 공간을 연결해요.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 8 },
  header: { minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 3, minHeight: 38, paddingHorizontal: 10 },
  locationText: { fontSize: 13, fontWeight: '800' },
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notificationDot: { position: 'absolute', right: 9, top: 8, width: 8, height: 8, borderRadius: 4, borderWidth: 1.5 },
  searchBar: { height: 54, borderWidth: 1, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '600', paddingVertical: 0 },
  hero: { marginTop: 18, minHeight: 250, padding: 22, overflow: 'hidden' },
  heroPill: { alignSelf: 'flex-start', minHeight: 28, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 5 },
  heroPillText: { fontSize: 11, fontWeight: '900' },
  heroTitle: { marginTop: 18, color: '#FFFFFF', fontSize: 26, lineHeight: 35, letterSpacing: -0.7, fontWeight: '900' },
  heroBody: { marginTop: 9, color: '#DCE8FF', fontSize: 13, lineHeight: 20, fontWeight: '600' },
  heroButton: { marginTop: 18, alignSelf: 'flex-start', minHeight: 43, paddingHorizontal: 16, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  heroButtonText: { fontSize: 13, fontWeight: '900' },
  heroDecoration: { position: 'absolute', right: 18, bottom: 16 },
  trustRow: { marginTop: 12, paddingVertical: 15, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-around' },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  trustLabel: { fontSize: 12, fontWeight: '800' },
  sectionHeading: { marginTop: 30, marginBottom: 14, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.6 },
  segment: { padding: 3, borderRadius: 11, flexDirection: 'row' },
  segmentItem: { width: 36, height: 31, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  filters: { gap: 8, paddingBottom: 14, paddingRight: 8 },
  cardGap: { marginTop: 12 },
  list: { gap: 12 },
  promise: { marginTop: 18, minHeight: 78, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11 },
  promiseIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  promiseText: { flex: 1 },
  promiseTitle: { fontSize: 14, fontWeight: '900' },
  promiseBody: { marginTop: 4, fontSize: 11, lineHeight: 16, fontWeight: '600' },
});
