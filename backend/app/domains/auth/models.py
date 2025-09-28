"""
인증 도메인 모델

사용자 관련 SQLModel 모델 정의
"""

from datetime import datetime
from typing import Optional
from enum import Enum
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field
from pydantic import BaseModel


class UserRole(str, Enum):
    """사용자 역할 열거형입니다."""
    ADMIN = "admin"
    OPERATOR = "operator"
    VIEWER = "viewer"


class TimestampMixin(BaseModel):
    """타임스탬프 믹스인 클래스입니다."""
    
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="생성 시간"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="수정 시간"
    )


class User(SQLModel, TimestampMixin, table=True):
    """사용자 정보를 저장하는 모델입니다.
    
    Attributes:
        id (UUID): 사용자 고유 ID
        email (str): 이메일 주소 (유니크)
        hashed_password (str): 해시된 비밀번호
        full_name (str): 사용자 전체 이름
        tenant_id (str): 테넌트 ID (멀티테넌시)
        role (UserRole): 사용자 역할
        is_active (bool): 활성 상태
    """
    
    __tablename__ = "users"
    
    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        description="사용자 고유 ID"
    )
    email: str = Field(
        unique=True,
        index=True,
        description="이메일 주소"
    )
    hashed_password: str = Field(
        description="해시된 비밀번호"
    )
    full_name: str = Field(
        description="사용자 전체 이름"
    )
    tenant_id: str = Field(
        index=True,
        description="테넌트 ID (멀티테넌시)"
    )
    role: UserRole = Field(
        default=UserRole.VIEWER,
        description="사용자 역할"
    )
    is_active: bool = Field(
        default=True,
        description="활성 상태"
    )
