import { APIKeyManagement } from "@/components/projects/api-key-management";

/**
 * API 키 관리 페이지
 *
 * @description
 * - API 접근 키 생성 및 관리
 * - 키별 권한 설정 및 사용량 모니터링
 * - 보안 설정 및 키 회전 관리
 */
export default function APIKeyManagementPage() {
  return <APIKeyManagement />;
}
