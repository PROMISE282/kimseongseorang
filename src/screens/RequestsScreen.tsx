import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { Pill } from '../components/Pill';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useToast } from '../components/ToastProvider';
import { notify, useStore } from '../store/StoreProvider';
import type { ParkingRequest } from '../store/types';
import { useTheme } from '../theme/ThemeProvider';
import { formatWon, relativeTime } from '../utils/format';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export function RequestsScreen() {
  const navigation = useNavigation<Nav>();
  const { colors, radii } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const toast = useToast();
  const { state, dispatch } = useStore();

  const sent = useMemo(() => state.requests.filter((r) => r.side === 'sent'), [state.requests]);
  const received = useMemo(() => state.requests.filter((r) => r.side === 'received'), [state.requests]);

  const approve = (req: ParkingRequest) => {
    dispatch({ type: 'resolveRequest', id: req.id, status: 'approved' });
    notify(dispatch, {
      kind: 'approved',
      title: '게스트 이용을 승인했어요',
      body: `${req.guest?.name ?? '게스트'}님의 ${req.spaceTitle} 이용을 승인했어요.`,
    });
    toast.show('게스트 이용을 승인했어요');
  };

  const reject = (req: ParkingRequest) => {
    dispatch({ type: 'resolveRequest', id: req.id, status: 'rejected' });
    notify(dispatch, {
      kind: 'rejected',
      title: '요청을 거절했어요',
      body: `${req.guest?.name ?? '게스트'}님에게 사유가 안내됩니다.`,
    });
    toast.show('요청을 거절했어요');
  };

  const pay = (req: ParkingRequest) => {
    dispatch({ type: 'resolveRequest', id: req.id, status: 'paid' });
    notify(dispatch, {
      kind: 'system',
      title: '결제가 완료됐어요',
      body: `${req.spaceTitle} · ${req.startLabel}부터 ${req.durationHours}시간. 도착하면 체크인하세요.`,
    });
    toast.show('결제 완료 · 체크인을 준비하세요');
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.ink }]}>승인 센터</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="알림"
            onPress={() => navigation.navigate('Notifications')}
            style={[styles.iconBtn, { backgroundColor: colors.surface }]}
          >
            <MaterialCommunityIcons name="bell-outline" size={20} color={colors.ink} />
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>내가 보낸 요청</Text>
        {sent.length === 0 ? (
          <View style={{ marginTop: 12 }}>
            <EmptyState
              icon="send-clock-outline"
              title="아직 보낸 요청이 없어요"
              body="공간의 AI 모델을 확인한 다음 호스트에게 이용 승인을 요청해보세요."
            />
          </View>
        ) : (
          sent.map((req) => <SentCard key={req.id} req={req} onPay={() => pay(req)} />)
        )}

        <View style={styles.sectionHeading}>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>내 공간에 온 요청</Text>
          {received.some((r) => r.status === 'pending') && (
            <View style={[styles.count, { backgroundColor: colors.danger }]}>
              <Text style={styles.countText}>{received.filter((r) => r.status === 'pending').length}</Text>
            </View>
          )}
        </View>
        {received.length === 0 ? (
          <View style={{ marginTop: 12 }}>
            <EmptyState icon="inbox-outline" title="들어온 요청이 없어요" body="공간을 등록하면 게스트의 이용 요청이 여기에 표시돼요." />
          </View>
        ) : (
          received.map((req) => (
            <ReceivedCard key={req.id} req={req} onApprove={() => approve(req)} onReject={() => reject(req)} />
          ))
        )}

        <View style={[styles.safetyCard, { backgroundColor: colors.greenSoft, borderRadius: radii.md }]}>
          <MaterialCommunityIcons name="shield-check-outline" size={24} color={colors.green} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.safetyTitle, { color: colors.ink }]}>공간과 사람, 둘 다 확인해요</Text>
            <Text style={[styles.safetyBody, { color: colors.muted }]}>
              소유권·차량번호·이용 이력을 승인 전에 보여드리고, 민감한 상세 주소는 승인 후에만 공개합니다.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function SentCard({ req, onPay }: { req: ParkingRequest; onPay: () => void }) {
  const { colors, radii, shadow } = useTheme();
  const approved = req.status === 'approved' || req.status === 'paid';
  const rejected = req.status === 'rejected';

  const statusPill =
    req.status === 'paid'
      ? { label: '결제 완료', tone: 'green' as const }
      : req.status === 'approved'
        ? { label: '승인 완료', tone: 'green' as const }
        : req.status === 'rejected'
          ? { label: '거절됨', tone: 'danger' as const }
          : { label: '응답 대기', tone: 'blue' as const };

  return (
    <View style={[styles.card, shadow, { backgroundColor: colors.surface, borderRadius: radii.lg }]}>
      <View style={styles.cardTop}>
        <View
          style={[
            styles.statusIcon,
            { backgroundColor: rejected ? colors.dangerSoft : approved ? colors.green : colors.blueSoft, borderRadius: radii.md },
          ]}
        >
          <MaterialCommunityIcons
            name={rejected ? 'close' : approved ? 'check' : 'clock-outline'}
            size={20}
            color={rejected ? colors.danger : approved ? '#FFFFFF' : colors.blue}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.cardTitle, { color: colors.ink }]}>{req.spaceTitle}</Text>
          <Text style={[styles.cardMeta, { color: colors.muted }]}>
            {req.startLabel}부터 {req.durationHours}시간 · {req.vehiclePlate}
          </Text>
        </View>
        <Pill label={statusPill.label} tone={statusPill.tone} />
      </View>

      <View style={styles.timeline}>
        <TimelineItem active label="요청 전송" time={relativeTime(req.createdAt)} />
        <View style={[styles.timelineLine, { backgroundColor: approved ? colors.blue : colors.line }]} />
        <TimelineItem
          active={approved}
          label={rejected ? '호스트 거절' : '호스트 승인'}
          time={rejected ? '완료' : approved ? '완료' : '대기 중'}
        />
        <View style={[styles.timelineLine, { backgroundColor: req.status === 'paid' ? colors.blue : colors.line }]} />
        <TimelineItem active={req.status === 'paid'} label="결제·체크인" time={req.status === 'paid' ? '완료' : '승인 후'} />
      </View>

      {req.status === 'pending' && (
        <View style={[styles.inlineNote, { backgroundColor: colors.blueSoft, borderRadius: radii.sm }]}>
          <MaterialCommunityIcons name="bell-ring-outline" size={18} color={colors.blue} />
          <Text style={[styles.inlineNoteText, { color: colors.blueDark }]}>
            호스트 응답 즉시 알림으로 알려드릴게요.
          </Text>
        </View>
      )}
      {req.status === 'approved' && (
        <PrimaryButton label={`결제하고 체크인 준비 · ${formatWon(req.price)}`} icon="shield-check" onPress={onPay} />
      )}
      {req.status === 'rejected' && (
        <View style={[styles.inlineNote, { backgroundColor: colors.dangerSoft, borderRadius: radii.sm }]}>
          <MaterialCommunityIcons name="information-outline" size={18} color={colors.danger} />
          <Text style={[styles.inlineNoteText, { color: colors.danger }]}>
            호스트가 이 시간대에 이용이 어렵다고 안내했어요. 다른 공간을 찾아보세요.
          </Text>
        </View>
      )}
      {req.status === 'paid' && (
        <View style={[styles.inlineNote, { backgroundColor: colors.greenSoft, borderRadius: radii.sm }]}>
          <MaterialCommunityIcons name="check-circle-outline" size={18} color={colors.green} />
          <Text style={[styles.inlineNoteText, { color: colors.green }]}>
            결제 완료 · 도착하면 체크인 보장이 적용돼요.
          </Text>
        </View>
      )}
    </View>
  );
}

