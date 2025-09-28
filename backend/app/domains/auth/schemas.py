"""
인증 도메인 스키마

요청/응답 데이터 검증 및 직렬화
"""

from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, validator

from .models import UserRole


class UserBase(BaseModel):
    """사용자 기본 스키마입니다."""
    
    email: EmailStr = Field(description="이메일 주소")
    full_name: str = Field(min_length=1, max_length=100, description="사용자 전체 이름")
    tenant_id: str = Field(min_length=1, max_length=50, description="테넌트 ID")
    role: UserRole = Field(default=UserRole.VIEWER, description="사용자 역할")


class UserCreate(UserBase):
    """사용자 생성 요청 스키마입니다."""
    
    password: str = Field(
        min_length=8,
        max_length=100,
        description="비밀번호 (8자 이상)"
    )
    
    @validator('password')
    def validate_password(cls, v):
        """비밀번호 유효성 검증입니다."""
        if len(v) < 8:
            raise ValueError('비밀번호는 8자 이상이어야 합니다')
        if not any(c.isupper() for c in v):
            raise ValueError('비밀번호는 대문자를 포함해야 합니다')
        if not any(c.islower() for c in v):
            raise ValueError('비밀번호는 소문자를 포함해야 합니다')
        if not any(c.isdigit() for c in v):
            raise ValueError('비밀번호는 숫자를 포함해야 합니다')
        return v


class UserRead(UserBase):
    """사용자 조회 응답 스키마입니다."""
    
    id: UUID = Field(description="사용자 고유 ID")
    is_active: bool = Field(description="활성 상태")
    created_at: datetime = Field(description="생성 시간")
    updated_at: datetime = Field(description="수정 시간")
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """사용자 정보 수정 요청 스키마입니다."""
    
    full_name: Optional[str] = Field(None, min_length=1, max_length=100, description="사용자 전체 이름")
    role: Optional[UserRole] = Field(None, description="사용자 역할")
    is_active: Optional[bool] = Field(None, description="활성 상태")


class LoginRequest(BaseModel):
    """로그인 요청 스키마입니다."""
    
    email: EmailStr = Field(description="이메일 주소")
    password: str = Field(description="비밀번호")


class LoginResponse(BaseModel):
    """로그인 응답 스키마입니다."""
    
    access_token: str = Field(description="액세스 토큰")
    refresh_token: str = Field(description="리프레시 토큰")
    token_type: str = Field(default="bearer", description="토큰 타입")
    expires_in: int = Field(description="토큰 만료 시간(초)")
    user: UserRead = Field(description="사용자 정보")


class TokenPayload(BaseModel):
    """JWT 토큰 페이로드 스키마입니다."""
    
    sub: str = Field(description="사용자 ID")
    email: str = Field(description="이메일 주소")
    tenant_id: str = Field(description="테넌트 ID")
    role: UserRole = Field(description="사용자 역할")
    type: str = Field(description="토큰 타입 (access/refresh)")
    exp: datetime = Field(description="만료 시간")


class TokenRefreshRequest(BaseModel):
    """토큰 갱신 요청 스키마입니다."""
    
    refresh_token: str = Field(description="리프레시 토큰")


class TokenRefreshResponse(BaseModel):
    """토큰 갱신 응답 스키마입니다."""
    
    access_token: str = Field(description="새로운 액세스 토큰")
    token_type: str = Field(default="bearer", description="토큰 타입")
    expires_in: int = Field(description="토큰 만료 시간(초)")


class ErrorResponse(BaseModel):
    """에러 응답 스키마입니다."""
    
    message: str = Field(description="에러 메시지")
    error_code: Optional[str] = Field(None, description="에러 코드")
    detail: Optional[str] = Field(None, description="상세 에러 정보")
