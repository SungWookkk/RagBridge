"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Search,
  Settings,
  Upload,
  Users,
  Bell,
  Plus,
  ChevronDown,
  Menu,
  PanelLeft,
  X,
  Cloud,
  MessageSquare,
  Wand2,
  Eye,
  TrendingUp,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip } from "@/components/ui/tooltip"
import { TooltipContent } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/**
 * 문서 상태 타입 정의
 * 
 * @description
 * - 문서 처리 파이프라인의 각 단계별 상태를 정의
 * - Kafka 스트림에서 문서가 처리되는 과정을 추적
 */
type DocumentStatus = "uploaded" | "parsing" | "validating" | "indexing" | "completed" | "error"

/**
 * 문서 정보 인터페이스
 * 
 * @description
 * - 문서 기본 정보와 처리 상태를 포함하는 데이터 구조
 * - 멀티테넌트 환경에서 테넌트별 문서 관리
 */
interface Document {
  id: string
  name: string
  tenantId: string
  status: DocumentStatus
  progress: number
  uploadedAt: string
  size: string
  category: string
}

/**
 * 프로젝트 정보 인터페이스
 * 
 * @description
 * - RAG 프로젝트의 진행 상황과 팀 구성 정보를 포함
 * - 멀티테넌트 환경에서 프로젝트별 권한 관리
 */
interface Project {
  id: string
  name: string
  description: string
  progress: number
  dueDate: string
  members: number
  documents: number
  status: "active" | "completed" | "archived"
}

/**
 * 샘플 문서 데이터
 * 
 * @description
 * - 개발/데모용 샘플 문서 데이터
 * - 실제 운영 시에는 API에서 가져올 데이터
 */
const sampleDocuments: Document[] = [
  {
    id: "1",
    name: "회사 정책서.pdf",
    tenantId: "tenant-001",
    status: "completed",
    progress: 100,
    uploadedAt: "2시간 전",
    size: "2.4 MB",
    category: "Policy"
  },
  {
    id: "2", 
    name: "기술 문서.docx",
    tenantId: "tenant-001",
    status: "indexing",
    progress: 75,
    uploadedAt: "1일 전",
    size: "1.8 MB",
    category: "Technical"
  },
  {
    id: "3",
    name: "회의록.pdf",
    tenantId: "tenant-001", 
    status: "parsing",
    progress: 30,
    uploadedAt: "3일 전",
    size: "0.9 MB",
    category: "Meeting"
  }
]

/**
 * 샘플 프로젝트 데이터
 */
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "법무팀 문서 분석",
    description: "계약서 및 정책 문서 자동 분석 프로젝트",
    progress: 85,
    dueDate: "2025년 2월 15일",
    members: 4,
    documents: 23,
    status: "active"
  },
  {
    id: "2",
    name: "기술문서 RAG 시스템",
    description: "개발자 문서 검색 및 질의응답 시스템",
    progress: 60,
    dueDate: "2025션 3월 10일", 
    members: 6,
    documents: 45,
    status: "active"
  }
]

/**
 * 사이드바 네비게이션 아이템 인터페이스
 */
interface SidebarItem {
  title: string
  icon: React.ReactNode
  isActive?: boolean
  badge?: string
  items?: Array<{
    title: string
    url: string
    badge?: string
  }>
}

/**
 * 사이드바 네비게이션 설정
 * 
 * @description
 * - RagBridge 플랫폼의 주요 기능별 네비게이션 구조
 * - 멀티테넌트 SaaS 환경에 적합한 메뉴 구성
 */
