import { RagBridgeDashboard } from "@/components/ragbridge-dashboard";

/**
 * 대시보드 메인 페이지
 *
 * @description
 * - 사용자 중심의 대시보드 인터페이스
 * - 온보딩 체크리스트, 오늘의 작업, AI 피드백 등 제공
 * - 기존 컴포넌트들을 조합한 Slim Wrapper 패턴
 */
export default function DashboardPage() {
  return <RagBridgeDashboard />;
}
