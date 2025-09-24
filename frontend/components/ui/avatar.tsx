"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

/**
 * Avatar 컴포넌트
 *
 * @description
 * - 사용자 프로필 이미지를 표시하는 컴포넌트
 * - Radix UI의 Avatar 프리미티브를 기반으로 구현
 * - 이미지 로드 실패 시 fallback 텍스트 표시
 * - 다양한 크기와 스타일 변형 지원
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

/**
 * Avatar Image 컴포넌트
 *
 * @description
 * - 실제 프로필 이미지를 렌더링하는 컴포넌트
 * - 이미지 로드 실패 시 자동으로 AvatarFallback으로 전환
 * - alt 속성으로 접근성 지원
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

/**
 * Avatar Fallback 컴포넌트
 *
 * @description
 * - 이미지 로드 실패 시 표시되는 대체 컴포넌트
 * - 일반적으로 사용자 이름의 첫 글자나 이니셜 표시
 * - 배경색과 텍스트 색상으로 구분 가능
 */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
