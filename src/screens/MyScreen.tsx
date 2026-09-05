import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Switch, Text, View, ScrollView } from 'react-native';

import { Brand } from '../components/Brand';
import { Pill } from '../components/Pill';
import { Screen } from '../components/Screen';
import { useToast } from '../components/ToastProvider';
import { useStore } from '../store/StoreProvider';
import { useTheme } from '../theme/ThemeProvider';
import { formatWon } from '../utils/format';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export function MyScreen() {
  const navigation = useNavigation<Nav>();
  const { colors, radii, shadow, mode, toggle } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const toast = useToast();
  const { state } = useStore();

  const mySpaces = useMemo(() => state.spaces.filter((s) => s.ownedByMe), [state.spaces]);
  const received = state.requests.filter((r) => r.side === 'received');
  const trips = state.requests.filter((r) => r.side === 'sent' && (r.status === 'paid' || r.status === 'approved')).length;

  const earnings = useMemo(
    () =>
      received
        .filter((r) => r.status === 'approved' || r.status === 'paid')
        .reduce((sum, r) => sum + Math.round(r.price * 0.85), 0),
    [received],
  );

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Brand />
          <View style={styles.headerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="찜한 공간"
              onPress={() => navigation.navigate('Favorites')}
              style={[styles.iconBtn, { backgroundColor: colors.surface }]}
            >
              <MaterialCommunityIcons name="heart-outline" size={20} color={colors.ink} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="알림"
              onPress={() => navigation.navigate('Notifications')}
              style={[styles.iconBtn, { backgroundColor: colors.surface }]}
            >
              <MaterialCommunityIcons name="bell-outline" size={20} color={colors.ink} />
            </Pressable>
          </View>
        </View>

        <View style={styles.profile}>
          <View style={[styles.avatar, { backgroundColor: colors.blueSoft, borderRadius: radii.xl }]}>
            <Text style={[styles.avatarText, { color: colors.blue }]}>나</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 13 }}>
            <Text style={[styles.name, { color: colors.ink }]}>나의 주차모아</Text>
            <Text style={[styles.profileMeta, { color: colors.muted }]}>
              {state.vehicles.length > 0 ? '차량 인증 완료' : '차량 미등록'} · 공간 {mySpaces.length}개
            </Text>
          </View>
          <Pill label="신뢰 98" tone="green" icon="shield-check" />
        </View>

        <LinearGradient colors={[colors.blue, colors.blueDark]} style={[styles.hostCard, { borderRadius: radii.xl }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardLabel}>승인·완료 건 예상 정산</Text>
            <Text style={styles.earnings}>{formatWon(earnings)}</Text>
            <Text style={styles.earningsMeta}>
              들어온 요청 {received.length}건 · 정산 수수료 15% 적용
            </Text>
          </View>
          <View style={styles.settlementIcon}>
            <MaterialCommunityIcons name="wallet-outline" size={28} color="#FFFFFF" />
          </View>
        </LinearGradient>

        <View style={[styles.stats, { backgroundColor: colors.surface, borderRadius: radii.md }]}>
          <Stat label="공유 공간" value={String(mySpaces.length)} />
          <Stat label="이용한 주차" value={String(trips)} />
          <Stat label="찜한 공간" value={String(state.favorites.length)} last />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>내 공간 관리</Text>
        {mySpaces.length === 0 ? (
          <Pressable
            onPress={() => navigation.navigate('Tabs', { screen: 'Register' })}
            style={[styles.addSpace, { borderColor: colors.line, borderRadius: radii.md }]}
          >
            <MaterialCommunityIcons name="camera-plus-outline" size={22} color={colors.blue} />
            <Text style={[styles.addSpaceText, { color: colors.blue }]}>사진 한 장으로 공간 등록하기</Text>
          </Pressable>
        ) : (
          mySpaces.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => navigation.navigate('SpaceDetail', { spaceId: s.id })}
              style={[styles.spaceCard, shadow, { backgroundColor: colors.surface, borderRadius: radii.md }]}
            >
              <View style={[styles.spaceIcon, { backgroundColor: colors.blueSoft, borderRadius: radii.sm }]}>
                <MaterialCommunityIcons name="parking" size={22} color={colors.blue} />
              </View>
              <View style={{ flex: 1, marginLeft: 11 }}>
                <Text style={[styles.spaceTitle, { color: colors.ink }]}>{s.title}</Text>
                <Text style={[styles.spaceMeta, { color: colors.muted }]}>
                  {s.listed ? `공개 중 · ${s.available}` : '검수 중 · 공개 준비'}
                </Text>
              </View>
              <Pill label={s.listed ? 'ON' : '검수중'} tone={s.listed ? 'green' : 'amber'} />
            </Pressable>
          ))
        )}

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>메뉴</Text>
        <View style={[styles.menu, { backgroundColor: colors.surface, borderRadius: radii.md }]}>
          <MenuRow icon="bell-outline" label="알림" onPress={() => navigation.navigate('Notifications')} />
          <MenuRow icon="heart-outline" label="찜한 공간" onPress={() => navigation.navigate('Favorites')} />
          <MenuRow icon="car-info" label="내 차량 관리" onPress={() => navigation.navigate('Vehicles')} />
          <MenuRow
            icon="calendar-check-outline"
            label="이용·요청 내역"
            onPress={() => navigation.navigate('Tabs', { screen: 'Requests' })}
          />
          <View style={[styles.menuRow, { borderBottomColor: colors.line }]}>
            <MaterialCommunityIcons name="weather-night" size={21} color={colors.muted} />
            <Text style={[styles.menuLabel, { color: colors.ink }]}>다크 모드</Text>
            <Switch value={mode === 'dark'} onValueChange={toggle} />
          </View>
          <MenuRow
            icon="lifebuoy"
            label="도움말·체크인 보장"
            last
            onPress={() => toast.show('도움말은 백엔드 연동 후 제공됩니다')}
          />
        </View>

        <Text style={[styles.version, { color: colors.subtle }]}>주차모아 · React Native · Expo SDK 57</Text>
      </ScrollView>
    </Screen>
  );
}

