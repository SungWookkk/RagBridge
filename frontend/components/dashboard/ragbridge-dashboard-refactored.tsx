"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Settings,
  Upload,
  X,
  Activity,
  Workflow,
  Brain,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// 분리된 컴포넌트들 import
import { DashboardHeader } from "./dashboard-header";
import { AnimatedBackground } from "./animated-background";
import { PipelineStatus } from "./pipeline-status";
import { MetricsCards, AdditionalMetrics } from "./metrics-cards";
import { useAuth } from "@/hooks/use-auth";

/**
 * 문서 처리 파이프라인 단계 타입 정의
 */
type PipelineStep =
  | "uploaded"
  | "ocr_processing"
  | "field_extraction"
  | "validation"
  | "embedding"
  | "indexing"
  | "completed"
  | "error";

type StepStatus = "pending" | "processing" | "completed" | "failed";

/**
 * 문서 상태 인터페이스
 */
interface DocumentStatus {
  currentStep: PipelineStep;
  overallProgress: number;
  steps: {
    [key in PipelineStep]: {
      status: StepStatus;
      progress: number;
      startTime?: string;
      endTime?: string;
      error?: string;
    };
  };
}

/**
 * 문서 정보 인터페이스
 */
interface Document {
  id: string;
  name: string;
  tenantId: string;
  status: DocumentStatus;
  fileType: string;
  uploadedAt: string;
  size: string;
  category: string;
  expectedFields: string[];
  extractedFields: Record<string, unknown>;
  validationErrors: string[];
  confidenceScore: number;
  processingTime: number;
}

/**
 * 시스템 메트릭 인터페이스
 */
interface SystemMetrics {
  processedDocuments: number;
  documentGrowth: number;
  avgProcessingTime: number;
  processingTimeImprovement: number;
  modelAccuracy: number;
  accuracyImprovement: number;
  activeStreams: number;
  totalStreams: number;
  successRate: number;
  errorRate: number;
  queueSize: number;
  throughput: string;
}

/**
 * 리팩토링된 RagBridge 대시보드 컴포넌트
 *
 * @description
 * - 기존 1700줄 거대 컴포넌트를 기능별로 분리
 * - 성능 최적화 및 유지보수성 향상
 * - 메모이제이션 및 조건부 렌더링 적용
 * - 접근성 및 사용자 경험 개선
 */
export default function RagBridgeDashboardRefactored() {
  // 인증 상태 관리
  const { user, getCurrentUser } = useAuth();
  const router = useRouter();

  // 상태 관리
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * 인증 상태 확인
   */
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      // 로그인되지 않은 사용자는 로그인 페이지로 리다이렉트
      router.push("/auth/login");
    }
  }, [getCurrentUser, router]);

  /**
   * 인증되지 않은 사용자는 로딩 표시
   */
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 목 데이터 (실제 API 연동 전까지 사용)
  const sampleDocuments: Document[] = [
    {
      id: "1",
      name: "회사 정책서.pdf",
      tenantId: "tenant-001",
      status: {
        currentStep: "completed",
        overallProgress: 100,
        steps: {
          uploaded: { status: "completed", progress: 100 },
          ocr_processing: { status: "completed", progress: 100 },
          field_extraction: { status: "completed", progress: 100 },
          validation: { status: "completed", progress: 100 },
          embedding: { status: "completed", progress: 100 },
          indexing: { status: "completed", progress: 100 },
          completed: { status: "completed", progress: 100 },
          error: { status: "pending", progress: 0 },
        },
      },
      fileType: "PDF",
      uploadedAt: "2시간 전",
      size: "2.4 MB",
      category: "Policy",
      expectedFields: ["제목", "발행일", "부서명"],
      extractedFields: {
        제목: "회사 정책서",
        발행일: "2024-01-15",
        부서명: "인사팀",
      },
      validationErrors: [],
      confidenceScore: 0.95,
      processingTime: 12.5,
    },
  ];

  const sampleMetrics: SystemMetrics = {
    processedDocuments: 1247,
    documentGrowth: 12.5,
    avgProcessingTime: 8.3,
    processingTimeImprovement: -15.2,
    modelAccuracy: 94.7,
    accuracyImprovement: 2.1,
    activeStreams: 8,
    totalStreams: 10,
    successRate: 96.8,
    errorRate: 3.2,
    queueSize: 23,
    throughput: "156/min",
  };

  // 이벤트 핸들러 (현재 사용하지 않음)
  // const toggleExpanded = (title: string) => {
  //   setExpandedItems((prev) => ({
  //     ...prev,
  //     [title]: !prev[title],
  //   }));
  // };

  return (
    <TooltipProvider>
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* 애니메이션 배경 */}
        <AnimatedBackground />

        {/* 모바일 메뉴 오버레이 */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* 사이드바 - 모바일 */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: mobileMenuOpen ? 0 : "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 z-50 h-full w-64 bg-background border-r md:hidden"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold">SmartDocs</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          {/* 사이드바 내용 (모바일과 동일) */}
          <div className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              문서 관리
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              스마트 검색
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              설정
            </Button>
          </div>
        </motion.div>

        {/* 사이드바 - 데스크톱 */}
        <motion.div
          initial={false}
          animate={{ width: sidebarOpen ? 256 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="hidden md:block fixed left-0 top-0 h-full bg-background border-r z-30 overflow-hidden"
        >
          <div className="w-64 h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                <span className="font-semibold">SmartDocs</span>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                문서 관리
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                스마트 검색
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                설정
              </Button>
            </div>
          </div>
        </motion.div>

        {/* 메인 콘텐츠 */}
        <div
          className={cn(
            "min-h-screen transition-all duration-300 ease-in-out",
            sidebarOpen ? "md:ml-64" : "md:ml-0",
          )}
        >
          {/* 헤더 */}
          <DashboardHeader
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />

          {/* 메인 콘텐츠 영역 */}
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-8">
              {/* 웰컴 섹션 */}
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
                        <Brain className="h-4 w-4" />
                        AI 파이프라인 활성
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-100 border-green-300/30 rounded-xl">
                        <Activity className="h-3 w-3 mr-1" />
                        실시간 처리 중
                      </Badge>
                    </div>
                    <h2 className="text-3xl font-bold">
                      SmartDocs 문서 처리 시스템
                    </h2>
                    <p className="max-w-[600px] text-white/80">
                      AI 기반 스마트 문서 처리 플랫폼으로 문서를 쉽고 빠르게
                      관리하세요.
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
                        스마트 검색 시작
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 메트릭 카드들 */}
              <MetricsCards metrics={sampleMetrics} />
              <AdditionalMetrics metrics={sampleMetrics} />

              {/* 파이프라인 상태 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="h-5 w-5" />
                    문서 처리 파이프라인
                  </CardTitle>
                  <CardDescription>
                    현재 처리 중인 문서의 상태를 실시간으로 확인하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PipelineStatus documentStatus={sampleDocuments[0].status} />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
