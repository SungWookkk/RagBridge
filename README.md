# Kafka + AI 문서 OCR·검증·RAG

> **목표**: **문서 업로드 → OCR/검증 → 임베딩/색인 → 권한 반영 → RAG 응답**까지를 **카프카 중심 스트리밍 파이프라인**으로 일관되게 처리하면서, **운영 복잡도는 최소화**합니다.


## 🔁 변경 요약 (v2, 스트리밍 채택)

- **Kafka/CDC/Streams 채택**: Debezium CDC + Kafka + **Kafka Streams(또는 ksqlDB)** 로 메타/권한/과금 **실시간 업서트**  
- **Outbox 패턴 제한적 적용**: 전 도메인 일괄이 아닌 **핵심 Aggregate(문서/ACL/사용량)** 에만 Outbox(또는 CDC Unwrap) 적용  
- **파티셔닝 가이드**: 순서 필요한 흐름은 `tenant_id:doc_id` 키, 그렇지 않은 집계는 `tenant_id` 키(확장성↑)  
- **State Store 운영 표준화**: RocksDB + changelog 토픽, 백업/복구/모니터링 Playbook 포함  
- **Citation Verifier**: **빠른 동기 휴리스틱 + 비동기 정밀 검증**(큐/캐시)로 p95 영향 최소화  
- **RLS 하이브리드**: **핵심 테이블만 RLS** + 앱 레벨 `tenant_id` 스코프(성능·개발 난이도 균형)  
- **FinOps**: 단위 경제 모델/예산 알람/쿼터·레이트리밋 포함

## 기술 스택

### Frontend
- **Next.js 15** (React 19, App Router) - 최신 버전 활용
- **TypeScript** (strict 모드) - 타입 안전성 보장
- **Tailwind CSS** + **shadcn/ui** - 모던 UI 컴포넌트
- **React Query/TanStack Query** - 서버 상태 관리 및 캐싱
- **@tanstack/react-query-devtools** - 개발 도구
- **Zustand** - 클라이언트 상태 관리
- **React Hook Form** - 폼 상태 관리
- **Framer Motion** - 애니메이션
- **Chart.js/Recharts** - 데이터 시각화

### Backend
- **API:** FastAPI (Python 3.12, SQLAlchemy/SQLModel, Alembic)
- **Streaming Bus:** **Apache Kafka** (+ **Schema Registry**)
- **CDC:** **Debezium** (Kafka Connect, Postgres→Kafka)
- **Stream Processing:** **Kafka Streams** *or* **ksqlDB** (업서트/조인/집계)
- **Workers:** Python (OCR/검증/임베딩), OpenCV, spaCy/HuggingFace
- **DB(Ops):** PostgreSQL (RLS 하이브리드)
- **Vector/Search:** pgvector *(시작)* → Elastic kNN *(성장 옵션)*
- **Cache:** Redis (세션/레이트/임시 키)
- **Storage:** S3-compatible (MinIO/AWS S3)
- **Observability:** Prometheus + Grafana, OpenTelemetry, Sentry/Loki
- **MLOps(선택):** PyTorch, HF(Transformers/PEFT/TRL), ONNX/TensorRT, MLflow, Triton

> ⚙️ Streams 런타임은 **Kafka Streams(Java)** 를 권장(성숙/운영도구 풍부).  
> Python 중심 팀은 **ksqlDB**를 우선 고려(운영 단순), 고급 요구에 Streams 보강.

---

## 개요

내부 플랫폼과 외부용 **멀티테넌트 SaaS**를 하나의 코드베이스로 구현합니다.  
문서 업로드 → **OCR/파싱** → **필드 추출** → **정합성 검증** → **임베딩/색인** → **RAG(검색+요약)** 를 **Kafka 스트리밍**으로 연결하고,  
**Debezium CDC + Apache Flink**로 DB 변경(권한/상태/사용량/과금)을 **초 단위로 반영**합니다.

