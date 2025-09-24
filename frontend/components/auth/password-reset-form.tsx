"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  passwordResetSchema,
  PasswordResetFormInputs,
  useAuth,
} from "@/hooks/use-auth";

/**
 * PasswordResetForm 컴포넌트
 *
 * @description
 * - 비밀번호 재설정 기능을 제공하는 폼
 * - React Hook Form과 Zod를 사용하여 폼 유효성 검사 및 상태 관리
 * - 새로운 2단 레이아웃에 맞춘 깔끔한 디자인
 * - 목 데이터 기반 비밀번호 재설정 로직 (`useAuth` 훅) 연동
 */
export function PasswordResetForm() {
  const router = useRouter();
  const { resetPassword, loading } = useAuth();
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<PasswordResetFormInputs>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  /**
   * 폼 제출 핸들러
   *
   * @description
   * - 비밀번호 재설정 로직 실행
   * - 성공 시 성공 메시지 표시, 실패 시 에러 메시지 표시
   */
  const onSubmit = async (data: PasswordResetFormInputs) => {
    clearErrors();
    const result = await resetPassword(data);

    if (result.success) {
      setResetSuccess(true);
    } else {
      setError("root.serverError", {
        type: "manual",
        message: result.error || "알 수 없는 오류가 발생했습니다.",
      });
    }
  };

  if (resetSuccess) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="text-3xl text-foreground">
            Reset Password Email Sent
          </h2>
          <p className="text-muted-foreground">
            We&apos;ve sent a password reset link to your email address. Please
            check your inbox.
          </p>
        </div>

        <Button
          onClick={() => router.push("/auth/login")}
          className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer bg-blue-600"
        >
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl text-foreground">Reset Password</h2>
        <p className="text-muted-foreground">
          이메일 주소를 입력하시면 재설정 링크를 보내드립니다.
        </p>
      </div>

      <div className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              placeholder="user@company.com"
              className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-blue-600"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

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
            Send Reset Link
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          비밀번호가 기억 나시나요?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="font-medium text-blue-600 hover:underline cursor-pointer"
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
