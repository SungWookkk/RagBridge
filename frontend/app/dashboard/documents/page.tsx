import { DocumentUpload } from "@/components/documents/document-upload";

/**
 * 문서 업로드 페이지
 *
 * @description
 * - 새 문서 업로드 및 처리 시작
 * - 드래그 앤 드롭 파일 업로드
 * - 멀티파일 업로드 지원
 * - 업로드 진행률 및 상태 표시
 */
export default function DocumentUploadPage() {
  return <DocumentUpload />;
}