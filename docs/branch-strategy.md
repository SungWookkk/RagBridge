# 브랜치 전략

## 브랜치 유형 및 용도

1. `main` 또는 `master`

   - 프로덕션 릴리스 전용 브랜치
   - 직접적인 커밋은 금지되며, Pull Request를 통해서만 변경 가능
   - 항상 안정적인 상태를 유지해야 함

2. `develop`

   - 통합 개발 브랜치
   - 모든 기능 개발과 버그 수정이 이 브랜치로 병합됨
   - 다음 릴리스를 위한 개발 작업이 진행되는 브랜치

3. `feature/xxx`

   - 새로운 기능 개발을 위한 브랜치
   - `develop` 브랜치에서 분기
   - 기능 개발이 완료되면 `develop` 브랜치로 병합
   - 브랜치명 예시: `feature/user-authentication`, `feature/payment-integration`

4. `bugfix/xxx`

   - 버그 수정을 위한 브랜치
   - `develop` 브랜치에서 분기
   - 버그 수정이 완료되면 `develop` 브랜치로 병합
   - 브랜치명 예시: `bugfix/login-error`, `bugfix/payment-validation`

## 브랜치 보호 규칙

- `main` 브랜치는 다음과 같은 보호 규칙이 적용됩니다:

  - 최소 1명의 승인된 리뷰어의 승인이 필요
  - 최신 변경사항에 대한 상태 검사가 통과되어야 함
  - 관리자도 동일한 보호 규칙을 준수해야 함

## 작업 흐름

1. ### 새로운 기능 개발 시작

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-feature
   ```

2. ### 버그 수정 시작

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b bugfix/issue-description
   ```

3. ### 변경사항 완료 후

   ```bash
   git push origin feature/new-feature
   # 또는
   git push origin bugfix/issue-description
   ```

   - GitHub에서 Pull Request 생성
   - 코드 리뷰 진행
   - 승인 후 `develop` 브랜치로 병합

## Pull Request & GitHub Projects 연동

1. **Pull Request 생성 시**

   - PR 제목 앞에 이슈 번호를 붙여 명확히 구분합니다.
     예시: `feat: #123 OAuth 로그인 구현`
   - **Projects > 원하는 보드**의 **`In Progress`**(또는 적절한 열)로 PR을 자동/수동으로 할당합니다.

     - _GitHub Projects 자동화 규칙_ 을 설정해 `feature/*`, `bugfix/*` PR이 열리면 해당 열로 카드가 생성·이동되도록 할 수 있습니다.

2. **리뷰 & 병합**

   - 최소 1명 이상의 리뷰어가 **Approve** 해야 합니다.
   - CI가 성공하면 `Squash & Merge`(권장) 혹은 `Rebase & Merge`로 `develop`(또는 `main`)에 병합합니다.
   - 병합과 동시에 Projects 카드가 **`Done`** 열로 이동하도록 자동화합니다.

3. **문서화 후속 작업**

   - 병합 직후, 관련 변경사항을 **CHANGELOG.md**·**Architecture 문서**·**API 문서(Swagger/OpenAPI)** 등에 반영합니다.
   - 필요한 경우 **docs/** 디렉터리나 위키 페이지를 업데이트하고, 커밋 메시지에 `[docs]` 태그를 포함합니다.
   - 문서 PR 역시 Projects의 **`Docs`** 열로 자동 배치하여 추적합니다.

> 위 작업 흐름을 통해 코드, 프로젝트 관리, 문서의 삼위일체를 유지하여 협업 효율을 극대화합니다.

---

## 백엔드 PR 품질 검증 체크리스트 (Pre‑Merge)

`develop`·`main` 브랜치로 **병합하기 전** 다음 항목이 **모두 통과**되어야 합니다.

| 단계 | 도구       | 통과 조건                                     | 대표 CLI                                          |
| ---- | ---------- | --------------------------------------------- | ------------------------------------------------- |
| 1    | **pytest** | ✅ 모든 테스트 **성공** ✅ **경고 없음**      | `poetry run pytest -q --strict-markers -W error`  |
| 2    | **mypy**   | ✅ 정적 타입 검사 **무결점**                  | `poetry run mypy .`                               |
| 3    | **isort**  | ✅ import 정렬 **완료** (`--check-only` 기준) | `poetry run isort . --profile black --check-only` |
| 4    | **black**  | ✅ 코드 포매팅 **일치** (`--check` 기준)      | `poetry run black . --check`                      |
| 5    | **ruff**   | ✅ 린트 **무결점**                            | `poetry run ruff check .`                         |
| 6    | **safety** | ✅ 보안 취약점 **검사 통과**                   | `poetry run safety check`                         |
| 7    | **bandit** | ✅ 보안 이슈 **정적 분석 통과**               | `poetry run bandit -r app/`                       |

> ⚠️ 위 명령 중 하나라도 실패(비 0 종료 코드)가 발생하면 PR을 **병합하지 말고** 원인 수정 후 다시 실행해야 합니다.
>
> GitHub Actions CI에서 동일한 스크립트를 실행하여 자동으로 검증·차단되도록 설정해 두는 것을 권장합니다.

### One‑Liner (로컬 검증용)

```bash
# 전체 체크를 한 번에 실행
poetry run pytest -q --strict-markers -W error && \
poetry run mypy . && \
poetry run isort . --profile black --check-only && \
poetry run black . --check && \
poetry run ruff check . && \
poetry run safety check && \
poetry run bandit -r app/
```

### 품질 검증 스크립트

```bash
# scripts/quality-check.sh
#!/bin/bash
set -e

echo "🧪 테스트 실행 중..."
poetry run pytest -q --strict-markers -W error

echo "🔍 타입 검사 중..."
poetry run mypy .

echo "📦 Import 정렬 검사 중..."
poetry run isort . --profile black --check-only

echo "🎨 코드 포매팅 검사 중..."
poetry run black . --check

echo "🔧 린터 검사 중..."
poetry run ruff check .

echo "🛡️ 보안 취약점 검사 중..."
poetry run safety check

echo "🔒 보안 이슈 검사 중..."
poetry run bandit -r app/

echo "✅ 모든 품질 검사 통과!"
```

### 포매터 자동 적용

```bash
# scripts/format.sh - 자동 포맷팅 스크립트
#!/bin/bash
echo "🔧 자동 포맷팅 적용 중..."
poetry run isort . --profile black
poetry run black .
poetry run ruff check . --fix
echo "✅ 포맷팅 완료!"
```

---
