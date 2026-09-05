import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { colors, radii, shadow } from '../theme';
import type { ApprovalStatus } from '../types';

type RequestsScreenProps = {
  guestStatus: ApprovalStatus;
  hostRequestStatus: 'pending' | 'approved' | 'rejected';
  onApproveHostRequest: () => void;
  onRejectHostRequest: () => void;
};

export function RequestsScreen({ guestStatus, hostRequestStatus, onApproveHostRequest, onRejectHostRequest }: RequestsScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>승인 센터</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="승인 설정" onPress={() => Alert.alert('승인 설정', '자동 만료 시간과 알림 방식을 다음 버전에서 설정할 수 있어요.')} style={styles.settings}><MaterialCommunityIcons name="tune-variant" size={21} color={colors.ink} /></Pressable>
      </View>

      <Text style={styles.sectionTitle}>내가 보낸 요청</Text>
      {guestStatus === 'none' ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}><MaterialCommunityIcons name="send-clock-outline" size={26} color={colors.blue} /></View>
          <Text style={styles.emptyTitle}>아직 보낸 요청이 없어요</Text>
          <Text style={styles.emptyBody}>공간의 AI 모델을 확인한 다음 호스트에게 이용 승인을 요청해보세요.</Text>
        </View>
      ) : (
        <View style={styles.guestCard}>
          <View style={styles.cardTop}>
            <View style={[styles.statusIcon, guestStatus === 'approved' && styles.approvedIcon]}>
              <MaterialCommunityIcons name={guestStatus === 'approved' ? 'check' : 'clock-outline'} size={21} color={guestStatus === 'approved' ? colors.surface : colors.blue} />
            </View>
            <View style={styles.cardTitleWrap}>
              <Text style={styles.cardTitle}>성수 주택 앞 마당</Text>
              <Text style={styles.cardMeta}>오늘 19:00–21:00 · 12가 3456</Text>
            </View>
            <View style={[styles.statusPill, guestStatus === 'approved' && styles.approvedPill]}>
              <Text style={[styles.statusText, guestStatus === 'approved' && styles.approvedText]}>{guestStatus === 'approved' ? '승인 완료' : '응답 대기'}</Text>
            </View>
          </View>
          <View style={styles.timeline}>
            <TimelineItem active label="요청 전송" time="방금" />
            <View style={[styles.timelineLine, guestStatus === 'approved' && styles.timelineActive]} />
            <TimelineItem active={guestStatus === 'approved'} label="호스트 승인" time={guestStatus === 'approved' ? '완료' : '평균 3분'} />
            <View style={styles.timelineLine} />
            <TimelineItem label="결제·체크인" time="승인 후" />
          </View>
          {guestStatus === 'pending' ? (
            <View style={styles.waitNotice}><MaterialCommunityIcons name="bell-ring-outline" size={19} color={colors.blue} /><Text style={styles.waitText}>호스트 응답 즉시 알림으로 알려드릴게요.</Text></View>
          ) : (
            <PrimaryButton label="결제하고 체크인 준비" icon="shield-check" onPress={() => Alert.alert('결제 연동 전 데모', '실서비스 결제 연동 후 체크인 준비를 이어갈 수 있어요.')} />
          )}
        </View>
      )}

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>내 공간에 온 요청</Text>
        {hostRequestStatus === 'pending' && <View style={styles.count}><Text style={styles.countText}>1</Text></View>}
      </View>
      <View style={styles.hostCard}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}><Text style={styles.avatarText}>민</Text></View>
          <View style={styles.profileText}><Text style={styles.guestName}>민지님이 이용을 요청했어요</Text><Text style={styles.guestMeta}>평점 4.9 · 이용 12회 · 신고 0회</Text></View>
          <MaterialCommunityIcons name="shield-account" size={23} color={colors.green} />
        </View>
        <View style={styles.requestDetail}>
          <RequestLine icon="calendar-blank-outline" label="오늘 20:00–22:00 (2시간)" />
          <RequestLine icon="car-side" label="34나 9012 · 기아 셀토스" />
          <RequestLine icon="cash" label="예상 정산 4,080원" />
        </View>
        <View style={styles.fitRow}>
          <View style={styles.fitIcon}><MaterialCommunityIcons name="auto-fix" size={18} color={colors.blue} /></View>
          <Text style={styles.fitText}>등록 공간과 차량 적합도</Text>
          <Text style={styles.fitScore}>96%</Text>
        </View>
        {hostRequestStatus === 'approved' ? (
          <View style={styles.approvedBanner}><MaterialCommunityIcons name="check-circle" size={21} color={colors.green} /><Text style={styles.approvedBannerText}>민지님의 이용을 승인했어요</Text></View>
        ) : hostRequestStatus === 'rejected' ? (
          <View style={styles.rejectedBanner}><MaterialCommunityIcons name="close-circle" size={21} color={colors.danger} /><Text style={styles.rejectedBannerText}>요청을 거절하고 게스트에게 안내했어요</Text></View>
        ) : (
          <View style={styles.actions}>
            <Pressable onPress={onRejectHostRequest} style={styles.reject}><Text style={styles.rejectText}>거절</Text></Pressable>
            <PrimaryButton label="승인" icon="check" onPress={onApproveHostRequest} style={styles.approve} />
          </View>
        )}
      </View>

      <View style={styles.safetyCard}>
        <MaterialCommunityIcons name="shield-check-outline" size={26} color={colors.green} />
        <View style={styles.safetyText}><Text style={styles.safetyTitle}>공간과 사람, 둘 다 확인해요</Text><Text style={styles.safetyBody}>소유권·차량번호·이용 이력을 승인 전에 보여드리고, 민감한 상세 주소는 승인 후에만 공개합니다.</Text></View>
      </View>
    </ScrollView>
  );
}

