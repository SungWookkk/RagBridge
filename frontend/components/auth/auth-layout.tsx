"use client";

import { Brain, Zap, Shield, Database, ArrowLeft } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * AuthLayout 컴포넌트 Props 타입
 *
 * @description
 * - AuthLayout 컴포넌트의 props 타입 정의
 * - children: 렌더링할 자식 요소
 */
interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * AuthLayout 컴포넌트
 *
 * @description
 * - 인증 관련 페이지 (로그인, 회원가입, 비밀번호 재설정)의 공통 레이아웃
 * - 2단 레이아웃: 왼쪽 브랜딩 영역, 오른쪽 폼 영역
 * - 영화 오프닝 크레딧 스타일의 애니메이션 효과
 * - 동적 그림자와 텍스트 애니메이션 포함
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();

  /**
   * 주요 기능 아이콘과 텍스트 (메모이제이션으로 성능 최적화)
   */
  const features = useMemo(
    () => [
      { icon: Brain, text: "고정확도 AI OCR 및 필드 추출", delay: 0.2 },
      { icon: Zap, text: "실시간 스트리밍 문서 처리", delay: 0.4 },
      { icon: Database, text: "RAG 기반 스마트 검색 및 질의응답", delay: 0.6 },
      { icon: Shield, text: "멀티테넌트 SaaS 아키텍처", delay: 0.8 },
    ],
    [],
  );

  /**
   * 메인 타이틀을 단어별로 분할 (동적 애니메이션용)
   */
  const titleWords = useMemo(
    () => [
      { text: "AI", delay: 0.1 },
      { text: "기반", delay: 0.15 },
      { text: "스마트", delay: 0.2 },
      { text: "문서", delay: 0.25 },
      { text: "처리", delay: 0.3 },
    ],
    [],
  );

  const platformWords = useMemo(() => [{ text: "플랫폼", delay: 0.35 }], []);

  /**
   * 서브타이틀을 단어별로 분할
   */
  const subtitleWords = useMemo(
    () => [
      { text: "문서", delay: 0.5 },
      { text: "업로드부터", delay: 0.55 },
      { text: "OCR,", delay: 0.6 },
      { text: "검증,", delay: 0.65 },
      { text: "RAG", delay: 0.7 },
      { text: "검색까지", delay: 0.75 },
      { text: "모든", delay: 0.8 },
      { text: "과정을", delay: 0.85 },
      { text: "자동화하고", delay: 0.9 },
      { text: "최적화하세요.", delay: 0.95 },
    ],
    [],
  );

  /**
   * 메인페이지로 이동하는 함수
   */
  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* 왼쪽 브랜딩 영역 (데스크톱에서만 표시) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white">
        {/* 동적 배경 요소들 (성능 최적화: will-change 사용) */}
        <div className="absolute inset-0">
          {/* 움직이는 그라데이션 원들 */}
          <motion.div
            className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 blur-3xl"
            style={{ willChange: "transform" }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 15, 0],
              scale: [1, 1.05, 0.95, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full opacity-25 blur-3xl"
            style={{ willChange: "transform" }}
            animate={{
              x: [0, -25, 20, 0],
              y: [0, 25, -15, 0],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full px-16 py-12">
          {/* 상단 네비게이션 및 로고 - 영화 크레딧 스타일 */}
          <div className="flex flex-col items-center space-y-4">
            {/* 메인페이지 이동 버튼 */}
            <motion.div
              className="self-start"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoHome}
                className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                메인으로 돌아가기
              </Button>
            </motion.div>

            {/* 로고 */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: -50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            >
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-lg"
                animate={{
                  rotateY: [0, 360],
                  boxShadow: [
                    "0 4px 15px rgba(59, 130, 246, 0.3)",
                    "0 8px 25px rgba(147, 51, 234, 0.4)",
                    "0 4px 15px rgba(59, 130, 246, 0.3)",
                  ],
                }}
                transition={{
                  rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
                  boxShadow: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <Brain className="w-4 h-4 text-white" />
              </motion.div>
              <motion.h1
                className="text-xl font-semibold text-gray-900"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                RagBridge
              </motion.h1>
            </motion.div>
          </div>

          {/* 중앙 콘텐츠 - 영화 크레딧 스타일 */}
          <div className="flex-1 flex flex-col justify-center text-center">
            {/* 메인 타이틀 - 단어별 동적 애니메이션 */}
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="text-5xl font-bold text-gray-900 leading-tight mb-4">
                {/* 첫 번째 줄: "AI 기반 스마트" */}
                <div className="flex flex-wrap justify-center gap-2">
                  {titleWords.map((word, index) => (
                    <motion.span
                      key={index}
                      className="inline-block"
                      initial={{
                        opacity: 0,
                        y: 50,
                        rotateX: -90,
                        textShadow: "0 0 0px rgba(0,0,0,0)",
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        textShadow: [
                          "2px 2px 4px rgba(0,0,0,0.1)",
                          "4px 4px 8px rgba(59, 130, 246, 0.2)",
                          "2px 2px 4px rgba(0,0,0,0.1)",
                        ],
                      }}
                      transition={{
                        duration: 0.8,
                        delay: word.delay,
                        ease: "easeOut",
                      }}
                      style={{
                        background:
                          "linear-gradient(135deg, #1f2937 0%, #374151 50%, #4f46e5 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {word.text}
                    </motion.span>
                  ))}
                </div>

                {/* 두 번째 줄: "문서 처리" (특별 강조) */}
                <div className="flex justify-center">
                  <motion.span
                    className="text-6xl inline-block"
                    initial={{
                      opacity: 0,
                      y: 50,
                      rotateX: -90,
                      textShadow: "0 0 0px rgba(0,0,0,0)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      textShadow: [
                        "3px 3px 6px rgba(0,0,0,0.2)",
                        "6px 6px 12px rgba(147, 51, 234, 0.4)",
                        "3px 3px 6px rgba(0,0,0,0.2)",
                      ],
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.4,
                      ease: "easeOut",
                    }}
                    style={{
                      background:
                        "linear-gradient(135deg, #1f2937 0%, #374151 50%, #8b5cf6 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    문서 처리
                  </motion.span>
                </div>

                {/* 세 번째 줄: "플랫폼" */}
                <div className="flex justify-center">
                  {platformWords.map((word, index) => (
                    <motion.span
                      key={index}
                      className="inline-block"
                      initial={{
                        opacity: 0,
                        y: 50,
                        rotateX: -90,
                        textShadow: "0 0 0px rgba(0,0,0,0)",
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        textShadow: [
                          "2px 2px 4px rgba(0,0,0,0.1)",
                          "4px 4px 8px rgba(59, 130, 246, 0.2)",
                          "2px 2px 4px rgba(0,0,0,0.1)",
                        ],
                      }}
                      transition={{
                        duration: 0.8,
                        delay: word.delay,
                        ease: "easeOut",
                      }}
                      style={{
                        background:
                          "linear-gradient(135deg, #1f2937 0%, #374151 50%, #4f46e5 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {word.text}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* 서브타이틀 - 단어별 동적 애니메이션 */}
            <div className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              <div className="flex flex-wrap justify-center gap-1">
                {subtitleWords.map((word, index) => (
                  <motion.span
                    key={index}
                    className="inline-block"
                    initial={{
                      opacity: 0,
                      y: 20,
                      textShadow: "0 0 0px rgba(0,0,0,0)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      textShadow: [
                        "1px 1px 2px rgba(0,0,0,0.05)",
                        "2px 2px 4px rgba(0,0,0,0.1)",
                        "1px 1px 2px rgba(0,0,0,0.05)",
                      ],
                    }}
                    transition={{
                      duration: 0.6,
                      delay: word.delay,
                      ease: "easeOut",
                    }}
                  >
                    {word.text}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* 주요 기능 목록 - 순차적 애니메이션 (성능 최적화) */}
            <div className="space-y-6 max-w-lg mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center text-gray-700"
                  initial={{ opacity: 0, x: -100, rotateY: -45 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: feature.delay,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    x: 10,
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                >
                  <motion.div
                    className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg"
                    style={{ willChange: "transform" }}
                    animate={{
                      rotate: [0, 360],
                      boxShadow: [
                        "0 4px 15px rgba(59, 130, 246, 0.3)",
                        "0 8px 25px rgba(147, 51, 234, 0.4)",
                        "0 4px 15px rgba(59, 130, 246, 0.3)",
                      ],
                    }}
                    transition={{
                      rotate: {
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      boxShadow: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <feature.icon className="w-4 h-4 text-white" />
                  </motion.div>
                  <motion.span
                    className="text-lg font-medium"
                    animate={{
                      textShadow: [
                        "1px 1px 2px rgba(0,0,0,0.1)",
                        "2px 2px 4px rgba(59, 130, 246, 0.2)",
                        "1px 1px 2px rgba(0,0,0,0.1)",
                      ],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: feature.delay,
                    }}
                  >
                    {feature.text}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 하단 저작권 - 페이드인 애니메이션 */}
          <motion.div
            className="flex justify-between items-center text-gray-500 text-sm max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <motion.span
              animate={{
                textShadow: [
                  "1px 1px 2px rgba(0,0,0,0.05)",
                  "2px 2px 4px rgba(0,0,0,0.1)",
                  "1px 1px 2px rgba(0,0,0,0.05)",
                ],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Copyright © 2025 RagBridge. All rights reserved.
            </motion.span>
            <motion.span
              className="cursor-pointer hover:text-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              animate={{
                textShadow: [
                  "1px 1px 2px rgba(0,0,0,0.05)",
                  "2px 2px 4px rgba(0,0,0,0.1)",
                  "1px 1px 2px rgba(0,0,0,0.05)",
                ],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Privacy Policy
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* 오른쪽 폼 영역 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* 모바일 네비게이션 및 로고 (데스크톱에서는 숨김) */}
          <div className="lg:hidden">
            {/* 모바일 메인페이지 이동 버튼 */}
            <div className="mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoHome}
                className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                메인으로 돌아가기
              </Button>
            </div>

            {/* 모바일 로고 */}
            <div className="text-center mb-8">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3 bg-gradient-to-br from-blue-600 to-purple-600">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">
                RagBridge
              </h1>
            </div>
          </div>

          {/* 폼 콘텐츠 */}
          {children}
        </div>
      </div>
    </div>
  );
}
