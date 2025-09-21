"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Button 변형 스타일 정의
 * 
 * @description
 * - Button 컴포넌트의 다양한 시각적 변형과 크기를 정의
 * - variant: default, destructive, outline, secondary, ghost, link
 * - size: default, sm, lg, icon
 * - 각 변형별로 배경색, 텍스트색, 호버 효과, 포커스 효과 정의
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button 컴포넌트 Props 타입
 * 
 * @description
 * - Button 컴포넌트의 props 타입 정의
 * - VariantProps를 통해 buttonVariants의 variant, size 속성 자동 추론
 * - asChild prop으로 Slot 컴포넌트 사용 가능
 * - HTML button 요소의 기본 속성들 상속
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * Button 컴포넌트
 * 
 * @description
 * - 사용자 인터랙션을 위한 버튼 컴포넌트
 * - 다양한 변형과 크기로 다양한 용도에 활용 가능
 * - asChild prop으로 다른 컴포넌트로 렌더링 가능 (예: Link)
 * - 접근성을 위한 키보드 네비게이션과 포커스 표시
 * - forwardRef로 ref 전달 지원
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
