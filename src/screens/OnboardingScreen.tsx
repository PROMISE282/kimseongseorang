import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '../components/Brand';
import { PrimaryButton } from '../components/PrimaryButton';
import { useStore } from '../store/StoreProvider';
import { useTheme } from '../theme/ThemeProvider';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const points: { icon: IconName; title: string; body: string }[] = [
  { icon: 'cube-scan', title: 'AI 공간 검증', body: '사진 한 장으로 폭·길이·진입 동선을 모델링해 도착 전에 확인해요.' },
  { icon: 'account-check-outline', title: '호스트 사전승인', body: '차량과 이용 시간을 호스트가 확인하고 승인한 뒤에만 결제돼요.' },
  { icon: 'shield-check-outline', title: '체크인 보장', body: '승인된 공간에 주차할 수 없으면 즉시 대체 공간을 연결해요.' },
];

export function OnboardingScreen() {
  const { colors, radii } = useTheme();
  const { dispatch } = useStore();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.top}>
        <Brand />
        <LinearGradient colors={[colors.blue, colors.blueDark]} style={[styles.hero, { borderRadius: radii.xl }]}>
          <Text style={styles.heroTitle}>빈 공간을 찍으면,{'\n'}안심 주차가 시작돼요.</Text>
          <Text style={styles.heroBody}>검증된 초근거리 사유지 주차를 확실하게.</Text>
          <View style={styles.heroCar}>
            <MaterialCommunityIcons name="car" size={54} color="rgba(255,255,255,0.95)" />
          </View>
        </LinearGradient>

        <View style={styles.points}>
          {points.map((p) => (
            <View key={p.title} style={styles.point}>
              <View style={[styles.pointIcon, { backgroundColor: colors.blueSoft, borderRadius: radii.md }]}>
                <MaterialCommunityIcons name={p.icon} size={22} color={colors.blue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.pointTitle, { color: colors.ink }]}>{p.title}</Text>
                <Text style={[styles.pointBody, { color: colors.muted }]}>{p.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton
          label="주차모아 시작하기"
          icon="arrow-right"
          onPress={() => dispatch({ type: 'completeOnboarding' })}
        />
        <Text style={[styles.legal, { color: colors.subtle }]}>
          계속하면 이용약관과 개인정보 처리방침에 동의하는 것으로 간주됩니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'space-between' },
  top: { paddingHorizontal: 24, paddingTop: 12 },
  hero: { marginTop: 20, minHeight: 190, padding: 24, overflow: 'hidden', justifyContent: 'center' },
  heroTitle: { color: '#FFFFFF', fontSize: 25, lineHeight: 34, fontWeight: '900', letterSpacing: -0.8 },
  heroBody: { marginTop: 10, color: '#DCE8FF', fontSize: 13, fontWeight: '600' },
  heroCar: { position: 'absolute', right: 18, bottom: 14 },
  points: { marginTop: 26, gap: 18 },
  point: { flexDirection: 'row', gap: 13, alignItems: 'center' },
  pointIcon: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  pointTitle: { fontSize: 15, fontWeight: '900' },
  pointBody: { marginTop: 4, fontSize: 12, lineHeight: 18, fontWeight: '600' },
  bottom: { paddingHorizontal: 24, paddingBottom: 12 },
  legal: { marginTop: 12, fontSize: 10, lineHeight: 15, textAlign: 'center', fontWeight: '600' },
});
