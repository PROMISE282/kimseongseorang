import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip } from '../components/Chip';
import { MapCanvas } from '../components/MapCanvas';
import { Screen } from '../components/Screen';
import { SpaceCard } from '../components/SpaceCard';
import { useSpaces, usePrimaryVehicle } from '../store/StoreProvider';
import { useTheme } from '../theme/ThemeProvider';
import { computeFit } from '../utils/fit';
import { vehicleClassOrder } from '../utils/format';
import type { RootStackParamList, TabParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function MapScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<TabParamList, 'Map'>>();
  const { colors, radii, shadow } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const spaces = useSpaces();
  const vehicle = usePrimaryVehicle();

  const [query, setQuery] = useState('');
  const [instantOnly, setInstantOnly] = useState(false);
  const [fromNow, setFromNow] = useState(false);
  const [fitOnly, setFitOnly] = useState(false);
  const [cheapFirst, setCheapFirst] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(
    route.params?.focusSpaceId ?? spaces[0]?.id,
  );

  const matches = useMemo(() => {
    const q = query.trim();
    let list = spaces.filter((s) => s.listed);
    if (q) list = list.filter((s) => `${s.title} ${s.area}`.includes(q));
    if (instantOnly) list = list.filter((s) => s.instant);
    if (fromNow) list = list.filter((s) => s.availableFromNow);
    if (fitOnly && vehicle) {
      list = list.filter(
        (s) => vehicleClassOrder.indexOf(vehicle.vClass) <= vehicleClassOrder.indexOf(s.maxClass) && computeFit(s, vehicle).fits,
      );
    }
    if (cheapFirst) list = [...list].sort((a, b) => a.price - b.price);
    return list;
  }, [spaces, query, instantOnly, fromNow, fitOnly, cheapFirst, vehicle]);

  const current = matches.find((s) => s.id === selectedId) ?? matches[0];
  const anyFilter = instantOnly || fromNow || fitOnly || cheapFirst || query.trim().length > 0;

  return (
    <Screen>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.ink }]}>지도에서 찾기</Text>
        <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: radii.md }]}>
          <MaterialCommunityIcons name="magnify" size={21} color={colors.subtle} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="성동구에서 검색"
            placeholderTextColor={colors.subtle}
            style={[styles.input, { color: colors.ink }]}
          />
          {anyFilter && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="필터 초기화"
              hitSlop={8}
              onPress={() => {
                setQuery('');
                setInstantOnly(false);
                setFromNow(false);
                setFitOnly(false);
                setCheapFirst(false);
              }}
            >
              <Text style={[styles.reset, { color: colors.blue }]}>초기화</Text>
            </Pressable>
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Chip label="즉시 승인" active={instantOnly} onPress={() => setInstantOnly((v) => !v)} />
          <Chip label="지금 이용 가능" active={fromNow} onPress={() => setFromNow((v) => !v)} />
          <Chip label="내 차 적합" active={fitOnly} onPress={() => setFitOnly((v) => !v)} />
          <Chip label="가격 낮은 순" active={cheapFirst} onPress={() => setCheapFirst((v) => !v)} />
        </ScrollView>
      </View>

      {matches.length > 0 && current ? (
        <View style={styles.mapArea}>
          <MapCanvas
            spaces={matches}
            selectedId={current.id}
            onSelect={(s) => setSelectedId(s.id)}
            onRecenter={() => setSelectedId(matches[0]?.id)}
            tall
          />
          <View style={[styles.countPill, { backgroundColor: colors.charcoal, borderRadius: radii.pill }]}>
            <Text style={styles.countText}>검증된 공간 {matches.length}개</Text>
          </View>
          <View style={[styles.floatingCard, shadow, { bottom: tabBarHeight + 16 }]}>
            <SpaceCard
              space={current}
              horizontal
              onPress={() => navigation.navigate('SpaceDetail', { spaceId: current.id })}
            />
          </View>
        </View>
      ) : (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="magnify-close" size={34} color={colors.subtle} />
          <Text style={[styles.emptyText, { color: colors.ink }]}>조건에 맞는 공간이 없어요</Text>
          <Pressable
            onPress={() => {
              setQuery('');
              setInstantOnly(false);
              setFromNow(false);
              setFitOnly(false);
              setCheapFirst(false);
            }}
          >
            <Text style={[styles.reset, { color: colors.blue, marginTop: 10 }]}>전체 공간 보기</Text>
          </Pressable>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12, zIndex: 2 },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: -0.9 },
  search: { marginTop: 14, height: 50, paddingHorizontal: 15, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 9 },
  input: { flex: 1, fontSize: 14, fontWeight: '600', paddingVertical: 0 },
  reset: { fontSize: 13, fontWeight: '800' },
  filters: { gap: 8, paddingTop: 11, paddingRight: 8 },
  mapArea: { flex: 1, position: 'relative' },
  countPill: { position: 'absolute', alignSelf: 'center', top: 16, minHeight: 34, paddingHorizontal: 13, alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  countText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  floatingCard: { position: 'absolute', left: 16, right: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { marginTop: 10, fontSize: 16, fontWeight: '800' },
});
