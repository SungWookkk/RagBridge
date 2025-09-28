"""
애플리케이션 설정 관리

환경변수 기반 설정 로드 및 타입 안전성 보장
"""

from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """애플리케이션 설정 클래스입니다."""
    
    # 애플리케이션 기본 설정
    DEBUG: bool = Field(default=False, description="디버그 모드")
    APP_NAME: str = Field(default="RagBridge Backend", description="애플리케이션 이름")
    VERSION: str = Field(default="1.0.0", description="애플리케이션 버전")
    
    # 데이터베이스 설정
    DB_URL: str = Field(default="sqlite+aiosqlite:///./ragbridge.db", description="데이터베이스 연결 URL")
    DB_POOL_SIZE: int = Field(default=5, description="DB 연결 풀 크기")
    DB_MAX_OVERFLOW: int = Field(default=10, description="DB 최대 오버플로우")
    
    # JWT 인증 설정
    API_JWT_SECRET: str = Field(default="your-super-secret-jwt-key-change-this-in-production", description="JWT 서명 키")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, description="액세스 토큰 만료 시간(분)")
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7, description="리프레시 토큰 만료 시간(일)")
    ALGORITHM: str = Field(default="HS256", description="JWT 암호화 알고리즘")
    
    # CORS 설정
    CORS_ORIGINS: list[str] = Field(default=["http://localhost:3000"], description="CORS 허용 출처")
    
    # Redis 설정 (캐싱 및 세션)
    REDIS_URL: Optional[str] = Field(default=None, description="Redis 연결 URL")
    REDIS_PASSWORD: Optional[str] = Field(default=None, description="Redis 비밀번호")
    REDIS_DB: Optional[int] = Field(default=0, description="Redis 데이터베이스 번호")
    
    # S3 스토리지 설정
    S3_BUCKET_URL: Optional[str] = Field(default=None, description="S3 버킷 URL")
    S3_ACCESS_KEY: Optional[str] = Field(default=None, description="S3 액세스 키")
    S3_SECRET_KEY: Optional[str] = Field(default=None, description="S3 시크릿 키")
    S3_REGION: Optional[str] = Field(default="us-east-1", description="S3 리전")
    AWS_ACCESS_KEY_ID: Optional[str] = Field(default=None, description="AWS 액세스 키")
    AWS_SECRET_ACCESS_KEY: Optional[str] = Field(default=None, description="AWS 시크릿 키")
    
    # Kafka 설정
    KAFKA_BROKERS: Optional[str] = Field(default=None, description="Kafka 브로커 주소")
    SCHEMA_REGISTRY_URL: Optional[str] = Field(default=None, description="Schema Registry URL")
    KAFKA_SASL_USERNAME: Optional[str] = Field(default=None, description="Kafka SASL 사용자명")
    KAFKA_SASL_PASSWORD: Optional[str] = Field(default=None, description="Kafka SASL 비밀번호")
    KAFKA_SASL_MECHANISM: Optional[str] = Field(default="PLAIN", description="Kafka SASL 메커니즘")
    
    # 로깅 설정
    LOG_LEVEL: str = Field(default="INFO", description="로그 레벨")
    LOG_FORMAT: Optional[str] = Field(default="%(asctime)s - %(name)s - %(levelname)s - %(message)s", description="로그 포맷")
    
    # AI/ML 설정
    OPENAI_API_KEY: Optional[str] = Field(default=None, description="OpenAI API 키")
    EMBEDDING_MODEL: Optional[str] = Field(default="sentence-transformers/all-MiniLM-L6-v2", description="임베딩 모델")
    MLFLOW_TRACKING_URI: Optional[str] = Field(default=None, description="MLflow 추적 URI")
    MODEL_REGISTRY_URI: Optional[str] = Field(default=None, description="모델 레지스트리 URI")
    
    # 모니터링 설정
    PROMETHEUS_URL: Optional[str] = Field(default=None, description="Prometheus URL")
    GRAFANA_URL: Optional[str] = Field(default=None, description="Grafana URL")
    SENTRY_DSN: Optional[str] = Field(default=None, description="Sentry DSN")
    
    # 이메일 설정
    SMTP_HOST: Optional[str] = Field(default=None, description="SMTP 호스트")
    SMTP_PORT: Optional[int] = Field(default=587, description="SMTP 포트")
    SMTP_USERNAME: Optional[str] = Field(default=None, description="SMTP 사용자명")
    SMTP_PASSWORD: Optional[str] = Field(default=None, description="SMTP 비밀번호")
    SMTP_USE_TLS: Optional[bool] = Field(default=True, description="SMTP TLS 사용 여부")
    
    # 테스트 설정
    TEST_DB_URL: Optional[str] = Field(default=None, description="테스트 데이터베이스 URL")
    TESTING: Optional[bool] = Field(default=False, description="테스트 모드")
    
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


# 전역 설정 인스턴스
settings = Settings()


def get_settings() -> Settings:
    """설정 인스턴스를 반환합니다.
    
    Returns:
        Settings: 애플리케이션 설정 객체
    """
    return settings