function ReceivedCard({
  req,
  onApprove,
  onReject,
}: {
  req: ParkingRequest;
  onApprove: () => void;
  onReject: () => void;
}) {
  const { colors, radii, shadow } = useTheme();
  const guest = req.guest;

  return (
    <View style={[styles.card, shadow, { backgroundColor: colors.surface, borderRadius: radii.lg }]}>
      <View style={styles.profileRow}>
        <View style={[styles.avatar, { backgroundColor: colors.sky }]}>
          <Text style={[styles.avatarText, { color: colors.blueDark }]}>{guest?.initial ?? '게'}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.cardTitle, { color: colors.ink }]}>
            {guest?.name ?? '게스트'}님이 이용을 요청했어요
          </Text>
          <Text style={[styles.cardMeta, { color: colors.muted }]}>
            평점 {guest?.rating ?? '-'} · 이용 {guest?.trips ?? 0}회 · 신고 {guest?.reports ?? 0}회
          </Text>
        </View>
        <MaterialCommunityIcons name="shield-account" size={22} color={colors.green} />
      </View>

      <View style={[styles.requestDetail, { backgroundColor: colors.background, borderRadius: radii.md }]}>
        <Line icon="calendar-blank-outline" label={`${req.startLabel}부터 ${req.durationHours}시간`} />
        <Line icon="car-side" label={`${req.vehiclePlate} · ${req.vehicleName}`} />
        <Line icon="cash" label={`예상 정산 ${formatWon(Math.round(req.price * 0.85))}`} />
      </View>

      <View style={styles.fitRow}>
        <View style={[styles.fitIcon, { backgroundColor: colors.blueSoft, borderRadius: radii.sm }]}>
          <MaterialCommunityIcons name="auto-fix" size={18} color={colors.blue} />
        </View>
        <Text style={[styles.fitText, { color: colors.muted }]}>등록 공간과 차량 적합도</Text>
        <Text style={[styles.fitScore, { color: colors.blue }]}>{req.fitScore}%</Text>
      </View>

      {req.status === 'approved' || req.status === 'paid' ? (
        <View style={[styles.banner, { backgroundColor: colors.greenSoft, borderRadius: radii.md }]}>
          <MaterialCommunityIcons name="check-circle" size={21} color={colors.green} />
          <Text style={[styles.bannerText, { color: colors.green }]}>
            {guest?.name ?? '게스트'}님의 이용을 승인했어요
          </Text>
        </View>
      ) : req.status === 'rejected' ? (
        <View style={[styles.banner, { backgroundColor: colors.dangerSoft, borderRadius: radii.md }]}>
          <MaterialCommunityIcons name="close-circle" size={21} color={colors.danger} />
          <Text style={[styles.bannerText, { color: colors.danger }]}>요청을 거절하고 게스트에게 안내했어요</Text>
        </View>
      ) : (
        <View style={styles.actions}>
          <Pressable
            onPress={onReject}
            accessibilityRole="button"
            style={[styles.rejectBtn, { borderColor: colors.line, borderRadius: radii.md }]}
          >
            <Text style={[styles.rejectText, { color: colors.muted }]}>거절</Text>
          </Pressable>
          <PrimaryButton label="승인" icon="check" onPress={onApprove} style={{ flex: 1 }} />
        </View>
      )}
    </View>
  );
}

