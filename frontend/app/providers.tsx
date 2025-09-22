"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

/**
 * React Query 프로바이더 설정
 * 
 * @description
 * - 서버 상태 관리 및 캐싱 설정
 * - 개발 환경에서 React Query Devtools 활성화
 * - 성능 최적화를 위한 기본 옵션 설정
 * - 에러 처리 및 재시도 로직 구성
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
            // 네트워크 오류 시 3회 재시도
            retry: (failureCount, error: any) => {
              if (error?.status === 404) return false
              return failureCount < 3
            },
            // 백그라운드에서 자동 refetch 비활성화 (수동 제어)
            refetchOnWindowFocus: false,
            // 네트워크 재연결 시 refetch 활성화
            refetchOnReconnect: true,
          },
          mutations: {
            // 뮤테이션 실패 시 2회 재시도
            retry: (failureCount, error: any) => {
              if (error?.status >= 400 && error?.status < 500) return false
              return failureCount < 2
            },
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 React Query Devtools 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  )
}