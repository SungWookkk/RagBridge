import { DashboardLayout } from "@/components/layout/dashboard-layout"

/**
 * 대시보드 레이아웃
 * 
 * @description
 * - 모든 대시보드 페이지의 공통 레이아웃
 * - 사이드바, 헤더, 네비게이션을 포함한 전체 구조
 * - 성능 최적화를 위한 클라이언트 컴포넌트 분리
 */
export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
