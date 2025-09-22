"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Search,
  Settings,
  X,
  ChevronDown,
  Wand2,
  FileCheck,
  Brain,
  Shield,
  Cpu,
  Activity,
  Layers,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

/**
 * 사이드바 네비게이션 아이템 타입 정의
 */
interface SidebarItem {
  title: string
  icon: React.ReactNode
  href?: string
  badge?: string
  items?: Array<{
    title: string
    href: string
    badge?: string
  }>
}

/**
 * 사이드바 네비게이션 설정
 * 
 * @description
 * - Next.js App Router 기반 네비게이션 구조
 * - 각 메뉴는 실제 페이지 경로와 연결
 * - 배지로 알림 및 상태 표시
 */
const sidebarItems: SidebarItem[] = [
  {
    title: "문서 처리 현황",
    icon: <Activity />,
    href: "/dashboard",
  },
  {
    title: "문서 관리",
    icon: <FileCheck />,
    badge: "3",
    items: [
      { title: "문서 업로드", href: "/dashboard/documents", badge: "3" },
      { title: "문서 읽기 현황", href: "/dashboard/documents/processing" },
      { title: "데이터 추출 결과", href: "/dashboard/documents/extraction" },
      { title: "검증 완료 문서", href: "/dashboard/documents/validation" },
    ],
  },
  {
    title: "스마트 검색",
    icon: <Brain />,
    items: [
      { title: "AI 질의응답", href: "/dashboard/search" },
      { title: "스마트 검색", href: "/dashboard/search/smart" },
      { title: "문서 인덱스 관리", href: "/dashboard/search/index" },
      { title: "출처 문서 분석", href: "/dashboard/search/sources" },
    ],
  },
  {
    title: "스마트 검증",
    icon: <Shield />,
    items: [
      { title: "검증 룰 설정", href: "/dashboard/validation/rules" },
      { title: "자동 필드 매핑", href: "/dashboard/validation/mapping" },
      { title: "데이터 정합성 검증", href: "/dashboard/validation/consistency" },
      { title: "검토 대기 목록", href: "/dashboard/validation/review" },
    ],
  },
  {
    title: "AI 모델 관리",
    icon: <Cpu />,
    items: [
      { title: "모델 성능 확인", href: "/dashboard/models/performance" },
      { title: "학습 데이터 관리", href: "/dashboard/models/training" },
      { title: "모델 업데이트", href: "/dashboard/models/deployment" },
      { title: "성능 비교 테스트", href: "/dashboard/models/testing" },
    ],
  },
  {
    title: "실시간 모니터링",
    icon: <Activity />,
    badge: "2",
    items: [
      { title: "시스템 상태", href: "/dashboard/monitoring" },
      { title: "처리 속도 & 응답시간", href: "/dashboard/monitoring/performance" },
      { title: "오류 알림", href: "/dashboard/monitoring/alerts", badge: "2" },
      { title: "성능 지표", href: "/dashboard/monitoring/metrics" },
    ],
  },
  {
    title: "프로젝트 관리",
    icon: <Layers />,
    items: [
      { title: "문서 프로젝트", href: "/dashboard/projects" },
      { title: "팀 권한 관리", href: "/dashboard/projects/permissions" },
      { title: "API 키 관리", href: "/dashboard/projects/api-keys" },
      { title: "사용량 분석", href: "/dashboard/projects/usage" },
    ],
  },
]

/**
 * 사이드바 컴포넌트 Props
 */
interface SidebarProps {
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

/**
 * 사이드바 컴포넌트
 * 
 * @description
 * - 네비게이션 메뉴 및 사용자 정보 표시
 * - 모바일/데스크톱 반응형 지원
 * - 현재 경로 기반 활성 상태 표시
 * - 하위 메뉴 확장/축소 기능
 */
export function Sidebar({ sidebarOpen, mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const pathname = usePathname()

  /**
   * 사이드바 아이템 확장/축소 토글
   */
  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  /**
   * 현재 경로가 활성 상태인지 확인
   */
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col border-r">
      <div className="flex items-center justify-between p-4">
        <Link 
          href="/" 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
          title="메인 페이지로 이동"
        >
          <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <Wand2 className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">SmartDocs</h2>
            <p className="text-xs text-muted-foreground">스마트 문서 처리</p>
          </div>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="md:hidden">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* 검색 컴포넌트 */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="검색..." className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2" />
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.title} className="mb-1">
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                    isActive(item.href) ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
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
                </Link>
              ) : (
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                    "hover:bg-muted"
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
                        expandedItems[item.title] ? "rotate-180" : ""
                      )}
                    />
                  )}
                </button>
              )}

              {item.items && expandedItems[item.title] && (
                <div className="mt-1 ml-6 space-y-1 border-l pl-3">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-3 py-2 text-sm hover:bg-muted",
                        isActive(subItem.href) ? "bg-primary/5 text-primary font-medium" : ""
                      )}
                    >
                      {subItem.title}
                      {subItem.badge && (
                        <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-xs">
                          {subItem.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* 하단 사용자 정보 */}
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
  )

  return (
    <>
      {/* 모바일 사이드바 */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </div>

      {/* 데스크톱 사이드바 */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r bg-background transition-transform duration-300 ease-in-out md:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </div>
    </>
  )
}