function TimelineItem({ active = false, label, time }: { active?: boolean; label: string; time: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.timelineItem}>
      <View style={[styles.timelineDot, { backgroundColor: active ? colors.blue : colors.line }]}>
        {active && <MaterialCommunityIcons name="check" size={11} color="#FFFFFF" />}
      </View>
      <Text style={[styles.timelineLabel, { color: active ? colors.ink : colors.subtle }]}>{label}</Text>
      <Text style={[styles.timelineTime, { color: colors.subtle }]}>{time}</Text>
    </View>
  );
}

function Line({ icon, label }: { icon: IconName; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.line}>
      <MaterialCommunityIcons name={icon} size={18} color={colors.muted} />
      <Text style={[styles.lineText, { color: colors.ink }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  title: { fontSize: 25, fontWeight: '900', letterSpacing: -0.7 },
  iconBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '900' },
  sectionHeading: { marginTop: 28, flexDirection: 'row', alignItems: 'center', gap: 7 },
  count: { minWidth: 21, height: 21, paddingHorizontal: 5, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  countText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
  card: { marginTop: 12, padding: 17 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  statusIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '900' },
  cardMeta: { marginTop: 4, fontSize: 11, fontWeight: '600' },
  timeline: { marginVertical: 16 },
  timelineItem: { height: 24, flexDirection: 'row', alignItems: 'center' },
  timelineDot: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  timelineLine: { width: 2, height: 12, marginLeft: 8 },
  timelineLabel: { flex: 1, marginLeft: 9, fontSize: 12, fontWeight: '700' },
  timelineTime: { fontSize: 10, fontWeight: '600' },
  inlineNote: { minHeight: 44, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  inlineNoteText: { flex: 1, fontSize: 11, fontWeight: '700', lineHeight: 16 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '900' },
  requestDetail: { marginTop: 15, padding: 14, gap: 10 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  lineText: { fontSize: 12, fontWeight: '700' },
  fitRow: { marginTop: 13, flexDirection: 'row', alignItems: 'center' },
  fitIcon: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  fitText: { flex: 1, marginLeft: 8, fontSize: 11, fontWeight: '700' },
  fitScore: { fontSize: 16, fontWeight: '900' },
  banner: { marginTop: 16, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  bannerText: { fontSize: 13, fontWeight: '900' },
  actions: { marginTop: 16, flexDirection: 'row', gap: 9 },
  rejectBtn: { width: 96, minHeight: 54, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  rejectText: { fontSize: 14, fontWeight: '900' },
  safetyCard: { marginTop: 20, padding: 16, flexDirection: 'row', gap: 11 },
  safetyTitle: { fontSize: 13, fontWeight: '900' },
  safetyBody: { marginTop: 5, fontSize: 11, lineHeight: 17, fontWeight: '600' },
});