**차별성**
- 단순 RAG를 넘어 **문서-메타(이름/날짜/번호) 정합성 검증**을 기본 제공
- **CDC 기반 실시간 동기화**로 권한/승인/상태/과금을 즉시 반영
- **멀티테넌시/보안/감사/과금**까지 제품형 기능 내장
- (NEW) **자체 AI 학습 모델**로 도메인 특화 정확도/비용/지연 최적화
## 개요(플로우)

1) **Upload/API/UI** → S3 저장 → `documents.uploaded`(Kafka) 발행  
2) **OCR Worker**: `documents.uploaded` → OCR/파싱 → `documents.parsed`  
3) **Validation Worker**: `documents.parsed` → 룰/유사도 검증 → `documents.validated` + Ops DB 반영  
4) **Embedding Worker**: 청크/임베딩 → Vector DB 업서트 → `documents.indexed`  
5) **Debezium CDC**: Ops DB 변경(`documents`, `acl`, `usage`, `billing` 등) → `db.*` CDC 토픽  
6) **Streams/ksqlDB**: `db.*` + 파이프라인 이벤트 조인/정규화 → **Upsert 토픽**(`index.meta`, `billing.usage`)  
7) **Search API**: `index.meta` 기반 권한 캐시 + 벡터 검색 → RAG 생성 + **Citation 검증**  
8) **대시보드/웹훅**: 처리율/지연/오류/사용량/과금 실시간 반영

---

## 주요 기능

- **문서 파이프라인**: 업로드 → OCR/파서 → 필드추출(엔티티/룰) → 검증 → 임베딩/색인 → RAG
- **정합성 검증 엔진**: 기대값 vs 추출값(유사도/정규식/형식/중복) + 휴먼검토 루프
- **실시간 동기화**: Debezium CDC → Kafka → Flink 조인/집계 → Upsert 토픽/캐시 반영
- **RAG 콘솔**: 권한 필터 반영된 벡터검색 + 출처/페이지 하이라이트 + “모르면 모른다” 가드
- **SaaS 운영**: 사용량·과금 집계, 요금제/좌석/SSO, 감사 로그, 대시보드, 웹훅/SDK
- **자체 모델 서빙**: 임베딩/리랭커/추출·검증 모델의 **온프레/전용 VPC** 서빙

---

## 아키텍처 플로우(요약)

1. **Upload/API/UI** → S3 저장 → `documents.uploaded`(Kafka)  
2. **OCR/Parser Worker** 소비 → 텍스트/필드 → `documents.parsed`  
3. **Validation Worker** 소비 → 정합성/중복/룰 → `documents.validated` + DB 업데이트  
4. **Embedding Worker/Flink** → 임베딩 → 벡터DB 업서트(또는 `documents.embeddings`)  
5. **Debezium CDC**: Ops DB 변경 → `db.*` CDC 토픽  
6. **Flink SQL/CDC**: `db.*` 조인/정규화/윈도우 → **Upsert 토픽**(`index.meta`, `billing.usage`)  
7. **Search API**: `index.meta` 기반 권한 캐시 + 벡터 검색 → RAG 응답(출처/하이라이트)  
8. **Dashboard/Webhooks/Connectors**: 상태/사용량/알림/외부 싱크  
9. **(자체모델 파이프라인)**: 데이터 큐레이션 → 학습/평가 → 레지스트리 등록 → 점진적 롤아웃

---

## Kafka 토픽 설계

