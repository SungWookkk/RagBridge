"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Search,
  Settings,
  Upload,
  Bell,
  Plus,
  ChevronDown,
  Menu,
  PanelLeft,
  X,
  Wand2,
  Eye,
  TrendingUp,
  Brain,
  Zap,
  Shield,
  Database,
  FileCheck,
  Cpu,
  Activity,
  BarChart3,
  Workflow,
  Target,
  Sparkles,
  Layers,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * 문서 처리 파이프라인 단계 타입 정의
 *
 * @description
 * - RagBridge AI 문서 처리 파이프라인의 각 단계별 상태를 정의
 * - Kafka 스트림에서 문서가 처리되는 과정을 실시간으로 추적
 * - 각 단계별 성공/실패/진행 상태를 세분화하여 관리
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
 *
 * @description
 * - 문서의 전체 처리 상태와 각 단계별 상세 정보를 포함
 * - 실시간 파이프라인 모니터링을 위한 상태 추적
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
 *
 * @description
 * - RagBridge 플랫폼의 문서 기본 정보와 AI 처리 상태를 포함하는 데이터 구조
 * - 멀티테넌트 환경에서 테넌트별 문서 관리 및 권한 제어
 * - 실시간 처리 파이프라인 상태 추적을 위한 상세 정보 포함
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
  extractedFields: Record<string, string | number | boolean>;
  validationErrors: string[];
  confidenceScore: number;
  processingTime: number;
}

/**
 * RAG 워크스페이스 정보 인터페이스
 *
 * @description
 * - RagBridge 플랫폼의 RAG 워크스페이스 정보를 포함하는 데이터 구조
 * - 멀티테넌트 환경에서 워크스페이스별 권한 및 설정 관리
 * - AI 모델 및 검증 룰 설정을 포함한 워크스페이스 컨텍스트
 */
interface RAGWorkspace {
  id: string;
  name: string;
  description: string;
  tenantId: string;
  documents: number;
  processedDocuments: number;
  totalQueries: number;
  avgResponseTime: number;
  status: "active" | "training" | "maintenance";
  aiModel: string;
  validationRules: number;
  lastActivity: string;
  members: number;
}

/**
 * 샘플 문서 데이터
 *
 * @description
 * - RagBridge AI 문서 처리 파이프라인 데모용 샘플 데이터
 * - 실제 운영 시에는 Kafka 스트림에서 실시간으로 업데이트되는 데이터
 * - 각 문서의 처리 단계별 상태와 AI 추출 결과를 포함
 */
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
  {
    id: "2",
    name: "기술 문서.docx",
    tenantId: "tenant-001",
    status: {
      currentStep: "embedding",
      overallProgress: 80,
      steps: {
        uploaded: { status: "completed", progress: 100 },
        ocr_processing: { status: "completed", progress: 100 },
        field_extraction: { status: "completed", progress: 100 },
        validation: { status: "completed", progress: 100 },
        embedding: { status: "processing", progress: 60 },
        indexing: { status: "pending", progress: 0 },
        completed: { status: "pending", progress: 0 },
        error: { status: "pending", progress: 0 },
      },
    },
    fileType: "DOCX",
    uploadedAt: "1일 전",
    size: "1.8 MB",
    category: "Technical",
    expectedFields: ["문서명", "버전", "작성자"],
    extractedFields: { 문서명: "기술 문서", 버전: "v2.1", 작성자: "개발팀" },
    validationErrors: [],
    confidenceScore: 0.88,
    processingTime: 8.2,
  },
  {
    id: "3",
    name: "회의록.pdf",
    tenantId: "tenant-001",
    status: {
      currentStep: "validation",
      overallProgress: 45,
      steps: {
        uploaded: { status: "completed", progress: 100 },
        ocr_processing: { status: "completed", progress: 100 },
        field_extraction: { status: "completed", progress: 100 },
        validation: { status: "processing", progress: 30 },
        embedding: { status: "pending", progress: 0 },
        indexing: { status: "pending", progress: 0 },
        completed: { status: "pending", progress: 0 },
        error: { status: "pending", progress: 0 },
      },
    },
    fileType: "PDF",
    uploadedAt: "3일 전",
    size: "0.9 MB",
    category: "Meeting",
    expectedFields: ["회의명", "날짜", "참석자"],
    extractedFields: { 회의명: "주간 회의", 날짜: "2024-01-12" },
    validationErrors: ["참석자 정보 누락"],
    confidenceScore: 0.72,
    processingTime: 5.1,
  },
];

