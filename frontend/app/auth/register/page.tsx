import { AuthForm } from "@/components/auth/auth-form";
import { AuthLayout } from "@/components/auth/auth-layout";

/**
 * 회원가입 페이지
 *
 * @description
 * - 새로운 사용자가 계정을 생성할 수 있는 페이지
 * - 새로운 2단 레이아웃 (왼쪽 브랜딩, 오른쪽 폼)
 * - AuthForm을 회원가입 모드로 렌더링
 */
export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthForm isLoginMode={false} />
    </AuthLayout>
  );
}
