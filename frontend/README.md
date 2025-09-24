# SmartDocs Frontend

> **Kafka + AI 문서 OCR·검증·RAG** 플랫폼의 프론트엔드  
> 문서 업로드 → OCR/검증 → 임베딩/색인 → 권한 반영 → RAG 응답까지를 **카프카 중심 스트리밍 파이프라인**으로 처리하는 멀티테넌트 SaaS

## 🚀 프로젝트 개요

SmartDocs는 AI 기반 문서 처리 플랫폼으로, 다음과 같은 핵심 기능을 제공합니다:

- **📄 문서 업로드 및 관리**: 드래그 앤 드롭 파일 업로드, 멀티파일 지원
- **🤖 AI 문서 처리**: OCR, 필드 추출, 검증을 통한 자동화된 문서 분석
- **🔍 스마트 검색**: 벡터 검색 기반 RAG 질의응답 시스템
- **📊 실시간 모니터링**: Kafka 스트림 처리 상태 및 시스템 메트릭 추적
- **🏢 멀티테넌시**: 테넌트별 데이터 격리 및 권한 관리

## 🛠 기술 스택

### 핵심 프레임워크

- **Next.js 15** (React 19, App Router) - 최신 버전 활용
- **TypeScript** - Strict 모드로 타입 안전성 보장
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크

### UI/UX 라이브러리

- **shadcn/ui** - 재사용 가능한 컴포넌트 시스템
- **Radix UI** - 접근성을 고려한 헤드리스 UI 컴포넌트
- **Framer Motion** - 부드러운 애니메이션 및 전환 효과
- **Lucide React** - 일관된 아이콘 시스템

### 상태 관리

- **TanStack Query (React Query)** - 서버 상태 관리 및 캐싱
- **Zustand** - 클라이언트 상태 관리
- **React Hook Form** - 폼 상태 및 검증 관리

### 개발 도구

- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **TypeScript** - 정적 타입 검사
- **React Query DevTools** - 개발 환경 디버깅

## 📁 프로젝트 구조

```
frontend/
├── app/                          # Next.js App Router
│   ├── dashboard/               # 대시보드 페이지들
│   │   ├── documents/           # 문서 관리 페이지
│   │   ├── search/              # 스마트 검색 페이지
│   │   ├── projects/            # 프로젝트 관리 페이지
│   │   ├── monitoring/          # 시스템 모니터링 페이지
│   │   ├── layout.tsx           # 대시보드 공통 레이아웃
│   │   └── page.tsx             # 대시보드 메인
│   ├── layout.tsx               # 루트 레이아웃
│   ├── providers.tsx            # React Query 프로바이더
│   └── page.tsx                 # 메인 페이지
├── components/                   # 재사용 가능한 컴포넌트
│   ├── layout/                  # 레이아웃 컴포넌트
│   │   ├── dashboard-layout.tsx # 대시보드 레이아웃
│   │   └── sidebar.tsx          # 네비게이션 사이드바
│   ├── dashboard/               # 대시보드 관련 컴포넌트
│   │   ├── dashboard-overview.tsx
│   │   ├── recent-documents.tsx
│   │   └── project-overview.tsx
│   ├── documents/               # 문서 관리 컴포넌트
│   ├── search/                  # 검색 관련 컴포넌트
│   ├── projects/                # 프로젝트 관리 컴포넌트
│   ├── monitoring/              # 모니터링 컴포넌트
│   ├── ui/                      # shadcn/ui 컴포넌트
│   └── error-boundary.tsx       # 에러 바운더리
├── hooks/                       # 커스텀 훅
│   ├── use-documents.ts         # 문서 관련 API 훅
│   ├── use-search.ts            # 검색 기능 훅
│   ├── use-workspaces.ts        # 워크스페이스 관련 훅
│   └── use-system-metrics.ts    # 시스템 메트릭 훅
├── lib/                         # 유틸리티 및 설정
│   ├── api.ts                   # API 클라이언트 설정
│   └── utils.ts                 # 공통 유틸리티 함수
└── public/                      # 정적 파일
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- pnpm (권장) 또는 npm/yarn

### 설치 및 실행

1. **의존성 설치**

```bash
pnpm install
```

2. **개발 서버 실행**

```bash
pnpm dev
```

3. **브라우저에서 확인**

```
http://localhost:3000
```

### 추가 스크립트

```bash
# 타입 체크
pnpm typecheck

# 린팅
pnpm lint

# 코드 포맷팅
pnpm format

# 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 사용하지 않는 코드 검사
pnpm deadcode
```

## 🔧 개발 가이드

### 현재 상태 반영 패턴

```typescript
/**
 * 현재: 목 데이터 기반 훅 (실제 API 연동 전)
 *
 * @description
 * - 하드코딩된 샘플 데이터 반환
 * - 폴링 비활성화 (실제 API 없어서 불필요)
 * - 타입 안전한 에러 처리 구현
 *
 * @todo
 * - 실제 API 엔드포인트 연결
 * - 필요 시 적절한 폴링 주기로 조정
 * - WebSocket 기반 실시간 업데이트
 */
