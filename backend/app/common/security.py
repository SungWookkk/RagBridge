"""
보안 및 JWT 토큰 관리

비밀번호 해시화, JWT 토큰 생성/검증 기능
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from passlib.hash import bcrypt

from .config import settings


class SecurityManager:
    """보안 관련 기능을 제공하는 클래스입니다."""
    
    def __init__(self):
        """보안 매니저를 초기화합니다."""
        # PassLib 컨텍스트 설정 (bcrypt 사용)
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """평문 비밀번호와 해시된 비밀번호를 검증합니다.
        
        Args:
            plain_password (str): 평문 비밀번호
            hashed_password (str): 해시된 비밀번호
            
        Returns:
            bool: 비밀번호가 일치하면 True, 그렇지 않으면 False
        """
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        """비밀번호를 해시화합니다.
        
        Args:
            password (str): 평문 비밀번호
            
        Returns:
            str: 해시된 비밀번호
        """
        return self.pwd_context.hash(password)
    
    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """액세스 토큰을 생성합니다.
        
        Args:
            data (Dict[str, Any]): 토큰에 포함할 데이터
            expires_delta (Optional[timedelta]): 만료 시간 델타
            
        Returns:
            str: JWT 액세스 토큰
        """
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire, "type": "access"})
        
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.API_JWT_SECRET, 
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt
    
    def create_refresh_token(self, data: Dict[str, Any]) -> str:
        """리프레시 토큰을 생성합니다.
        
        Args:
            data (Dict[str, Any]): 토큰에 포함할 데이터
            
        Returns:
            str: JWT 리프레시 토큰
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        
        to_encode.update({"exp": expire, "type": "refresh"})
        
        encoded_jwt = jwt.encode(
            to_encode,
            settings.API_JWT_SECRET,
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """JWT 토큰을 검증하고 페이로드를 반환합니다.
        
        Args:
            token (str): 검증할 JWT 토큰
            
        Returns:
            Optional[Dict[str, Any]]: 토큰이 유효하면 페이로드, 그렇지 않으면 None
        """
        try:
            payload = jwt.decode(
                token,
                settings.API_JWT_SECRET,
                algorithms=[settings.ALGORITHM]
            )
            return payload
        except JWTError:
            return None
    
    def extract_token_from_header(self, authorization: str) -> Optional[str]:
        """Authorization 헤더에서 토큰을 추출합니다.
        
        Args:
            authorization (str): Authorization 헤더 값
            
        Returns:
            Optional[str]: Bearer 토큰, 형식이 잘못되면 None
        """
        if not authorization.startswith("Bearer "):
            return None
        return authorization.split(" ")[1]


# 전역 보안 매니저 인스턴스
security = SecurityManager()


def get_password_hash(password: str) -> str:
    """비밀번호를 해시화합니다.
    
    Args:
        password (str): 평문 비밀번호
        
    Returns:
        str: 해시된 비밀번호
    """
    return security.get_password_hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """평문 비밀번호와 해시된 비밀번호를 검증합니다.
    
    Args:
        plain_password (str): 평문 비밀번호
        hashed_password (str): 해시된 비밀번호
        
    Returns:
        bool: 비밀번호가 일치하면 True, 그렇지 않으면 False
    """
    return security.verify_password(plain_password, hashed_password)


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """액세스 토큰을 생성합니다.
    
    Args:
        data (Dict[str, Any]): 토큰에 포함할 데이터
        expires_delta (Optional[timedelta]): 만료 시간 델타
        
    Returns:
        str: JWT 액세스 토큰
    """
    return security.create_access_token(data, expires_delta)


def create_refresh_token(data: Dict[str, Any]) -> str:
    """리프레시 토큰을 생성합니다.
    
    Args:
        data (Dict[str, Any]): 토큰에 포함할 데이터
        
    Returns:
        str: JWT 리프레시 토큰
    """
    return security.create_refresh_token(data)


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """JWT 토큰을 검증하고 페이로드를 반환합니다.
    
    Args:
        token (str): 검증할 JWT 토큰
        
    Returns:
        Optional[Dict[str, Any]]: 토큰이 유효하면 페이로드, 그렇지 않으면 None
    """
    return security.verify_token(token)
