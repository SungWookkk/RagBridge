"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { Toaster } from "@/components/ui/toast";
import { ToastProvider } from "@/components/ui/toast";

/**
 * AxiosError 타입 가드 함수
 *
 * @description
 * - AxiosError 객체인지 안전하게 확인
 * - HTTP 상태 코드에 따른 재시도 여부 판단
 */
function isAxiosError(error: unknown): error is import("axios").AxiosError {
  return axios.isAxiosError(error);
}

/**
 * 에러가 재시도 가능한지 판단하는 함수
 *
 * @description
 * - 4xx 클라이언트 에러: 재시도 안함 (사용자 입력 문제)
 * - 5xx 서버 에러: 재시도 가능 (일시적 서버 문제)
 * - 네트워크 에러: 재시도 가능
 */
function isRetryableError(error: unknown): boolean {
  if (!isAxiosError(error)) {
    // AxiosError가 아닌 경우 재시도 가능
    return true;
  }

  const status = error.response?.status;

  // 4xx 클라이언트 에러는 재시도하지 않음
  if (status && status >= 400 && status < 500) {
    return false;
  }

  // 5xx 서버 에러, 네트워크 에러는 재시도 가능
  return true;
}

/**
 * React Query 프로바이더 설정
 *
 * @description
 * - 서버 상태 관리 및 캐싱 설정
 * - 개발 환경에서 React Query Devtools 활성화
 * - 성능 최적화를 위한 기본 옵션 설정
 * - 타입 안전한 에러 처리 및 재시도 로직 구성
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5분 후 데이터를 stale로 간주
            staleTime: 5 * 60 * 1000,
            // 10분 후 캐시에서 제거
            gcTime: 10 * 60 * 1000,
            // 타입 안전한 재시도 로직
            retry: (failureCount, error: unknown) => {
              // 최대 3회 재시도
              if (failureCount >= 3) {
                return false;
              }

              // 재시도 가능한 에러인지 확인
              return isRetryableError(error);
            },
            // 백그라운드에서 자동 refetch 비활성화 (수동 제어)
            refetchOnWindowFocus: false,
            // 네트워크 재연결 시 refetch 활성화
            refetchOnReconnect: true,
            // 현재 목 데이터 사용 중이므로 폴링 비활성화
            refetchInterval: false,
          },
          mutations: {
            // 뮤테이션 실패 시 타입 안전한 재시도
            retry: (failureCount, error: unknown) => {
              // 최대 2회 재시도
              if (failureCount >= 2) {
                return false;
              }

              // 재시도 가능한 에러인지 확인
              return isRetryableError(error);
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
        <Toaster />
      </ToastProvider>
      {/* React Query Devtools 비활성화 (필요시 주석 해제) */}
      {/* {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )} */}
    </QueryClientProvider>
  );
}