export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async (): Promise<Document[]> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/documents')
      // return response.data

      return mockDocuments; // 현재는 샘플 데이터
    },
    refetchInterval: false, // 목 데이터 사용 중이므로 폴링 비활성화
    staleTime: 5 * 60 * 1000, // 5분 후 stale 상태로 변경
  });
}
```

### 컴포넌트 분리 전략

```typescript
// 이전: 거대 단일 컴포넌트 (1700줄+)
// frontend/components/ragbridge-dashboard.tsx

// 현재: 기능별 컴포넌트 분리 완료 ✅
// frontend/components/dashboard/
//   ├── dashboard-header.tsx      # 대시보드 헤더
//   ├── animated-background.tsx   # 애니메이션 배경
//   ├── pipeline-status.tsx       # 처리 파이프라인
//   ├── metrics-cards.tsx         # 메트릭 카드들
//   └── ragbridge-dashboard-refactored.tsx # 새로운 메인 컴포넌트
```

### API 연동 준비 구조

```typescript
// lib/api.ts - 실제 API 연동 준비 완료 ✅
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
});

// 타입 안전한 에러 처리 구현 완료 ✅
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const normalizedError = normalizeApiError(err);
    return Promise.reject(normalizedError);
  },
);
```

### 성능 최적화 방향

```typescript
// 메모이제이션 적용 완료 ✅
const MemoizedIcon = React.memo(({ icon: Icon, ...props }) => (
  <Icon {...props} />
));

const OptimizedDashboard = React.memo(() => {
  const memoizedData = useMemo(() =>
    processLargeDataset(rawData), [rawData]
  );

  const handleClick = useCallback((id: string) => {
    // 클릭 핸들러
  }, []);

  return (
    <div>
      {/* 최적화된 컴포넌트들 */}
    </div>
  );
});
```

## 🎨 디자인 시스템

### 색상 팔레트

- **Primary**: Emerald (주요 액션)
- **Secondary**: Blue (보조 액션)
- **Accent**: Purple (강조 요소)
- **Success**: Green (성공 상태)
- **Warning**: Yellow (경고 상태)
- **Error**: Red (오류 상태)

### 컴포넌트 스타일

- **모던한 디자인**: 둥근 모서리, 그라데이션, 그림자
- **반응형**: 모바일 우선 설계
- **접근성**: ARIA 속성, 키보드 네비게이션
- **애니메이션**: Framer Motion으로 부드러운 전환

## 🔒 보안 및 성능

### 보안

- **XSS 방지**: 입력 데이터 검증
- **CSRF 토큰**: API 요청 보호
- **민감한 데이터 마스킹**: 로그 및 UI에서 보호
- **HTTPS 강제**: 프로덕션 환경

### 성능 최적화

- **코드 스플리팅**: Next.js 자동 번들 분할
- **이미지 최적화**: Next.js Image 컴포넌트
- **캐싱 전략**: React Query 기반 서버 상태 캐싱
- **메모이제이션**: React.memo, useMemo, useCallback
- **가상화**: 대용량 리스트 처리

## 테스트

```bash
# 단위 테스트 (향후 추가 예정)
pnpm test

# E2E 테스트 (향후 추가 예정)
pnpm test:e2e

# 코드 커버리지 (향후 추가 예정)
pnpm test:coverage
```

## API 연동

### 환경 변수 설정

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

### API 클라이언트

```typescript
// lib/api.ts
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
});
```

### Docker 배포

```bash
# Docker 이미지 빌드
docker build -t smartdocs-frontend .

# 컨테이너 실행
docker run -p 3000:3000 smartdocs-frontend
```

## 🤝 기여하기

1. **Fork** 프로젝트
2. **Feature 브랜치** 생성 (`git checkout -b feature/AmazingFeature`)
3. **커밋** (`git commit -m 'Add some AmazingFeature'`)
4. **푸시** (`git push origin feature/AmazingFeature`)
5. **Pull Request** 생성

## 📋 API 연동 체크리스트

### 1. 백엔드 준비사항

- [ ] **FastAPI 서버** 구동 확인
- [ ] **API 엔드포인트** 문서화 (Swagger/OpenAPI)
- [ ] **인증 방식** 결정 (JWT, API Key 등)
- [ ] **CORS 설정** 프론트엔드 도메인 허용

### 2. 프론트엔드 수정사항

- [ ] **환경 변수** 설정 (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

- [ ] **API 클라이언트** 수정 (lib/api.ts) ✅ 완료
- [ ] **React Query 훅** 실제 API 호출로 교체
- [ ] **에러 처리** 사용자 피드백 UI 구현

### 3. 성능 최적화 (✅ 완료)

- [x] **페이지네이션** 구현 (기본 20개씩)
- [x] **가상 스크롤** 적용 (1000개 이상)
- [x] **메모이제이션** 적용 (React.memo, useMemo)
- [x] **애니메이션 최적화** (prefers-reduced-motion)

## 🧪 테스트 계획

### 현재 상태

- **테스트**: 미구현 (프로토타입 단계)
- **분석**: 코드 커버리지 측정 불가
- **접근성**: ARIA 속성 부분 적용

### 향후 테스트 계획

- [ ] **단위 테스트**: Jest + React Testing Library
- [ ] **통합 테스트**: API 연동 테스트
- [ ] **E2E 테스트**: Playwright 기반 사용자 플로우
- [ ] **성능 테스트**: Lighthouse + 부하 테스트
- [ ] **접근성 테스트**: axe-core 자동화

> **현재는 프로토타입 단계**
