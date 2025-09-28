import { PendingReview } from "@/components/documents/pending-review";

/**
 * 검토 대기 페이지
 *
 * @description
 * - 승인이 필요한 문서 목록
 * - 휴먼 검토 및 승인/거부 기능
 * - 검증 오류 및 수정 사항 표시
 * - 배치 승인 및 우선순위 관리
 */
export default function PendingReviewPage() {
  return <PendingReview />;
}
