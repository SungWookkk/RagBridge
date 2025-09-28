"""
예외 처리 및 커스텀 예외 클래스

도메인별 비즈니스 예외 및 HTTP 상태 코드 매핑
"""

from typing import Optional
from fastapi import HTTPException, status


class BusinessException(Exception):
    """비즈니스 로직 예외 클래스입니다."""
    
    def __init__(self, message: str, error_code: Optional[str] = None):
        self.message = message
        self.error_code = error_code
        super().__init__(message)


class UserAlreadyExists(BusinessException):
    """사용자가 이미 존재할 때 발생하는 예외입니다."""
    
    def __init__(self, email: str):
        super().__init__(
            message=f"이미 존재하는 이메일입니다: {email}",
            error_code="USER_ALREADY_EXISTS"
        )


class InvalidCredentials(BusinessException):
    """잘못된 인증 정보일 때 발생하는 예외입니다."""
    
    def __init__(self):
        super().__init__(
            message="이메일 또는 비밀번호가 올바르지 않습니다",
            error_code="INVALID_CREDENTIALS"
        )


class UserNotFound(BusinessException):
    """사용자를 찾을 수 없을 때 발생하는 예외입니다."""
    
    def __init__(self, user_id: str):
        super().__init__(
            message=f"사용자를 찾을 수 없습니다: {user_id}",
            error_code="USER_NOT_FOUND"
        )


class InactiveUser(BusinessException):
    """비활성 사용자일 때 발생하는 예외입니다."""
    
    def __init__(self):
        super().__init__(
            message="비활성화된 사용자입니다",
            error_code="INACTIVE_USER"
        )


class InvalidToken(BusinessException):
    """잘못된 토큰일 때 발생하는 예외입니다."""
    
    def __init__(self):
        super().__init__(
            message="유효하지 않은 토큰입니다",
            error_code="INVALID_TOKEN"
        )


class TokenExpired(BusinessException):
    """만료된 토큰일 때 발생하는 예외입니다."""
    
    def __init__(self):
        super().__init__(
            message="만료된 토큰입니다",
            error_code="TOKEN_EXPIRED"
        )


# HTTP 상태 코드 매핑
EXCEPTION_STATUS_MAP = {
    UserAlreadyExists: status.HTTP_409_CONFLICT,
    InvalidCredentials: status.HTTP_401_UNAUTHORIZED,
    UserNotFound: status.HTTP_404_NOT_FOUND,
    InactiveUser: status.HTTP_403_FORBIDDEN,
    InvalidToken: status.HTTP_401_UNAUTHORIZED,
    TokenExpired: status.HTTP_401_UNAUTHORIZED,
}


def business_exception_handler(exc: BusinessException) -> HTTPException:
    """비즈니스 예외를 HTTP 예외로 변환합니다.
    
    Args:
        exc (BusinessException): 비즈니스 예외
        
    Returns:
        HTTPException: HTTP 예외
    """
    status_code = EXCEPTION_STATUS_MAP.get(type(exc), status.HTTP_400_BAD_REQUEST)
    
    return HTTPException(
        status_code=status_code,
        detail={
            "message": exc.message,
            "error_code": exc.error_code,
        }
    )
