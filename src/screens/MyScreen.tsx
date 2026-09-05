import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brand } from '../components/Brand';
import { colors, radii, shadow } from '../theme';

export function MyScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}><Brand /><Pressable accessibilityRole="button" accessibilityLabel="설정" onPress={() => Alert.alert('설정', '계정과 알림 설정은 백엔드 연동 후 제공됩니다.')} style={styles.settings}><MaterialCommunityIcons name="cog-outline" size={22} color={colors.ink} /></Pressable></View>
      <View style={styles.profile}>
        <View style={styles.avatar}><Text style={styles.avatarText}>재</Text></View>
        <View style={styles.profileText}><Text style={styles.name}>재민님</Text><Text style={styles.profileMeta}>공간과 차량 인증 완료</Text></View>
        <View style={styles.level}><MaterialCommunityIcons name="shield-check" size={15} color={colors.green} /><Text style={styles.levelText}>신뢰 98</Text></View>
      </View>

      <LinearGradient colors={['#1267F7', '#0D4DCB']} style={styles.hostCard}>
        <View style={styles.earningsCopy}><Text style={styles.cardLabel}>9월 정산 예정</Text><Text style={styles.earnings}>128,400원</Text><Text style={styles.earningsMeta}>예약 14건 · 9월 10일 입금 예정</Text></View>
        <View style={styles.settlementIcon}><MaterialCommunityIcons name="wallet-outline" size={30} color={colors.surface} /></View>
      </LinearGradient>

      <View style={styles.stats}>
        <Stat label="공유 공간" value="1" />
        <Stat label="이번 달 이용" value="14" />
        <Stat label="평균 응답" value="3분" last />
      </View>

      <Text style={styles.sectionTitle}>내 공간 관리</Text>
      <View style={styles.spaceCard}>
        <View style={styles.spaceIcon}><MaterialCommunityIcons name="parking" size={24} color={colors.blue} /></View>
        <View style={styles.spaceText}><Text style={styles.spaceTitle}>성수 주택 앞 마당</Text><Text style={styles.spaceMeta}>공개 중 · 오늘 19:00부터 가능</Text></View>
        <View style={styles.onPill}><View style={styles.onDot} /><Text style={styles.onText}>ON</Text></View>
      </View>

      <Text style={styles.sectionTitle}>메뉴</Text>
      <View style={styles.menu}>
        <MenuRow icon="calendar-check-outline" label="예약 내역" />
        <MenuRow icon="wallet-outline" label="정산 및 계좌" />
        <MenuRow icon="car-info" label="내 차량 관리" />
        <MenuRow icon="shield-account-outline" label="인증 및 보안" />
        <MenuRow icon="lifebuoy" label="도움말·체크인 보장" last />
      </View>
      <Text style={styles.version}>주차모아 MVP · Expo 57</Text>
    </ScrollView>
  );
}

function Stat({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return <View style={[styles.stat, last && styles.statLast]}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

function MenuRow({ icon, label, last = false }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; last?: boolean }) {
  return <Pressable accessibilityRole="button" onPress={() => Alert.alert(label, '실서비스 계정 연동 후 사용할 수 있어요.')} style={[styles.menuRow, last && styles.menuRowLast]}><MaterialCommunityIcons name={icon} size={21} color={colors.muted} /><Text style={styles.menuLabel}>{label}</Text><MaterialCommunityIcons name="chevron-right" size={20} color={colors.subtle} /></Pressable>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 112 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settings: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  profile: { marginTop: 25, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 58, height: 58, borderRadius: 22, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.blue, fontSize: 22, fontWeight: '900' },
  profileText: { flex: 1, marginLeft: 13 },
  name: { color: colors.ink, fontSize: 21, fontWeight: '900' },
  profileMeta: { marginTop: 4, color: colors.muted, fontSize: 11, fontWeight: '600' },
  level: { minHeight: 31, paddingHorizontal: 10, borderRadius: radii.pill, backgroundColor: colors.greenSoft, flexDirection: 'row', alignItems: 'center', gap: 4 },
  levelText: { color: colors.green, fontSize: 10, fontWeight: '900' },
  hostCard: { marginTop: 23, minHeight: 150, padding: 20, borderRadius: radii.xl, overflow: 'hidden', flexDirection: 'row', alignItems: 'center' },
  earningsCopy: { flex: 1 },
  cardLabel: { color: '#DCE8FF', fontSize: 11, fontWeight: '700' },
  earnings: { marginTop: 7, color: colors.surface, fontSize: 27, fontWeight: '900', letterSpacing: -1 },
  earningsMeta: { marginTop: 7, color: '#DCE8FF', fontSize: 10, fontWeight: '800' },
  settlementIcon: { width: 58, height: 58, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  stats: { marginTop: 12, paddingVertical: 17, borderRadius: radii.md, backgroundColor: colors.surface, flexDirection: 'row' },
  stat: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: colors.line },
  statLast: { borderRightWidth: 0 },
  statValue: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  statLabel: { marginTop: 4, color: colors.muted, fontSize: 10, fontWeight: '600' },
  sectionTitle: { marginTop: 27, marginBottom: 11, color: colors.ink, fontSize: 17, fontWeight: '900' },
  spaceCard: { padding: 15, borderRadius: radii.md, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', ...shadow },
  spaceIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center' },
  spaceText: { flex: 1, marginLeft: 11 },
  spaceTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  spaceMeta: { marginTop: 4, color: colors.muted, fontSize: 10, fontWeight: '600' },
  onPill: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: radii.pill, backgroundColor: colors.greenSoft, flexDirection: 'row', alignItems: 'center', gap: 5 },
  onDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green },
  onText: { color: colors.green, fontSize: 10, fontWeight: '900' },
  menu: { overflow: 'hidden', borderRadius: radii.md, backgroundColor: colors.surface },
  menuRow: { minHeight: 57, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 11 },
  menuRowLast: { borderBottomWidth: 0 },
  menuLabel: { flex: 1, color: colors.ink, fontSize: 13, fontWeight: '700' },
  version: { marginTop: 24, color: colors.subtle, fontSize: 10, textAlign: 'center', fontWeight: '600' },
});
