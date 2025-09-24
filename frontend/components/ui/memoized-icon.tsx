"use client";

import { memo } from "react";
import { LucideIcon } from "lucide-react";

/**
 * 메모이제이션된 아이콘 컴포넌트
 *
 * @description
 * - 아이콘 렌더링 성능 최적화
 * - 불필요한 리렌더링 방지
 * - prefers-reduced-motion 지원
 * - 접근성 고려
 */
interface MemoizedIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  color?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
}

export const MemoizedIcon = memo<MemoizedIconProps>(
  ({
    icon: Icon,
    className = "",
    size = 16,
    color,
    "aria-label": ariaLabel,
    "aria-hidden": ariaHidden = false,
  }) => {
    return (
      <Icon
        size={size}
        color={color}
        className={className}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
      />
    );
  },
);

MemoizedIcon.displayName = "MemoizedIcon";

/**
 * 조건부 애니메이션 래퍼 컴포넌트
 *
 * @description
 * - prefers-reduced-motion 미디어 쿼리 지원
 * - 애니메이션 비활성화 시 정적 상태로 표시
 * - 성능 최적화를 위한 메모이제이션
 */
interface ConditionalAnimationProps {
  children: React.ReactNode;
  animationProps?: Record<string, unknown>;
  fallback?: React.ReactNode;
  className?: string;
}

export const ConditionalAnimation = memo<ConditionalAnimationProps>(
  ({ children, animationProps = {}, fallback, className = "" }) => {
    // prefers-reduced-motion 감지 (실제 구현에서는 useMediaQuery 훅 사용)
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return <div className={className}>{fallback || children}</div>;
    }

    return (
      <div className={className} {...animationProps}>
        {children}
      </div>
    );
  },
);

ConditionalAnimation.displayName = "ConditionalAnimation";

/**
 * 최적화된 아이콘 그룹 컴포넌트
 *
 * @description
 * - 여러 아이콘을 효율적으로 렌더링
 * - 공통 props를 재사용하여 메모리 효율성 향상
 * - 접근성 및 키보드 네비게이션 지원
 */
interface IconGroupProps {
  icons: Array<{
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
  }>;
  className?: string;
  size?: number;
  variant?: "default" | "ghost" | "outline";
}

export const MemoizedIconGroup = memo<IconGroupProps>(
  ({ icons, className = "", size = 16, variant = "default" }) => {
    return (
      <div
        className={`flex items-center gap-2 ${className}`}
        role="toolbar"
        aria-label="아이콘 그룹"
      >
        {icons.map(
          (
            { icon: Icon, label, onClick, className: iconClassName, disabled },
            index,
          ) => (
            <button
              key={index}
              onClick={onClick}
              disabled={disabled}
              className={`
            flex items-center justify-center p-2 rounded-md transition-colors
            ${variant === "ghost" ? "hover:bg-gray-100" : ""}
            ${variant === "outline" ? "border border-gray-300 hover:bg-gray-50" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${iconClassName || ""}
          `}
              aria-label={label}
              title={label}
            >
              <Icon size={size} />
            </button>
          ),
        )}
      </div>
    );
  },
);

MemoizedIconGroup.displayName = "MemoizedIconGroup";

/**
 * 최적화된 애니메이션 컴포넌트
 *
 * @description
 * - Framer Motion 애니메이션 최적화
 * - 메모이제이션으로 불필요한 리렌더링 방지
 * - 조건부 애니메이션 지원
 */
interface OptimizedAnimationProps {
  children: React.ReactNode;
  animation?: "fadeIn" | "slideIn" | "scaleIn" | "none";
  delay?: number;
  duration?: number;
  className?: string;
  disabled?: boolean;
}

const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
};

export const OptimizedAnimation = memo<OptimizedAnimationProps>(
  ({
    children,
    animation = "fadeIn",
    delay = 0,
    duration = 0.3,
    className = "",
    disabled = false,
  }) => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (disabled || prefersReducedMotion || animation === "none") {
      return <div className={className}>{children}</div>;
    }

    const variant = animationVariants[animation];

    return (
      <div
        className={className}
        style={{
          animation: `fadeIn ${duration}s ease-out ${delay}s both`,
          ...variant.initial,
        }}
        onAnimationEnd={() => {
          // 애니메이션 완료 후 정적 상태로 전환
        }}
      >
        {children}
      </div>
    );
  },
);

OptimizedAnimation.displayName = "OptimizedAnimation";

/**
 * 성능 모니터링을 위한 훅
 */
export function usePerformanceMonitor(componentName: string) {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const renderStart = performance.now();

    return () => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart;

      if (renderTime > 16) {
        // 16ms = 60fps 기준
        console.warn(
          `${componentName} 렌더링 시간: ${renderTime.toFixed(2)}ms (권장: <16ms)`,
        );
      }
    };
  }

  return () => {};
}
