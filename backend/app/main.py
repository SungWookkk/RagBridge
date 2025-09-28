"""
RagBridge Backend 메인 애플리케이션

FastAPI 애플리케이션 설정 및 라우터 등록
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from .common.config import settings
from .common.database import init_db, close_db
from .common.exceptions import BusinessException, business_exception_handler
from .domains.auth.router import router as auth_router


# 로깅 설정
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 생명주기 관리입니다."""
    # 시작 시 실행
    logger.info("RagBridge Backend 시작 중...")
    await init_db()
    logger.info("데이터베이스 초기화 완료")
    
    yield
    
    # 종료 시 실행
    logger.info("RagBridge Backend 종료 중...")
    await close_db()
    logger.info("데이터베이스 연결 종료 완료")


# FastAPI 애플리케이션 생성
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Kafka + AI 문서 OCR·검증·RAG 플랫폼의 백엔드",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 전역 예외 핸들러
@app.exception_handler(BusinessException)
async def business_exception_handler_func(request: Request, exc: BusinessException):
    """비즈니스 예외 핸들러입니다."""
    logger.error(f"비즈니스 예외 발생: {exc.message}")
    return business_exception_handler(exc)


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """일반 예외 핸들러입니다."""
    logger.error(f"예상치 못한 오류 발생: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "message": "내부 서버 오류가 발생했습니다",
            "error_code": "INTERNAL_SERVER_ERROR"
        }
    )


# 라우터 등록
app.include_router(auth_router)


@app.get("/", tags=["헬스체크"])
async def root():
    """루트 엔드포인트입니다."""
    return {
        "message": "RagBridge Backend",
        "version": settings.VERSION,
        "status": "running"
    }


@app.get("/health", tags=["헬스체크"])
async def health_check():
    """헬스체크 엔드포인트입니다."""
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "environment": "development" if settings.DEBUG else "production"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
