"use client";

/**
 * useToast 훅의 재내보내기
 *
 * @description
 * - 새로운 순수 React 토스트 시스템의 useToast 훅을 재내보내기
 * - 기존 코드와의 호환성을 위해 별도 파일로 유지
 * - 실제 구현은 @/components/ui/toast에서 가져옴
 *
 * @usage
 * ```tsx
 * import { useToast } from "@/hooks/use-toast"
 *
 * function MyComponent() {
 *   const { toast, dismiss, dismissAll } = useToast()
 *
 *   const showSuccess = () => {
 *     toast({
 *       variant: "success",
 *       title: "성공!",
 *       description: "작업이 완료되었습니다."
 *     })
 *   }
 *
 *   return <button onClick={showSuccess}>토스트 표시</button>
 * }
 * ```
 */

// 새로운 토스트 시스템의 useToast를 재내보내기
export { useToast } from "@/components/ui/toast";

/**
 * 편의 함수들 - 새로운 토스트 시스템과 호환
 *
 * @description
 * - 기존 코드와의 호환성을 위한 편의 함수들
 * - 새로운 토스트 시스템의 variant 타입에 맞춰 조정
 */

/**
 * 성공 토스트 표시 함수
 *
 * @param title - 토스트 제목
 * @param description - 토스트 설명
 * @param duration - 표시 시간 (밀리초, 기본 5초)
 */
export const showSuccessToast = (
  _title: string,
  _description?: string,
  _duration?: number,
) => {
  // 이 함수는 useToast 훅을 사용하는 컴포넌트 내에서만 호출 가능
  console.warn(
    "showSuccessToast는 useToast 훅을 사용하는 컴포넌트 내에서만 호출 가능합니다.",
  );
};

/**
 * 에러 토스트 표시 함수
 *
 * @param title - 토스트 제목
 * @param description - 토스트 설명
 * @param duration - 표시 시간 (밀리초, 기본 5초)
 */
export const showErrorToast = (
  _title: string,
  _description?: string,
  _duration?: number,
) => {
  console.warn(
    "showErrorToast는 useToast 훅을 사용하는 컴포넌트 내에서만 호출 가능합니다.",
  );
};

/**
 * 경고 토스트 표시 함수
 *
 * @param title - 토스트 제목
 * @param description - 토스트 설명
 * @param duration - 표시 시간 (밀리초, 기본 5초)
 */
export const showWarningToast = (
  _title: string,
  _description?: string,
  _duration?: number,
) => {
  console.warn(
    "showWarningToast는 useToast 훅을 사용하는 컴포넌트 내에서만 호출 가능합니다.",
  );
};

/**
 * 정보 토스트 표시 함수
 *
 * @param title - 토스트 제목
 * @param description - 토스트 설명
 * @param duration - 표시 시간 (밀리초, 기본 5초)
 */
export const showInfoToast = (
  _title: string,
  _description?: string,
  _duration?: number,
) => {
  console.warn(
    "showInfoToast는 useToast 훅을 사용하는 컴포넌트 내에서만 호출 가능합니다.",
  );
};