/**
 * 샘플 RAG 워크스페이스 데이터
 *
 * @description
 * - RagBridge 플랫폼의 RAG 워크스페이스 데모 데이터
 * - 각 워크스페이스별 AI 모델, 검증 룰, 처리 통계를 포함
 */
const sampleWorkspaces: RAGWorkspace[] = [
  {
    id: "1",
    name: "법무팀 문서 분석",
    description: "계약서 및 정책 문서 자동 분석 및 검증 프로젝트",
    tenantId: "legal-dept",
    documents: 156,
    processedDocuments: 142,
    totalQueries: 2847,
    avgResponseTime: 1.2,
    status: "active",
    aiModel: "gpt-4-turbo",
    validationRules: 12,
    lastActivity: "5분 전",
    members: 4,
  },
  {
    id: "2",
    name: "기술문서 검색 시스템",
    description: "개발자 문서 검색 및 질의응답 전용 프로젝트",
    tenantId: "tech-dept",
    documents: 89,
    processedDocuments: 89,
    totalQueries: 15672,
    avgResponseTime: 0.8,
    status: "active",
    aiModel: "claude-3-sonnet",
    validationRules: 8,
    lastActivity: "1분 전",
    members: 6,
  },
  {
    id: "3",
    name: "HR 정책 문서 센터",
    description: "인사 정책 및 규정 문서 스마트 검색 시스템",
    tenantId: "hr-dept",
    documents: 34,
    processedDocuments: 28,
    totalQueries: 892,
    avgResponseTime: 1.5,
    status: "training",
    aiModel: "gpt-3.5-turbo",
    validationRules: 5,
    lastActivity: "30분 전",
    members: 3,
  },
];

/**
 * 사이드바 네비게이션 아이템 인터페이스
 */
interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  badge?: string;
  items?: Array<{
    title: string;
    url: string;
    badge?: string;
  }>;
}

/**
 * RagBridge AI 문서 처리 파이프라인 중심 네비게이션 설정
 *
 * @description
 * - AI 문서 처리 워크플로우를 중심으로 한 네비게이션 구조
 * - 사용자가 문서 업로드부터 RAG 응답까지의 전체 파이프라인을 직관적으로 이해할 수 있도록 구성
 * - 실시간 처리 상태 모니터링과 AI 모델 관리 기능을 강화
 */
const sidebarItems: SidebarItem[] = [
  {
    title: "문서 처리 현황",
    icon: <Workflow />,
    isActive: true,
  },
  {
    title: "문서 관리",
    icon: <FileCheck />,
    badge: "3",
    items: [
      { title: "문서 업로드", url: "#", badge: "3" },
      { title: "문서 읽기 현황", url: "#" },
      { title: "데이터 추출 결과", url: "#" },
      { title: "검증 완료 문서", url: "#" },
    ],
  },
  {
    title: "스마트 검색",
    icon: <Brain />,
    items: [
      { title: "AI 질의응답", url: "#" },
      { title: "스마트 검색", url: "#" },
      { title: "문서 인덱스 관리", url: "#" },
      { title: "출처 문서 분석", url: "#" },
    ],
  },
  {
    title: "스마트 검증",
    icon: <Shield />,
    items: [
      { title: "검증 룰 설정", url: "#" },
      { title: "자동 필드 매핑", url: "#" },
      { title: "데이터 정합성 검증", url: "#" },
      { title: "검토 대기 목록", url: "#" },
    ],
  },
  {
    title: "AI 모델 관리",
    icon: <Cpu />,
    items: [
      { title: "모델 성능 확인", url: "#" },
      { title: "학습 데이터 관리", url: "#" },
      { title: "모델 업데이트", url: "#" },
      { title: "성능 비교 테스트", url: "#" },
    ],
  },
  {
    title: "실시간 모니터링",
    icon: <Activity />,
    badge: "2",
    items: [
      { title: "시스템 상태", url: "#" },
      { title: "처리 속도 & 응답시간", url: "#" },
      { title: "오류 알림", url: "#", badge: "2" },
      { title: "성능 지표", url: "#" },
    ],
  },
  {
    title: "프로젝트 관리",
    icon: <Layers />,
    items: [
      { title: "문서 프로젝트", url: "#" },
      { title: "팀 권한 관리", url: "#" },
      { title: "API 키 관리", url: "#" },
      { title: "사용량 분석", url: "#" },
    ],
  },
];

