"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

/**
 * Tooltip Provider 컴포넌트
 *
 * @description
 * - Tooltip 컴포넌트들을 위한 컨텍스트 프로바이더
 * - 전역적으로 툴팁 설정을 관리
 * - delayDuration으로 툴팁 표시 지연 시간 설정 가능
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip 컴포넌트
 *
 * @description
 * - 툴팁 컨테이너 컴포넌트
 * - Radix UI의 Tooltip 프리미티브를 기반으로 구현
 * - 키보드 네비게이션과 접근성 지원
 */
const Tooltip = TooltipPrimitive.Root;

/**
 * Tooltip Trigger 컴포넌트
 *
 * @description
 * - 툴팁을 트리거하는 요소를 감싸는 컴포넌트
 * - 호버나 포커스 시 툴팁 표시
 * - forwardRef로 ref 전달 지원
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Tooltip Content 컴포넌트
 *
 * @description
 * - 실제 툴팁 내용을 표시하는 컴포넌트
 * - 애니메이션과 포지셔닝 자동 처리
 * - 접근성을 위한 적절한 ARIA 속성
 * - forwardRef로 ref 전달 지원
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
