"""
인증 도메인 서비스

사용자 인증 및 권한 관리 비즈니스 로직
"""

from typing import Optional, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlmodel import SQLModel
from datetime import timedelta

from ...common.security import get_password_hash, verify_password, create_access_token, create_refresh_token, verify_token
from ...common.exceptions import UserAlreadyExists, InvalidCredentials, UserNotFound, InactiveUser
from ...common.config import settings
from .models import User, UserRole
from .schemas import UserCreate, UserRead, LoginRequest, LoginResponse


class BaseRepository:
    """기본 Repository 클래스입니다."""
    
    def __init__(self, session: AsyncSession):
        """Repository를 초기화합니다.
        
        Args:
            session (AsyncSession): 데이터베이스 세션
        """
        self.session = session
    
    async def create(self, model: SQLModel) -> SQLModel:
        """모델을 생성합니다.
        
        Args:
            model (SQLModel): 생성할 모델
            
        Returns:
            SQLModel: 생성된 모델
        """
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return model
    
    async def get_by_id(self, model_class: type[SQLModel], id: UUID) -> Optional[SQLModel]:
        """ID로 모델을 조회합니다.
        
        Args:
            model_class (type[SQLModel]): 모델 클래스
            id (UUID): 모델 ID
            
        Returns:
            Optional[SQLModel]: 조회된 모델 또는 None
        """
        result = await self.session.execute(
            select(model_class).where(model_class.id == id)
        )
        return result.scalar_one_or_none()
    
    async def update(self, model: SQLModel) -> SQLModel:
        """모델을 업데이트합니다.
        
        Args:
            model (SQLModel): 업데이트할 모델
            
        Returns:
            SQLModel: 업데이트된 모델
        """
        await self.session.commit()
        await self.session.refresh(model)
        return model
    
    async def delete(self, model: SQLModel) -> None:
        """모델을 삭제합니다.
        
        Args:
            model (SQLModel): 삭제할 모델
        """
        await self.session.delete(model)
        await self.session.commit()


class UserRepository(BaseRepository):
    """사용자 Repository 클래스입니다."""
    
    async def create_user(self, user: User) -> User:
        """새로운 사용자를 생성합니다.
        
        Args:
            user (User): 생성할 사용자 모델
            
        Returns:
            User: 생성된 사용자
        """
        return await self.create(user)
    
    async def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """ID로 사용자를 조회합니다.
        
        Args:
            user_id (UUID): 사용자 ID
            
        Returns:
            Optional[User]: 조회된 사용자 또는 None
        """
        return await self.get_by_id(User, user_id)
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """이메일로 사용자를 조회합니다.
        
        Args:
            email (str): 이메일 주소
            
        Returns:
            Optional[User]: 조회된 사용자 또는 None
        """
        result = await self.session.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_user_by_email_and_tenant(self, email: str, tenant_id: str) -> Optional[User]:
        """이메일과 테넌트 ID로 사용자를 조회합니다.
        
        Args:
            email (str): 이메일 주소
            tenant_id (str): 테넌트 ID
            
        Returns:
            Optional[User]: 조회된 사용자 또는 None
        """
        result = await self.session.execute(
            select(User).where(
                User.email == email,
                User.tenant_id == tenant_id
            )
        )
        return result.scalar_one_or_none()
    
    async def get_users_by_tenant(self, tenant_id: str) -> List[User]:
        """테넌트 ID로 사용자 목록을 조회합니다.
        
        Args:
            tenant_id (str): 테넌트 ID
            
        Returns:
            List[User]: 사용자 목록
        """
        result = await self.session.execute(
            select(User).where(User.tenant_id == tenant_id)
        )
        return result.scalars().all()
    
    async def get_users_by_role(self, tenant_id: str, role: UserRole) -> List[User]:
        """테넌트와 역할로 사용자 목록을 조회합니다.
        
        Args:
            tenant_id (str): 테넌트 ID
            role (UserRole): 사용자 역할
            
        Returns:
            List[User]: 사용자 목록
        """
        result = await self.session.execute(
            select(User).where(
                User.tenant_id == tenant_id,
                User.role == role
            )
        )
        return result.scalars().all()
    
    async def update_user(self, user: User) -> User:
        """사용자 정보를 업데이트합니다.
        
        Args:
            user (User): 업데이트할 사용자
            
        Returns:
            User: 업데이트된 사용자
        """
        return await self.update(user)
    
    async def delete_user(self, user: User) -> None:
        """사용자를 삭제합니다.
        
        Args:
            user (User): 삭제할 사용자
        """
        await self.delete(user)
    
    async def check_email_exists(self, email: str) -> bool:
        """이메일이 이미 존재하는지 확인합니다.
        
        Args:
            email (str): 확인할 이메일
            
        Returns:
            bool: 이메일이 존재하면 True, 그렇지 않으면 False
        """
        user = await self.get_user_by_email(email)
        return user is not None
    
    async def check_email_exists_in_tenant(self, email: str, tenant_id: str) -> bool:
        """테넌트 내에서 이메일이 이미 존재하는지 확인합니다.
        
        Args:
            email (str): 확인할 이메일
            tenant_id (str): 테넌트 ID
            
        Returns:
            bool: 이메일이 존재하면 True, 그렇지 않으면 False
        """
        user = await self.get_user_by_email_and_tenant(email, tenant_id)
        return user is not None


