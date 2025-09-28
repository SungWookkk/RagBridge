"""
pytest 설정 및 공통 픽스처

테스트 환경 설정 및 데이터베이스 픽스처
"""

import pytest
import asyncio
from typing import AsyncGenerator, Generator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool
from httpx import AsyncClient
from fastapi.testclient import TestClient

from app.main import app
from app.common.database import get_db_session
from app.common.config import settings
from app.domains.auth.models import User, UserRole
from app.common.security import get_password_hash


# 테스트용 데이터베이스 URL (메모리 SQLite)
TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """이벤트 루프 픽스처입니다."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def test_engine():
    """테스트용 데이터베이스 엔진입니다."""
    engine = create_async_engine(
        TEST_DB_URL,
        poolclass=StaticPool,
        connect_args={"check_same_thread": False},
        echo=False,
    )
    
    # 테이블 생성
    from sqlmodel import SQLModel
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    
    yield engine
    await engine.dispose()


@pytest.fixture
async def test_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    """테스트용 데이터베이스 세션입니다."""
    async_session = async_sessionmaker(
        test_engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        yield session
        await session.rollback()


@pytest.fixture
def override_get_db(test_session: AsyncSession):
    """데이터베이스 세션 의존성 오버라이드입니다."""
    async def _override_get_db():
        yield test_session
    
    app.dependency_overrides[get_db_session] = _override_get_db
    yield
    app.dependency_overrides.clear()


@pytest.fixture
async def test_client(override_get_db) -> AsyncGenerator[AsyncClient, None]:
    """테스트용 HTTP 클라이언트입니다."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


@pytest.fixture
async def test_user(test_session: AsyncSession) -> User:
    """테스트용 사용자입니다."""
    user = User(
        email="test@example.com",
        hashed_password=get_password_hash("TestPassword123"),
        full_name="테스트 사용자",
        tenant_id="test-tenant",
        role=UserRole.VIEWER,
        is_active=True
    )
    
    test_session.add(user)
    await test_session.commit()
    await test_session.refresh(user)
    
    return user


@pytest.fixture
async def admin_user(test_session: AsyncSession) -> User:
    """테스트용 관리자 사용자입니다."""
    user = User(
        email="admin@example.com",
        hashed_password=get_password_hash("AdminPassword123"),
        full_name="관리자",
        tenant_id="test-tenant",
        role=UserRole.ADMIN,
        is_active=True
    )
    
    test_session.add(user)
    await test_session.commit()
    await test_session.refresh(user)
    
    return user


@pytest.fixture
async def inactive_user(test_session: AsyncSession) -> User:
    """테스트용 비활성 사용자입니다."""
    user = User(
        email="inactive@example.com",
        hashed_password=get_password_hash("InactivePassword123"),
        full_name="비활성 사용자",
        tenant_id="test-tenant",
        role=UserRole.VIEWER,
        is_active=False
    )
    
    test_session.add(user)
    await test_session.commit()
    await test_session.refresh(user)
    
    return user
