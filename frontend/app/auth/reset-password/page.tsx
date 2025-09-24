import { AuthLayout } from "@/components/auth/auth-layout";
import { PasswordResetForm } from "@/components/auth/password-reset-form";

/**
 * 비밀번호 재설정 페이지
 *
 * @description
 * - 사용자가 비밀번호를 재설정할 수 있는 페이지
 * - 새로운 2단 레이아웃 (왼쪽 브랜딩, 오른쪽 폼)
 * - PasswordResetForm을 렌더링
 */
export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <PasswordResetForm />
    </AuthLayout>
  );
}
