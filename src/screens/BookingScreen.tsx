import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '../components/Chip';
import { PrimaryButton } from '../components/PrimaryButton';
import { useToast } from '../components/ToastProvider';
import { makeId, notify, useSpace, useStore, usePrimaryVehicle } from '../store/StoreProvider';
import type { ParkingRequest } from '../store/types';
import { useTheme } from '../theme/ThemeProvider';
import { computeFit } from '../utils/fit';
import { formatWon } from '../utils/format';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Duration = 1 | 2 | 3 | 4;

const startOptions = [
  { key: 'now', label: '지금 바로', offset: 0 },
  { key: 'h1', label: '1시간 뒤', offset: 1 },
  { key: 'h2', label: '2시간 뒤', offset: 2 },
  { key: 'evening', label: '오늘 저녁 7시', offset: -1 },
] as const;

function startLabelFor(key: string): string {
  const now = new Date();
  if (key === 'evening') return '오늘 오후 7:00';
  const opt = startOptions.find((o) => o.key === key);
  const start = new Date(now.getTime() + (opt?.offset ?? 0) * 3600_000);
  const h = start.getHours();
  const period = h < 12 ? '오전' : '오후';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const m = start.getMinutes() < 30 ? '00' : '30';
  return `오늘 ${period} ${h12}:${m}`;
}

