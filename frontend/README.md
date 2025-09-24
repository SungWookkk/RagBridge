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

## 🎯 주요 기능

### 1. 문서 업로드 및 관리
- **드래그 앤 드롭** 파일 업로드
- **멀티파일** 동시 업로드 지원
- **실시간 진행률** 표시
- **파일 타입 검증** (PDF, DOCX, 이미지)
- **S3 업로드** 후 Kafka 이벤트 발행

### 2. AI 문서 처리 파이프라인
- **OCR 처리**: Tesseract, PaddleOCR, AWS Textract 지원
- **필드 추출**: AI 기반 구조화된 데이터 추출
- **검증 시스템**: 룰 기반 데이터 검증 및 휴먼검토
- **임베딩 생성**: 벡터 임베딩 및 인덱싱
- **실시간 상태** 추적 및 모니터링

### 3. 스마트 검색 (RAG)
- **벡터 검색** 기반 질의응답
- **출처 문서** 하이라이트 표시
- **페이지별 인용** 정보 제공
- **"모르면 모른다"** 가드 기능
- **실시간 스트림** 응답 지원

### 4. 시스템 모니터링
- **Kafka 처리율** 실시간 모니터링
- **지연시간 및 실패율** 추적
- **컨슈머 랙** 모니터링
- **TopN 오류** 분석
- **알림 및 웹훅** 설정

### 5. 멀티테넌시 지원
- **테넌트별** 데이터 격리
- **권한 기반** 접근 제어
- **테넌트 전환** 기능
- **설정 및 커스터마이징**

## 🔧 개발 가이드

### 컴포넌트 개발 패턴

```typescript
/**
 * 문서 업로드 컴포넌트
 * 
 * @description
 * - 드래그 앤 드롭 파일 업로드
 * - 파일 타입 검증 (PDF, DOCX, 이미지)
 * - 업로드 진행률 표시
 * - 멀티파일 업로드 지원
 * - S3 업로드 후 Kafka 이벤트 발행
 * 
 * @api
 * - POST /api/v1/documents/upload: 파일 업로드
 * - GET /api/v1/documents/status: 업로드 상태 조회
 */
export function DocumentUploadModal() {
  // 컴포넌트 로직
}
```

### React Query 설정

```typescript
// 5분 후 stale, 10분 후 캐시 제거
staleTime: 5 * 60 * 1000,
gcTime: 10 * 60 * 1000,
// 네트워크 오류 시 3회 재시도
retry: (failureCount, error) => failureCount < 3,
// 백그라운드 refetch 비활성화
refetchOnWindowFocus: false,
```

### 상태 관리 패턴

- **서버 상태**: TanStack Query로 관리
- **클라이언트 상태**: Zustand로 관리
- **폼 상태**: React Hook Form으로 관리
- **UI 상태**: useState/useReducer로 관리

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

##  테스트

```bash
# 단위 테스트 (향후 추가 예정)
pnpm test

# E2E 테스트 (향후 추가 예정)
pnpm test:e2e

# 코드 커버리지 (향후 추가 예정)
pnpm test:coverage
```

##  API 연동

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


**SmartDocs** - AI 기반 스마트 문서 처리 플랫폼으로 문서 관리의 새로운 차원을 경험하세요! 