const sidebarItems: SidebarItem[] = [
  {
    title: "대시보드",
    icon: <PanelLeft />,
    isActive: true,
  },
  {
    title: "문서 관리",
    icon: <FileText />,
    badge: "3",
    items: [
      { title: "전체 문서", url: "#" },
      { title: "최근 업로드", url: "#", badge: "3" },
      { title: "처리 대기", url: "#", badge: "1" },
      { title: "완료된 문서", url: "#" },
    ],
  },
  {
    title: "RAG 콘솔",
    icon: <Search />,
    items: [
      { title: "질의응답", url: "#" },
      { title: "검색 설정", url: "#" },
      { title: "임베딩 관리", url: "#" },
    ],
  },
  {
    title: "검증 룰",
    icon: <Wand2 />,
    items: [
      { title: "룰 빌더", url: "#" },
      { title: "필드 매핑", url: "#" },
      { title: "정규식 패턴", url: "#" },
    ],
  },
  {
    title: "모니터링",
    icon: <TrendingUp />,
    badge: "2",
    items: [
      { title: "스트림 상태", url: "#" },
      { title: "처리율", url: "#" },
      { title: "오류 로그", url: "#", badge: "2" },
    ],
  },
]

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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  
  // 알림 수
  const [notifications, _setNotifications] = useState(3)
  
  // 활성 탭 상태
  const [activeTab, setActiveTab] = useState("dashboard")

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
    }))
  }

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
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
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
                  <h2 className="font-semibold">RagBridge</h2>
                  <p className="text-xs text-muted-foreground">AI 문서 플랫폼</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="검색..." className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2" />
              </div>
            </div>

            <ScrollArea className="flex-1 px-3 py-2">
              <div className="space-y-1">
                {sidebarItems.map((item) => (
                  <div key={item.title} className="mb-1">
                    <button
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                        item.isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                      )}
                      onClick={() => item.items && toggleExpanded(item.title)}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-xs">
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
                              <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-xs">
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
                  <h2 className="font-semibold">RagBridge</h2>
                  <p className="text-xs text-muted-foreground">AI 문서 플랫폼</p>
                </div>
              </div>
            </div>
            
            {/* 검색 컴포넌트 */}
            <div className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="검색..." className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2" />
              </div>
            </div>

            <ScrollArea className="flex-1 px-3 py-2">
              <div className="space-y-1">
                {sidebarItems.map((item) => (
                  <div key={item.title} className="mb-1">
                    <button
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                        item.isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                      )}
                      onClick={() => item.items && toggleExpanded(item.title)}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-xs">
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
                              <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-xs">
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
        <div className={cn("min-h-screen transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-64" : "md:pl-0")}>
          {/* 헤더 */}
          <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <PanelLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-xl font-semibold">RagBridge 대시보드</h1>
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <Cloud className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>클라우드 스토리지</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>메시지</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl relative">
                      <Bell className="h-5 w-5" />
                      {notifications > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                          {notifications}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>알림</TooltipContent>
                </Tooltip>

                <Avatar className="h-9 w-9 border-2 border-primary">
                  <AvatarFallback>김</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* 메인 콘텐츠 영역 */}
          <main className="flex-1 p-4 md:p-6">
            <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <TabsList className="grid w-full max-w-[600px] grid-cols-4 rounded-2xl p-1">
                  <TabsTrigger value="dashboard" className="rounded-xl">
                    대시보드
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="rounded-xl">
                    문서 관리
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="rounded-xl">
                    프로젝트
                  </TabsTrigger>
                  <TabsTrigger value="monitoring" className="rounded-xl">
                    모니터링
                  </TabsTrigger>
                </TabsList>
                <div className="hidden md:flex gap-2">
                  <Button variant="outline" className="rounded-2xl">
                    <Upload className="mr-2 h-4 w-4" />
                    문서 업로드
                  </Button>
                  <Button className="rounded-2xl">
                    <Plus className="mr-2 h-4 w-4" />
                    새 프로젝트
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
                        className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white"
                      >
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-4">
                            <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">프로</Badge>
                            <h2 className="text-3xl font-bold">RagBridge에 오신 것을 환영합니다</h2>
                            <p className="max-w-[600px] text-white/80">
                              Kafka 기반 AI 문서 처리 플랫폼으로 문서를 업로드하고, 검증하고, 검색하세요.
                            </p>
                            <div className="flex flex-wrap gap-3">
                              <Button className="rounded-2xl bg-white text-indigo-700 hover:bg-white/90">
                                문서 업로드하기
                              </Button>
                              <Button
                                variant="blue-500"
                                className="rounded-2xl bg-transparent border-white text-white hover:bg-white/10"
                              >
                                플랫폼 둘러보기
                              </Button>
                            </div>
                          </div>
                          <div className="hidden lg:block">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="relative h-40 w-40"
                            >
                              <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" />
                              <div className="absolute inset-4 rounded-full bg-white/20" />
                              <div className="absolute inset-8 rounded-full bg-white/30" />
                              <div className="absolute inset-12 rounded-full bg-white/40" />
                              <div className="absolute inset-16 rounded-full bg-white/50" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </section>

                    {/* 최근 문서 섹션 */}
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">최근 문서</h2>
                        <Button variant="ghost" className="rounded-2xl">
                          전체 보기
                        </Button>
                      </div>
                      <div className="rounded-3xl border">
                        <div className="grid grid-cols-1 divide-y">
                          {sampleDocuments.slice(0, 3).map((document) => (
                            <motion.div
                              key={document.id}
                              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                              className="p-4"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
                                    <FileText className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{document.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {document.category} • {document.uploadedAt}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="rounded-xl">
                                  {document.status}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span>처리 진행률</span>
                                  <span>{document.progress}%</span>
                                </div>
                                <Progress value={document.progress} className="h-2 rounded-xl" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* 활성 프로젝트 섹션 */}
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">활성 프로젝트</h2>
                        <Button variant="ghost" className="rounded-2xl">
                          전체 보기
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {sampleProjects.map((project) => (
                          <motion.div key={project.id} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                            <Card className="overflow-hidden rounded-3xl border hover:border-primary/50 transition-all duration-300">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle>{project.name}</CardTitle>
                                  <Badge variant="outline" className="rounded-xl">
                                    {project.status}
                                  </Badge>
                                </div>
                                <CardDescription>{project.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span>진행률</span>
                                    <span>{project.progress}%</span>
                                  </div>
                                  <Progress value={project.progress} className="h-2 rounded-xl" />
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <Users className="mr-1 h-4 w-4" />
                                    {project.members}명
                                  </div>
                                  <div className="flex items-center">
                                    <FileText className="mr-1 h-4 w-4" />
                                    {project.documents}개
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="flex gap-2">
                                <Button variant="secondary" className="flex-1 rounded-2xl">
                                  프로젝트 열기
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  </TabsContent>

                  {/* 문서 관리 탭 */}
                  <TabsContent value="documents" className="space-y-8 mt-0">
                    <section>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8 text-white"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-2">
                            <h2 className="text-3xl font-bold">문서 관리</h2>
                            <p className="max-w-[600px] text-white/80">
                              업로드된 문서들을 관리하고 처리 상태를 모니터링하세요.
                            </p>
                          </div>
                          <Button className="w-fit rounded-2xl bg-white text-blue-700 hover:bg-white/90">
                            <Upload className="mr-2 h-4 w-4" />
                            새 문서 업로드
                          </Button>
                        </div>
                      </motion.div>
                    </section>

                    <div className="rounded-3xl border overflow-hidden">
                      <div className="bg-muted/50 p-3 hidden md:grid md:grid-cols-12 text-sm font-medium">
                        <div className="col-span-6">문서명</div>
                        <div className="col-span-2">카테고리</div>
                        <div className="col-span-2">크기</div>
                        <div className="col-span-2">상태</div>
                      </div>
                      <div className="divide-y">
                        {sampleDocuments.map((document) => (
                          <motion.div
                            key={document.id}
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                            className="p-3 md:grid md:grid-cols-12 items-center flex flex-col md:flex-row gap-3 md:gap-0"
                          >
                            <div className="col-span-6 flex items-center gap-3 w-full md:w-auto">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">{document.name}</p>
                                <p div className="text-xs text-muted-foreground">
                                  {document.uploadedAt}
                                </p>
                              </div>
                            </div>
                            <div className="col-span-2 text-sm md:text-base">{document.category}</div>
                            <div className="col-span-2 text-sm md:text-base">{document.size}</div>
                            <div className="col-span-2 flex items-center justify-between w-full md:w-auto">
                              <Badge variant="outline" className="rounded-xl">
                                {document.status}
                              </Badge>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* 프로젝트 탭 */}
                  <TabsContent value="projects" className="space-y-8 mt-0">
                    <section>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 text-white"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-2">
                            <h2 className="text-3xl font-bold">프로젝트 관리</h2>
                            <p className="max-w-[600px] text-white/80">
                              RAG 프로젝트를 생성하고 팀과 협업하세요.
                            </p>
                          </div>
                          <Button className="w-fit rounded-2xl bg-white text-purple-700 hover:bg-white/90">
                            <Plus className="mr-2 h-4 w-4" />
                            새 프로젝트
                          </Button>
                        </div>
                      </motion.div>
                    </section>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {sampleProjects.map((project) => (
                        <motion.div key={project.id} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                          <Card className="overflow-hidden rounded-3xl border hover:border-primary/50 transition-all duration-300">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle>{project.name}</CardTitle>
                                <Badge variant="outline" className="rounded-xl">
                                  {project.status}
                                </Badge>
                              </div>
                              <CardDescription>{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span>진행률</span>
                                  <span>{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2 rounded-xl" />
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Users className="mr-1 h-4 w-4" />
                                  {project.members}명
                                </div>
                                <div className="flex items-center">
                                  <FileText className="mr-1 h-4 w-4" />
                                  {project.documents}개
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                              <Button variant="secondary" className="flex-1 rounded-2xl">
                                프로젝트 열기
                              </Button>
                              <Button variant="outline" size="icon" className="rounded-2xl">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* 모니터링 탭 */}
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
                            <h2 className="text-3xl font-bold">실시간 모니터링</h2>
                            <p className="max-w-[600px] text-white/80">
                              Kafka 스트림 처리 상태와 시스템 성능을 실시간으로 확인하세요.
                            </p>
                          </div>
                          <Button className="w-fit rounded-2xl bg-white text-orange-700 hover:bg-white/90">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            상세 대시보드
                          </Button>
                        </div>
                      </motion.div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="rounded-3xl">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">처리된 문서</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">1,234</div>
                          <p className="text-xs text-muted-foreground">+12% 지난 시간 대비</p>
                        </CardContent>
                      </Card>
                      <Card className="rounded-3xl">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">평균 처리 시간</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">2.3초</div>
                          <p className="text-xs text-muted-foreground">-0.5초 개선</p>
                        </CardContent>
                      </Card>
                      <Card className="rounded-3xl">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">오류율</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">0.2%</div>
                          <p className="text-xs text-muted-foreground">정상 범위</p>
                        </CardContent>
                      </Card>
                      <Card className="rounded-3xl">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">활성 스트림</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">8</div>
                          <p className="text-xs text-muted-foreground">모두 정상 작동</p>
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
  )
}
