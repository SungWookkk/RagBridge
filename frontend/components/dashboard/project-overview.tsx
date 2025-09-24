"use client";

import { motion } from "framer-motion";
import { Layers, Brain, Cpu, Shield, Settings } from "lucide-react";

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
 * 프로젝트 개요 컴포넌트
 *
 * @description
 * - 활성 프로젝트들의 요약 정보 표시
 * - AI 모델 상태 및 성능 지표
 * - 빠른 액션 버튼 제공
 */
export function ProjectOverview() {
  const { workspaces, isLoading } = useWorkspaces();

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">문서 프로젝트</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-3xl">
              <CardHeader>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">문서 프로젝트</h2>
        </div>
        <Button variant="ghost" className="rounded-2xl">
          <Layers className="mr-2 h-4 w-4" />
          모든 프로젝트
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.slice(0, 3).map((workspace) => (
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
                    <CardTitle className="text-lg">{workspace.name}</CardTitle>
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
                      <span className="text-muted-foreground">응답시간</span>
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
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button variant="secondary" className="flex-1 rounded-2xl">
                  <Brain className="mr-2 h-4 w-4" />
                  스마트 검색 열기
                </Button>
                <Button variant="outline" size="icon" className="rounded-2xl">
                  <Settings className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
