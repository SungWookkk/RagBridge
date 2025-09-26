"use client";

import { motion } from "framer-motion";
import {
  Upload,
  Brain,
  CheckCircle,
  Clock,
  Users,
  Bell,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 사용자 중심 Hero 섹션 컴포넌트
 *
 * @description
 * - 신규 사용자 온보딩 체크리스트 제공
 * - 오늘 해야 할 작업 요약 표시
 * - 서비스 업데이트 및 공지사항 배치
 * - 사용자 가치 중심의 CTA 버튼 구성
 */
export function UserFocusedHero() {
  /**
   * 온보딩 체크리스트 데이터
   * - 신규 사용자가 따라야 할 단계별 가이드
   * - 각 단계별 완료 상태를 시각적으로 표시
   */
  const onboardingSteps = [
    {
      id: 1,
      title: "첫 문서 업로드",
      description: "PDF나 이미지를 업로드해보세요",
      completed: true,
      icon: Upload,
    },
    {
      id: 2,
      title: "AI 검색 체험",
      description: "자연어로 질문해보세요",
      completed: true,
      icon: Brain,
    },
    {
      id: 3,
      title: "팀 초대하기",
      description: "동료들과 함께 작업하세요",
      completed: false,
      icon: Users,
    },
    {
      id: 4,
      title: "검증 룰 설정",
      description: "문서 품질을 자동으로 관리하세요",
      completed: false,
      icon: CheckCircle,
    },
  ];

  /**
   * 오늘의 작업 데이터
   * - 사용자가 당일 처리해야 할 우선순위 작업들
   * - 작업 유형별로 분류하여 표시
   */
  const todayTasks = [
    {
      id: 1,
      title: "검토 대기 문서",
      count: 3,
      priority: "high",
      description: "승인이 필요한 문서가 있습니다",
    },
    {
      id: 2,
      title: "재처리 요청",
      count: 1,
      priority: "medium",
      description: "처리 실패한 문서를 다시 처리하세요",
    },
    {
      id: 3,
      title: "팀 피드백",
      count: 2,
      priority: "low",
      description: "동료들의 피드백을 확인하세요",
    },
  ];

  /**
   * 서비스 업데이트 데이터
   * - 최신 기능 업데이트 및 공지사항
   * - 사용자에게 중요한 정보를 우선적으로 표시
   */
  const serviceUpdates = [
    {
      id: 1,
      title: "새로운 AI 모델 출시",
      description: "더 정확한 문서 분석이 가능합니다",
      type: "feature",
      isNew: true,
    },
    {
      id: 2,
      title: "모바일 앱 출시 예정",
      description: "언제 어디서나 문서를 관리하세요",
      type: "announcement",
      isNew: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* 메인 웰컴 섹션 */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 p-8 text-white"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  스마트 문서 처리
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-300/30 rounded-xl">
                  <Clock className="h-3 w-3 mr-1" />
                  실시간 처리 중
                </Badge>
              </div>
              <h2 className="text-3xl font-bold">안녕하세요! 👋</h2>
              <p className="max-w-[600px] text-white/80">
                오늘도 스마트하게 문서를 처리해보세요. AI가 도와드립니다.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="rounded-2xl bg-white text-emerald-700 hover:bg-white/90 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  문서 업로드
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl bg-transparent border-white text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  빠른 검색
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="relative h-40 w-40"
              >
                <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <Brain className="h-16 w-16 text-white/60" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-4 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <CheckCircle className="h-12 w-12 text-white/50" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1.2, 1, 1.2] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-8 rounded-full bg-white/30 flex items-center justify-center"
                >
                  <Sparkles className="h-8 w-8 text-white/40" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 온보딩 체크리스트 및 오늘의 작업 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 온보딩 체크리스트 */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              시작하기 가이드
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {onboardingSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                    step.completed
                      ? "bg-green-50 border border-green-200"
                      : "bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step.completed
                        ? "bg-green-100 text-green-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${step.completed ? "text-green-800" : ""}`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  {!step.completed && (
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* 오늘의 작업 */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              오늘의 작업
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-600"
                        : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <span className="text-sm font-bold">{task.count}</span>
                  </div>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 서비스 업데이트 및 공지사항 */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-600" />
            최신 소식
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {serviceUpdates.map((update) => (
              <div
                key={update.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {update.isNew && (
                    <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                      NEW
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      update.type === "feature"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {update.type === "feature" ? "기능" : "공지"}
                  </Badge>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{update.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {update.description}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