export function BookingScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'Booking'>>();
  const { colors, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const space = useSpace(params.spaceId);
  const { dispatch } = useStore();
  const primaryVehicle = usePrimaryVehicle();
  const { state } = useStore();

  const [start, setStart] = useState<string>('now');
  const [duration, setDuration] = useState<Duration>(2);
  const [vehicleId, setVehicleId] = useState<string | undefined>(primaryVehicle?.id);
  const [submitting, setSubmitting] = useState(false);

  const vehicle = state.vehicles.find((v) => v.id === vehicleId) ?? primaryVehicle;
  const total = useMemo(() => (space ? space.price * duration : 0), [space, duration]);
  const fit = space ? computeFit(space, vehicle) : null;

  if (!space) {
    return (
      <View style={[styles.missing, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.ink, fontWeight: '800' }}>공간 정보를 불러올 수 없어요.</Text>
        <PrimaryButton label="닫기" secondary onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const confirm = () => {
    if (!vehicle) return;
    setSubmitting(true);
    const startLabel = startLabelFor(start);
    const request: ParkingRequest = {
      id: makeId('req'),
      side: 'sent',
      spaceId: space.id,
      spaceTitle: space.title,
      createdAt: Date.now(),
      startLabel,
      durationHours: duration,
      price: total,
      vehiclePlate: vehicle.plate,
      vehicleName: vehicle.name,
      fitScore: fit?.score ?? 0,
      status: 'pending',
    };
    dispatch({ type: 'sendRequest', request });
    notify(dispatch, {
      kind: 'system',
      title: '승인 요청을 보냈어요',
      body: `${space.title} · ${startLabel}부터 ${duration}시간. 호스트 응답을 기다리는 중이에요.`,
    });

    // Demo: host responds automatically after a short delay.
    setTimeout(() => {
      dispatch({ type: 'resolveRequest', id: request.id, status: 'approved' });
      notify(dispatch, {
        kind: 'approved',
        title: '호스트가 승인했어요',
        body: `${space.title} 이용이 승인됐어요. 결제하고 체크인을 준비하세요.`,
      });
    }, 4500);

    navigation.navigate('Tabs', { screen: 'Requests' });
    toast.show('호스트에게 승인 요청을 보냈어요');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.grabber, { backgroundColor: colors.line }]} />
      <View style={styles.headingRow}>
        <Text style={[styles.title, { color: colors.ink }]}>언제 이용하시나요?</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="닫기"
          onPress={() => navigation.goBack()}
          style={[styles.close, { backgroundColor: colors.surfaceAlt }]}
        >
          <MaterialCommunityIcons name="close" size={22} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={[styles.spaceRow, { backgroundColor: colors.surface, borderRadius: radii.md }]}>
          <View style={[styles.spaceIcon, { backgroundColor: colors.blueSoft, borderRadius: radii.sm }]}>
            <MaterialCommunityIcons name="parking" size={22} color={colors.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.spaceTitle, { color: colors.ink }]}>{space.title}</Text>
            <Text style={[styles.spaceMeta, { color: colors.muted }]}>
              {space.area} · 시간당 {formatWon(space.price)}
            </Text>
          </View>
        </View>

        <Text style={[styles.label, { color: colors.ink }]}>이용 시작</Text>
        <View style={styles.wrapRow}>
          {startOptions.map((o) => (
            <Chip key={o.key} label={o.label} active={start === o.key} onPress={() => setStart(o.key)} />
          ))}
        </View>

        <Text style={[styles.label, { color: colors.ink }]}>이용 시간</Text>
        <View style={styles.row}>
          {([1, 2, 3, 4] as Duration[]).map((h) => (
            <Chip key={h} label={`${h}시간`} active={duration === h} onPress={() => setDuration(h)} style={styles.flexChip} />
          ))}
        </View>

        <Text style={[styles.label, { color: colors.ink }]}>이용 차량</Text>
        {state.vehicles.length === 0 ? (
          <Pressable
            onPress={() => navigation.navigate('Vehicles')}
            style={[styles.addVehicle, { borderColor: colors.line, borderRadius: radii.md }]}
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color={colors.blue} />
            <Text style={[styles.addVehicleText, { color: colors.blue }]}>차량을 먼저 등록해주세요</Text>
          </Pressable>
        ) : (
          <View style={{ gap: 8 }}>
            {state.vehicles.map((v) => {
              const selected = (vehicleId ?? primaryVehicle?.id) === v.id;
              return (
                <Pressable
                  key={v.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => setVehicleId(v.id)}
                  style={[
                    styles.vehicleRow,
                    { backgroundColor: colors.surface, borderRadius: radii.md, borderColor: selected ? colors.blue : colors.line },
                  ]}
                >
                  <View style={[styles.carIcon, { backgroundColor: colors.blueSoft, borderRadius: radii.sm }]}>
                    <MaterialCommunityIcons name="car-side" size={22} color={colors.blue} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.vehicleTitle, { color: colors.ink }]}>
                      {v.plate} · {v.name}
                    </Text>
                    <Text style={[styles.vehicleMeta, { color: colors.muted }]}>
                      호스트에게 차종과 번호가 전달돼요
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name={selected ? 'radiobox-marked' : 'radiobox-blank'}
                    size={20}
                    color={selected ? colors.blue : colors.subtle}
                  />
                </Pressable>
              );
            })}
          </View>
        )}

        {fit && vehicle && (
          <View style={[styles.fitNote, { backgroundColor: fit.fits ? colors.greenSoft : colors.amberSoft, borderRadius: radii.md }]}>
            <MaterialCommunityIcons
              name={fit.fits ? 'check-circle-outline' : 'alert-circle-outline'}
              size={18}
              color={fit.fits ? colors.green : colors.amber}
            />
            <Text style={[styles.fitText, { color: fit.fits ? colors.green : colors.amber }]}>
              {vehicle.name} 적합도 {fit.score}% · {fit.summary}
            </Text>
          </View>
        )}

        <View style={[styles.summary, { borderTopColor: colors.line }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>예상 주차요금</Text>
            <Text style={[styles.summaryValue, { color: colors.ink }]}>{formatWon(total)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>승인 대기 중 결제</Text>
            <Text style={[styles.free, { color: colors.green }]}>0원</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 14, borderTopColor: colors.line, backgroundColor: colors.background }]}>
        <PrimaryButton
          label={`호스트에게 ${duration}시간 승인 요청`}
          icon="send-outline"
          loading={submitting}
          disabled={state.vehicles.length === 0}
          onPress={confirm}
        />
        <Text style={[styles.note, { color: colors.subtle }]}>
          승인 전에는 결제되지 않으며, 응답이 없으면 자동 취소됩니다.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  grabber: { alignSelf: 'center', width: 42, height: 4, borderRadius: 2, marginTop: 10 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14 },
  title: { fontSize: 23, fontWeight: '900', letterSpacing: -0.7 },
  close: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24 },
  spaceRow: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11 },
  spaceIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  spaceTitle: { fontSize: 14, fontWeight: '900' },
  spaceMeta: { marginTop: 4, fontSize: 11, fontWeight: '600' },
  label: { marginTop: 22, marginBottom: 10, fontSize: 13, fontWeight: '900' },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  flexChip: { flex: 1 },
  addVehicle: { minHeight: 54, borderWidth: 1, borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  addVehicleText: { fontSize: 13, fontWeight: '800' },
  vehicleRow: { padding: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 11 },
  carIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  vehicleTitle: { fontSize: 13, fontWeight: '900' },
  vehicleMeta: { marginTop: 3, fontSize: 10, fontWeight: '600' },
  fitNote: { marginTop: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  fitText: { flex: 1, fontSize: 11, fontWeight: '800' },
  summary: { marginTop: 20, paddingTop: 15, borderTopWidth: 1, gap: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 13, fontWeight: '600' },
  summaryValue: { fontSize: 16, fontWeight: '900' },
  free: { fontSize: 14, fontWeight: '900' },
  footer: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1 },
  note: { marginTop: 10, fontSize: 10, lineHeight: 15, textAlign: 'center', fontWeight: '600' },
});
