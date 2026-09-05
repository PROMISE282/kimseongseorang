import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip } from '../components/Chip';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, radii, shadow } from '../theme';

const preview = require('../../assets/ai-space-preview.jpg');

type RegisterScreenProps = { onComplete: () => void };

export function RegisterScreen({ onComplete }: RegisterScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [price, setPrice] = useState('2400');
  const [vehicle, setVehicle] = useState('SUV까지');
  const [time, setTime] = useState('평일 저녁');
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (step !== 2) return;
    progress.setValue(0);
    const animation = Animated.timing(progress, { toValue: 1, duration: 2100, useNativeDriver: false });
    animation.start(({ finished }) => finished && setStep(3));
    return () => animation.stop();
  }, [progress, step]);

  useEffect(() => {
    if (step !== 4) return;
    const timer = setTimeout(onComplete, 1100);
    return () => clearTimeout(timer);
  }, [onComplete, step]);

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

  const startDemoAnalysis = () => {
    setPhotoUri(null);
    setStep(2);
  };

  const finish = () => {
    setStep(4);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>내 공간 등록</Text>
        <Text style={styles.step}>{Math.min(step, 3)} / 3</Text>
      </View>
      <View style={styles.stepTrack}>
        {[1, 2, 3].map((number) => <View key={number} style={[styles.stepBar, number <= step && styles.stepBarActive]} />)}
      </View>

      {step === 1 && (
        <>
          <Text style={styles.lead}>주차공간이 한눈에 보이도록{`\n`}사진 한 장만 찍어주세요.</Text>
          <Text style={styles.body}>AI가 폭·길이·진입로를 모델링해 게스트에게 보여줄 검증 카드를 만듭니다.</Text>
          <View style={styles.cameraGuide}>
            <Image source={preview} style={styles.guideImage} resizeMode="cover" />
            <View style={styles.guideOverlay}>
              <View style={[styles.corner, styles.topLeft]} /><View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} /><View style={[styles.corner, styles.bottomRight]} />
              <View style={styles.guideBadge}><MaterialCommunityIcons name="check-circle" size={16} color={colors.green} /><Text style={styles.guideBadgeText}>공간 전체가 보여요</Text></View>
            </View>
          </View>
          <View style={styles.tips}>
            <Tip icon="weather-sunny" text="밝은 시간에" />
            <Tip icon="arrow-expand-all" text="입구까지 넓게" />
            <Tip icon="car-off" text="차량은 비우고" />
          </View>
          <PrimaryButton label="카메라로 촬영" icon="camera" onPress={takePhoto} />
          <PrimaryButton label="사진 보관함에서 선택" icon="image-outline" onPress={pickPhoto} secondary style={styles.secondaryButton} />
          <Pressable accessibilityRole="button" onPress={startDemoAnalysis} style={styles.demoButton}><Text style={styles.demoText}>데모 이미지로 분석해보기</Text></Pressable>
        </>
      )}

      {step === 2 && (
        <View style={styles.analysisWrap}>
          <View style={styles.scanImageWrap}>
            <Image source={photoUri ? { uri: photoUri } : preview} style={styles.scanImage} resizeMode="cover" />
            <Animated.View style={[styles.scanLine, { top: progress.interpolate({ inputRange: [0, 1], outputRange: ['8%', '90%'] }) }]} />
            <View style={styles.scanGrid}><View style={styles.gridLineV} /><View style={styles.gridLineH} /></View>
          </View>
          <Text style={styles.analysisTitle}>공간을 입체적으로 분석 중이에요</Text>
          <Text style={styles.analysisBody}>차량 진입로와 장애물, 실제 주차 가능 영역을 찾고 있습니다.</Text>
          <Animated.View style={styles.analysisTrack}><Animated.View style={[styles.analysisProgress, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['2%', '100%'] }) }]} /></Animated.View>
          <View style={styles.analysisItems}>
            <AnalysisItem label="주차 경계 인식" status="완료" />
            <AnalysisItem label="진입 동선 계산" status="분석 중" muted />
            <AnalysisItem label="차종별 적합도" status="대기" muted />
          </View>
        </View>
      )}

      {step === 3 && (
        <>
          <View style={styles.successBadge}><MaterialCommunityIcons name="check-decagram" size={18} color={colors.green} /><Text style={styles.successText}>AI 모델 생성 완료</Text></View>
          <Text style={styles.lead}>게스트가 볼 공간 정보를{`\n`}마지막으로 확인해주세요.</Text>
          <View style={styles.resultCard}>
            <Image source={preview} style={styles.resultImage} resizeMode="cover" />
            <View style={styles.resultStats}>
              <View><Text style={styles.resultLabel}>유효 공간</Text><Text style={styles.resultValue}>2.48 × 5.32m</Text></View>
              <View><Text style={styles.resultLabel}>AI 신뢰도</Text><Text style={styles.resultValueBlue}>96%</Text></View>
            </View>
          </View>
          <Text style={styles.formLabel}>시간당 요금</Text>
          <View style={styles.inputWrap}><TextInput accessibilityLabel="시간당 요금" value={price} onChangeText={setPrice} keyboardType="number-pad" style={styles.priceInput} /><Text style={styles.inputSuffix}>원</Text></View>
          <Text style={styles.formLabel}>이용 가능한 차량</Text>
          <View style={styles.optionRow}>{['준중형까지', 'SUV까지', '대형 SUV'].map((label) => <Chip key={label} label={label} active={vehicle === label} onPress={() => setVehicle(label)} />)}</View>
          <Text style={styles.formLabel}>공유 시간</Text>
          <View style={styles.optionRow}>{['평일 저녁', '주말', '직접 설정'].map((label) => <Chip key={label} label={label} active={time === label} onPress={() => setTime(label)} />)}</View>
          <View style={styles.approvalNotice}>
            <MaterialCommunityIcons name="account-clock-outline" size={23} color={colors.blue} />
            <View style={styles.approvalText}><Text style={styles.approvalTitle}>예약마다 직접 승인</Text><Text style={styles.approvalBody}>게스트의 차종과 시간을 확인한 뒤 승인할 수 있어요. 원치 않는 이용은 자동으로 성사되지 않습니다.</Text></View>
          </View>
          <PrimaryButton label="검수 요청하고 등록" icon="arrow-right" onPress={finish} />
        </>
      )}

      {step === 4 && (
        <View style={styles.complete}>
          <View style={styles.completeIcon}><MaterialCommunityIcons name="check" size={40} color={colors.surface} /></View>
          <Text style={styles.completeTitle}>공간 등록을 요청했어요</Text>
          <Text style={styles.completeBody}>AI 검증 리포트와 소유 확인을 마치면{`\n`}승인 가능한 공간으로 공개됩니다.</Text>
        </View>
      )}
    </ScrollView>
  );
}

