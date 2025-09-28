"""
데이터베이스 연결 및 세션 관리

변경/목적 요약:
- create_async_engine에 pool_pre_ping=True를 적용해 죽은 연결을 재시도하도록 함.
- init_db/create_tables에 재시도(backoff) 로직 추가: 개발 환경에서 DB가 늦게 올라올 때 안전하게 대처.
- test_connection 헬퍼로 앱 시작 전 빠르게 DB 연결 상태를 확인할 수 있도록 함.
- 세션 생성/롤백 로직은 기존과 유사하되 컨텍스트 매니저를 사용해 안전하게 관리.
"""

import asyncio
import logging
from typing import AsyncGenerator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.exc import OperationalError
from sqlmodel import SQLModel

from .config import settings

logger = logging.getLogger("app.db")

class DatabaseManager:
    """
    데이터베이스 엔진/세션팩토리 관리

    Attributes
    - engine: SQLAlchemy 비동기 엔진
    - SessionLocal: async_sessionmaker로 생성된 세션 팩토리
    """
    def __init__(self) -> None:
        # pool_size/max_overflow는 asyncpg 드라이버와 환경에 따라 예기치 않은 동작을 유발할 수 있어
        # 기본값을 사용하고 pool_pre_ping으로 죽은 연결을 감지하게 구성합니다.
        self.engine = create_async_engine(
            settings.DB_URL,
            echo=settings.DEBUG,
            future=True,
            pool_pre_ping=True,
        )

        self.SessionLocal = async_sessionmaker(
            bind=self.engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )

    async def create_tables(self) -> None:
        """
        메타데이터로부터 테이블 생성.
        재시도 로직을 포함해 DB가 아직 준비되지 않은 경우 대기 후 재시도합니다.
        """
        max_retries = 5
        base_delay = 1.0  # 초

        for attempt in range(1, max_retries + 1):
            try:
                logger.info("데이터베이스 테이블 생성 시도 (attempt=%d)", attempt)
                async with self.engine.begin() as conn:
                    await conn.run_sync(SQLModel.metadata.create_all)
                logger.info("데이터베이스 테이블 생성 완료")
                return
            except Exception as exc:
                # OperationalError 등으로 연결 실패 시 재시도
                logger.warning(
                    "create_tables 실패 (attempt=%d/%d): %s",
                    attempt,
                    max_retries,
                    exc,
                )
                if attempt == max_retries:
                    logger.exception("create_tables 최대 재시도 실패, 예외를 상위로 전달합니다.")
                    raise
                # 지수 백오프
                await asyncio.sleep(base_delay * (2 ** (attempt - 1)))

    async def test_connection(self) -> None:
        """
        간단한 SELECT 1 연결 테스트.
        앱 시작 전에 이 호출을 통해 DB 연결 상태를 빠르게 확인 가능.
        """
        try:
            async with self.engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
                await conn.commit()
            logger.info("DB 연결 테스트 성공")
        except Exception:
            logger.exception("DB 연결 테스트 실패")
            raise

    async def close(self) -> None:
        """엔진 디스포즈"""
        await self.engine.dispose()


# 전역 인스턴스
db_manager = DatabaseManager()


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    종속성 주입용 세션 생성기.
    사용법:
      async for session in get_db_session(): ...
      또는 FastAPI 의존성으로 사용
    """
    async with db_manager.SessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            logger.exception("세션에서 예외 발생, 롤백 수행")
            raise


async def init_db() -> None:
    """
    앱 시작 시 호출되는 초기화 함수(테이블 생성 등).
    필요 시 app.main에서 호출.
    """
    await db_manager.create_tables()


async def close_db() -> None:
    await db_manager.close()