/**
 * RagBridge 대시보드 컴포넌트
 *
 * @description
 * - Kafka + AI 문서 OCR·검증·RAG 플랫폼의 메인 대시보드
 * - 멀티테넌트 SaaS 환경에 최적화된 인터페이스
 * - 실시간 문서 처리 상태 모니터링
 * - 프로젝트별 권한 및 관리 기능
 */
export function RagBridgeDashboard() {
  // 사이드바 상태 관리
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  // 알림 수 (실제로는 API에서 가져올 데이터)
  const [notifications] = useState(3);

  // 활성 탭 상태
  const [activeTab, setActiveTab] = useState("dashboard");

  /**
   * 사이드바 아이템 확장/축소 토글
   *
   * @param title - 토글할 아이템의 제목
   * @description
   * - 사이드바 하위 메뉴의 펼침/접힘 상태를 관리
   * - 상태 객체에서 해당 키의 boolean 값을 토글
   */
  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <TooltipProvider>
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* 애니메이션 그라데이션 배경 */}
        <motion.div
          className="absolute inset-0 -z-10 opacity-10"
          animate={{
            background: [
              "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.5) 0%, rgba(147, 51, 234, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
              "radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.5) 0%, rgba(59, 130, 246, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
              "radial-gradient(circle at 70% 30%, rgba(245, 158, 11, 0.5) 0%, rgba(16, 185, 129, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
              "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.5) 0%, rgba(147, 51, 234, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          aria-hidden="true"
        />

        {/* 모바일 메뉴 오버레이 */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* 사이드바 - 모바일 */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-300 ease-in-out md:hidden",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col border-r">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  <Wand2 className="size-5" />
                </div>
                <div>
                  <h2 className="font-semibold">SmartDocs</h2>
                  <p className="text-xs text-muted-foreground">
                    스마트 문서 처리
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="검색..."
                  className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 px-3 py-2">
              <div className="space-y-1">
                {sidebarItems.map((item) => (
                  <div key={item.title} className="mb-1">
                    <button
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                        item.isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted",
                      )}
                      onClick={() => item.items && toggleExpanded(item.title)}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge
                          variant="outline"
                          className="ml-auto rounded-full px-2 py-0.5 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {item.items && (
                        <ChevronDown
                          className={cn(
                            "ml-2 h-4 w-4 transition-transform",
                            expandedItems[item.title] ? "rotate-180" : "",
                          )}
                        />
                      )}
                    </button>

                    {item.items && expandedItems[item.title] && (
                      <div className="mt-1 ml-6 space-y-1 border-l pl-3">
                        {item.items.map((subItem) => (
                          <a
                            key={subItem.title}
                            href={subItem.url}
                            className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm hover:bg-muted"
                          >
                            {subItem.title}
                            {subItem.badge && (
                              <Badge
                                variant="outline"
                                className="ml-auto rounded-full px-2 py-0.5 text-xs"
                              >
                                {subItem.badge}
                              </Badge>
                            )}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-3">
              <div className="space-y-1">
                <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                  <Settings className="h-5 w-5" />
                  <span>설정</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 사이드바 - 데스크톱 */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r bg-background transition-transform duration-300 ease-in-out md:block",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {/* 사이드바 내용 (모바일과 동일) */}
          <div className="flex h-full flex-col">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  <Wand2 className="size-5" />
                </div>
                <div>
                  <h2 className="font-semibold">SmartDocs</h2>
                  <p className="text-xs text-muted-foreground">
                    스마트 문서 처리
                  </p>
                </div>
              </div>
            </div>

            {/* 검색 컴포넌트 */}
            <div className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="검색..."
                  className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 px-3 py-2">
              <div className="space-y-1">
                {sidebarItems.map((item) => (
                  <div key={item.title} className="mb-1">
                    <button
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                        item.isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted",
                      )}
                      onClick={() => item.items && toggleExpanded(item.title)}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge
                          variant="outline"
                          className="ml-auto rounded-full px-2 py-0.5 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {item.items && (
                        <ChevronDown
                          className={cn(
                            "ml-2 h-4 w-4 transition-transform",
                            expandedItems[item.title] ? "rotate-180" : "",
                          )}
                        />
                      )}
                    </button>

                    {item.items && expandedItems[item.title] && (
                      <div className="mt-1 ml-6 space-y-1 border-l pl-3">
                        {item.items.map((subItem) => (
                          <a
                            key={subItem.title}
                            href={subItem.url}
                            className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm hover:bg-muted"
                          >
                            {subItem.title}
                            {subItem.badge && (
                              <Badge
                                variant="outline"
                                className="ml-auto rounded-full px-2 py-0.5 text-xs"
                              >
                                {subItem.badge}
                              </Badge>
                            )}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-3">
              <div className="space-y-1">
                <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                  <Settings className="h-5 w-5" />
                  <span>설정</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span>김개발</span>
                  </div>
                  <Badge variant="outline">Pro</Badge>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div
          className={cn(
            "min-h-screen transition-all duration-300 ease-in-out",
            sidebarOpen ? "md:pl-64" : "md:pl-0",
          )}
        >
          {/* 헤더 */}
          <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-semibold">SmartDocs 문서 처리</h1>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <Activity className="h-3 w-3 mr-1" />
                  실시간 처리 중
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <Database className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>벡터 데이터베이스</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <Zap className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Kafka 스트림</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-2xl relative"
                    >
                      <Bell className="h-5 w-5" />
                      {notifications > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                          {notifications}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>AI 처리 알림</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>AI 모델 설정</TooltipContent>
                </Tooltip>

                <Avatar className="h-9 w-9 border-2 border-primary">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* 메인 콘텐츠 영역 */}
          <main className="flex-1 p-4 md:p-6">
            <Tabs
              defaultValue="dashboard"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <TabsList className="grid w-full max-w-[800px] grid-cols-5 rounded-2xl p-1">
                  <TabsTrigger
                    value="dashboard"
                    className="rounded-xl flex items-center gap-2"
                  >
                    <Workflow className="h-4 w-4" />
                    문서 처리 현황
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="rounded-xl flex items-center gap-2"
                  >
                    <FileCheck className="h-4 w-4" />
                    문서 처리 현황
                  </TabsTrigger>
                  <TabsTrigger
                    value="rag-console"
                    className="rounded-xl flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    스마트 검색
                  </TabsTrigger>
                  <TabsTrigger
                    value="workspaces"
                    className="rounded-xl flex items-center gap-2"
                  >
                    <Layers className="h-4 w-4" />
                    프로젝트
                  </TabsTrigger>
                  <TabsTrigger
                    value="monitoring"
                    className="rounded-xl flex items-center gap-2"
                  >
                    <Activity className="h-4 w-4" />
                    실시간 모니터링
                  </TabsTrigger>
                </TabsList>
                <div className="hidden md:flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    문서 업로드
                  </Button>
                  <Button className="rounded-2xl bg-gradient-to-r from-green-600 to-blue-600">
                    <Sparkles className="mr-2 h-4 w-4" />새 프로젝트
                  </Button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* 대시보드 탭 */}
                  <TabsContent value="dashboard" className="space-y-8 mt-0">
                    {/* 웰컴 섹션 */}
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
                              AI 기반 스마트 문서 처리 플랫폼으로 문서를 쉽고
                              빠르게 관리하세요.
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
                                transition={{
                                  duration: 2,
                                  repeat: Number.POSITIVE_INFINITY,
                                }}
                                className="absolute inset-4 rounded-full bg-white/20 flex items-center justify-center"
                              >
                                <Zap className="h-12 w-12 text-white/50" />
                              </motion.div>
                              <motion.div
                                animate={{ scale: [1.2, 1, 1.2] }}
                                transition={{
                                  duration: 3,
                                  repeat: Number.POSITIVE_INFINITY,
                                }}
                                className="absolute inset-8 rounded-full bg-white/30 flex items-center justify-center"
                              >
                                <Database className="h-8 w-8 text-white/40" />
                              </motion.div>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </section>

                    {/* AI 문서 처리 파이프라인 현황 */}
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Workflow className="h-6 w-6 text-primary" />
                          <h2 className="text-2xl font-semibold">
                            문서 처리 현황
                          </h2>
                        </div>
                        <Button variant="ghost" className="rounded-2xl">
                          <Activity className="mr-2 h-4 w-4" />
                          실시간 모니터링
                        </Button>
                      </div>
                      <div className="rounded-3xl border">
                        <div className="grid grid-cols-1 divide-y">
                          {sampleDocuments.slice(0, 3).map((document) => (
                            <motion.div
                              key={document.id}
                              whileHover={{
                                backgroundColor: "rgba(0,0,0,0.02)",
                              }}
                              className="p-4"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {document.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {document.fileType} • {document.category}{" "}
                                      • {document.uploadedAt}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="rounded-xl"
                                  >
                                    {document.status.currentStep}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="rounded-xl bg-green-50 text-green-700 border-green-200"
                                  >
                                    신뢰도:{" "}
                                    {(document.confidenceScore * 100).toFixed(
                                      0,
                                    )}
                                    %
                                  </Badge>
                                </div>
                              </div>

                              {/* AI 처리 단계별 진행 상황 */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">
                                    AI 처리 진행률
                                  </span>
                                  <span className="text-primary font-semibold">
                                    {document.status.overallProgress}%
                                  </span>
                                </div>
                                <Progress
                                  value={document.status.overallProgress}
                                  className="h-3 rounded-xl"
                                />

                                {/* 처리 단계별 상태 표시 */}
                                <div className="flex items-center gap-2 text-xs">
                                  {Object.entries(document.status.steps)
                                    .slice(0, 6)
                                    .map(([step, stepStatus]) => {
                                      const stepIcons = {
                                        uploaded: (
                                          <Upload className="h-3 w-3" />
                                        ),
                                        ocr_processing: (
                                          <Eye className="h-3 w-3" />
                                        ),
                                        field_extraction: (
                                          <Target className="h-3 w-3" />
                                        ),
                                        validation: (
                                          <Shield className="h-3 w-3" />
                                        ),
                                        embedding: (
                                          <Brain className="h-3 w-3" />
                                        ),
                                        indexing: (
                                          <Database className="h-3 w-3" />
                                        ),
                                      };

                                      return (
                                        <div
                                          key={step}
                                          className="flex items-center gap-1"
                                        >
                                          <div
                                            className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                              stepStatus.status === "completed"
                                                ? "bg-green-100 text-green-600"
                                                : stepStatus.status ===
                                                    "processing"
                                                  ? "bg-blue-100 text-blue-600"
                                                  : stepStatus.status ===
                                                      "failed"
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-gray-100 text-gray-400"
                                            }`}
                                          >
                                            {stepStatus.status ===
                                            "completed" ? (
                                              <CheckCircle className="h-3 w-3" />
                                            ) : stepStatus.status ===
                                              "processing" ? (
                                              stepIcons[
                                                step as keyof typeof stepIcons
                                              ]
                                            ) : stepStatus.status ===
                                              "failed" ? (
                                              <AlertCircle className="h-3 w-3" />
                                            ) : (
                                              <Clock className="h-3 w-3" />
                                            )}
                                          </div>
                                          <span className="text-muted-foreground capitalize">
                                            {step.replace("_", " ")}
                                          </span>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* RAG 워크스페이스 섹션 */}
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Layers className="h-6 w-6 text-primary" />
                          <h2 className="text-2xl font-semibold">
                            문서 프로젝트
                          </h2>
                        </div>
                        <Button variant="ghost" className="rounded-2xl">
                          <Layers className="mr-2 h-4 w-4" />
                          모든 프로젝트
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {sampleWorkspaces.map((workspace) => (
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
                                <CardDescription>
                                  {workspace.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {/* AI 모델 정보 */}
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Cpu className="h-4 w-4 text-primary" />
                                    <span>AI 모델</span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="rounded-lg text-xs"
                                  >
                                    {workspace.aiModel}
                                  </Badge>
                                </div>

                                {/* 처리 통계 */}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-muted-foreground">
                                        문서
                                      </span>
                                      <span className="font-medium">
                                        {workspace.documents}개
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-muted-foreground">
                                        처리됨
                                      </span>
                                      <span className="font-medium text-green-600">
                                        {workspace.processedDocuments}개
                                      </span>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-muted-foreground">
                                        질의
                                      </span>
                                      <span className="font-medium">
                                        {workspace.totalQueries.toLocaleString()}
                                        회
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
                                  <Badge
                                    variant="outline"
                                    className="rounded-lg"
                                  >
                                    {workspace.validationRules}개
                                  </Badge>
                                </div>
                              </CardContent>
                              <CardFooter className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  className="flex-1 rounded-2xl"
                                >
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
                    </section>
                  </TabsContent>

                  {/* AI 문서 처리 현황 탭 */}
                  <TabsContent value="documents" className="space-y-8 mt-0">
                    <section>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 p-8 text-white"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <FileCheck className="h-8 w-8" />
                              <h2 className="text-3xl font-bold">
                                문서 처리 현황
                              </h2>
                            </div>
                            <p className="max-w-[600px] text-white/80">
                              업로드된 문서들의 처리 상태를 실시간으로
                              확인하세요.
                            </p>
                          </div>
                          <Button className="w-fit rounded-2xl bg-white text-emerald-700 hover:bg-white/90">
                            <Upload className="mr-2 h-4 w-4" />
                            문서 업로드
                          </Button>
                        </div>
                      </motion.div>
                    </section>

                    {/* AI 처리 파이프라인 상세 테이블 */}
                    <div className="rounded-3xl border overflow-hidden">
                      <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-4 hidden md:grid md:grid-cols-12 text-sm font-medium">
                        <div className="col-span-4 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          문서 정보
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <Workflow className="h-4 w-4" />
                          처리 단계
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          AI 신뢰도
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          처리 시간
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          작업
                        </div>
                      </div>
                      <div className="divide-y">
                        {sampleDocuments.map((document) => (
                          <motion.div
                            key={document.id}
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                            className="p-4 md:grid md:grid-cols-12 items-center flex flex-col md:flex-row gap-4 md:gap-0"
                          >
                            {/* 문서 정보 */}
                            <div className="col-span-4 flex items-center gap-3 w-full md:w-auto">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                                <FileText className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{document.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {document.fileType} • {document.category} •{" "}
                                  {document.uploadedAt}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {document.size}
                                </p>
                              </div>
                            </div>

                            {/* 처리 단계 */}
                            <div className="col-span-2 flex items-center gap-2 w-full md:w-auto">
                              <Badge
                                variant="outline"
                                className="rounded-xl capitalize"
                              >
                                {document.status.currentStep.replace("_", " ")}
                              </Badge>
                              <span className="text-sm font-medium">
                                {document.status.overallProgress}%
                              </span>
                            </div>

                            {/* AI 신뢰도 */}
                            <div className="col-span-2 flex items-center gap-2 w-full md:w-auto">
                              <div className="flex items-center gap-1">
                                <Brain className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">
                                  {(document.confidenceScore * 100).toFixed(0)}%
                                </span>
                              </div>
                              <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${document.confidenceScore * 100}%`,
                                  }}
                                />
                              </div>
                            </div>

                            {/* 처리 시간 */}
                            <div className="col-span-2 flex items-center gap-2 w-full md:w-auto">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {document.processingTime}초
                              </span>
                            </div>

                            {/* 작업 버튼 */}
                            <div className="col-span-2 flex items-center gap-2 w-full md:w-auto justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-xl"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-xl"
                              >
                                <Activity className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* RAG 검색 콘솔 탭 */}
                  <TabsContent value="rag-console" className="space-y-8 mt-0">
                    <section>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-8 text-white"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Brain className="h-8 w-8" />
                              <h2 className="text-3xl font-bold">
                                스마트 검색
                              </h2>
                            </div>
                            <p className="max-w-[600px] text-white/80">
                              자연어로 질문하면 관련 문서를 찾아 답변해드립니다.
                            </p>
                          </div>
                          <Button className="w-fit rounded-2xl bg-white text-purple-700 hover:bg-white/90">
                            <Sparkles className="mr-2 h-4 w-4" />
                            스마트 검색 시작
                          </Button>
                        </div>
                      </motion.div>
                    </section>

                    {/* RAG 검색 인터페이스 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 검색 입력 영역 */}
                      <Card className="rounded-3xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            질문 입력
                          </CardTitle>
                          <CardDescription>
                            자연어로 질문하시면 AI가 관련 문서를 찾아
                            답변해드립니다.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder="예: 회사 정책에서 휴가 규정은 어떻게 되나요?"
                              className="w-full rounded-2xl bg-muted pl-9 pr-4 py-3 text-base"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1 rounded-2xl">
                              <Brain className="mr-2 h-4 w-4" />
                              스마트 검색 실행
                            </Button>
                            <Button variant="outline" className="rounded-2xl">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 검색 결과 미리보기 */}
                      <Card className="rounded-3xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            검색 결과
                          </CardTitle>
                          <CardDescription>
                            관련 문서와 AI 답변을 확인하세요.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="p-4 rounded-2xl bg-muted/50">
                              <p className="text-sm text-muted-foreground">
                                검색어를 입력하고 AI 검색을 실행해보세요.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* 최근 검색 히스토리 */}
                    <Card className="rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          최근 검색 히스토리
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            {
                              query: "회사 정책서에서 휴가 신청 절차",
                              result: "3개 문서에서 관련 정보 발견",
                              time: "5분 전",
                            },
                            {
                              query: "기술 문서에서 API 사용법",
                              result: "5개 문서에서 관련 정보 발견",
                              time: "1시간 전",
                            },
                            {
                              query: "회의록에서 프로젝트 일정",
                              result: "2개 문서에서 관련 정보 발견",
                              time: "2시간 전",
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex-1">
                                <p className="font-medium">{item.query}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.result}
                                </p>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.time}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* 워크스페이스 탭 */}
                  <TabsContent value="workspaces" className="space-y-8 mt-0">
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
                              <h2 className="text-3xl font-bold">
                                문서 프로젝트 관리
                              </h2>
                            </div>
                            <p className="max-w-[600px] text-white/80">
                              팀별 문서 프로젝트를 생성하고 AI 모델을
                              관리하세요.
                            </p>
                          </div>
                          <Button className="w-fit rounded-2xl bg-white text-indigo-700 hover:bg-white/90">
                            <Plus className="mr-2 h-4 w-4" />새 프로젝트
                          </Button>
                        </div>
                      </motion.div>
                    </section>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {sampleWorkspaces.map((workspace) => (
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
                              <CardDescription>
                                {workspace.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {/* AI 모델 정보 */}
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <Cpu className="h-4 w-4 text-primary" />
                                  <span>AI 모델</span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="rounded-lg text-xs"
                                >
                                  {workspace.aiModel}
                                </Badge>
                              </div>

                              {/* 처리 통계 */}
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      문서
                                    </span>
                                    <span className="font-medium">
                                      {workspace.documents}개
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      처리됨
                                    </span>
                                    <span className="font-medium text-green-600">
                                      {workspace.processedDocuments}개
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      질의
                                    </span>
                                    <span className="font-medium">
                                      {workspace.totalQueries.toLocaleString()}
                                      회
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
                            </CardContent>
                            <CardFooter className="flex gap-2">
                              <Button
                                variant="secondary"
                                className="flex-1 rounded-2xl"
                              >
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
                  </TabsContent>

                  {/* 실시간 AI 스트림 모니터링 탭 */}
                  <TabsContent value="monitoring" className="space-y-6 mt-0">
                    <section>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 p-8 text-white"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Activity className="h-8 w-8" />
                              <h2 className="text-3xl font-bold">
                                시스템 모니터링
                              </h2>
                            </div>
                            <p className="max-w-[600px] text-white/80">
                              문서 처리 시스템 상태와 AI 모델 성능을 실시간으로
                              확인하세요.
                            </p>
                          </div>
                          <Button className="w-fit rounded-2xl bg-white text-orange-700 hover:bg-white/90">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            상세 분석
                          </Button>
                        </div>
                      </motion.div>
                    </section>

                    {/* AI 처리 성능 지표 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="rounded-3xl border-l-4 border-l-green-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-green-600" />
                            처리된 문서
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            1,847
                          </div>
                          <p className="text-xs text-muted-foreground">
                            +18% 지난 시간 대비
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="rounded-3xl border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            평균 처리 시간
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">
                            1.8초
                          </div>
                          <p className="text-xs text-muted-foreground">
                            -0.3초 개선
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="rounded-3xl border-l-4 border-l-purple-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-600" />
                            모델 정확도
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-purple-600">
                            94.2%
                          </div>
                          <p className="text-xs text-muted-foreground">
                            +1.2% 향상
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="rounded-3xl border-l-4 border-l-orange-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Zap className="h-4 w-4 text-orange-600" />
                            시스템 상태
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-orange-600">
                            8/8
                          </div>
                          <p className="text-xs text-muted-foreground">
                            모든 토픽 정상
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* AI 모델 성능 차트 영역 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="rounded-3xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            문서 처리량 추이
                          </CardTitle>
                          <CardDescription>
                            시간별 문서 처리량과 성능 지표
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-2xl">
                            <div className="text-center">
                              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                실시간 차트 영역
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Chart.js 또는 Recharts로 구현 예정
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="rounded-3xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            스트림 처리 상태
                          </CardTitle>
                          <CardDescription>
                            시스템 토픽별 처리 상태와 성능 모니터링
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              {
                                topic: "documents.uploaded",
                                status: "정상",
                                lag: 0,
                                throughput: "245/min",
                              },
                              {
                                topic: "documents.parsed",
                                status: "정상",
                                lag: 2,
                                throughput: "198/min",
                              },
                              {
                                topic: "documents.validated",
                                status: "정상",
                                lag: 1,
                                throughput: "186/min",
                              },
                              {
                                topic: "documents.embeddings",
                                status: "정상",
                                lag: 3,
                                throughput: "172/min",
                              },
                            ].map((stream, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-2xl bg-muted/30"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                  <div>
                                    <p className="font-medium text-sm">
                                      {stream.topic}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      처리량: {stream.throughput}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-green-600">
                                    {stream.status}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    랙: {stream.lag}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
