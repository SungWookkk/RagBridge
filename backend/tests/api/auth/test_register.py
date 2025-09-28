"""
사용자 등록 API 테스트

회원가입 엔드포인트의 성공/실패 케이스 테스트
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.auth.models import User
from app.domains.auth.schemas import UserCreate


class TestRegister:
    """사용자 등록 테스트 클래스"""

    async def test_register_success(
        self, 
        test_client: AsyncClient, 
        test_session: AsyncSession
    ):
        """회원가입 성공 테스트"""
        user_data = {
            "email": "newuser@example.com",
            "password": "NewPassword123",
            "full_name": "새로운 사용자",
            "tenant_id": "test-tenant",
            "role": "viewer"
        }
        
        response = await test_client.post("/api/v1/auth/register", json=user_data)
        
        assert response.status_code == 201
        data = response.json()
        
        # 응답 데이터 검증
        assert data["email"] == user_data["email"]
        assert data["full_name"] == user_data["full_name"]
        assert data["tenant_id"] == user_data["tenant_id"]
        assert data["role"] == user_data["role"]
        assert data["is_active"] is True
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data
        assert "hashed_password" not in data  # 비밀번호는 응답에 포함되지 않음
        
        # 데이터베이스에 실제로 저장되었는지 확인
        from sqlalchemy import select
        result = await test_session.execute(
            select(User).where(User.email == user_data["email"])
        )
        db_user = result.scalar_one_or_none()
        assert db_user is not None
        assert db_user.email == user_data["email"]
        assert db_user.full_name == user_data["full_name"]

    async def test_register_duplicate_email(
        self, 
        test_client: AsyncClient, 
        test_user: User
    ):
        """중복 이메일 등록 실패 테스트"""
        user_data = {
            "email": test_user.email,  # 이미 존재하는 이메일
            "password": "NewPassword123",
            "full_name": "중복 사용자",
            "tenant_id": "test-tenant",
            "role": "viewer"
        }
        
        response = await test_client.post("/api/v1/auth/register", json=user_data)
        
        assert response.status_code == 409
        data = response.json()
        assert "이미 존재하는 이메일입니다" in data["detail"]["message"]

    async def test_register_invalid_password(
        self, 
        test_client: AsyncClient
    ):
        """잘못된 비밀번호 등록 실패 테스트"""
        user_data = {
            "email": "test@example.com",
            "password": "123",  # 너무 짧은 비밀번호
            "full_name": "테스트 사용자",
            "tenant_id": "test-tenant",
            "role": "viewer"
        }
        
        response = await test_client.post("/api/v1/auth/register", json=user_data)
        
        assert response.status_code == 422
        data = response.json()
        assert "비밀번호는 8자 이상이어야 합니다" in str(data)

    async def test_register_missing_fields(
        self, 
        test_client: AsyncClient
    ):
        """필수 필드 누락 등록 실패 테스트"""
        user_data = {
            "email": "test@example.com",
            # password 누락
            "full_name": "테스트 사용자",
            "tenant_id": "test-tenant",
            "role": "viewer"
        }
        
        response = await test_client.post("/api/v1/auth/register", json=user_data)
        
        assert response.status_code == 422
        data = response.json()
        assert "password" in str(data)

    async def test_register_invalid_email_format(
        self, 
        test_client: AsyncClient
    ):
        """잘못된 이메일 형식 등록 실패 테스트"""
        user_data = {
            "email": "invalid-email",  # 잘못된 이메일 형식
            "password": "ValidPassword123",
            "full_name": "테스트 사용자",
            "tenant_id": "test-tenant",
            "role": "viewer"
        }
        
        response = await test_client.post("/api/v1/auth/register", json=user_data)
        
        assert response.status_code == 422
        data = response.json()
        assert "email" in str(data)

    async def test_register_invalid_role(
        self, 
        test_client: AsyncClient
    ):
        """잘못된 역할 등록 실패 테스트"""
        user_data = {
            "email": "test@example.com",
            "password": "ValidPassword123",
            "full_name": "테스트 사용자",
            "tenant_id": "test-tenant",
            "role": "invalid_role"  # 잘못된 역할
        }
        
        response = await test_client.post("/api/v1/auth/register", json=user_data)
        
        assert response.status_code == 422
        data = response.json()
        assert "role" in str(data)