| 토픽 | 목적 | Key | Value(요약) |
|---|---|---|---|
| `documents.uploaded` | 업로드 이벤트 | `doc_id` | `tenant_id, file_path, expected_fields, uploaded_at` |
| `documents.parsed` | OCR/파싱 결과 | `doc_id`/`chunk_id` | `text/page, extracted_fields, parser_model` |
| `documents.validated` | 검증 결과 | `doc_id` | `validated_data, status, errors, duplicate` |
| `documents.embeddings`(옵션) | 임베딩 결과 | `doc_id`/`chunk_id` | `content, vector, meta` |
| `db.documents` | Debezium CDC | PK | before/after + schema meta |
| `db.validation` | Debezium CDC | PK | before/after + schema meta |
| `db.acl`/`db.tenants` | Debezium CDC | PK | 권한/테넌트 변경 |
| `db.usage` | Debezium CDC | PK | 페이지/토큰/스토리지 사용량 row-level |
| `index.meta` | Flink Upsert | `doc_id` | 접근/권한/상태 메타(최신) |
| `billing.usage` | Flink Upsert | `tenant_id` | 사용량/예상 청구(윈도우 집계) |
| **`ml.training.jobs`** | 학습 잡 제출 | `job_id` | 데이터 스냅샷/하이퍼파라미터/타깃 모델 |
| **`ml.models.registered`** | 모델 등록/갱신 | `model_id` | 버전/메트릭/아티팩트/롤아웃 정책 |

> 파티셔닝: 순서 필요한 흐름은 `doc_id` 등으로 key 지정.  
> 스키마: Avro/JSON Schema + Schema Registry, **FORWARD 호환** 권장.

---

## 기능별 기술 스택 (요약 표)

| 기능 | 주 스택 | 보조/옵션 |
|---|---|---|
| 업로드/저장 | Next.js UI → FastAPI → S3 | Drive/Email 인게스트 |
| OCR/파서 | Python Worker, Tesseract/PaddleOCR, (Textract/DocAI/Azure) 폴백 | OpenCV 전처리, LlamaParse |
| 필드추출/검증 | Python Worker, spaCy/HF NER + 정규식/룰, 유사도 | 휴먼검토 UI, 재처리 |
| CDC 수집 | **Debezium**(Kafka Connect) | **Flink CDC Connectors** |
| 스트림 처리 | **Apache Flink**(SQL/Table, RocksDB, Checkpoint) | DataStream API |
| Upsert/서빙 | **Upsert-Kafka** → 서빙 캐시/검색 | Redis/Materialized View |
| 벡터/RAG | pgvector/Weaviate/Qdrant + LLM API | Elastic kNN, Pinecone |
| 사용량/과금 | Flink 윈도우 집계 → `billing.usage` | Stripe/내부정산 |
| 관측/알림 | Prometheus+Grafana, OTEL, ELK | PagerDuty/Slack |
| **자체모델 학습/서빙** | **PyTorch/HF, PEFT/LoRA, TRL(RLHF/RLAIF), MLflow, Triton/ONNX** | BitsAndBytes(4/8bit), TensorRT |

---

## 사용자 기능(대시보드 & API)

- **대시보드**
  - 업로드 상태/실패 사유/재처리
  - **검증 룰 빌더**(필드 매핑/정규식/유사도 임계)
  - **RAG 콘솔**(출처/페이지 하이라이트, 답변 가드)
  - **스트림 모니터링**(처리율/지연/실패 TopN/컨슈머 랙)
  - **사용량·과금 위젯**(실시간 누적, 임계 알림)
  - **감사 로그/변경 이력**(CDC 기반 타임라인)
  - **모델 탭(NEW)**: 현재 서빙 모델 버전/메트릭, 롤아웃 상태, 롤백 버튼
- **개발자 인터페이스**
  - REST/GraphQL + SDK(ts/py/java)
  - **웹훅**: `document.validated`, `rag.answer.ready`, `billing.threshold`, `ml.model.updated`
  - **커넥터/싱크**: BigQuery/Snowflake/Elastic Sink, 고객 자사 Kafka 복제

---

## 멀티테넌시/보안

- 모든 이벤트/레코드에 **`tenant_id`** 필수(ORM 글로벌 스코프, 컨슈머 필터)
- 권한/ACL 변경 CDC → **Flink 조인 → `index.meta`** → 검색 권한 캐시 즉시 반영
- TLS/at-rest 암호화, LLM 프롬프트 **PII 마스킹**, 감사 로그, 보존/파기 정책
- 배포 옵션: SaaS(기본) / 전용 VPC / 온프레

