import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip } from '../components/Chip';
import { PrimaryButton } from '../components/PrimaryButton';
import { useToast } from '../components/ToastProvider';
import { Screen } from '../components/Screen';
import { makeId, notify, useStore } from '../store/StoreProvider';
import type { Space, VehicleClass } from '../store/types';
import { useTheme } from '../theme/ThemeProvider';
import type { RootStackParamList } from '../navigation/types';

const preview = require('../../assets/ai-space-preview.jpg');
type Nav = NativeStackNavigationProp<RootStackParamList>;
type Step = 1 | 2 | 3 | 4;

const vehicleChoices: { label: string; value: VehicleClass }[] = [
  { label: '준중형까지', value: 'compact' },
  { label: '중형 세단까지', value: 'sedan' },
  { label: 'SUV까지', value: 'suv' },
  { label: '대형 SUV', value: 'largeSuv' },
];

const dimsByClass: Record<VehicleClass, { width: number; length: number }> = {
  compact: { width: 2.15, length: 4.8 },
  sedan: { width: 2.32, length: 5.05 },
  suv: { width: 2.5, length: 5.35 },
  largeSuv: { width: 2.78, length: 5.9 },
};

export function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { colors, radii, shadow } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const toast = useToast();
  const { dispatch } = useStore();

  const [step, setStep] = useState<Step>(1);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [price, setPrice] = useState('2400');
  const [vehicle, setVehicle] = useState<VehicleClass>('suv');
  const [time, setTime] = useState('평일 저녁');
  const progress = useRef(new Animated.Value(0)).current;

  const reset = useCallback(() => {
    setStep(1);
    setPhotoUri(null);
    setPrice('2400');
    setVehicle('suv');
    setTime('평일 저녁');
    progress.setValue(0);
  }, [progress]);

  useEffect(() => {
    if (step !== 2) return;
    progress.setValue(0);
    const anim = Animated.timing(progress, { toValue: 1, duration: 2100, useNativeDriver: false });
    anim.start(({ finished }) => finished && setStep(3));
    return () => anim.stop();
  }, [progress, step]);

  const publish = () => {
    const parsedPrice = Math.max(500, Math.min(20000, parseInt(price, 10) || 2400));
    const dims = dimsByClass[vehicle];
    const space: Space = {
      id: makeId('space'),
      title: '내 집 앞 주차공간',
      area: '성수동2가',
      address: '서울 성동구 (승인 후 공개)',
      walk: '성수역 5분',
      price: parsedPrice,
      rating: 0,
      reviews: 0,
      responseTime: '평균 5분',
      instant: false,
      maxClass: vehicle,
      dimensions: dims,
      aiConfidence: 94,
      entryDifficulty: 'easy',
      entryNote: 'AI 분석 기준 진입로에 장애물이 없습니다.',
      features: ['AI 검증 완료', time, '사진 등록'],
      available: time.includes('저녁') ? '평일 18:00 이후' : '주말 상시',
      availableFromNow: false,
      x: 30 + Math.round(Math.random() * 45),
      y: 25 + Math.round(Math.random() * 45),
      host: { name: '나', initial: '나', approvalRate: 100, verified: false },
      ownedByMe: true,
      listed: false,
    };
    dispatch({ type: 'addSpace', space });
    notify(dispatch, {
      kind: 'listing',
      title: '검수 요청이 접수됐어요',
      body: 'AI 검증 리포트와 소유 확인을 마치면 공개됩니다. 보통 몇 분 안에 완료돼요.',
    });
    setStep(4);

    setTimeout(() => {
      dispatch({ type: 'toggleListing', spaceId: space.id });
      notify(dispatch, {
        kind: 'listing',
        title: '공간이 공개됐어요',
        body: `${space.title}이(가) 승인 가능한 공간 목록에 올라갔어요.`,
      });
    }, 6000);

    setTimeout(() => {
      reset();
      navigation.navigate('Tabs', { screen: 'My' });
      toast.show('검수 요청이 접수됐어요');
    }, 1200);
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('카메라 권한이 필요해요', '주차공간을 촬영하려면 설정에서 카메라 접근을 허용해주세요.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.82 });
      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
        setStep(2);
      }
    } catch {
      Alert.alert('카메라를 열 수 없어요', Platform.OS === 'web' ? '이 브라우저에서는 사진 보관함을 이용해주세요.' : '잠시 후 다시 시도해주세요.');
    }
  };

  const pickPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('사진 권한이 필요해요', '주차공간 사진을 선택하려면 사진 접근을 허용해주세요.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.82 });
      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
        setStep(2);
      }
    } catch {
      Alert.alert('사진을 불러올 수 없어요', '잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.ink }]}>내 공간 등록</Text>
          <Text style={[styles.step, { color: colors.muted }]}>{Math.min(step, 3)} / 3</Text>
        </View>
        <View style={styles.stepTrack}>
          {[1, 2, 3].map((n) => (
            <View
              key={n}
              style={[styles.stepBar, { backgroundColor: n <= step ? colors.blue : colors.line }]}
            />
          ))}
        </View>

        {step === 1 && (
          <>
            <Text style={[styles.lead, { color: colors.ink }]}>
              주차공간이 한눈에 보이도록{'\n'}사진 한 장만 찍어주세요.
            </Text>
            <Text style={[styles.body, { color: colors.muted }]}>
              AI가 폭·길이·진입로를 모델링해 게스트에게 보여줄 검증 카드를 만듭니다.
            </Text>
            <View style={[styles.cameraGuide, { backgroundColor: colors.blueSoft, borderRadius: radii.lg }]}>
              <Image source={preview} style={styles.guideImage} resizeMode="cover" />
              <View style={styles.guideOverlay}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>
            <View style={styles.tips}>
              <Tip icon="weather-sunny" text="밝은 시간에" />
              <Tip icon="arrow-expand-all" text="입구까지 넓게" />
              <Tip icon="car-off" text="차량은 비우고" />
            </View>
            <PrimaryButton label="카메라로 촬영" icon="camera" onPress={takePhoto} />
            <PrimaryButton label="사진 보관함에서 선택" icon="image-outline" onPress={pickPhoto} secondary style={{ marginTop: 9 }} />
            <Pressable accessibilityRole="button" onPress={() => setStep(2)} style={styles.demoButton}>
              <Text style={[styles.demoText, { color: colors.muted }]}>데모 이미지로 분석해보기</Text>
            </Pressable>
          </>
        )}

        {step === 2 && (
          <View style={styles.analysisWrap}>
            <View style={[styles.scanImageWrap, { backgroundColor: colors.blueSoft, borderRadius: radii.lg }]}>
              <Image source={photoUri ? { uri: photoUri } : preview} style={styles.scanImage} resizeMode="cover" />
              <Animated.View
                style={[
                  styles.scanLine,
                  { backgroundColor: colors.blue, top: progress.interpolate({ inputRange: [0, 1], outputRange: ['8%', '90%'] }) },
                ]}
              />
            </View>
            <Text style={[styles.analysisTitle, { color: colors.ink }]}>공간을 입체적으로 분석 중이에요</Text>
            <Text style={[styles.analysisBody, { color: colors.muted }]}>
              차량 진입로와 장애물, 실제 주차 가능 영역을 찾고 있습니다.
            </Text>
            <View style={[styles.analysisTrack, { backgroundColor: colors.line }]}>
              <Animated.View
                style={[
                  styles.analysisProgress,
                  { backgroundColor: colors.blue, width: progress.interpolate({ inputRange: [0, 1], outputRange: ['2%', '100%'] }) },
                ]}
              />
            </View>
            <View style={[styles.analysisItems, { backgroundColor: colors.surface, borderRadius: radii.md }]}>
              <AnalysisItem label="주차 경계 인식" status="완료" />
              <AnalysisItem label="진입 동선 계산" status="분석 중" muted />
              <AnalysisItem label="차종별 적합도" status="대기" muted />
            </View>
          </View>
        )}

        {step === 3 && (
          <>
            <View style={[styles.successBadge, { backgroundColor: colors.greenSoft, borderRadius: radii.pill }]}>
              <MaterialCommunityIcons name="check-decagram" size={16} color={colors.green} />
              <Text style={[styles.successText, { color: colors.green }]}>AI 모델 생성 완료</Text>
            </View>
            <Text style={[styles.lead, { color: colors.ink }]}>
              게스트가 볼 공간 정보를{'\n'}마지막으로 확인해주세요.
            </Text>
            <View style={[styles.resultCard, shadow, { backgroundColor: colors.surface, borderRadius: radii.lg }]}>
              <Image source={preview} style={styles.resultImage} resizeMode="cover" />
              <View style={styles.resultStats}>
                <View>
                  <Text style={[styles.resultLabel, { color: colors.muted }]}>유효 공간</Text>
                  <Text style={[styles.resultValue, { color: colors.ink }]}>
                    {dimsByClass[vehicle].width.toFixed(2)} × {dimsByClass[vehicle].length.toFixed(2)}m
                  </Text>
                </View>
                <View>
                  <Text style={[styles.resultLabel, { color: colors.muted }]}>AI 신뢰도</Text>
                  <Text style={[styles.resultValueBlue, { color: colors.blue }]}>94%</Text>
                </View>
              </View>
            </View>

            <Text style={[styles.formLabel, { color: colors.ink }]}>시간당 요금</Text>
            <View style={[styles.inputWrap, { borderColor: colors.line, backgroundColor: colors.surface, borderRadius: radii.md }]}>
              <TextInput
                accessibilityLabel="시간당 요금"
                value={price}
                onChangeText={(t) => setPrice(t.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                style={[styles.priceInput, { color: colors.ink }]}
                placeholder="2400"
                placeholderTextColor={colors.subtle}
              />
              <Text style={[styles.inputSuffix, { color: colors.muted }]}>원</Text>
            </View>

            <Text style={[styles.formLabel, { color: colors.ink }]}>이용 가능한 차량</Text>
            <View style={styles.optionRow}>
              {vehicleChoices.map((c) => (
                <Chip key={c.value} label={c.label} active={vehicle === c.value} onPress={() => setVehicle(c.value)} />
              ))}
            </View>

            <Text style={[styles.formLabel, { color: colors.ink }]}>공유 시간</Text>
            <View style={styles.optionRow}>
              {['평일 저녁', '주말', '직접 설정'].map((label) => (
                <Chip key={label} label={label} active={time === label} onPress={() => setTime(label)} />
              ))}
            </View>

            <View style={[styles.approvalNotice, { backgroundColor: colors.blueSoft, borderRadius: radii.md }]}>
              <MaterialCommunityIcons name="account-clock-outline" size={22} color={colors.blue} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.approvalTitle, { color: colors.ink }]}>예약마다 직접 승인</Text>
                <Text style={[styles.approvalBody, { color: colors.muted }]}>
                  게스트의 차종과 시간을 확인한 뒤 승인할 수 있어요. 원치 않는 이용은 자동으로 성사되지 않습니다.
                </Text>
              </View>
            </View>
            <PrimaryButton label="검수 요청하고 등록" icon="arrow-right" onPress={publish} />
          </>
        )}

        {step === 4 && (
          <View style={styles.complete}>
            <View style={[styles.completeIcon, shadow, { backgroundColor: colors.green }]}>
              <MaterialCommunityIcons name="check" size={40} color="#FFFFFF" />
            </View>
            <Text style={[styles.completeTitle, { color: colors.ink }]}>공간 등록을 요청했어요</Text>
            <Text style={[styles.completeBody, { color: colors.muted }]}>
              AI 검증 리포트와 소유 확인을 마치면{'\n'}승인 가능한 공간으로 공개됩니다.
            </Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

function Tip({ icon, text }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; text: string }) {
  const { colors, radii } = useTheme();
  return (
    <View style={[styles.tip, { backgroundColor: colors.surface, borderRadius: radii.sm }]}>
      <MaterialCommunityIcons name={icon} size={20} color={colors.blue} />
      <Text style={[styles.tipText, { color: colors.muted }]}>{text}</Text>
    </View>
  );
}

function AnalysisItem({ label, status, muted = false }: { label: string; status: string; muted?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={styles.analysisItem}>
      <View style={[styles.analysisDot, { backgroundColor: muted ? colors.line : colors.green }]} />
      <Text style={[styles.analysisLabel, { color: muted ? colors.subtle : colors.ink }]}>{label}</Text>
      <Text style={[styles.analysisStatus, { color: muted ? colors.subtle : colors.green }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 8 },
  header: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  title: { fontSize: 25, fontWeight: '900', letterSpacing: -0.7 },
  step: { fontSize: 13, fontWeight: '800' },
  stepTrack: { marginTop: 17, flexDirection: 'row', gap: 6 },
  stepBar: { flex: 1, height: 4, borderRadius: 2 },
  lead: { marginTop: 28, fontSize: 24, lineHeight: 33, fontWeight: '900', letterSpacing: -1 },
  body: { marginTop: 9, fontSize: 13, lineHeight: 20, fontWeight: '500' },
  cameraGuide: { marginTop: 22, height: 240, overflow: 'hidden' },
  guideImage: { width: '100%', height: '100%' },
  guideOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11,25,46,0.12)' },
  corner: { position: 'absolute', width: 32, height: 32, borderColor: '#FFFFFF' },
  topLeft: { left: 18, top: 18, borderLeftWidth: 3, borderTopWidth: 3 },
  topRight: { right: 18, top: 18, borderRightWidth: 3, borderTopWidth: 3 },
  bottomLeft: { left: 18, bottom: 18, borderLeftWidth: 3, borderBottomWidth: 3 },
  bottomRight: { right: 18, bottom: 18, borderRightWidth: 3, borderBottomWidth: 3 },
  tips: { marginVertical: 16, flexDirection: 'row', gap: 8 },
  tip: { flex: 1, minHeight: 68, padding: 8, alignItems: 'center', justifyContent: 'center' },
  tipText: { marginTop: 5, fontSize: 10, fontWeight: '700' },
  demoButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  demoText: { fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },
  analysisWrap: { paddingTop: 30, alignItems: 'center' },
  scanImageWrap: { width: '100%', height: 290, overflow: 'hidden' },
  scanImage: { width: '100%', height: '100%' },
  scanLine: { position: 'absolute', left: 12, right: 12, height: 2, opacity: 0.9 },
  analysisTitle: { marginTop: 26, fontSize: 20, fontWeight: '900', textAlign: 'center' },
  analysisBody: { marginTop: 8, fontSize: 12, lineHeight: 18, fontWeight: '600', textAlign: 'center' },
  analysisTrack: { marginTop: 22, width: '100%', height: 8, borderRadius: 4, overflow: 'hidden' },
  analysisProgress: { height: '100%', borderRadius: 4 },
  analysisItems: { marginTop: 20, width: '100%', padding: 16, gap: 15 },
  analysisItem: { flexDirection: 'row', alignItems: 'center' },
  analysisDot: { width: 8, height: 8, borderRadius: 4, marginRight: 9 },
  analysisLabel: { flex: 1, fontSize: 13, fontWeight: '800' },
  analysisStatus: { fontSize: 11, fontWeight: '800' },
  successBadge: { marginTop: 24, alignSelf: 'flex-start', minHeight: 32, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 6 },
  successText: { fontSize: 11, fontWeight: '900' },
  resultCard: { marginTop: 20, overflow: 'hidden' },
  resultImage: { width: '100%', height: 210 },
  resultStats: { padding: 15, flexDirection: 'row', justifyContent: 'space-between' },
  resultLabel: { fontSize: 10, fontWeight: '700' },
  resultValue: { marginTop: 3, fontSize: 14, fontWeight: '900' },
  resultValueBlue: { marginTop: 3, fontSize: 14, fontWeight: '900', textAlign: 'right' },
  formLabel: { marginTop: 22, marginBottom: 9, fontSize: 13, fontWeight: '900' },
  inputWrap: { height: 52, paddingHorizontal: 15, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  priceInput: { flex: 1, fontSize: 18, fontWeight: '900' },
  inputSuffix: { fontSize: 14, fontWeight: '700' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  approvalNotice: { marginVertical: 22, padding: 15, flexDirection: 'row', gap: 10 },
  approvalTitle: { fontSize: 13, fontWeight: '900' },
  approvalBody: { marginTop: 5, fontSize: 11, lineHeight: 17, fontWeight: '600' },
  complete: { minHeight: 440, alignItems: 'center', justifyContent: 'center' },
  completeIcon: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
  completeTitle: { marginTop: 22, fontSize: 22, fontWeight: '900' },
  completeBody: { marginTop: 8, fontSize: 13, lineHeight: 20, textAlign: 'center', fontWeight: '600' },
});
