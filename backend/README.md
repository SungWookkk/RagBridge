# RagBridge Backend

> **Kafka + AI 문서 OCR·검증·RAG** 플랫폼의 백엔드 API 서버

## 🚀 프로젝트 개요

RagBridge는 문서 업로드부터 RAG 응답까지를 **카프카 중심 스트리밍 파이프라인**으로 처리하는 멀티테넌트 SaaS 플랫폼입니다.

### 주요 기능

- **문서 파이프라인**: 업로드 → OCR/파서 → 필드추출 → 검증 → 임베딩/색인 → RAG
- **정합성 검증 엔진**: 기대값 vs 추출값 검증 + 휴먼검토 루프
- **실시간 동기화**: Debezium CDC → Kafka → Flink 조인/집계
- **멀티테넌시**: 테넌트별 데이터 격리 및 권한 관리
- **자체 AI 모델**: 임베딩/리랭커/필드추출 모델 서빙

## 🛠 기술 스택

### 핵심 백엔드
- **Python 3.12+** + **FastAPI** (API Gateway)
- **SQLModel** + **PostgreSQL** (메인 데이터베이스)
- **Redis** (캐싱 및 세션 관리)
- **Alembic** (데이터베이스 마이그레이션)

### 스트리밍 및 메시징
- **Apache Kafka** (스트리밍 버스)
- **Schema Registry** (스키마 관리)
- **Debezium** (CDC: Postgres → Kafka)
- **Kafka Streams** 또는 **ksqlDB** (스트림 처리)

### AI/ML 스택
- **Python Workers** (OCR/검증/임베딩)
- **OpenCV** (이미지 전처리)
- **spaCy/HuggingFace** (NLP 처리)
- **pgvector** (벡터 검색)
- **MLflow** (모델 레지스트리)

## 📁 프로젝트 구조

```
backend/
├── app/                          # 애플리케이션 코드
│   ├── common/                   # 공통 모듈
│   │   ├── config.py            # 환경 설정
│   │   ├── database.py          # 데이터베이스 관리
│   │   ├── security.py          # 보안 (JWT, 비밀번호)
│   │   └── exceptions.py        # 예외 처리
│   ├── domains/                 # 도메인별 모듈
│   │   └── auth/                # 인증 도메인
│   │       ├── models.py        # 데이터 모델
│   │       ├── schemas.py        # Pydantic 스키마
│   │       ├── services.py      # 비즈니스 로직
│   │       └── router.py         # API 라우터
│   └── main.py                  # FastAPI 앱 진입점
├── tests/                        # 테스트 코드
│   ├── conftest.py              # 테스트 설정
│   └── api/
│       └── auth/                 # 인증 API 테스트
├── alembic/                      # 데이터베이스 마이그레이션
├── pyproject.toml                # 프로젝트 설정
├── Makefile                      # 개발 도구
└── README.md                     # 프로젝트 문서
```

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# 저장소 클론
git clone https://github.com/ragbridge/backend.git
cd backend

# Poetry 설치 (시스템에 Poetry가 없는 경우)
curl -sSL https://install.python-poetry.org | python3 -

# 의존성 설치
poetry install

# 또는 개발 의존성까지 설치
poetry install --with dev,test
```

### 2. 환경 변수 설정

```bash
# .env 파일 생성
cp env.example .env

# 필요한 환경 변수 설정
# DB_URL, API_JWT_SECRET, CORS_ORIGINS 등
```

### 3. 데이터베이스 설정

```bash
# 마이그레이션 실행
make upgrade

# 또는 마이그레이션 생성
make migrate MSG="초기 마이그레이션"
```

### 4. 서버 실행

```bash
# Poetry를 사용한 개발 서버 실행
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 또는 Makefile 사용
make run

# 또는 Poetry 셸 활성화 후 실행
poetry shell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. API 문서 확인

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🧪 테스트

