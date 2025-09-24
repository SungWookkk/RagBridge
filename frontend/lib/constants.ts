/**
 * 운영 상수 정의
 *
 * @description
 * - 성능 최적화를 위한 임계값들
 * - 대용량 데이터 처리 설정
 * - 캐싱 및 폴링 관련 상수
 * - 접근성 및 사용자 경험 설정
 */

/**
 * 페이지네이션 관련 상수
 */
export const PAGINATION_CONSTANTS = {
  // 기본 페이지 크기
  DEFAULT_PAGE_SIZE: 20,
  // 최대 페이지 크기
  MAX_PAGE_SIZE: 100,
  // 페이지 크기 옵션들
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  // 가상 스크롤 임계값 (이 이상이면 가상 스크롤 적용)
  VIRTUAL_SCROLL_THRESHOLD: 1000,
} as const;

/**
 * 캐싱 관련 상수
 */
export const CACHE_CONSTANTS = {
  // 기본 stale 시간 (5분)
  DEFAULT_STALE_TIME: 5 * 60 * 1000,
  // 기본 가비지 컬렉션 시간 (10분)
  DEFAULT_GC_TIME: 10 * 60 * 1000,
  // 짧은 캐시 시간 (30초)
  SHORT_STALE_TIME: 30 * 1000,
  // 긴 캐시 시간 (30분)
  LONG_STALE_TIME: 30 * 60 * 1000,
} as const;

/**
 * 성능 최적화 상수
 */
export const PERFORMANCE_CONSTANTS = {
  // 최대 렌더 아이템 수 (가상 스크롤 적용 임계값)
  MAX_RENDER_ITEMS: 1000,
  // 디바운스 지연 시간 (검색 등)
  DEBOUNCE_DELAY: 300,
  // 스로틀 지연 시간 (스크롤 이벤트 등)
  THROTTLE_DELAY: 100,
  // 애니메이션 지연 시간
  ANIMATION_DELAY: 200,
  // 무한 스크롤 로딩 임계값
  INFINITE_SCROLL_THRESHOLD: 1000,
} as const;

/**
 * 에러 처리 관련 상수
 */
export const ERROR_CONSTANTS = {
  // 최대 재시도 횟수
  MAX_RETRY_COUNT: 3,
  // 재시도 지연 시간
  RETRY_DELAY: 1000,
  // 네트워크 타임아웃 (15초)
  NETWORK_TIMEOUT: 15000,
  // 요청 타임아웃 (30초)
  REQUEST_TIMEOUT: 30000,
} as const;

/**
 * 폴링 관련 상수
 */
export const POLLING_CONSTANTS = {
  // 실시간 데이터 폴링 간격 (30초)
  REALTIME_POLLING_INTERVAL: 30 * 1000,
  // 일반 데이터 폴링 간격 (5분)
  NORMAL_POLLING_INTERVAL: 5 * 60 * 1000,
  // 느린 데이터 폴링 간격 (15분)
  SLOW_POLLING_INTERVAL: 15 * 60 * 1000,
  // 폴링 비활성화 (목 데이터 사용 시)
  POLLING_DISABLED: false,
} as const;

/**
 * 애니메이션 관련 상수
 */
export const ANIMATION_CONSTANTS = {
  // 기본 애니메이션 지속 시간
  DEFAULT_DURATION: 0.3,
  // 빠른 애니메이션 지속 시간
  FAST_DURATION: 0.15,
  // 느린 애니메이션 지속 시간
  SLOW_DURATION: 0.5,
  // 애니메이션 지연 시간
  DEFAULT_DELAY: 0.1,
  // 배경 애니메이션 지속 시간
  BACKGROUND_DURATION: 20,
} as const;

/**
 * 접근성 관련 상수
 */
export const ACCESSIBILITY_CONSTANTS = {
  // 키보드 네비게이션 지연 시간
  KEYBOARD_NAVIGATION_DELAY: 300,
  // 포커스 표시 시간
  FOCUS_VISIBLE_DURATION: 200,
  // 스크린 리더 대기 시간
  SCREEN_READER_DELAY: 100,
} as const;

/**
 * 파일 업로드 관련 상수
 */
export const UPLOAD_CONSTANTS = {
  // 최대 파일 크기 (50MB)
  MAX_FILE_SIZE: 50 * 1024 * 1024,
  // 허용된 파일 타입
  ALLOWED_FILE_TYPES: [
    ".pdf",
    ".docx",
    ".doc",
    ".txt",
    ".jpg",
    ".jpeg",
    ".png",
  ],
  // 최대 동시 업로드 파일 수
  MAX_CONCURRENT_UPLOADS: 5,
  // 업로드 진행률 업데이트 간격
  UPLOAD_PROGRESS_INTERVAL: 100,
} as const;

/**
 * 검색 관련 상수
 */
export const SEARCH_CONSTANTS = {
  // 최소 검색어 길이
  MIN_SEARCH_LENGTH: 2,
  // 최대 검색어 길이
  MAX_SEARCH_LENGTH: 100,
  // 검색 결과 최대 개수
  MAX_SEARCH_RESULTS: 100,
  // 검색 디바운스 시간
  SEARCH_DEBOUNCE: 300,
  // 자동완성 제안 개수
  AUTOCOMPLETE_SUGGESTIONS: 10,
} as const;

/**
 * 테마 관련 상수
 */
export const THEME_CONSTANTS = {
  // 다크 모드 클래스명
  DARK_MODE_CLASS: "dark",
  // 라이트 모드 클래스명
  LIGHT_MODE_CLASS: "light",
  // 시스템 테마 감지
  SYSTEM_THEME: "system",
} as const;

/**
 * 브레이크포인트 상수
 */
export const BREAKPOINT_CONSTANTS = {
  // 모바일
  MOBILE: 640,
  // 태블릿
  TABLET: 768,
  // 데스크톱
  DESKTOP: 1024,
  // 대형 데스크톱
  LARGE_DESKTOP: 1280,
} as const;

/**
 * API 관련 상수
 */
export const API_CONSTANTS = {
  // 기본 API URL
  DEFAULT_API_URL: "http://localhost:8000",
  // WebSocket URL
  DEFAULT_WS_URL: "ws://localhost:8000/ws",
  // API 버전
  API_VERSION: "v1",
  // 기본 헤더
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
} as const;

/**
 * 개발 환경 상수
 */
export const DEV_CONSTANTS = {
  // 개발 모드 확인
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  // 프로덕션 모드 확인
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  // 테스트 모드 확인
  IS_TEST: process.env.NODE_ENV === "test",
} as const;

/**
 * 모든 상수를 하나의 객체로 통합
 */
export const OPERATION_CONSTANTS = {
  PAGINATION: PAGINATION_CONSTANTS,
  CACHE: CACHE_CONSTANTS,
  PERFORMANCE: PERFORMANCE_CONSTANTS,
  ERROR: ERROR_CONSTANTS,
  POLLING: POLLING_CONSTANTS,
  ANIMATION: ANIMATION_CONSTANTS,
  ACCESSIBILITY: ACCESSIBILITY_CONSTANTS,
  UPLOAD: UPLOAD_CONSTANTS,
  SEARCH: SEARCH_CONSTANTS,
  THEME: THEME_CONSTANTS,
  BREAKPOINT: BREAKPOINT_CONSTANTS,
  API: API_CONSTANTS,
  DEV: DEV_CONSTANTS,
} as const;

export default OPERATION_CONSTANTS;
