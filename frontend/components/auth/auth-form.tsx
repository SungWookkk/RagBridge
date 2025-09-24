"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  loginSchema,
  registerSchema,
  LoginFormInputs,
  RegisterFormInputs,
  useAuth,
} from "@/hooks/use-auth";

/**
 * AuthForm 컴포넌트 Props 타입
 *
 * @description
 * - AuthForm 컴포넌트의 props 타입 정의
 * - isLoginMode: 로그인 모드인지 회원가입 모드인지 구분
 */
interface AuthFormProps {
  isLoginMode: boolean;
}

/**
 * AuthForm 컴포넌트
 *
 * @description
 * - 로그인 및 회원가입 기능을 제공하는 통합 인증 폼
 * - React Hook Form과 Zod를 사용하여 폼 유효성 검사 및 상태 관리
 * - 새로운 2단 레이아웃에 맞춘 깔끔한 디자인
 * - 비밀번호 표시/숨김 토글 기능 포함
 * - 목 데이터 기반 인증 로직 (`useAuth` 훅) 연동
 */
export function AuthForm({ isLoginMode }: AuthFormProps) {
  const router = useRouter();
  const { login, register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = isLoginMode ? loginSchema : registerSchema;

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: isLoginMode
      ? { email: "", password: "", rememberMe: false }
      : {
          email: "",
          password: "",
          username: "",
          confirmPassword: "",
          agreeToTerms: false,
        },
  });

  /**
   * 폼 제출 핸들러
   *
   * @description
   * - 로그인 또는 회원가입 로직 실행
   * - 성공 시 대시보드로 이동, 실패 시 에러 메시지 표시
   */
  const onSubmit = async (data: LoginFormInputs | RegisterFormInputs) => {
    clearErrors();
    let result;
    if (isLoginMode) {
      result = await login(data as LoginFormInputs);
    } else {
      result = await register(data as RegisterFormInputs);
    }

    if (!result.success) {
      setError("root.serverError", {
        type: "manual",
        message: result.error || "알 수 없는 오류가 발생했습니다.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl text-foreground">
          {isLoginMode ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-muted-foreground">
          {isLoginMode
            ? "계정에 접속하려면 이메일과 비밀번호를 입력하세요"
            : "RagBridge를 시작하려면 새 계정을 만드세요."}
        </p>
      </div>

      <div className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLoginMode && (
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-foreground"
              >
                Full Name
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="John Doe"
                className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-blue-600"
                {...formRegister("username")}
              />
              {!isLoginMode && "username" in errors && errors.username && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Email"
              className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-blue-600"
              {...formRegister("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-blue-600"
                {...formRegister("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {!isLoginMode && (
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className="h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-blue-600"
                  {...formRegister("confirmPassword")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {!isLoginMode &&
                "confirmPassword" in errors &&
                errors.confirmPassword && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
            </div>
          )}

          {isLoginMode && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-gray-300 cursor-pointer"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  정보 기억하기
                </Label>
              </div>
              <Button
                variant="link"
                className="p-0 h-auto text-sm hover:text-opacity-80 cursor-pointer text-blue-600"
                onClick={() => router.push("/auth/reset-password")}
              >
                비밀번호를 잊으셨나요?
              </Button>
            </div>
          )}

          {!isLoginMode && (
            <div className="flex items-center space-x-2">
              <Checkbox id="agreeToTerms" {...formRegister("agreeToTerms")} />
              <label
                htmlFor="agreeToTerms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <span className="text-blue-600">이용 약관</span>에 동의합니다.
              </label>
              {!isLoginMode &&
                "agreeToTerms" in errors &&
                errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.agreeToTerms.message}
                  </p>
                )}
            </div>
          )}

          {errors.root?.serverError && (
            <p className="mt-2 text-sm text-destructive">
              {errors.root.serverError.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer bg-blue-600"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoginMode ? "Log In" : "Create Account"}
          </Button>
        </form>

        {!isLoginMode && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Or Sign Up With
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg bg-white shadow-none cursor-pointer"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg bg-white shadow-none cursor-pointer"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-.96 3.64-.82 1.57.06 2.75.63 3.54 1.51-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Apple
              </Button>
            </div>
          </>
        )}

        <div className="text-center text-sm text-muted-foreground">
          {isLoginMode ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
          <button
            type="button"
            onClick={() =>
              router.push(isLoginMode ? "/auth/register" : "/auth/login")
            }
            className="font-medium text-blue-600 hover:underline cursor-pointer"
          >
            {isLoginMode ? "회원가입하기" : "로그인 하기."}
          </button>
        </div>
      </div>
    </div>
  );
}
