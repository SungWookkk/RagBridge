// app/providers.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ToastProvider } from "@/components/ui/toast"
import { ReactNode, useState } from "react"

/**
 * 앱 전체 프로바이더 컴포넌트
 * 
 * @description
 * - React Query와 Toast 시스템을 앱 전체에 제공
 * - ToastProvider가 모든 자식 컴포넌트를 감싸서 useToast 훅 사용 가능
 * - QueryClientProvider로 서버 상태 관리 기능 제공
 */
export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </QueryClientProvider>
  )
}
