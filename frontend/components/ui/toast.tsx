"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Toast 변형 타입 정의
 *
 * @description
 * - 토스트 알림의 시각적 스타일을 정의하는 타입
 * - success, error, warning, info 네 가지 변형 제공
 * - 각 변형별로 아이콘과 색상이 다름
 */
export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

/**
 * Toast 데이터 구조 정의
 *
 * @description
 * - 토스트 알림에 필요한 모든 데이터를 포함하는 인터페이스
 * - id: 고유 식별자 (자동 생성)
 * - variant: 시각적 스타일 변형
 * - title: 토스트 제목 (선택적)
 * - description: 토스트 설명 메시지
 * - duration: 표시 시간 (밀리초, 기본 5초)
 * - action: 액션 버튼 (선택적)
 */
export interface ToastData {
  id: string;
  variant: ToastVariant;
  title?: string;
  description?: string;
  duration?: number;
  action?: React.ReactNode;
}

/**
 * Toast 컨텍스트 타입 정의
 *
 * @description
 * - Toast 상태와 제어 함수들을 제공하는 컨텍스트
 * - toasts: 현재 표시 중인 토스트 목록
 * - toast: 새 토스트 추가 함수
 * - dismiss: 특정 토스트 제거 함수
 * - dismissAll: 모든 토스트 제거 함수
 */
interface ToastContextType {
  toasts: ToastData[];
  toast: (toast: Omit<ToastData, "id">) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

/**
 * Toast 컨텍스트 생성
 *
 * @description
 * - React.createContext로 Toast 상태 관리 컨텍스트 생성
 * - 기본값으로 빈 배열과 빈 함수들 제공
 */
const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined,
);

/**
 * Toast 변형별 스타일과 아이콘 정의
 *
 * @description
 * - 각 Toast 변형에 대한 Tailwind CSS 클래스와 아이콘 매핑
 * - variantStyles: 배경색, 테두리색, 텍스트색 정의
 * - variantIcons: 각 변형에 맞는 Lucide 아이콘 컴포넌트
 */
const variantStyles = {
  default: "border bg-background text-foreground",
  success:
    "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-100",
  error:
    "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/20 dark:text-red-100",
  warning:
    "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-100",
  info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-100",
};

const variantIcons = {
  default: null,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

/**
 * Toast Provider 컴포넌트
 *
 * @description
 * - Toast 상태를 관리하는 컨텍스트 프로바이더
 * - useState로 toasts 배열 상태 관리
 * - toast: 새 토스트 추가 (고유 ID 자동 생성)
 * - dismiss: 특정 토스트 제거
 * - dismissAll: 모든 토스트 제거
 * - 자동 제거를 위한 useEffect 타이머 관리
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  /**
   * 새 토스트 추가 함수
   *
   * @param toast - 추가할 토스트 데이터 (id 제외)
   * @description
   * - 고유 ID를 crypto.randomUUID()로 생성
   * - 기본 duration 5초 설정
   * - 기존 toasts 배열에 새 토스트 추가
   */
  const toast = React.useCallback((toast: Omit<ToastData, "id">) => {
    const id = crypto.randomUUID();
    const newToast: ToastData = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  /**
   * 특정 토스트 제거 함수
   *
   * @param id - 제거할 토스트의 ID
   * @description
   * - 해당 ID를 가진 토스트를 배열에서 필터링하여 제거
   */
  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * 모든 토스트 제거 함수
   *
   * @description
   * - toasts 배열을 빈 배열로 초기화
   */
  const dismissAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  /**
   * 자동 토스트 제거 효과
   *
   * @description
   * - 각 토스트의 duration이 지나면 자동으로 제거
   * - setTimeout으로 타이머 설정하고 cleanup에서 clearTimeout
   * - duration이 0인 경우 자동 제거하지 않음
   */
  React.useEffect(() => {
    const timers = toasts.map((toast) => {
      if (toast.duration && toast.duration > 0) {
        return setTimeout(() => {
          dismiss(toast.id);
        }, toast.duration);
      }
      return null;
    });

    return () => {
      timers.forEach((timer) => timer && clearTimeout(timer));
    };
  }, [toasts, dismiss]);

  const contextValue = React.useMemo(
    () => ({
      toasts,
      toast,
      dismiss,
      dismissAll,
    }),
    [toasts, toast, dismiss, dismissAll],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

/**
 * Toast 훅
 *
 * @description
 * - Toast 컨텍스트를 사용하기 위한 커스텀 훅
 * - 컨텍스트가 없으면 에러 throw
 * - toast, dismiss, dismissAll 함수들을 반환
 */
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

/**
 * Toast Viewport 컴포넌트
 *
 * @description
 * - 토스트들이 표시될 컨테이너 영역
 * - 화면 우상단에 고정 위치
 * - 반응형 디자인으로 모바일에서는 상단, 데스크톱에서는 우하단
 * - z-index 100으로 다른 요소들 위에 표시
 * - ToastProvider 내부에서 직접 toasts 배열과 dismiss 함수를 받아서 렌더링
 */
const ToastViewport: React.FC<{
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

/**
 * 개별 Toast 아이템 컴포넌트
 *
 * @description
 * - 실제 토스트 알림을 렌더링하는 컴포넌트
 * - variant에 따른 스타일과 아이콘 적용
 * - 애니메이션 효과와 호버 시 닫기 버튼 표시
 * - 접근성을 위한 ARIA 속성 포함
 */
const ToastItem: React.FC<{
  toast: ToastData;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLeaving, setIsLeaving] = React.useState(false);
  const Icon = variantIcons[toast.variant];

  /**
   * 토스트 표시 애니메이션 효과
   *
   * @description
   * - 컴포넌트 마운트 시 약간의 지연 후 isVisible을 true로 설정
   * - CSS transition으로 슬라이드 인 애니메이션 구현
   */
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  /**
   * 토스트 제거 함수
   *
   * @description
   * - isLeaving 상태를 true로 설정하여 애니메이션 시작
   * - 300ms 후 실제로 토스트를 제거
   */
  const handleDismiss = React.useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }, [onDismiss, toast.id]);

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all duration-300 ease-in-out",
        variantStyles[toast.variant],
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0",
        isLeaving && "translate-x-full opacity-0",
      )}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start space-x-3 flex-1">
        {Icon && (
          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
        )}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <div className="text-sm font-semibold mb-1">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm opacity-90">{toast.description}</div>
          )}
        </div>
      </div>

      {toast.action && <div className="flex-shrink-0">{toast.action}</div>}

      <button
        onClick={handleDismiss}
        className={cn(
          "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
          toast.variant === "error" &&
            "text-red-300 hover:text-red-50 focus:ring-red-400",
          toast.variant === "warning" &&
            "text-yellow-300 hover:text-yellow-50 focus:ring-yellow-400",
          toast.variant === "success" &&
            "text-green-300 hover:text-green-50 focus:ring-green-400",
          toast.variant === "info" &&
            "text-blue-300 hover:text-blue-50 focus:ring-blue-400",
        )}
        aria-label="토스트 닫기"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

/**
 * Toast Action 컴포넌트
 *
 * @description
 * - 토스트 내부에 액션 버튼을 추가할 때 사용
 * - 기본 스타일링과 호버/포커스 효과 포함
 * - destructive 변형에 대한 특별한 스타일링
 */
export const ToastAction: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
};

// 타입 내보내기
export type ToastProps = ToastData;
export type ToastActionElement = React.ReactElement<typeof ToastAction>;