---

## **자체 AI 학습 모델** 

### 1) 목표
- **정확도 향상**: 일반 모델 대비 한글/서식/숫자 필드 인식 및 **정합성 판단** 정확도 ↑  
- **비용/지연 절감**: 임베딩·리랭킹·필드추출을 **경량 자체 모델**로 대체, 외부 API 호출 최소화  
- **보안**: 민감 데이터 **온프레 학습/서빙** 옵션 제공

### 2) 모델 라인업
- **도메인 임베딩 모델(Emb-XS/SM/LG)**: SBERT/miniLM 기반 **대조학습(contrastive)** 파인튜닝  
- **리랭커(ReRanker-SM)**: cross-encoder 기반 상위 k 문서 재정렬 → RAG 품질 향상  
- **필드추출 모델(NER/Tagger)**: HF TokenClassification + 룰/정규식 하이브리드  
- **레이아웃 파서(옵션)**: LayoutLMv3/Donut 미세조정(표/칸 구조에 강함)

### 3) 데이터 파이프라인
- **Kafka 원천**: `documents.parsed`, `documents.validated`에서 학습 샘플 생성  
- **라벨링/검수**: 휴먼검토 UI → 정답 라벨 축적(활용 동의 범위 내, PII 마스킹)  
- **특성 저장소**: `data/feature-store`(문서 청크, 메타, 정답), 버전 관리  
- **스냅샷**: 주기별 학습 데이터 커밋(데이터 카드와 함께 MLflow에 기록)

### 4) 학습/평가/배포
- **학습**: PEFT/LoRA, 4/8bit(BitsAndBytes)로 경량 파인튜닝 → 비용↓ 속도↑  
- **강화(RLAIF)**: 휴먼 피드백/규칙 위반 사례를 보상모델 없이 **규칙 기반 보상**으로 학습  
- **평가**: Retrieval@k, MRR, EM/F1(필드추출), LLM-as-a-Judge(보안 가드)  
- **레지스트리**: MLflow Model Registry에 `vector-embed@v1.4` 등 버전 기록(메트릭/아티팩트)  
- **서빙**: Triton/ONNX Runtime로 지연 최소화, `canary 10% → 50% → 100%` 단계적 롤아웃  
- **롤백**: 품질/지연 SLA 이탈 시 버튼 한 번에 이전 버전 복귀

### 5) 개인정보/윤리
- **동의/옵트아웃**: 테넌트별 학습 데이터 사용 동의 플래그  
- **PII 마스킹**: 학습 전 파이프라인에서 주민번호/계좌 등 제거/치환  
- **데이터 수명**: 보존 기한 만료 시 자동 파기, 레지스트리/스냅샷 동기 삭제

### 6) 운영 토픽(위에서 추가)
- `ml.training.jobs`: 주기 학습/수동 트리거, 하이퍼파라미터/데이터 버전  
- `ml.models.registered`: 새 모델 등록/승격 이벤트 → 서빙 롤아웃/롤백 트리거


---

## 폴더 구조 (현재 구현 상태)

### Frontend - Next.js App Router 기반 컴포넌트 분리 구조