function Stat({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.stat, { borderRightColor: colors.line }, last && { borderRightWidth: 0 }]}>
      <Text style={[styles.statValue, { color: colors.ink }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  last = false,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  last?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.menuRow, { borderBottomColor: colors.line }, last && { borderBottomWidth: 0 }]}
    >
      <MaterialCommunityIcons name={icon} size={21} color={colors.muted} />
      <Text style={[styles.menuLabel, { color: colors.ink }]}>{label}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.subtle} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  profile: { marginTop: 24, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '900' },
  name: { fontSize: 21, fontWeight: '900' },
  profileMeta: { marginTop: 4, fontSize: 11, fontWeight: '600' },
  hostCard: { marginTop: 22, minHeight: 150, padding: 20, overflow: 'hidden', flexDirection: 'row', alignItems: 'center' },
  cardLabel: { color: '#DCE8FF', fontSize: 11, fontWeight: '700' },
  earnings: { marginTop: 7, color: '#FFFFFF', fontSize: 27, fontWeight: '900', letterSpacing: -1 },
  earningsMeta: { marginTop: 7, color: '#DCE8FF', fontSize: 10, fontWeight: '800' },
  settlementIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  stats: { marginTop: 12, paddingVertical: 17, flexDirection: 'row' },
  stat: { flex: 1, alignItems: 'center', borderRightWidth: 1 },
  statValue: { fontSize: 17, fontWeight: '900' },
  statLabel: { marginTop: 4, fontSize: 10, fontWeight: '600' },
  sectionTitle: { marginTop: 26, marginBottom: 11, fontSize: 17, fontWeight: '900' },
  addSpace: { minHeight: 64, borderWidth: 1, borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  addSpaceText: { fontSize: 13, fontWeight: '800' },
  spaceCard: { marginBottom: 10, padding: 15, flexDirection: 'row', alignItems: 'center' },
  spaceIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  spaceTitle: { fontSize: 14, fontWeight: '900' },
  spaceMeta: { marginTop: 4, fontSize: 10, fontWeight: '600' },
  menu: { overflow: 'hidden' },
  menuRow: { minHeight: 57, paddingHorizontal: 15, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 11 },
  menuLabel: { flex: 1, fontSize: 13, fontWeight: '700' },
  version: { marginTop: 24, fontSize: 10, textAlign: 'center', fontWeight: '600' },
});
