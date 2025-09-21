"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Badge 변형 스타일 정의
 * 
 * @description
 * - Badge 컴포넌트의 다양한 시각적 변형을 정의
 * - default, secondary, destructive, outline 네 가지 변형 제공
 * - 각 변형별로 배경색, 텍스트색, 테두리색 정의
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Badge 컴포넌트 Props 타입
 * 
 * @description
 * - Badge 컴포넌트의 props 타입 정의
 * - VariantProps를 통해 badgeVariants의 variant 속성 자동 추론
 * - HTML div 요소의 기본 속성들 상속
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge 컴포넌트
 * 
 * @description
 * - 상태나 카테고리를 표시하는 작은 라벨 컴포넌트
 * - 다양한 변형과 색상으로 정보를 시각적으로 구분
 * - 접근성을 위한 적절한 색상 대비와 포커스 표시
 * - forwardRef로 ref 전달 지원
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