```bash
# Poetry를 사용한 테스트 실행
poetry run pytest

# 커버리지 포함 테스트
poetry run pytest --cov=app --cov-report=html --cov-report=term

# 빠른 테스트 (통합 테스트 제외)
poetry run pytest -m "not slow"

# 또는 Makefile 사용
make test
make test-cov
make test-fast
```

## 🔧 개발 도구

```bash
# Poetry를 사용한 개발 도구 실행
poetry run ruff check app tests          # 코드 린팅
poetry run black app tests               # 코드 포맷팅
poetry run isort app tests               # import 정렬
poetry run mypy app                      # 타입 체크

# 또는 Makefile 사용
make lint
make format
make type-check
make check-all
```

## 📊 API 엔드포인트

### 인증 API

| 메서드 | 엔드포인트 | 설명 | 상태 코드 |
|--------|------------|------|-----------|
| `POST` | `/api/v1/auth/register` | 사용자 등록 | 201, 409 |
| `POST` | `/api/v1/auth/login` | 로그인 | 200, 401 |
| `GET` | `/api/v1/auth/me` | 현재 사용자 조회 | 200, 401 |
| `POST` | `/api/v1/auth/refresh` | 토큰 갱신 | 200, 401 |

### 헬스 체크

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| `GET` | `/health` | 서버 상태 확인 |
| `GET` | `/health/db` | 데이터베이스 상태 확인 |

## 🔐 인증 및 보안

### JWT 토큰

- **액세스 토큰**: 30분 만료, API 접근용
- **리프레시 토큰**: 7일 만료, 토큰 갱신용
- **알고리즘**: HS256

### 비밀번호 정책

- 최소 8자 이상
- 대문자, 소문자, 숫자 포함 필수
- bcrypt 해시화

### 멀티테넌시

- 모든 API 요청에 `tenant_id` 헤더 포함
- 테넌트별 데이터 격리
- 역할 기반 접근 제어 (RBAC)

## 🏗 아키텍처 패턴

### Clean Architecture + DDD

- **Domain Layer**: 비즈니스 로직 (`services.py`)
- **Infrastructure Layer**: 데이터 접근 (`models.py`)
- **Presentation Layer**: API 인터페이스 (`router.py`)
- **Application Layer**: 데이터 변환 (`schemas.py`)

### 의존성 주입

- FastAPI의 `Depends` 활용
- 서비스와 리포지토리 분리
- 테스트 가능한 구조

## 📈 성능 최적화

### 데이터베이스

- 비동기 세션 사용
- 연결 풀링 (pool_size=5, max_overflow=10)
- 인덱스 최적화

### 캐싱

- Redis 기반 세션 관리
- JWT 토큰 캐싱
- API 응답 캐싱

### 비동기 처리

- `async`/`await` 패턴
- I/O 바운드 작업 최적화
- 동시성 처리

## 🚀 배포

### Docker

```bash
# 이미지 빌드
make docker-build

# 컨테이너 실행
make docker-run
```

### 프로덕션 실행

```bash
# Poetry를 사용한 프로덕션 서버 실행
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# 또는 Makefile 사용
make run-prod
```

## 📝 개발 가이드라인

### 코드 스타일

- **Black** 코드 포맷팅 (line-length: 79)
- **Ruff** 린팅 (B, E, F, I 규칙)
- **MyPy** 타입 체크 (strict 모드)
- **isort** import 정렬

### 네이밍 규칙

- **클래스**: PascalCase (`UserService`)
- **함수/변수**: snake_case (`create_user`)
- **상수**: UPPER_SNAKE_CASE (`MAX_UPLOAD_SIZE`)
- **파일명**: snake_case (`user_service.py`)

### 주석 규칙

- 모든 함수에 docstring 필수
- 복잡한 로직에 인라인 주석
- 타입 힌트 100% 적용

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원

- **이슈**: [GitHub Issues](https://github.com/ragbridge/backend/issues)
- **문서**: [API Documentation](https://docs.ragbridge.com)
- **이메일**: team@ragbridge.com

---

**RagBridge Team** - Kafka + AI 문서 OCR·검증·RAG 플랫폼
