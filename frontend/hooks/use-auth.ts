"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

/**
 * 사용자 정보 스키마
 *
 * @description
 * - 기본 사용자 정보와 메타데이터를 포함
 * - createdAt: 계정 생성 시간
 * - lastLoginAt: 마지막 로그인 시간 (선택적)
 */
export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3, "사용자 이름은 3자 이상이어야 합니다."),
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  role: z.enum(["user", "admin"]),
  avatar: z.string().optional(),
  createdAt: z.string().optional(),
  lastLoginAt: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;

/**
 * 로그인 폼 스키마
 */
export const loginSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
  rememberMe: z.boolean().optional(),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

/**
 * 회원가입 폼 스키마
 */
export const registerSchema = z
  .object({
    username: z.string().min(3, "사용자 이름은 3자 이상이어야 합니다."),
    email: z.string().email("유효한 이메일 주소를 입력해주세요."),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
    confirmPassword: z
      .string()
      .min(6, "비밀번호 확인은 6자 이상이어야 합니다."),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "약관에 동의해야 합니다.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type RegisterFormInputs = z.infer<typeof registerSchema>;

/**
 * 비밀번호 재설정 폼 스키마
 */
export const passwordResetSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
});

export type PasswordResetFormInputs = z.infer<typeof passwordResetSchema>;

/**
 * 인증 관련 타입 정의 (레거시 호환성)
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

/**
 * 인증 상태 관리 훅
 *
 * @description
 * - 사용자 로그인, 회원가입, 로그아웃 기능 제공
 * - 목 데이터 기반으로 구현 (실제 API 연동 전)
 * - 로컬 스토리지 기반 세션 관리
 * - 에러 처리 및 로딩 상태 관리
 */
export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * 로그인 함수
   *
   * @description
   * - 이메일과 비밀번호로 사용자 인증
   * - 목 데이터에서 사용자 정보 확인
   * - 로그인 성공 시 토큰과 사용자 정보 저장
   */
  const login = async (
    credentials: LoginCredentials,
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 실제 API 호출로 교체
      // const response = await api.post('/auth/login', credentials)

      // 목 데이터 기반 로그인 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 샘플 사용자 데이터 (실제로는 API에서 받아옴)
      const mockUser: User = {
        id: "1",
        email: credentials.email,
        username: credentials.email.split("@")[0],
        role: credentials.email === "admin@ragbridge.com" ? "admin" : "user",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      // 로컬 스토리지에 사용자 정보 저장
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", "mock-jwt-token");

      if (credentials.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      setUser(mockUser);

      // 대시보드로 리다이렉트
      router.push("/dashboard");

      return {
        success: true,
        user: mockUser,
        token: "mock-jwt-token",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "로그인 중 오류가 발생했습니다.";

      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 회원가입 함수
   *
   * @description
   * - 새로운 사용자 계정 생성
   * - 이메일 중복 확인 (목 데이터 기반)
   * - 비밀번호 확인 검증
   * - 약관 동의 확인
   */
  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // 비밀번호 확인 검증
      if (data.password !== data.confirmPassword) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }

      // 약관 동의 확인
      if (!data.agreeToTerms) {
        throw new Error("약관에 동의해야 합니다.");
      }

      // TODO: 실제 API 호출로 교체
      // const response = await api.post('/auth/register', data)

      // 목 데이터 기반 회원가입 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 샘플 사용자 데이터 생성
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        username: data.username,
        role: "user",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
        createdAt: new Date().toISOString(),
      };

      // 로컬 스토리지에 사용자 정보 저장
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", "mock-jwt-token");

      setUser(newUser);

      // 대시보드로 리다이렉트
      router.push("/dashboard");

      return {
        success: true,
        user: newUser,
        token: "mock-jwt-token",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다.";

      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그아웃 함수
   *
   * @description
   * - 사용자 세션 종료
   * - 로컬 스토리지에서 사용자 정보 제거
   * - 로그인 페이지로 리다이렉트
   */
  const logout = async (): Promise<void> => {
    try {
      // TODO: 실제 API 호출로 교체
      // await api.post('/auth/logout')

      // 로컬 스토리지에서 사용자 정보 제거
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("rememberMe");

      setUser(null);
      setError(null);

      // 로그인 페이지로 리다이렉트
      router.push("/auth/login");
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
    }
  };

  /**
   * 현재 사용자 정보 가져오기
   *
   * @description
   * - 로컬 스토리지에서 사용자 정보 확인
   * - 앱 초기화 시 호출
   */
  const getCurrentUser = (): User | null => {
    if (typeof window === "undefined") return null;

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error("사용자 정보 불러오기 오류:", error);
    }

    return null;
  };

  /**
   * 비밀번호 재설정 요청
   *
   * @description
   * - 이메일로 비밀번호 재설정 링크 전송
   * - 목 데이터 기반으로 구현
   */
  const requestPasswordReset = async (email: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 실제 API 호출로 교체
      // await api.post('/auth/password-reset', { email })

      // 목 데이터 기반 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "비밀번호 재설정 요청 중 오류가 발생했습니다.";

      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 비밀번호 재설정 함수 (새로운 폼에서 사용)
   *
   * @description
   * - 비밀번호 재설정 폼에서 사용하는 래퍼 함수
   * - PasswordResetFormInputs 타입을 받아서 처리
   */
  const resetPassword = async (
    data: PasswordResetFormInputs,
  ): Promise<AuthResponse> => {
    return requestPasswordReset(data.email);
  };

  return {
    // 상태
    user,
    isLoading,
    loading: isLoading, // 호환성을 위한 별칭
    error,

    // 함수
    login,
    register,
    logout,
    getCurrentUser,
    requestPasswordReset,
    resetPassword, // 새로운 폼에서 사용하는 메서드
  };
}
