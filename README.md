# Kafka + AI 문서 OCR·검증·RAG 

## 기술 스택
- **FE:** Next.js (React, Tailwind, shadcn/ui)
- **API:** FastAPI (Python 3.12)
- **Workers:** Python (OCR/검증/임베딩), aiokafka / confluent-kafka
- **Streaming Bus:** Apache Kafka (+ Schema Registry)
- **CDC:** Debezium (Kafka Connect) *or* Flink CDC Connectors
- **Stream Processing:** Apache Flink (SQL/Table API, Upsert-Kafka, Checkpoint/RocksDB)
- **DB(Ops):** PostgreSQL (+ Alembic/SQLModel or SQLAlchemy)
- **Vector/Search:** pgvector *or* Weaviate/Qdrant/Elastic kNN
- **Cache:** Redis
- **Storage:** S3-compatible (MinIO/AWS S3)
- **Observability:** Prometheus + Grafana, OpenTelemetry, ELK/Opensearch
- **CI/CD & Infra:** GitHub Actions, Docker, Kubernetes(Helm), Terraform

> 선택/확장: Pinecone, Azure/GCP OCR, Anthropic/OpenAI/로컬 LLM, Redpanda, BigQuery/Snowflake/Elastic Sink

---

## 개요

내부 플랫폼과 외부용 **멀티테넌트 SaaS**를 하나의 코드베이스로 구현합니다.  
문서 업로드 → **OCR/파싱** → **필드 추출** → **정합성 검증** → **임베딩/색인** → **RAG(검색+요약)** 를 **Kafka 스트리밍**으로 연결하고,  
**Debezium CDC + Apache Flink**로 DB 변경(권한/상태/사용량/과금)을 **초 단위로 반영**합니다.

**차별성**
- 단순 RAG를 넘어 **문서-메타(이름/날짜/번호) 정합성 검증**을 기본 제공
- **CDC 기반 실시간 동기화**로 권한/승인/상태/과금을 즉시 반영
- **멀티테넌시/보안/감사/과금**까지 제품형 기능 내장

---

## 주요 기능

- **문서 파이프라인**: 업로드 → OCR/파서 → 필드추출(엔티티/룰) → 검증 → 임베딩/색인 → RAG
- **정합성 검증 엔진**: 기대값 vs 추출값(유사도/정규식/형식/중복) + 휴먼검토 루프
- **실시간 동기화**: Debezium CDC → Kafka → Flink 조인/집계 → Upsert 토픽/캐시 반영
- **RAG 콘솔**: 권한 필터 반영된 벡터검색 + 출처/페이지 하이라이트 + “모르면 모른다” 가드
- **SaaS 운영**: 사용량·과금 집계, 요금제/좌석/SSO, 감사 로그, 대시보드, 웹훅/SDK

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

> 파티셔닝: 순서 필요한 흐름은 `doc_id`/`match_id` 등으로 key 지정.  
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

---

## 사용자 기능(대시보드 & API)

- **대시보드**
  - 업로드 상태/실패 사유/재처리
  - **검증 룰 빌더**(필드 매핑/정규식/유사도 임계)
  - **RAG 콘솔**(출처/페이지 하이라이트, 답변 가드)
  - **스트림 모니터링**(처리율/지연/실패 TopN/컨슈머 랙)
  - **사용량·과금 위젯**(실시간 누적, 임계 알림)
  - **감사 로그/변경 이력**(CDC 기반 타임라인)
- **개발자 인터페이스**
  - REST/GraphQL + SDK(ts/py/java)
  - **웹훅**: `document.validated`, `rag.answer.ready`, `billing.threshold`
  - **커넥터/싱크**: BigQuery/Snowflake/Elastic Sink, 고객 자사 Kafka 복제

---

## 멀티테넌시/보안

- 모든 이벤트/레코드에 **`tenant_id`** 필수(ORM 글로벌 스코프, 컨슈머 필터)
- 권한/ACL 변경 CDC → **Flink 조인 → `index.meta`** → 검색 권한 캐시 즉시 반영
- TLS/at-rest 암호화, LLM 프롬프트 **PII 마스킹**, 감사 로그, 보존/파기 정책
- 배포 옵션: SaaS(기본) / 전용 VPC / 온프레
---

## 폴더 구조(예시)

- /frontend # Next.js 앱 (대시보드, RAG 콘솔, 룰 빌더)
- /api-gateway # FastAPI (Auth, Upload, Search/RAG, Webhooks)
- /workers/ocr # OCR/파서 워커(카프카 컨슈머)
- /workers/validate # 정합성 검증/휴먼검토 트리거
- /workers/embed # 임베딩 생성/업서트
- /stream/flink # Flink SQL/CDC 잡(DDL/쿼리)
- /connect # Debezium 커넥터 설정(JSON)
- /infra # Docker, Helm, Terraform, Grafana Dashboards
- /docs # 아키텍처/운영 문서, API 스펙

---
## 환경 변수(핵심)


- 공통: `NEXT_PUBLIC_API_URL`, `API_JWT_SECRET`, `S3_BUCKET_URL`
- Kafka: `KAFKA_BROKERS`, `SCHEMA_REGISTRY_URL`, `KAFKA_SASL_*`(옵션)
- DB: `DB_URL`(Postgres), `VECTOR_DB_URL`, `REDIS_URL`
- CDC: `DEBEZIUM_*`(커넥터), *또는* `FLINK_CDC_*`
- Flink: `FLINK_CHECKPOINT_DIR`, `STATE_BACKEND_PATH`
- AI: `OPENAI_API_KEY`(또는 로컬 LLM 엔드포인트), `EMBEDDING_MODEL`

> **명령어(설치/실행/배포)** 는 환경 세팅 후 이 파일에 추가합니다.

---
