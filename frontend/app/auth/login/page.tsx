import { AuthForm } from "@/components/auth/auth-form";
import { AuthLayout } from "@/components/auth/auth-layout";

/**
 * 로그인 페이지
 *
 * @description
 * - 사용자가 계정에 로그인할 수 있는 페이지
 * - 새로운 2단 레이아웃 (왼쪽 브랜딩, 오른쪽 폼)
 * - AuthForm을 로그인 모드로 렌더링
 */
export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthForm isLoginMode={true} />
    </AuthLayout>
  );
}
