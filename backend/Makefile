# RagBridge Backend 개발 도구 (Poetry 기반)

.PHONY: help install dev test lint format type-check migrate upgrade downgrade clean run

help: ## 도움말 표시
	@echo "RagBridge Backend 개발 도구 (Poetry 기반)"
	@echo "사용법: make [명령어]"
	@echo ""
	@echo "사용 가능한 명령어:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## 의존성 설치
	poetry install

install-dev: ## 개발 의존성 설치
	poetry install --with dev,test

test: ## 테스트 실행
	poetry run pytest

test-cov: ## 테스트 실행 (커버리지 포함)
	poetry run pytest --cov=app --cov-report=html --cov-report=term

test-fast: ## 빠른 테스트 실행 (통합 테스트 제외)
	poetry run pytest -m "not slow"

lint: ## 코드 린팅
	poetry run ruff check app tests

format: ## 코드 포맷팅
	poetry run black app tests
	poetry run isort app tests

format-check: ## 코드 포맷팅 검사
	poetry run black --check app tests
	poetry run isort --check-only app tests

type-check: ## 타입 체크
	poetry run mypy app

check-all: lint format-check type-check ## 모든 검사 실행

migrate: ## 마이그레이션 생성
	poetry run alembic revision --autogenerate -m "$(MSG)"

upgrade: ## 데이터베이스 업그레이드
	poetry run alembic upgrade head

downgrade: ## 데이터베이스 다운그레이드
	poetry run alembic downgrade -1

migrate-history: ## 마이그레이션 히스토리 확인
	poetry run alembic history

migrate-current: ## 현재 마이그레이션 상태 확인
	poetry run alembic current

clean: ## 임시 파일 정리
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf .coverage htmlcov/ .pytest_cache/ .mypy_cache/

run: ## 개발 서버 실행 (Poetry)
	poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

run-prod: ## 프로덕션 서버 실행 (Poetry)
	poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

docker-build: ## Docker 이미지 빌드
	docker build -t ragbridge-backend .

docker-run: ## Docker 컨테이너 실행
	docker run -p 8000:8000 ragbridge-backend

pre-commit: ## pre-commit 훅 설치
	poetry run pre-commit install

pre-commit-run: ## pre-commit 훅 실행
	poetry run pre-commit run --all-files

setup: install-dev pre-commit ## 개발 환경 설정
	@echo "개발 환경 설정이 완료되었습니다!"
	@echo "다음 명령어로 서버를 실행할 수 있습니다:"
	@echo "  make run"
	@echo "  또는"
	@echo "  poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

ci: check-all test ## CI 파이프라인 실행

# Poetry 관련 추가 명령어
poetry-install: ## Poetry 설치 (시스템에 Poetry가 없는 경우)
	curl -sSL https://install.python-poetry.org | python3 -

poetry-update: ## 의존성 업데이트
	poetry update

poetry-show: ## 설치된 패키지 목록 표시
	poetry show

poetry-tree: ## 의존성 트리 표시
	poetry show --tree

poetry-shell: ## Poetry 가상환경 활성화
	poetry shell
