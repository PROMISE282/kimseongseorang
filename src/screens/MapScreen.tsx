import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip } from '../components/Chip';
import { MapCanvas } from '../components/MapCanvas';
import { SpaceCard } from '../components/SpaceCard';
import { spaces } from '../data';
import { colors, radii, shadow } from '../theme';
import type { Space } from '../types';

type MapScreenProps = { onOpenSpace: (space: Space) => void };

export function MapScreen({ onOpenSpace }: MapScreenProps) {
  const [selected, setSelected] = useState(spaces[0]);
  const [query, setQuery] = useState('');
  const [onlyApproved, setOnlyApproved] = useState(true);
  const [fromNow, setFromNow] = useState(true);
  const [filter, setFilter] = useState<'all' | 'suv' | 'price'>('all');

  const matches = useMemo(() => {
    const q = query.trim();
    const searched = q ? spaces.filter((space) => `${space.title} ${space.area}`.includes(q)) : spaces;
    const approved = onlyApproved
      ? searched.filter((space) => space.responseTime === '즉시 승인' || Number(space.responseTime.match(/\d+/)?.[0] ?? 99) <= 5)
      : searched;
    const timed = fromNow ? approved.filter((space) => space.available.includes('지금') || space.available.includes('오늘')) : approved;
    const filtered = filter === 'suv' ? timed.filter((space) => space.vehicle.includes('SUV')) : timed;
    return filter === 'price' ? [...filtered].sort((a, b) => a.price - b.price) : filtered;
  }, [filter, fromNow, onlyApproved, query]);

  const current = matches.find((space) => space.id === selected.id) ?? matches[0];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>지도에서 찾기</Text>
        <View style={styles.search}>
          <MaterialCommunityIcons name="magnify" size={21} color={colors.subtle} />
          <TextInput value={query} onChangeText={setQuery} placeholder="성수동에서 검색" placeholderTextColor={colors.subtle} style={styles.input} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Chip label="승인 가능만" active={onlyApproved} onPress={() => setOnlyApproved((value) => !value)} />
          <Chip label="현재부터" active={fromNow} onPress={() => setFromNow((value) => !value)} />
          <Chip label="SUV 가능" active={filter === 'suv'} onPress={() => setFilter((value) => value === 'suv' ? 'all' : 'suv')} />
          <Chip label="가격 낮은 순" active={filter === 'price'} onPress={() => setFilter((value) => value === 'price' ? 'all' : 'price')} />
        </ScrollView>
      </View>
      {matches.length > 0 ? (
        <>
          <MapCanvas spaces={matches} selectedId={current.id} onSelect={setSelected} tall />
          <View style={styles.floatingCard}>
            <SpaceCard space={current} onPress={() => onOpenSpace(current)} horizontal />
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countText}>검증된 공간 {matches.length}개</Text>
          </View>
        </>
      ) : (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="magnify-close" size={34} color={colors.subtle} />
          <Text style={styles.emptyText}>검색 결과가 없어요</Text>
          <Pressable onPress={() => setQuery('')}><Text style={styles.reset}>전체 공간 보기</Text></Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, backgroundColor: colors.background },
  title: { color: colors.ink, fontSize: 24, fontWeight: '900', letterSpacing: -0.9 },
  search: { marginTop: 14, height: 50, paddingHorizontal: 15, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 9 },
  input: { flex: 1, color: colors.ink, fontSize: 14, fontWeight: '600', paddingVertical: 0 },
  filters: { gap: 8, paddingTop: 11 },
  floatingCard: { position: 'absolute', left: 16, right: 16, bottom: 96, ...shadow },
  countPill: { position: 'absolute', alignSelf: 'center', top: 194, minHeight: 34, paddingHorizontal: 13, borderRadius: radii.pill, backgroundColor: colors.charcoal, alignItems: 'center', justifyContent: 'center' },
  countText: { color: colors.surface, fontSize: 12, fontWeight: '800' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { marginTop: 10, color: colors.ink, fontSize: 16, fontWeight: '800' },
  reset: { marginTop: 10, color: colors.blue, fontSize: 14, fontWeight: '800' },
});