```bash
frontend/
├─ app/                          # Next.js App Router 구조
│  ├─ layout.tsx                 # 루트 레이아웃 (React Query 설정)
│  ├─ page.tsx                   # 메인 페이지 (대시보드로 리다이렉트)
│  ├─ providers.tsx              # React Query 프로바이더
│  ├─ globals.css                # 글로벌 스타일
│  └─ dashboard/                 # 대시보드 페이지들
│     ├─ layout.tsx              # 대시보드 공통 레이아웃
│     ├─ page.tsx                # 대시보드 메인 (개요)
│     ├─ documents/page.tsx      # 문서 관리 페이지
│     ├─ search/page.tsx         # 스마트 검색 페이지
│     ├─ projects/page.tsx       # 프로젝트 관리 페이지
│     └─ monitoring/page.tsx     # 시스템 모니터링 페이지
├─ components/                   # 기능별 분리된 컴포넌트
│  ├─ layout/                    # 공통 레이아웃 컴포넌트
│  │  ├─ dashboard-layout.tsx    # 대시보드 레이아웃 (사이드바, 헤더)
│  │  └─ sidebar.tsx             # 네비게이션 사이드바
│  ├─ dashboard/                 # 대시보드 관련 컴포넌트
│  │  ├─ dashboard-overview.tsx  # 대시보드 개요
│  │  ├─ recent-documents.tsx    # 최근 문서 현황
│  │  └─ project-overview.tsx    # 프로젝트 개요
│  ├─ documents/                 # 문서 관리 컴포넌트
│  │  └─ document-management.tsx
│  ├─ search/                    # 검색 관련 컴포넌트
│  │  └─ smart-search.tsx
│  ├─ projects/                  # 프로젝트 관리 컴포넌트
│  │  └─ project-management.tsx
│  ├─ monitoring/                # 모니터링 컴포넌트
│  │  └─ system-monitoring.tsx
│  └─ ui/                        # shadcn/ui 기본 컴포넌트들
│     ├─ avatar.tsx              # 아바타 컴포넌트
│     ├─ badge.tsx               # 배지 컴포넌트
│     ├─ button.tsx              # 버튼 컴포넌트
│     ├─ card.tsx                # 카드 컴포넌트
│     ├─ input.tsx               # 입력 컴포넌트
│     ├─ progress.tsx            # 진행률 컴포넌트
│     ├─ scroll-area.tsx         # 스크롤 영역
│     ├─ tabs.tsx                # 탭 컴포넌트
│     ├─ toast.tsx               # 토스트 알림
│     └─ tooltip.tsx             # 툴팁 컴포넌트
├─ hooks/                        # API 연동 커스텀 훅
│  ├─ use-documents.ts           # 문서 관련 API 훅
│  ├─ use-workspaces.ts          # 워크스페이스 관련 API 훅
│  ├─ use-search.ts              # 검색 기능 훅
│  ├─ use-system-metrics.ts      # 시스템 메트릭 훅
│  └─ use-toast.ts               # 토스트 훅
├─ lib/                          # 유틸리티 및 API 클라이언트
│  ├─ api.ts                     # Axios API 클라이언트 설정
│  └─ utils.ts                   # 공통 유틸리티 함수
├─ public/                       # 정적 파일들
├─ components.json               # shadcn/ui 설정
├─ eslint.config.mjs             # ESLint 설정
├─ next.config.ts                # Next.js 설정
├─ package.json                  # 의존성 및 스크립트
├─ pnpm-lock.yaml                # PNPM 락 파일
├─ postcss.config.mjs            # PostCSS 설정
├─ tsconfig.json                 # TypeScript 설정
└─ README.md                     # 프론트엔드 README
```

### 전체 프로젝트 구조

```bash
.
├─ README.md                     # 프로젝트 개요 및 아키텍처 문서
├─ docs/                         # 아키텍처/운영 문서
│  └─ branch-strategy.md         # 브랜치 전략
├─ frontend/                     # Next.js 웹앱 (✅ 구현 완료)
├─ package.json                  # 루트 패키지 설정
├─ pnpm-lock.yaml                # 루트 PNPM 락 파일
└─ .cursor/                      # Cursor AI 설정
    └─ rules/                    # 개발 규칙 및 가이드라인
        ├─ airule.mdc            # 프론트엔드 개발 규칙
        └─ project-sync.mdc      # 프로젝트 동기화 규칙

# 향후 구현 예정 디렉토리들
├─ api-gateway/                  # FastAPI 게이트웨이 (예정)
├─ workers/                      # Kafka 컨슈머 워커들 (예정)
├─ stream/                       # 스트림 처리 (예정)
├─ connect/                      # Kafka Connect 설정 (예정)
├─ ml/                           # AI 모델 학습/서빙 (예정)
├─ infra/                        # 인프라 설정 (예정)
├─ scripts/                      # 배포/운영 스크립트 (예정)
└─ .github/                      # CI/CD 워크플로우 (예정)
```
---