class AuthService:
    """인증 관련 서비스 클래스입니다."""
    
    def __init__(self, session: AsyncSession):
        """AuthService를 초기화합니다.
        
        Args:
            session (AsyncSession): 데이터베이스 세션
        """
        self.session = session
        self.user_repo = UserRepository(session)
    
    async def register_user(self, user_data: UserCreate) -> UserRead:
        """새로운 사용자를 등록합니다.
        
        Args:
            user_data (UserCreate): 사용자 생성 데이터
            
        Returns:
            UserRead: 생성된 사용자 정보
            
        Raises:
            UserAlreadyExists: 이미 존재하는 이메일인 경우
        """
        # 이메일 중복 확인
        if await self.user_repo.check_email_exists(user_data.email):
            raise UserAlreadyExists(user_data.email)
        
        # 비밀번호 해시화
        hashed_password = get_password_hash(user_data.password)
        
        # 사용자 모델 생성
        user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            tenant_id=user_data.tenant_id,
            role=user_data.role,
            is_active=True
        )
        
        # 데이터베이스에 저장
        created_user = await self.user_repo.create_user(user)
        
        # 응답 스키마로 변환
        return UserRead.from_orm(created_user)
    
    async def authenticate_user(self, login_data: LoginRequest) -> LoginResponse:
        """사용자 인증을 수행합니다.
        
        Args:
            login_data (LoginRequest): 로그인 데이터
            
        Returns:
            LoginResponse: 로그인 응답 (토큰 포함)
            
        Raises:
            InvalidCredentials: 잘못된 인증 정보인 경우
            InactiveUser: 비활성 사용자인 경우
        """
        # 사용자 조회
        user = await self.user_repo.get_user_by_email(login_data.email)
        
        if not user:
            raise InvalidCredentials()
        
        # 비밀번호 검증
        if not verify_password(login_data.password, user.hashed_password):
            raise InvalidCredentials()
        
        # 사용자 활성 상태 확인
        if not user.is_active:
            raise InactiveUser()
        
        # 토큰 생성
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "tenant_id": user.tenant_id,
            "role": user.role.value
        }
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        # 토큰 만료 시간 계산 (초 단위)
        expires_in = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        
        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=expires_in,
            user=UserRead.from_orm(user)
        )
    
    async def get_current_user(self, user_id: UUID) -> UserRead:
        """현재 사용자 정보를 조회합니다.
        
        Args:
            user_id (UUID): 사용자 ID
            
        Returns:
            UserRead: 사용자 정보
            
        Raises:
            UserNotFound: 사용자를 찾을 수 없는 경우
            InactiveUser: 비활성 사용자인 경우
        """
        user = await self.user_repo.get_user_by_id(user_id)
        
        if not user:
            raise UserNotFound(str(user_id))
        
        if not user.is_active:
            raise InactiveUser()
        
        return UserRead.from_orm(user)
    
    async def refresh_access_token(self, refresh_token: str) -> str:
        """액세스 토큰을 갱신합니다.
        
        Args:
            refresh_token (str): 리프레시 토큰
            
        Returns:
            str: 새로운 액세스 토큰
            
        Raises:
            InvalidCredentials: 잘못된 토큰인 경우
            UserNotFound: 사용자를 찾을 수 없는 경우
            InactiveUser: 비활성 사용자인 경우
        """
        # 토큰 검증
        payload = verify_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise InvalidCredentials()
        
        # 사용자 조회
        user_id = UUID(payload["sub"])
        user = await self.user_repo.get_user_by_id(user_id)
        
        if not user:
            raise UserNotFound(str(user_id))
        
        if not user.is_active:
            raise InactiveUser()
        
        # 새로운 액세스 토큰 생성
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "tenant_id": user.tenant_id,
            "role": user.role.value
        }
        
        return create_access_token(token_data)
