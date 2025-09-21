"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Card 컴포넌트
 * 
 * @description
 * - 콘텐츠를 그룹화하고 시각적으로 구분하는 컨테이너 컴포넌트
 * - 그림자와 테두리로 카드 형태의 레이아웃 제공
 * - 다양한 크기와 스타일 변형 지원
 * - forwardRef로 ref 전달 지원
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

/**
 * Card Header 컴포넌트
 * 
 * @description
 * - Card의 상단 헤더 영역을 담당하는 컴포넌트
 * - 제목과 설명을 포함하는 영역
 * - 적절한 패딩과 간격으로 레이아웃 구성
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * Card Title 컴포넌트
 * 
 * @description
 * - Card의 제목을 표시하는 컴포넌트
 * - 적절한 폰트 크기와 가중치로 제목 스타일링
 * - 접근성을 위한 시맨틱 마크업
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/**
 * Card Description 컴포넌트
 * 
 * @description
 * - Card의 설명 텍스트를 표시하는 컴포넌트
 * - 제목 아래에 배치되는 부가 정보
 * - 적절한 색상과 크기로 가독성 확보
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * Card Content 컴포넌트
 * 
 * @description
 * - Card의 메인 콘텐츠 영역을 담당하는 컴포넌트
 * - 헤더와 푸터 사이의 주요 내용을 포함
 * - 적절한 패딩으로 콘텐츠와 경계 구분
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/**
 * Card Footer 컴포넌트
 * 
 * @description
 * - Card의 하단 푸터 영역을 담당하는 컴포넌트
 * - 액션 버튼이나 추가 정보를 포함하는 영역
 * - 상단 패딩 제거로 헤더와 구분
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
