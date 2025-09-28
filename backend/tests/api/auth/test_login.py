"""
사용자 로그인 API 테스트

로그인 엔드포인트의 성공/실패 케이스 테스트
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.auth.models import User
from app.domains.auth.schemas import LoginRequest


class TestLogin:
    """사용자 로그인 테스트 클래스"""

    async def test_login_success(
        self, 
        test_client: AsyncClient, 
        test_user: User
    ):
        """로그인 성공 테스트"""
        login_data = {
            "email": test_user.email,
            "password": "TestPassword123"  # 테스트 사용자의 비밀번호
        }
        
        response = await test_client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 200
        data = response.json()
        
        # 응답 데이터 검증
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        assert data["expires_in"] == 1800  # 30분
        
        # 토큰이 실제로 유효한지 확인
        from app.common.security import verify_token
        payload = verify_token(data["access_token"])
        assert payload is not None
        assert payload["sub"] == str(test_user.id)
        assert payload["email"] == test_user.email
        assert payload["tenant_id"] == test_user.tenant_id
        assert payload["role"] == test_user.role.value
        assert payload["type"] == "access"

    async def test_login_invalid_email(
        self, 
        test_client: AsyncClient
    ):
        """존재하지 않는 이메일로 로그인 실패 테스트"""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "SomePassword123"
        }
        
        response = await test_client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 401
        data = response.json()
        assert "잘못된 이메일 또는 비밀번호입니다" in data["detail"]["message"]

    async def test_login_invalid_password(
        self, 
        test_client: AsyncClient, 
        test_user: User
    ):
        """잘못된 비밀번호로 로그인 실패 테스트"""
        login_data = {
            "email": test_user.email,
            "password": "WrongPassword123"
        }
        
        response = await test_client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 401
        data = response.json()
        assert "잘못된 이메일 또는 비밀번호입니다" in data["detail"]["message"]

    async def test_login_inactive_user(
        self, 
        test_client: AsyncClient, 
        inactive_user: User
    ):
        """비활성 사용자 로그인 실패 테스트"""
        login_data = {
            "email": inactive_user.email,
            "password": "InactivePassword123"
        }
        
        response = await test_client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 401
        data = response.json()
        assert "비활성화된 사용자입니다" in data["detail"]["message"]

    async def test_login_missing_fields(
        self, 
        test_client: AsyncClient
    ):
        """필수 필드 누락 로그인 실패 테스트"""
        login_data = {
            "email": "test@example.com",
            # password 누락
        }
        
        response = await test_client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 422
        data = response.json()
        assert "password" in str(data)

    async def test_login_invalid_email_format(
        self, 
        test_client: AsyncClient
    ):
        """잘못된 이메일 형식 로그인 실패 테스트"""
        login_data = {
            "email": "invalid-email",
            "password": "SomePassword123"
        }
        
        response = await test_client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 422
        data = response.json()
        assert "email" in str(data)

    async def test_login_empty_request(
        self, 
        test_client: AsyncClient
    ):
        """빈 요청 로그인 실패 테스트"""
        response = await test_client.post("/api/v1/auth/login", json={})
        
        assert response.status_code == 422
        data = response.json()
        assert "email" in str(data)
        assert "password" in str(data)
