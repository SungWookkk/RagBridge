"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

/**
 * Tabs 컴포넌트
 *
 * @description
 * - 탭 기반 네비게이션을 제공하는 컨테이너 컴포넌트
 * - Radix UI의 Tabs 프리미티브를 기반으로 구현
 * - 키보드 네비게이션과 접근성 지원
 * - forwardRef로 ref 전달 지원
 */
const Tabs = TabsPrimitive.Root;

/**
 * Tabs List 컴포넌트
 *
 * @description
 * - 탭 버튼들을 포함하는 컨테이너 컴포넌트
 * - 탭 버튼들의 레이아웃과 스타일링 담당
 * - 가로 또는 세로 배치 지원
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * Tabs Trigger 컴포넌트
 *
 * @description
 * - 개별 탭 버튼 컴포넌트
 * - 클릭 시 해당 탭 패널로 전환
 * - 활성 상태에 따른 스타일 변화
 * - 접근성을 위한 적절한 ARIA 속성
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * Tabs Content 컴포넌트
 *
 * @description
 * - 탭 패널의 내용을 담는 컨테이너 컴포넌트
 * - 활성 탭에 해당하는 내용만 표시
 * - 포커스 관리와 접근성 지원
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
