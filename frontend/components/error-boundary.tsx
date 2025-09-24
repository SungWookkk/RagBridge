"use client";

import { Component, ReactNode } from "react";
import { motion } from "framer-motion";
import { RefreshCw, AlertTriangle, Home, Bug } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * 에러 바운더리 Props 타입 정의
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 에러 바운더리 State 타입 정의
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * React Error Boundary 컴포넌트
 *
 * @description
 * - 런타임 JavaScript 에러를 포착하여 UI 대체
 * - 사용자에게 친화적인 에러 메시지 제공
 * - 에러 정보를 콘솔에 로깅하여 디버깅 지원
 * - 페이지 새로고침 및 메인 페이지 이동 기능
 * - 개발 환경에서 상세 에러 정보 표시
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * 에러 발생 시 상태 업데이트
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  /**
   * 에러 정보 수집 및 로깅
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // 실제 운영 환경에서는 에러 추적 서비스로 전송
    // 예: Sentry.captureException(error, { extra: errorInfo })
  }

  /**
   * 에러 상태 초기화
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * 페이지 새로고침
   */
  handleRefresh = () => {
    window.location.reload();
  };

  /**
   * 메인 페이지로 이동
   */
  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 fallback UI가 제공된 경우 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          {/* 배경 애니메이션 */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>

          {/* 메인 콘텐츠 */}
          <motion.div
            className="relative z-10 w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-4">
                <motion.div
                  className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.3,
                  }}
                >
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                </motion.div>

                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  예상치 못한 오류가 발생했습니다
                </CardTitle>

                <CardDescription className="text-lg text-gray-600">
                  시스템에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* 에러 정보 (개발 환경에서만 표시) */}
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Bug className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        개발자 정보
                      </span>
                    </div>
                    <details className="text-sm">
                      <summary className="cursor-pointer text-gray-600 hover:text-gray-800 mb-2">
                        에러 상세 정보 보기
                      </summary>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                        {this.state.error.toString()}
                        {this.state.errorInfo && (
                          <>
                            {"\n\n"}
                            {this.state.errorInfo.componentStack}
                          </>
                        )}
                      </pre>
                    </details>
                  </div>
                )}

                {/* 액션 버튼들 */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={this.handleReset}
                    className="w-full sm:w-auto"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    다시 시도
                  </Button>

                  <Button
                    variant="outline"
                    onClick={this.handleRefresh}
                    className="w-full sm:w-auto"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    페이지 새로고침
                  </Button>

                  <Button
                    variant="outline"
                    onClick={this.handleGoHome}
                    className="w-full sm:w-auto"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    메인 페이지로
                  </Button>
                </div>

                {/* 도움말 정보 */}
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-3">
                    문제가 지속되면 다음을 시도해 보세요:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="outline">브라우저 새로고침</Badge>
                    <Badge variant="outline">캐시 삭제</Badge>
                    <Badge variant="outline">다른 브라우저 사용</Badge>
                    <Badge variant="outline">고객 지원 문의</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 글로벌 에러 바운더리 HOC
 *
 * @description
 * - 컴포넌트를 에러 바운더리로 감싸는 고차 컴포넌트
 * - 특정 컴포넌트에만 에러 바운더리를 적용할 때 사용
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