function TimelineItem({ active = false, label, time }: { active?: boolean; label: string; time: string }) {
  return <View style={styles.timelineItem}><View style={[styles.timelineDot, active && styles.timelineDotActive]}>{active && <MaterialCommunityIcons name="check" size={11} color={colors.surface} />}</View><Text style={[styles.timelineLabel, active && styles.timelineLabelActive]}>{label}</Text><Text style={styles.timelineTime}>{time}</Text></View>;
}

function RequestLine({ icon, label }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }) {
  return <View style={styles.requestLine}><MaterialCommunityIcons name={icon} size={18} color={colors.muted} /><Text style={styles.requestLineText}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 112 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  title: { color: colors.ink, fontSize: 25, fontWeight: '900', letterSpacing: -0.7 },
  settings: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  emptyCard: { marginTop: 12, padding: 22, borderRadius: radii.lg, backgroundColor: colors.surface, alignItems: 'center', borderWidth: 1, borderColor: colors.line },
  emptyIcon: { width: 52, height: 52, borderRadius: 18, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { marginTop: 13, color: colors.ink, fontSize: 15, fontWeight: '900' },
  emptyBody: { marginTop: 6, color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', fontWeight: '600' },
  guestCard: { marginTop: 12, padding: 17, borderRadius: radii.lg, backgroundColor: colors.surface, ...shadow },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  statusIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center' },
  approvedIcon: { backgroundColor: colors.green },
  cardTitleWrap: { flex: 1, marginLeft: 10 },
  cardTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  cardMeta: { marginTop: 4, color: colors.muted, fontSize: 10, fontWeight: '600' },
  statusPill: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: radii.pill, backgroundColor: colors.blueSoft },
  approvedPill: { backgroundColor: colors.greenSoft },
  statusText: { color: colors.blue, fontSize: 10, fontWeight: '900' },
  approvedText: { color: colors.green },
  timeline: { marginVertical: 18 },
  timelineItem: { height: 24, flexDirection: 'row', alignItems: 'center' },
  timelineDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  timelineDotActive: { backgroundColor: colors.blue },
  timelineLine: { width: 2, height: 13, marginLeft: 8, backgroundColor: colors.line },
  timelineActive: { backgroundColor: colors.blue },
  timelineLabel: { flex: 1, marginLeft: 9, color: colors.subtle, fontSize: 12, fontWeight: '700' },
  timelineLabelActive: { color: colors.ink },
  timelineTime: { color: colors.subtle, fontSize: 10, fontWeight: '600' },
  waitNotice: { minHeight: 44, paddingHorizontal: 12, borderRadius: 12, backgroundColor: colors.blueSoft, flexDirection: 'row', alignItems: 'center', gap: 8 },
  waitText: { color: colors.blueDark, fontSize: 11, fontWeight: '700' },
  sectionHeading: { marginTop: 28, flexDirection: 'row', alignItems: 'center', gap: 7 },
  count: { width: 21, height: 21, borderRadius: 11, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
  countText: { color: colors.surface, fontSize: 11, fontWeight: '900' },
  hostCard: { marginTop: 12, padding: 18, borderRadius: radii.lg, backgroundColor: colors.surface, ...shadow },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E7D8FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#6F3BC5', fontSize: 16, fontWeight: '900' },
  profileText: { flex: 1, marginLeft: 10 },
  guestName: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  guestMeta: { marginTop: 4, color: colors.muted, fontSize: 10, fontWeight: '600' },
  requestDetail: { marginTop: 16, padding: 14, borderRadius: 14, backgroundColor: colors.background, gap: 10 },
  requestLine: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  requestLineText: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  fitRow: { marginTop: 13, flexDirection: 'row', alignItems: 'center' },
  fitIcon: { width: 32, height: 32, borderRadius: 11, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center' },
  fitText: { flex: 1, marginLeft: 8, color: colors.muted, fontSize: 11, fontWeight: '700' },
  fitScore: { color: colors.blue, fontSize: 16, fontWeight: '900' },
  actions: { marginTop: 17, flexDirection: 'row', gap: 9 },
  reject: { flex: 0.42, minHeight: 54, borderRadius: radii.md, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  rejectText: { color: colors.muted, fontSize: 14, fontWeight: '900' },
  approve: { flex: 1 },
  approvedBanner: { marginTop: 17, minHeight: 48, borderRadius: radii.md, backgroundColor: colors.greenSoft, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  approvedBannerText: { color: colors.green, fontSize: 13, fontWeight: '900' },
  rejectedBanner: { marginTop: 17, minHeight: 48, borderRadius: radii.md, backgroundColor: '#FFF0F0', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  rejectedBannerText: { color: colors.danger, fontSize: 12, fontWeight: '900' },
  safetyCard: { marginTop: 18, padding: 16, borderRadius: radii.md, backgroundColor: colors.greenSoft, flexDirection: 'row', gap: 11 },
  safetyText: { flex: 1 },
  safetyTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  safetyBody: { marginTop: 5, color: colors.muted, fontSize: 11, lineHeight: 17, fontWeight: '600' },
});
