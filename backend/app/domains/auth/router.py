"""
인증 도메인 라우터

사용자 인증 관련 REST API 엔드포인트
"""

from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from ...common.database import get_db_session
from ...common.security import verify_token
from ...common.exceptions import business_exception_handler
from ...common.config import settings
from .schemas import UserCreate, UserRead, LoginRequest, LoginResponse, TokenRefreshRequest, TokenRefreshResponse
from .services import AuthService

# HTTP Bearer 토큰 스키마
security = HTTPBearer()


def get_auth_service(session: Annotated[AsyncSession, Depends(get_db_session)]) -> AuthService:
    """AuthService 의존성을 제공합니다.
    
    Args:
        session (AsyncSession): 데이터베이스 세션
        
    Returns:
        AuthService: 인증 서비스 인스턴스
    """
    return AuthService(session)


def get_current_user_id(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> UUID:
    """현재 사용자 ID를 추출합니다.
    
    Args:
        credentials (HTTPAuthorizationCredentials): 인증 정보
        
    Returns:
        UUID: 사용자 ID
        
    Raises:
        HTTPException: 토큰이 유효하지 않은 경우
    """
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다"
        )
    
    return UUID(payload["sub"])


# 인증 라우터 생성
router = APIRouter(prefix="/api/v1/auth", tags=["인증"])


@router.post(
    "/register",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    summary="사용자 등록",
    description="새로운 사용자를 등록합니다."
)
async def register(
    user_data: UserCreate,
    auth_service: Annotated[AuthService, Depends(get_auth_service)]
) -> UserRead:
    """사용자 등록 엔드포인트입니다.
    
    Args:
        user_data (UserCreate): 사용자 생성 데이터
        auth_service (AuthService): 인증 서비스
        
    Returns:
        UserRead: 생성된 사용자 정보
        
    Raises:
        HTTPException: 이미 존재하는 이메일인 경우 (409)
    """
    try:
        return await auth_service.register_user(user_data)
    except Exception as e:
        raise business_exception_handler(e)


@router.post(
    "/login",
    response_model=LoginResponse,
    summary="사용자 로그인",
    description="이메일과 비밀번호로 로그인합니다."
)
async def login(
    login_data: LoginRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)]
) -> LoginResponse:
    """사용자 로그인 엔드포인트입니다.
    
    Args:
        login_data (LoginRequest): 로그인 데이터
        auth_service (AuthService): 인증 서비스
        
    Returns:
        LoginResponse: 로그인 응답 (토큰 포함)
        
    Raises:
        HTTPException: 잘못된 인증 정보인 경우 (401)
    """
    try:
        return await auth_service.authenticate_user(login_data)
    except Exception as e:
        raise business_exception_handler(e)


@router.get(
    "/me",
    response_model=UserRead,
    summary="현재 사용자 정보",
    description="현재 로그인한 사용자의 정보를 조회합니다."
)
async def get_current_user(
    user_id: Annotated[UUID, Depends(get_current_user_id)],
    auth_service: Annotated[AuthService, Depends(get_auth_service)]
) -> UserRead:
    """현재 사용자 정보 조회 엔드포인트입니다.
    
    Args:
        user_id (UUID): 사용자 ID
        auth_service (AuthService): 인증 서비스
        
    Returns:
        UserRead: 사용자 정보
        
    Raises:
        HTTPException: 사용자를 찾을 수 없거나 비활성인 경우 (404/403)
    """
    try:
        return await auth_service.get_current_user(user_id)
    except Exception as e:
        raise business_exception_handler(e)


@router.post(
    "/refresh",
    response_model=TokenRefreshResponse,
    summary="토큰 갱신",
    description="리프레시 토큰으로 액세스 토큰을 갱신합니다."
)
async def refresh_token(
    refresh_data: TokenRefreshRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)]
) -> TokenRefreshResponse:
    """토큰 갱신 엔드포인트입니다.
    
    Args:
        refresh_data (TokenRefreshRequest): 리프레시 토큰 데이터
        auth_service (AuthService): 인증 서비스
        
    Returns:
        TokenRefreshResponse: 새로운 액세스 토큰
        
    Raises:
        HTTPException: 잘못된 토큰인 경우 (401)
    """
    try:
        access_token = await auth_service.refresh_access_token(refresh_data.refresh_token)
        
        expires_in = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        
        return TokenRefreshResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=expires_in
        )
    except Exception as e:
        raise business_exception_handler(e)
