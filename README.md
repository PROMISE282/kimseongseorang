# 주차모아 (Juchamowa)

AI 공간 검증과 호스트 사전승인으로 사유지 주차공간을 안심하고 빌리는 **React Native 모바일 앱**입니다. iOS / Android 네이티브 앱으로 개발되었으며 Expo SDK 57 위에서 동작합니다.

## 실행

요구 환경: Node.js 22.13 이상, npm, Expo Go(SDK 57) 또는 개발 빌드.

```bash
npm install
npm run ios      # iOS 시뮬레이터
npm run android  # Android 에뮬레이터
npm start        # Expo Dev 서버 (QR로 Expo Go 연결)
```

정적 타입 검사:

```bash
npm run typecheck
```

## 앱 구조

- **네비게이션**: `@react-navigation` 네이티브 스택 + 커스텀 하단 탭. 실제 뒤로가기 스택, iOS 스와이프 백, Android 하드웨어 백을 지원합니다.
- **상태·영속성**: `src/store`의 Context + reducer 스토어를 `@react-native-async-storage`에 저장합니다. 찜·요청·등록한 공간·차량·알림·테마가 앱을 재시작해도 유지됩니다.
- **테마**: `src/theme`의 라이트/다크 토큰. 시스템 설정을 따르며 MY 탭에서 수동 전환할 수 있고 선택이 저장됩니다.
- **첫 실행 온보딩**: 최초 1회 가치 제안 화면을 보여준 뒤 완료 상태를 저장합니다.

## 화면

| 탭/화면 | 내용 |
| --- | --- |
| 홈 | 브랜드 메시지, 검색, 신뢰 요소, 지도/목록 토글, `즉시 승인`·`내 차 적합`·`2천원대` 필터 |
| 지도 | 검증 공간만 정리된 코드 기반 지도, 필터 초기화, 선택 공간 미리보기 |
| 공간 등록 | 촬영 가이드 → 카메라/보관함 → AI 분석 애니메이션 → 요금·차종·시간 설정 → **실제로 새 공간 생성**(검수중 → 공개) |
| 승인 센터 | 내가 보낸 요청의 상태 타임라인(전송→승인→결제), 내 공간에 온 요청 승인/거절 |
| MY | 신뢰 점수, 정산 예상액(승인 건 기준 계산), 내 공간 상태, 알림·찜·차량·테마 |
| 공간 상세 | AI 공간 모델, **공간별 실측값**, **내 차량 기준으로 계산한 적합도**, 진입 동선·난이도, 호스트 신뢰, 승인 요청 |
| 예약 시트 | 이용 시작 시간·시간·차량 선택, 요금 자동 계산, 적합도 경고 |
| 알림 | 요청·승인·거절·등록 알림 목록, 진입 시 읽음 처리 |
| 찜한 공간 | 저장한 공간 목록 |
| 내 차량 | 차량 추가·삭제·기본 차량 설정 (예약 시 사용) |

실제 AI 추론, 로그인, 지도 SDK, 결제, 푸시, 서버 저장은 백엔드 연동 전 데모 상태입니다. 호스트 승인은 요청 후 데모용으로 잠시 뒤 자동 승인됩니다. 제품 의도와 출시 범위는 [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) 참고.

## 기술 구성

- Expo SDK 57 / React Native 0.86 / React 19.2 / TypeScript strict
- `@react-navigation/native` 7 (native-stack, bottom-tabs)
- `@react-native-async-storage/async-storage`
- `react-native-safe-area-context`, `react-native-screens`, `react-native-gesture-handler`
- `expo-image-picker`, `expo-linear-gradient`, `@expo/vector-icons`

## 소스 레이아웃

- `App.tsx` — Provider 트리(Gesture/SafeArea/Theme/Store/Toast/Navigation)와 하이드레이션 게이트
- `src/navigation` — 루트 스택, 탭 네비게이터, 커스텀 탭바
- `src/store` — 타입, 시드 데이터, reducer + AsyncStorage 영속화, 셀렉터 훅
- `src/theme` — 라이트/다크 토큰과 `ThemeProvider`
- `src/screens` — 11개 화면
- `src/components` — Brand, SpaceCard, MapCanvas, Chip, PrimaryButton, Pill, EmptyState, Screen, ToastProvider
- `src/utils` — 통화·시간 포맷, 차량↔공간 적합도 계산(`fit.ts`)

## 이미지 자산

`assets/ai-space-preview.jpg`는 주차모아 앱을 위해 생성한 AI 공간 모델링 예시입니다.
