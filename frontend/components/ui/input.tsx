"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input 컴포넌트 Props 타입
 *
 * @description
 * - Input 컴포넌트의 props 타입 정의
 * - HTML input 요소의 기본 속성들 상속
 * - 추가적인 스타일링을 위한 className prop 포함
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Input 컴포넌트
 *
 * @description
 * - 사용자 입력을 받는 텍스트 입력 필드 컴포넌트
 * - 다양한 input 타입 지원 (text, email, password 등)
 * - 접근성을 위한 적절한 스타일링과 포커스 표시
 * - forwardRef로 ref 전달 지원하여 폼 라이브러리와 호환
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
