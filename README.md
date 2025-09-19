# Kafka + AI 문서 OCR·검증·RAG

## 기술 스택
- **FE:** Next.js (React, Tailwind, shadcn/ui)
- **API:** FastAPI (Python 3.12)
- **Workers:** Python (OCR/검증/임베딩), aiokafka / confluent-kafka, OpenCV, spaCy/HF
- **Streaming Bus:** Apache Kafka (+ Schema Registry)
- **CDC:** Debezium (Kafka Connect) *or* Flink CDC Connectors
- **Stream Processing:** Apache Flink (SQL/Table API, Upsert-Kafka, Checkpoint/RocksDB)
- **DB(Ops):** PostgreSQL (+ Alembic/SQLModel or SQLAlchemy)
- **Vector/Search:** pgvector *or* Weaviate/Qdrant/Elastic kNN
- **Cache:** Redis
- **Storage:** S3-compatible (MinIO/AWS S3)
- **Observability:** Prometheus + Grafana, OpenTelemetry, ELK/Opensearch
- **CI/CD & Infra:** GitHub Actions, Docker, Kubernetes(Helm), Terraform
- **MLOps(자체모델):** PyTorch, Hugging Face(Transformers/PEFT/TRL), ONNX/TensorRT, MLflow(Model Registry), Weights & Biases(옵션)

> 선택/확장: Pinecone, Azure/GCP OCR, Anthropic/OpenAI/로컬 LLM, Redpanda, BigQuery/Snowflake/Elastic Sink, Triton Inference Server

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

## 우리만의 **자체 AI 학습 모델** (독보적 기술 전략)

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

## 폴더 구조(명확 버전)

```bash
.
├─ README.md
├─ frontend/                     # Next.js 웹앱 (대시보드, RAG 콘솔, 룰 빌더)
│  ├─ app/                       # pages/app router
│  ├─ components/
│  ├─ lib/                       # API 클라이언트, auth, hooks
│  ├─ styles/
│  └─ tests/
├─ api-gateway/                  # FastAPI 게이트웨이 (Auth/Upload/Search/Webhooks)
│  ├─ app/
│  │  ├─ api/                    # REST/GraphQL
│  │  ├─ services/               # search, auth, billing, webhook
│  │  ├─ models/                 # SQLModel/SQLAlchemy
│  │  ├─ schemas/                # Pydantic
│  │  ├─ config/
│  │  └─ main.py
│  └─ tests/
├─ workers/
│  ├─ ocr/                       # OCR/파서 컨슈머
│  │  ├─ consumer.py
│  │  ├─ ocr_providers/          # tesseract/paddle/textract/docai/azure
│  │  └─ preprocessing/          # OpenCV 필터
│  ├─ validate/                  # 정합성 검증/휴먼검토 트리거
│  │  └─ consumer.py
│  ├─ embed/                     # 임베딩 생성/업서트
│  │  └─ consumer.py
│  └─ common/                    # 공통 유틸(카프카, 스키마, 로깅)
├─ stream/
│  ├─ flink/                     # Flink SQL/CDC 잡
│  │  ├─ ddl/                    # source/sink DDL
│  │  ├─ queries/                # join/window/upsert
│  │  └─ pipeline.md
│  └─ ksqldb/                    # (옵션) ksql 쿼리
├─ connect/
│  ├─ debezium/                  # Debezium 커넥터 설정(JSON)
│  └─ sinks/                     # BigQuery/Snowflake/Elastic 등
├─ ml/                           # (NEW) 자체 모델 학습/서빙
│  ├─ data/                      # 데이터 카드/스냅샷 메타(PII 제거본)
│  ├─ training/
│  │  ├─ embedding/              # SBERT/miniLM 파인튜닝 스크립트
│  │  ├─ reranker/               # cross-encoder 학습
│  │  ├─ ner/                    # 필드추출 모델
│  │  ├─ layout/                 # layoutlm/donut (옵션)
│  │  └─ utils/
│  ├─ serving/
│  │  ├─ triton/                 # 모델 리포지토리, config.pbtxt
│  │  ├─ onnx/                   # 변환 스크립트
│  │  └─ server/                 # gRPC/REST inference 서버
│  ├─ registry/                  # MLflow 등록/승격 스크립트
│  └─ evaluation/                # 벤치마크/리포트/LLM-as-a-Judge
├─ infra/
│  ├─ docker/                    # compose 파일들
│  ├─ k8s/                       # Helm 차트/매니페스트
│  ├─ terraform/                 # IaC
│  └─ grafana/                   # 대시보드 JSON
├─ scripts/                      # 부트스트랩/마이그레이션/메터링 집계
├─ docs/                         # 아키텍처/운영 문서, API 스펙, 보안/개인정보
└─ .github/                      # Actions 워크플로우