function Tip({ icon, text }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; text: string }) {
  return <View style={styles.tip}><MaterialCommunityIcons name={icon} size={20} color={colors.blue} /><Text style={styles.tipText}>{text}</Text></View>;
}

function AnalysisItem({ label, status, muted = false }: { label: string; status: string; muted?: boolean }) {
  return <View style={styles.analysisItem}><View style={[styles.analysisDot, muted && styles.analysisDotMuted]} /><Text style={[styles.analysisLabel, muted && styles.muted]}>{label}</Text><Text style={[styles.analysisStatus, muted && styles.muted]}>{status}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 116 },
  header: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  title: { color: colors.ink, fontSize: 25, fontWeight: '900', letterSpacing: -0.7 },
  step: { color: colors.muted, fontSize: 13, fontWeight: '800' },
  stepTrack: { marginTop: 17, flexDirection: 'row', gap: 6 },
  stepBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line },
  stepBarActive: { backgroundColor: colors.blue },
  lead: { marginTop: 28, color: colors.ink, fontSize: 25, lineHeight: 34, fontWeight: '900', letterSpacing: -1 },
  body: { marginTop: 9, color: colors.muted, fontSize: 13, lineHeight: 20, fontWeight: '500' },
  cameraGuide: { marginTop: 22, height: 246, overflow: 'hidden', borderRadius: radii.lg, backgroundColor: colors.blueSoft },
  guideImage: { width: '100%', height: '100%' },
  guideOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(11,25,46,0.12)' },
  corner: { position: 'absolute', width: 32, height: 32, borderColor: colors.surface },
  topLeft: { left: 18, top: 18, borderLeftWidth: 3, borderTopWidth: 3 },
  topRight: { right: 18, top: 18, borderRightWidth: 3, borderTopWidth: 3 },
  bottomLeft: { left: 18, bottom: 18, borderLeftWidth: 3, borderBottomWidth: 3 },
  bottomRight: { right: 18, bottom: 18, borderRightWidth: 3, borderBottomWidth: 3 },
  guideBadge: { position: 'absolute', alignSelf: 'center', bottom: 16, minHeight: 34, paddingHorizontal: 11, borderRadius: radii.pill, backgroundColor: 'rgba(255,255,255,0.94)', flexDirection: 'row', alignItems: 'center', gap: 5 },
  guideBadgeText: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  tips: { marginVertical: 16, flexDirection: 'row', gap: 8 },
  tip: { flex: 1, minHeight: 68, padding: 8, borderRadius: 13, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  tipText: { marginTop: 5, color: colors.muted, fontSize: 10, fontWeight: '700' },
  secondaryButton: { marginTop: 9 },
  demoButton: { minHeight: 40, alignItems: 'center', justifyContent: 'center' },
  demoText: { color: colors.muted, fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },
  analysisWrap: { paddingTop: 32, alignItems: 'center' },
  scanImageWrap: { width: '100%', height: 300, overflow: 'hidden', borderRadius: radii.lg, backgroundColor: colors.blueSoft },
  scanImage: { width: '100%', height: '100%' },
  scanLine: { position: 'absolute', left: 12, right: 12, height: 2, backgroundColor: '#58B7FF', shadowColor: colors.blue, shadowOpacity: 0.9, shadowRadius: 10 },
  scanGrid: { ...StyleSheet.absoluteFill, borderWidth: 1, borderColor: 'rgba(255,255,255,0.45)' },
  gridLineV: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  gridLineH: { position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  analysisTitle: { marginTop: 27, color: colors.ink, fontSize: 20, fontWeight: '900', textAlign: 'center' },
  analysisBody: { marginTop: 8, color: colors.muted, fontSize: 12, lineHeight: 18, fontWeight: '600', textAlign: 'center' },
  analysisTrack: { marginTop: 24, width: '100%', height: 8, borderRadius: 4, backgroundColor: colors.line, overflow: 'hidden' },
  analysisProgress: { height: '100%', borderRadius: 4, backgroundColor: colors.blue },
  analysisItems: { marginTop: 22, width: '100%', padding: 16, borderRadius: radii.md, backgroundColor: colors.surface, gap: 15 },
  analysisItem: { flexDirection: 'row', alignItems: 'center' },
  analysisDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green, marginRight: 9 },
  analysisDotMuted: { backgroundColor: colors.line },
  analysisLabel: { flex: 1, color: colors.ink, fontSize: 13, fontWeight: '800' },
  analysisStatus: { color: colors.green, fontSize: 11, fontWeight: '800' },
  muted: { color: colors.subtle },
  successBadge: { marginTop: 25, alignSelf: 'flex-start', minHeight: 32, paddingHorizontal: 11, borderRadius: radii.pill, backgroundColor: colors.greenSoft, flexDirection: 'row', alignItems: 'center', gap: 6 },
  successText: { color: colors.green, fontSize: 11, fontWeight: '900' },
  resultCard: { marginTop: 20, overflow: 'hidden', borderRadius: radii.lg, backgroundColor: colors.surface, ...shadow },
  resultImage: { width: '100%', height: 220 },
  resultStats: { padding: 15, flexDirection: 'row', justifyContent: 'space-between' },
  resultLabel: { color: colors.muted, fontSize: 10, fontWeight: '700' },
  resultValue: { marginTop: 3, color: colors.ink, fontSize: 14, fontWeight: '900' },
  resultValueBlue: { marginTop: 3, color: colors.blue, fontSize: 14, fontWeight: '900', textAlign: 'right' },
  formLabel: { marginTop: 22, marginBottom: 9, color: colors.ink, fontSize: 13, fontWeight: '900' },
  inputWrap: { height: 52, paddingHorizontal: 15, borderRadius: radii.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center' },
  priceInput: { flex: 1, color: colors.ink, fontSize: 18, fontWeight: '900' },
  inputSuffix: { color: colors.muted, fontSize: 14, fontWeight: '700' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  approvalNotice: { marginVertical: 24, padding: 15, borderRadius: radii.md, backgroundColor: colors.blueSoft, flexDirection: 'row', gap: 10 },
  approvalText: { flex: 1 },
  approvalTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  approvalBody: { marginTop: 5, color: colors.muted, fontSize: 11, lineHeight: 17, fontWeight: '600' },
  complete: { minHeight: 520, alignItems: 'center', justifyContent: 'center' },
  completeIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', ...shadow },
  completeTitle: { marginTop: 22, color: colors.ink, fontSize: 22, fontWeight: '900' },
  completeBody: { marginTop: 8, color: colors.muted, fontSize: 13, lineHeight: 20, textAlign: 'center', fontWeight: '600' },
});
