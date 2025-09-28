import { DocumentsInProgress } from "@/components/documents/documents-in-progress";

/**
 * 진행 중인 문서 페이지
 *
 * @description
 * - 현재 처리 중인 문서 현황
 * - OCR 및 검증 진행률 표시
 * - 실시간 상태 업데이트
 * - 처리 중단 및 재시도 기능
 */
export default function DocumentsInProgressPage() {
  return <DocumentsInProgress />;
}
