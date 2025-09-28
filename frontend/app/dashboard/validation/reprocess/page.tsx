import { ReprocessingQueue } from "@/components/validation/reprocessing-queue";

/**
 * 재처리 큐 페이지
 *
 * @description
 * - 처리 실패한 문서들의 재처리 관리
 * - 재처리 큐 상태 모니터링
 * - 실패 원인 분석 및 해결 방안 제시
 */
export default function ReprocessingQueuePage() {
  return <ReprocessingQueue />;
}
