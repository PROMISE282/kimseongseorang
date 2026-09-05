import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '../components/Chip';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { useToast } from '../components/ToastProvider';
import { makeId, useStore } from '../store/StoreProvider';
import type { VehicleClass } from '../store/types';
import { useTheme } from '../theme/ThemeProvider';
import { vehicleClassLabel, vehicleClassOrder } from '../utils/format';

export function VehiclesScreen() {
  const { colors, radii, shadow } = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { state, dispatch } = useStore();

  const [adding, setAdding] = useState(false);
  const [plate, setPlate] = useState('');
  const [name, setName] = useState('');
  const [vClass, setVClass] = useState<VehicleClass>('sedan');

  const canSave = plate.trim().length >= 4 && name.trim().length >= 1;

  const save = () => {
    if (!canSave) return;
    dispatch({
      type: 'addVehicle',
      vehicle: {
        id: makeId('v'),
        plate: plate.trim(),
        name: name.trim(),
        vClass,
        primary: state.vehicles.length === 0,
      },
    });
    setPlate('');
    setName('');
    setVClass('sedan');
    setAdding(false);
    toast.show('차량을 추가했어요');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {state.vehicles.length === 0 && !adding && (
          <EmptyState icon="car-off" title="등록된 차량이 없어요" body="예약 시 호스트에게 전달할 차량을 등록하세요." />
        )}

        {state.vehicles.map((v) => (
          <View
            key={v.id}
            style={[styles.card, shadow, { backgroundColor: colors.surface, borderRadius: radii.md }]}
          >
            <View style={[styles.icon, { backgroundColor: colors.blueSoft, borderRadius: radii.sm }]}>
              <MaterialCommunityIcons name="car-side" size={22} color={colors.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.plateRow}>
                <Text style={[styles.plate, { color: colors.ink }]}>{v.plate}</Text>
                {v.primary && (
                  <View style={[styles.primaryTag, { backgroundColor: colors.blueSoft, borderRadius: radii.pill }]}>
                    <Text style={[styles.primaryTagText, { color: colors.blueDark }]}>기본</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.name, { color: colors.muted }]}>
                {v.name} · {vehicleClassLabel[v.vClass].replace('까지', '')}
              </Text>
            </View>
            <View style={styles.cardActions}>
              {!v.primary && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="기본 차량으로 설정"
                  hitSlop={8}
                  onPress={() => dispatch({ type: 'setPrimaryVehicle', id: v.id })}
                >
                  <MaterialCommunityIcons name="star-outline" size={20} color={colors.subtle} />
                </Pressable>
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="차량 삭제"
                hitSlop={8}
                onPress={() => {
                  dispatch({ type: 'removeVehicle', id: v.id });
                  toast.show('차량을 삭제했어요');
                }}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.subtle} />
              </Pressable>
            </View>
          </View>
        ))}

        {adding ? (
          <View style={[styles.form, { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: radii.md }]}>
            <Text style={[styles.formLabel, { color: colors.ink }]}>차량 번호</Text>
            <TextInput
              value={plate}
              onChangeText={setPlate}
              placeholder="12가 3456"
              placeholderTextColor={colors.subtle}
              style={[styles.input, { borderColor: colors.line, color: colors.ink, borderRadius: radii.sm }]}
            />
            <Text style={[styles.formLabel, { color: colors.ink }]}>차종</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="현대 아반떼"
              placeholderTextColor={colors.subtle}
              style={[styles.input, { borderColor: colors.line, color: colors.ink, borderRadius: radii.sm }]}
            />
            <Text style={[styles.formLabel, { color: colors.ink }]}>크기 분류</Text>
            <View style={styles.classRow}>
              {vehicleClassOrder.map((c) => (
                <Chip
                  key={c}
                  label={vehicleClassLabel[c].replace('까지', '')}
                  active={vClass === c}
                  onPress={() => setVClass(c)}
                />
              ))}
            </View>
            <View style={styles.formActions}>
              <Pressable
                onPress={() => setAdding(false)}
                style={[styles.cancelBtn, { borderColor: colors.line, borderRadius: radii.md }]}
              >
                <Text style={[styles.cancelText, { color: colors.muted }]}>취소</Text>
              </Pressable>
              <PrimaryButton label="차량 저장" icon="check" disabled={!canSave} onPress={save} style={{ flex: 1 }} />
            </View>
          </View>
        ) : (
          <PrimaryButton label="차량 추가" icon="plus" secondary onPress={() => setAdding(true)} style={{ marginTop: 4 }} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 12 },
  card: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  plateRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  plate: { fontSize: 14, fontWeight: '900' },
  primaryTag: { paddingHorizontal: 7, paddingVertical: 2 },
  primaryTagText: { fontSize: 10, fontWeight: '900' },
  name: { marginTop: 3, fontSize: 11, fontWeight: '600' },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  form: { padding: 16, borderWidth: 1, gap: 8 },
  formLabel: { marginTop: 6, fontSize: 12, fontWeight: '900' },
  input: { height: 46, paddingHorizontal: 12, borderWidth: 1, fontSize: 14, fontWeight: '700' },
  classRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 2 },
  formActions: { marginTop: 14, flexDirection: 'row', gap: 9 },
  cancelBtn: { width: 88, minHeight: 54, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 14, fontWeight: '900' },
});
