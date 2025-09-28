"""
현재 사용자 조회 API 테스트

GET /me 엔드포인트의 성공/실패 케이스 테스트
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.auth.models import User
from app.common.security import create_access_token


class TestMe:
    """현재 사용자 조회 테스트 클래스"""

    async def test_me_success(
        self, 
        test_client: AsyncClient, 
        test_user: User
    ):
        """유효한 토큰으로 현재 사용자 조회 성공 테스트"""
        # 유효한 액세스 토큰 생성
        access_token = create_access_token(
            data={
                "sub": str(test_user.id),
                "email": test_user.email,
                "tenant_id": test_user.tenant_id,
                "role": test_user.role.value,
                "type": "access"
            }
        )
        
        headers = {"Authorization": f"Bearer {access_token}"}
        response = await test_client.get("/api/v1/auth/me", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        # 응답 데이터 검증
        assert data["id"] == str(test_user.id)
        assert data["email"] == test_user.email
        assert data["full_name"] == test_user.full_name
        assert data["tenant_id"] == test_user.tenant_id
        assert data["role"] == test_user.role.value
        assert data["is_active"] == test_user.is_active
        assert "created_at" in data
        assert "updated_at" in data
        assert "hashed_password" not in data  # 비밀번호는 응답에 포함되지 않음

    async def test_me_invalid_token(
        self, 
        test_client: AsyncClient
    ):
        """잘못된 토큰으로 현재 사용자 조회 실패 테스트"""
        headers = {"Authorization": "Bearer invalid_token"}
        response = await test_client.get("/api/v1/auth/me", headers=headers)
        
        assert response.status_code == 401
        data = response.json()
        assert "유효하지 않은 토큰입니다" in data["detail"]

    async def test_me_expired_token(
        self, 
        test_client: AsyncClient, 
        test_user: User
    ):
        """만료된 토큰으로 현재 사용자 조회 실패 테스트"""
        # 만료된 액세스 토큰 생성 (exp가 과거 시간)
        import datetime
        expired_time = datetime.datetime.utcnow() - datetime.timedelta(hours=1)
        
        access_token = create_access_token(
            data={
                "sub": str(test_user.id),
                "email": test_user.email,
                "tenant_id": test_user.tenant_id,
                "role": test_user.role.value,
                "type": "access"
            },
            expires_delta=datetime.timedelta(seconds=-3600)  # 1시간 전에 만료
        )
        
        headers = {"Authorization": f"Bearer {access_token}"}
        response = await test_client.get("/api/v1/auth/me", headers=headers)
        
        assert response.status_code == 401
        data = response.json()
        assert "유효하지 않은 토큰입니다" in data["detail"]

    async def test_me_wrong_token_type(
        self, 
        test_client: AsyncClient, 
        test_user: User
    ):
        """잘못된 토큰 타입으로 현재 사용자 조회 실패 테스트"""
        # 리프레시 토큰으로 요청 (type이 "refresh")
        refresh_token = create_access_token(
            data={
                "sub": str(test_user.id),
                "email": test_user.email,
                "tenant_id": test_user.tenant_id,
                "role": test_user.role.value,
                "type": "refresh"  # 잘못된 타입
            }
        )
        
        headers = {"Authorization": f"Bearer {refresh_token}"}
        response = await test_client.get("/api/v1/auth/me", headers=headers)
        
        assert response.status_code == 401
        data = response.json()
        assert "유효하지 않은 토큰입니다" in data["detail"]

    async def test_me_missing_authorization_header(
        self, 
        test_client: AsyncClient
    ):
        """Authorization 헤더 누락으로 현재 사용자 조회 실패 테스트"""
        response = await test_client.get("/api/v1/auth/me")
        
        assert response.status_code == 403
        data = response.json()
        assert "Not authenticated" in data["detail"]

    async def test_me_malformed_authorization_header(
        self, 
        test_client: AsyncClient
    ):
        """잘못된 형식의 Authorization 헤더로 현재 사용자 조회 실패 테스트"""
        headers = {"Authorization": "InvalidFormat token"}
        response = await test_client.get("/api/v1/auth/me", headers=headers)
        
        assert response.status_code == 403
        data = response.json()
        assert "Not authenticated" in data["detail"]

    async def test_me_nonexistent_user(
        self, 
        test_client: AsyncClient
    ):
        """존재하지 않는 사용자 ID로 토큰 생성 후 조회 실패 테스트"""
        # 존재하지 않는 사용자 ID로 토큰 생성
        access_token = create_access_token(
            data={
                "sub": "00000000-0000-0000-0000-000000000000",  # 존재하지 않는 UUID
                "email": "nonexistent@example.com",
                "tenant_id": "test-tenant",
                "role": "viewer",
                "type": "access"
            }
        )
        
        headers = {"Authorization": f"Bearer {access_token}"}
        response = await test_client.get("/api/v1/auth/me", headers=headers)
        
        assert response.status_code == 404
        data = response.json()
        assert "사용자를 찾을 수 없습니다" in data["detail"]["message"]

    async def test_me_admin_user(
        self, 
        test_client: AsyncClient, 
        admin_user: User
    ):
        """관리자 사용자로 현재 사용자 조회 성공 테스트"""
        access_token = create_access_token(
            data={
                "sub": str(admin_user.id),
                "email": admin_user.email,
                "tenant_id": admin_user.tenant_id,
                "role": admin_user.role.value,
                "type": "access"
            }
        )
        
        headers = {"Authorization": f"Bearer {access_token}"}
        response = await test_client.get("/api/v1/auth/me", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        # 관리자 사용자 정보 검증
        assert data["id"] == str(admin_user.id)
        assert data["email"] == admin_user.email
        assert data["role"] == "admin"
        assert data["is_active"] is True
