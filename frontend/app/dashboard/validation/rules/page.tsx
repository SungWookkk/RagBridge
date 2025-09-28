import { ValidationRulesBuilder } from "@/components/validation/validation-rules-builder";

/**
 * 검증 규칙 페이지
 *
 * @description
 * - 문서 품질 검증 규칙 설정 및 관리
 * - 필드 매핑, 정규식, 임계값 설정
 * - 휴먼검토 루프 및 테스트 기능
 */
export default function ValidationRulesPage() {
  return <ValidationRulesBuilder />;
}
