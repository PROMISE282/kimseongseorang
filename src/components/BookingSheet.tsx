import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { formatWon } from '../data';
import { colors, radii, shadow } from '../theme';
import type { Space } from '../types';
import { Chip } from './Chip';
import { PrimaryButton } from './PrimaryButton';

type BookingSheetProps = {
  visible: boolean;
  space: Space;
  duration: number;
  onDurationChange: (duration: Duration) => void;
  onClose: () => void;
  onConfirm: () => void;
};

type Duration = 1 | 2 | 4;

export function BookingSheet({ visible, space, duration, onDurationChange, onClose, onConfirm }: BookingSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable accessibilityLabel="예약창 닫기" style={styles.backdrop} onPress={onClose} />
        <ScrollView style={styles.sheet} contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
          <View style={styles.handle} />
          <View style={styles.heading}>
            <Text style={styles.title}>언제 이용하시나요?</Text>
            <Pressable onPress={onClose} accessibilityLabel="닫기" style={styles.close}>
              <MaterialCommunityIcons name="close" size={22} color={colors.ink} />
            </Pressable>
          </View>
          <View style={styles.dateCard}>
            <View style={styles.calendar}><Text style={styles.calendarMonth}>SEP</Text><Text style={styles.calendarDay}>05</Text></View>
            <View style={styles.dateText}>
              <Text style={styles.dateTitle}>오늘 · 오후 7:00부터</Text>
              <Text style={styles.dateMeta}>{space.title}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={21} color={colors.subtle} />
          </View>
          <Text style={styles.label}>이용 시간</Text>
          <View style={styles.chips}>
            {[1, 2, 4].map((hour) => (
              <Chip key={hour} label={`${hour}시간`} active={duration === hour} onPress={() => onDurationChange(hour as Duration)} style={styles.chip} />
            ))}
          </View>
          <View style={styles.vehicleRow}>
            <View style={styles.carIcon}><MaterialCommunityIcons name="car-side" size={24} color={colors.blue} /></View>
            <View style={styles.vehicleText}><Text style={styles.vehicleTitle}>12가 3456 · 현대 아반떼</Text><Text style={styles.vehicleMeta}>호스트에게 차종과 번호가 전달돼요</Text></View>
            <MaterialCommunityIcons name="pencil-outline" size={19} color={colors.subtle} />
          </View>
          <View style={styles.summary}>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>예상 주차요금</Text><Text style={styles.summaryValue}>{formatWon(space.price * duration)}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>승인 대기 중 결제</Text><Text style={styles.free}>0원</Text></View>
          </View>
          <PrimaryButton label={`호스트에게 ${duration}시간 승인 요청`} icon="send-outline" onPress={onConfirm} />
          <Text style={styles.note}>승인 전에는 결제되지 않으며, 응답이 없으면 자동 취소됩니다.</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(16,24,40,0.46)' },
  sheet: { maxHeight: '88%', borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: colors.surface, ...shadow },
  sheetContent: { padding: 20, paddingBottom: 28 },
  handle: { alignSelf: 'center', width: 42, height: 4, borderRadius: 2, backgroundColor: colors.line, marginBottom: 18 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.ink, fontSize: 23, fontWeight: '900', letterSpacing: -0.7 },
  close: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  dateCard: { marginTop: 20, padding: 14, borderRadius: radii.md, backgroundColor: colors.background, flexDirection: 'row', alignItems: 'center' },
  calendar: { width: 44, height: 48, borderRadius: 11, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  calendarMonth: { width: '100%', paddingVertical: 2, color: colors.surface, backgroundColor: colors.blue, fontSize: 8, fontWeight: '900', textAlign: 'center' },
  calendarDay: { marginTop: 2, color: colors.ink, fontSize: 17, fontWeight: '900' },
  dateText: { flex: 1, marginLeft: 11 },
  dateTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  dateMeta: { marginTop: 4, color: colors.muted, fontSize: 11, fontWeight: '600' },
  label: { marginTop: 20, color: colors.ink, fontSize: 13, fontWeight: '900' },
  chips: { marginTop: 10, flexDirection: 'row', gap: 8 },
  chip: { flex: 1 },
  vehicleRow: { marginTop: 20, flexDirection: 'row', alignItems: 'center' },
  carIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center' },
  vehicleText: { flex: 1, marginLeft: 11 },
  vehicleTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  vehicleMeta: { marginTop: 4, color: colors.muted, fontSize: 10, fontWeight: '600' },
  summary: { marginVertical: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: colors.line, gap: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryLabel: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  summaryValue: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  free: { color: colors.green, fontSize: 14, fontWeight: '900' },
  note: { marginTop: 10, color: colors.subtle, fontSize: 10, lineHeight: 15, textAlign: 'center', fontWeight: '600' },
});
