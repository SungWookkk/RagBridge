// lib/api.ts
import axios, { AxiosError, AxiosResponse } from "axios";

/**
 * API 에러 타입 정의
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * API 응답 타입 정의
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  status: "success" | "error";
  timestamp: string;
}

/**
 * HTTP 상태 코드별 에러 메시지 매핑
 */
const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: "잘못된 요청입니다.",
  401: "인증이 필요합니다.",
  403: "접근 권한이 없습니다.",
  404: "요청한 리소스를 찾을 수 없습니다.",
  409: "데이터 충돌이 발생했습니다.",
  422: "입력 데이터가 유효하지 않습니다.",
  429: "요청 한도를 초과했습니다.",
  500: "서버 내부 오류가 발생했습니다.",
  502: "게이트웨이 오류가 발생했습니다.",
  503: "서비스를 일시적으로 사용할 수 없습니다.",
  504: "게이트웨이 타임아웃이 발생했습니다.",
};

/**
 * Axios 인스턴스 생성
 *
 * @description
 * - 기본 설정 및 타임아웃 구성
 * - 요청/응답 인터셉터로 공통 처리
 * - 타입 안전한 에러 처리
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  withCredentials: false,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * API 에러를 표준화된 형태로 변환
 *
 * @param error - AxiosError 또는 기타 에러
 * @returns 표준화된 ApiError 객체
 */
function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;

    return {
      message:
        HTTP_ERROR_MESSAGES[status || 500] || "알 수 없는 오류가 발생했습니다.",
      status,
      code: axiosError.code,
      details: axiosError.response?.data,
    };
  }

  // AxiosError가 아닌 경우
  return {
    message:
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.",
    code: "UNKNOWN_ERROR",
  };
}

/**
 * 요청 인터셉터
 *
 * @description
 * - 요청 전 공통 처리 (인증 토큰 추가 등)
 * - 로깅 및 디버깅 정보 추가
 */
api.interceptors.request.use(
  (config) => {
    // 개발 환경에서만 요청 로깅
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        {
          params: config.params,
          data: config.data,
        },
      );
    }

    // TODO: 실제 API 연동 시 인증 토큰 추가
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);

/**
 * 응답 인터셉터
 *
 * @description
 * - 응답 후 공통 처리 및 에러 변환
 * - 표준화된 에러 형태로 변환
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 개발 환경에서만 응답 로깅
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Response] ${response.status} ${response.config.url}`,
        response.data,
      );
    }

    return response;
  },
  (error: AxiosError | Error) => {
    const normalizedError = normalizeApiError(error);

    // 개발 환경에서만 에러 로깅
    if (process.env.NODE_ENV === "development") {
      console.error("[API Error]", normalizedError);
    }

    // TODO: 실제 API 연동 시 토스트 알림 추가
    // toast.error(normalizedError.message);

    return Promise.reject(normalizedError);
  },
);

/**
 * API 호출 헬퍼 함수들
 */

/**
 * GET 요청 헬퍼
 */
export async function apiGet<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const response = await api.get<ApiResponse<T>>(url, { params });
  return response.data.data;
}

/**
 * POST 요청 헬퍼
 */
export async function apiPost<T = unknown, D = unknown>(
  url: string,
  data?: D,
): Promise<T> {
  const response = await api.post<ApiResponse<T>>(url, data);
  return response.data.data;
}

/**
 * PUT 요청 헬퍼
 */
export async function apiPut<T = unknown, D = unknown>(
  url: string,
  data?: D,
): Promise<T> {
  const response = await api.put<ApiResponse<T>>(url, data);
  return response.data.data;
}

/**
 * DELETE 요청 헬퍼
 */
export async function apiDelete<T = unknown>(url: string): Promise<T> {
  const response = await api.delete<ApiResponse<T>>(url);
  return response.data.data;
}
