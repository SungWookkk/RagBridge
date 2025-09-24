"use client";

import { motion } from "framer-motion";
import {
  Layers,
  Plus,
  Brain,
  Cpu,
  Shield,
  Settings,
  Activity,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWorkspaces } from "@/hooks/use-workspaces";

/**
 * 프로젝트 관리 컴포넌트
 *
 * @description
 * - 팀별 문서 프로젝트 생성 및 관리
 * - AI 모델 설정 및 성능 모니터링
 * - 권한 관리 및 사용량 분석
 * - 성능 최적화를 위한 컴포넌트 분리
 */
export function ProjectManagement() {
  const { workspaces, isLoading, refetch } = useWorkspaces();

  /**
   * 워크스페이스 목록 새로고침 핸들러
   *
   * @description
   * - 사용자가 수동으로 프로젝트 목록을 새로고침할 때 사용
   * - 실시간 업데이트가 필요한 상황에서 호출
   */
  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Layers className="h-8 w-8" />
                <h2 className="text-3xl font-bold">문서 프로젝트 관리</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                팀별 문서 프로젝트를 생성하고 AI 모델을 관리하세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="w-fit rounded-2xl bg-white text-indigo-700 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />새 프로젝트
              </Button>
              <Button
                variant="outline"
                className="w-fit rounded-2xl bg-white/20 text-white border-white/30 hover:bg-white/30"
                onClick={handleRefresh}
              >
                <Activity className="mr-2 h-4 w-4" />
                새로고침
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 프로젝트 그리드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? // 로딩 상태
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="rounded-3xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-32" />
                    </div>
                    <div className="h-6 bg-muted rounded-full animate-pulse w-16" />
                  </div>
                  <div className="h-3 bg-muted rounded animate-pulse w-full" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                      <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                      <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          : workspaces.map((workspace) => (
              <motion.div
                key={workspace.id}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="overflow-hidden rounded-3xl border hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">
                          {workspace.name}
                        </CardTitle>
                      </div>
                      <Badge
                        variant="outline"
                        className={`rounded-xl ${
                          workspace.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : workspace.status === "training"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {workspace.status === "active"
                          ? "활성"
                          : workspace.status === "training"
                            ? "학습중"
                            : "유지보수"}
                      </Badge>
                    </div>
                    <CardDescription>{workspace.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* AI 모델 정보 */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-primary" />
                        <span>AI 모델</span>
                      </div>
                      <Badge variant="outline" className="rounded-lg text-xs">
                        {workspace.aiModel}
                      </Badge>
                    </div>

                    {/* 처리 통계 */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">문서</span>
                          <span className="font-medium">
                            {workspace.documents}개
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">처리됨</span>
                          <span className="font-medium text-green-600">
                            {workspace.processedDocuments}개
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">질의</span>
                          <span className="font-medium">
                            {workspace.totalQueries.toLocaleString()}회
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            응답시간
                          </span>
                          <span className="font-medium text-blue-600">
                            {workspace.avgResponseTime}초
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 검증 룰 수 */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>검증 룰</span>
                      </div>
                      <Badge variant="outline" className="rounded-lg">
                        {workspace.validationRules}개
                      </Badge>
                    </div>

                    {/* 마지막 활동 */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">마지막 활동</span>
                      <span className="font-medium">
                        {workspace.lastActivity}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button variant="secondary" className="flex-1 rounded-2xl">
                      <Brain className="mr-2 h-4 w-4" />
                      스마트 검색 열기
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-2xl"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
