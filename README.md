# 주차모아

AI 공간 검증과 호스트 사전승인으로 사유지 주차공간을 안심하고 빌리는 React Native MVP입니다. iOS, Android, Web에서 같은 코드로 실행됩니다.

## 실행

요구 환경: Node.js 22.13 이상, npm, 모바일 테스트 시 Expo Go SDK 57.

```bash
npm install
npm start
```

웹 미리보기:

```bash
npm run web
```

정적 타입 검사와 웹 빌드 검증:

```bash
npm run typecheck
npm run export:web
```

Impeccable 디자인 품질 검사:

```bash
.agents/skills/impeccable/scripts/impeccable detect src/
```

Impeccable은 이 프로젝트의 `.agents`에 설치되어 있으며, Codex에서 `/hooks`를 열어 프로젝트 훅을 승인하면 UI 파일을 수정할 때마다 검사가 자동 실행됩니다. 제품·디자인 맥락을 장기적으로 고정하려면 다음 Codex 작업에서 `/impeccable init`을 실행하세요.

## 구현된 기능

- 지역·장소 검색과 승인/차종/가격 필터
- 코드 기반 지도와 가격 핀, 공간 카드 선택
- AI 3D 공간 모델, 실측값, 차량 적합도, 진입 동선 화면
- 이용시간 선택과 호스트 승인 요청
- 게스트 요청 상태 추적과 호스트 승인/거절
- 실제 카메라 및 사진 보관함 연결
- AI 분석 진행 애니메이션과 공간 등록 조건 설정
- 호스트 수익·신뢰·공간 상태 대시보드
- 520px 모바일 캔버스로 정돈된 반응형 웹 미리보기

실제 AI 추론, 로그인, 지도 SDK, 결제, 푸시, 데이터 저장은 백엔드 연동 전의 데모 상태입니다. 제품 의도와 출시 범위는 [PRODUCT_SPEC.md](./PRODUCT_SPEC.md)에 정리돼 있습니다.

## 기술 구성

- Expo SDK 57
- React Native 0.86 / React 19.2
- TypeScript strict mode
- Expo Image Picker, Linear Gradient, Vector Icons
- React Native Safe Area Context
- Impeccable 프로젝트 스킬과 UI 품질 검사 훅

## 핵심 코드

- `App.tsx`: 앱 상태와 화면 흐름
- `src/screens`: 홈, 지도, 상세, 등록, 승인, MY
- `src/components`: 브랜드, 지도, 카드, 버튼, 하단 탭, 예약 시트
- `src/data.ts`: 데모 공간 데이터
- `src/theme.ts`: 색상·라운드·그림자 디자인 토큰

## 이미지 자산

`assets/ai-space-preview.jpg`는 주차모아 앱을 위해 생성한 AI 공간 모델링 예시입니다. 생성 프롬프트와 방식은 작업 결과 안내에 기록합니다.
