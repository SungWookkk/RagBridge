"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck,
  Brain,
  Layers,
  Activity,
  BarChart3,
  Upload,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 사용자 중심 컴포넌트들
import { UserFocusedHero } from "./dashboard/user-focused-hero";
import { UserTaskQueue } from "./dashboard/user-task-queue";
import { AIFeedbackBoard } from "./dashboard/ai-feedback-board";
import { UsageBillingSnapshot } from "./dashboard/usage-billing-snapshot";

// 기존 컴포넌트들
import { DashboardOverview } from "./dashboard/dashboard-overview";
import { DocumentManagement } from "./documents/document-management";
import { SmartSearch } from "./search/smart-search";
import { ProjectManagement } from "./projects/project-management";
import { SystemMonitoring } from "./monitoring/system-monitoring";

/**
 * RagBridge 메인 대시보드 컴포넌트
 *
 * @description
 * - 사용자 중심의 대시보드 인터페이스
 * - 기존 컴포넌트들을 조합하여 구성
 * - 기술 용어보다는 사용자 가치 중심의 플로우 제공
 * - Slim Wrapper 패턴으로 유지보수성 향상
 */
export function RagBridgeDashboard() {
  // 활성 탭 상태 관리
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="w-full">
            <Tabs
        defaultValue="overview"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
        {/* 사용자 중심 탭 헤더 */}
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <TabsList className="grid w-full max-w-[800px] grid-cols-5 rounded-2xl p-1">
                  <TabsTrigger
              value="overview"
                    className="rounded-xl flex items-center gap-2"
                  >
              <Activity className="h-4 w-4" />
              대시보드
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="rounded-xl flex items-center gap-2"
                  >
                    <FileCheck className="h-4 w-4" />
              문서 관리
                  </TabsTrigger>
                  <TabsTrigger
              value="search"
                    className="rounded-xl flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    스마트 검색
                  </TabsTrigger>
                  <TabsTrigger
              value="projects"
                    className="rounded-xl flex items-center gap-2"
                  >
                    <Layers className="h-4 w-4" />
                    프로젝트
                  </TabsTrigger>
                  <TabsTrigger
                    value="monitoring"
                    className="rounded-xl flex items-center gap-2"
                  >
              <BarChart3 className="h-4 w-4" />
              시스템 현황
                  </TabsTrigger>
                </TabsList>
          
          {/* 빠른 액션 버튼들 */}
                <div className="hidden md:flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    문서 업로드
                  </Button>
                  <Button className="rounded-2xl bg-gradient-to-r from-green-600 to-blue-600">
              <Sparkles className="mr-2 h-4 w-4" />
              새 프로젝트
                  </Button>
                </div>
              </div>

        {/* 탭 콘텐츠 */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
            {/* 사용자 중심 대시보드 */}
            <TabsContent value="overview" className="space-y-8 mt-0">
              <UserFocusedHero />
              <UserTaskQueue />
              <AIFeedbackBoard />
              <UsageBillingSnapshot />
                  </TabsContent>

            {/* 문서 관리 */}
                  <TabsContent value="documents" className="space-y-8 mt-0">
              <DocumentManagement />
                  </TabsContent>

            {/* 스마트 검색 */}
            <TabsContent value="search" className="space-y-8 mt-0">
              <SmartSearch />
                  </TabsContent>

            {/* 프로젝트 관리 */}
            <TabsContent value="projects" className="space-y-8 mt-0">
              <ProjectManagement />
                  </TabsContent>

            {/* 시스템 모니터링 */}
            <TabsContent value="monitoring" className="space-y-8 mt-0">
              <SystemMonitoring />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
        </div>
  );
}