## 🚀 빠른 시작

### Frontend 개발 환경 설정

```bash
# 의존성 설치
cd frontend
pnpm install

# 개발 서버 실행
pnpm dev

# 타입 체크
pnpm typecheck

# 린트 검사
pnpm lint
```

### 접속 정보
- **개발 서버**: http://localhost:3000
- **React Query DevTools**: 개발 환경에서 자동 활성화

### 주요 페이지
- `/dashboard` - 메인 대시보드 (개요)
- `/dashboard/documents` - 문서 관리
- `/dashboard/search` - 스마트 검색
- `/dashboard/projects` - 프로젝트 관리
- `/dashboard/monitoring` - 시스템 모니터링

---

**환경 변수(핵심)**

**공통**: NEXT_PUBLIC_API_URL, API_JWT_SECRET, S3_BUCKET_URL

**Kafka**: KAFKA_BROKERS, SCHEMA_REGISTRY_URL, KAFKA_SASL_*(옵션)

**DB**: DB_URL(Postgres), VECTOR_DB_URL, REDIS_URL

**CDC**: DEBEZIUM_*(커넥터), 또는 FLINK_CDC_*

**Flink**: FLINK_CHECKPOINT_DIR, STATE_BACKEND_PATH

**AI**: OPENAI_API_KEY(또는 로컬 LLM 엔드포인트), EMBEDDING_MODEL

**MLOps**: MLFLOW_TRACKING_URI, MODEL_REGISTRY_URI, TRITON_URL(또는 ONNX_RUNTIME_*)

> 명령어(설치/실행/배포) 는 환경 세팅 후 이 파일에 추가합니다.

---

## 🚀 Frontend 아키텍처 특징

### 컴포넌트 분리 및 성능 최적화
- **Next.js App Router**: 페이지 기반 라우팅으로 자동 코드 스플리팅
- **React Query**: 서버 상태 관리 및 캐싱 (staleTime: 5분, gcTime: 10분)
- **컴포넌트 분리**: 1000줄 이상 거대 컴포넌트 금지, 기능별 독립적 분리
- **타입 안전성**: TypeScript strict 모드로 컴파일 타임 에러 방지
- **실시간 업데이트**: 5초마다 자동 데이터 새로고침

### 개발 생산성 향상
- **커스텀 훅**: API 연동 로직을 훅으로 분리하여 재사용성 극대화
- **레이아웃 중첩**: 공통 레이아웃과 기능별 레이아웃 분리
- **개발 도구**: React Query DevTools로 캐싱 상태 실시간 모니터링
- **코드 리뷰**: 체크리스트 기반 품질 보장

---


### 환경 변수 설정
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

### 타입 정의 예시
```typescript
// types/api.types.ts
export interface Document {
  id: string;
  name: string;
  tenantId: string;
  status: DocumentStatus;
  fileType: string;
  uploadedAt: string;
  size: string;
  category: string;
  expectedFields: string[];
  extractedFields: Record<string, any>;
  validationErrors: string[];
  confidenceScore: number;
  processingTime: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
}
```

---

**차별점 (2줄 요약)**

**정합성 검증 내장 RAG:** 이름/날짜/번호 등 문서-메타 일치성을 룰/유사도로 검증하고, 실패 시 휴먼검수 루프로 정확도 보장.

**카프카 중심 실시간 제품화**: CDC→Streams 업서트→권한/과금 즉시 반영으로 엔터프라이즈급 일관성과 감사 가능성 확보.
