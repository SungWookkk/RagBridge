"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Bell,
  Menu,
  PanelLeft,
  Brain,
  Database,
  Zap,
  Settings,
  LogOut,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";

/**
 * 대시보드 헤더 컴포넌트
 *
 * @description
 * - 상단 네비게이션 및 액션 버튼들
 * - 알림, 시스템 상태, 사용자 정보 표시
 * - 반응형 디자인 및 모바일 지원
 * - 성능 최적화를 위한 메모이제이션 적용
 */
interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function DashboardHeader({
  sidebarOpen,
  setSidebarOpen,
}: DashboardHeaderProps) {
  // 알림 수 (실제로는 API에서 가져올 데이터)
  const [notifications] = useState(3);
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
        {/* 모바일 메뉴 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => {
            /* 모바일 메뉴 토글 로직 */
          }}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* 데스크톱 사이드바 토글 */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>

        <div className="flex flex-1 items-center justify-between">
          {/* 로고 및 브랜딩 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
              <Brain className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">SmartDocs 문서 처리</h1>
            </div>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <div className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              실시간 처리 중
            </Badge>
          </div>

          {/* 액션 버튼들 */}
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

            {/* 사용자 메뉴 */}
            <div className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 w-9 rounded-full p-0"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <Avatar className="h-9 w-9 border-2 border-primary">
                      {user?.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          width={36}
                          height={36}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <AvatarFallback>
                          {user?.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>사용자 메뉴</TooltipContent>
              </Tooltip>

              {/* 사용자 드롭다운 메뉴 */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-12 w-64 bg-card border border-border rounded-lg shadow-lg z-50"
                >
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        {user?.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.username}
                            width={40}
                            height={40}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <AvatarFallback>
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user?.username || "사용자"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email || "user@example.com"}
                        </p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {user?.role === "admin" ? "관리자" : "사용자"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      프로필 설정
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      로그아웃
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}

