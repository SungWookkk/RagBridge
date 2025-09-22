"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Settings,
  Menu,
  PanelLeft,
  Bell,
  Brain,
  Database,
  Zap,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { TooltipContent } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"

/**
 * 대시보드 레이아웃 컴포넌트
 * 
 * @description
 * - 모든 대시보드 페이지의 공통 레이아웃 구조
 * - 사이드바, 헤더, 메인 콘텐츠 영역을 포함
 * - 반응형 디자인 및 모바일 지원
 * - 성능 최적화를 위한 상태 관리 최소화
 */
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 사이드바 상태 관리
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // 알림 수 (실제로는 API에서 가져올 데이터)
  const [notifications] = useState(3)

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

        {/* 사이드바 컴포넌트 */}
        <Sidebar 
          sidebarOpen={sidebarOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* 메인 콘텐츠 영역 */}
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
              <div className="flex items-center gap-3">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
                  title="메인 페이지로 이동"
                >
                  <Brain className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-semibold">SmartDocs 문서 처리</h1>
                </Link>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse" />
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
                  <TooltipContent>시스템 스트림</TooltipContent>
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
                  <TooltipContent>처리 알림</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>시스템 설정</TooltipContent>
                </Tooltip>

                <Avatar className="h-9 w-9 border-2 border-primary">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* 메인 콘텐츠 */}
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
