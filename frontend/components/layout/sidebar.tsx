"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Search,
  Workflow,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  X,
  ChevronDown,
  Wand2,
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Shield,
  Key,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/**
 * 사이드바 네비게이션 아이템 타입 정의
 *
 * @description
 * - 사용자 중심의 직관적인 메뉴 구조
 * - 실제 라우트와 연결된 네비게이션
 * - 배지로 알림 및 상태 표시
 */
interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string;
  tooltip?: string;
  items?: Array<{
    title: string;
    href: string;
    badge?: string;
    tooltip?: string;
  }>;
}

/**
 * 사용자 중심 사이드바 네비게이션 설정
 *
 * @description
 * - 사용자 가치 중심의 메뉴 구성
 * - 실제 라우트와 일치하는 href 설정
 * - 기술 용어 대신 사용자 행동 중심의 명칭 사용
 */
const sidebarItems: SidebarItem[] = [
  {
    title: "홈 & 업무 현황",
    icon: <Home />,
    href: "/dashboard",
    tooltip: "전체 업무 현황 및 요약 정보",
  },
  {
    title: "문서 작업",
    icon: <FileText />,
    badge: "3",
    tooltip: "문서 업로드, 처리, 검토 관리",
    items: [
      { 
        title: "문서 업로드", 
        href: "/dashboard/documents", 
        badge: "3",
        tooltip: "새 문서 업로드 및 처리 시작"
      },
      { 
        title: "진행 중인 문서", 
        href: "/dashboard/documents/processing",
        tooltip: "현재 처리 중인 문서 현황"
      },
      { 
        title: "검토 대기", 
        href: "/dashboard/documents/review",
        tooltip: "승인이 필요한 문서 목록"
      },
      { 
        title: "완료된 문서", 
        href: "/dashboard/documents/completed",
        tooltip: "처리 완료된 문서 목록"
      },
    ],
  },
  {
    title: "지식 검색",
    icon: <Search />,
    tooltip: "AI 기반 스마트 검색 및 질의응답",
    items: [
      { 
        title: "AI 검색", 
        href: "/dashboard/search",
        tooltip: "자연어로 질문하고 답변 받기"
      },
      { 
        title: "검색 기록", 
        href: "/dashboard/search/history",
        tooltip: "이전 검색 결과 및 히스토리"
      },
      { 
        title: "즐겨찾기", 
        href: "/dashboard/search/favorites",
        tooltip: "자주 사용하는 검색 결과"
      },
    ],
  },
  {
    title: "워크플로우 자동화",
    icon: <Workflow />,
    tooltip: "문서 처리 규칙 및 자동화 설정",
    items: [
      { 
        title: "검증 규칙", 
        href: "/dashboard/validation/rules",
        tooltip: "문서 품질 검증 규칙 설정"
      },
      { 
        title: "자동 매핑", 
        href: "/dashboard/validation/mapping",
        tooltip: "필드 자동 매핑 규칙"
      },
      { 
        title: "재처리 큐", 
        href: "/dashboard/validation/reprocess",
        tooltip: "처리 실패 문서 재처리"
      },
    ],
  },
  {
    title: "조직 & 권한",
    icon: <Users />,
    tooltip: "팀 관리 및 권한 설정",
    items: [
      { 
        title: "프로젝트", 
        href: "/dashboard/projects",
        tooltip: "문서 프로젝트 관리"
      },
      { 
        title: "팀원 관리", 
        href: "/dashboard/projects/members",
        tooltip: "팀원 초대 및 권한 관리"
      },
      { 
        title: "API 키", 
        href: "/dashboard/projects/api-keys",
        tooltip: "API 접근 키 관리"
      },
    ],
  },
  {
    title: "사용량 & 과금",
    icon: <CreditCard />,
    tooltip: "사용량 현황 및 요금 정보",
    items: [
      { 
        title: "사용량 현황", 
        href: "/dashboard/billing/usage",
        tooltip: "월간 사용량 및 한도 확인"
      },
      { 
        title: "요금 정보", 
        href: "/dashboard/billing/pricing",
        tooltip: "요금제 및 결제 정보"
      },
      { 
        title: "사용량 분석", 
        href: "/dashboard/billing/analytics",
        tooltip: "사용 패턴 및 트렌드 분석"
      },
    ],
  },
  {
    title: "시스템 현황",
    icon: <BarChart3 />,
    badge: "2",
    tooltip: "시스템 상태 및 성능 모니터링",
    items: [
      { 
        title: "시스템 상태", 
        href: "/dashboard/monitoring",
        tooltip: "전체 시스템 상태 확인"
      },
      { 
        title: "성능 지표", 
        href: "/dashboard/monitoring/performance",
        tooltip: "처리 속도 및 응답시간"
      },
      { 
        title: "알림 센터", 
        href: "/dashboard/monitoring/alerts",
        badge: "2",
        tooltip: "시스템 알림 및 오류 메시지"
      },
    ],
  },
];

/**
 * 사이드바 컴포넌트 Props
 */
interface SidebarProps {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

/**
 * 사용자 중심 사이드바 컴포넌트
 *
 * @description
 * - 사용자 가치 중심의 직관적인 네비게이션
 * - 실제 라우트와 일치하는 메뉴 구조
 * - 기술 용어 대신 사용자 행동 중심의 명칭
 * - 모바일/데스크톱 반응형 지원
 */
export function Sidebar({
  sidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  /**
   * 사이드바 아이템 확장/축소 토글
   *
   * @param title - 토글할 아이템의 제목
   * @description
   * - 하위 메뉴의 펼침/접힘 상태를 관리
   * - 상태 객체에서 해당 키의 boolean 값을 토글
   */
  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  /**
   * 현재 경로가 활성 상태인지 확인
   *
   * @param href - 확인할 경로
   * @description
   * - 대시보드 메인 페이지는 정확히 일치해야 함
   * - 하위 페이지는 경로가 시작되는지 확인
   */
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  /**
   * 사이드바 콘텐츠 컴포넌트
   *
   * @description
   * - 모바일과 데스크톱에서 공통으로 사용하는 사이드바 내용
   * - 헤더, 검색, 네비게이션, 사용자 정보를 포함
   */
  const SidebarContent = () => (
    <div className="flex h-full flex-col border-r">
      {/* 헤더 */}
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* 빠른 검색 */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="빠른 검색..."
            className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2"
          />
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
                    "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted",
                  )}
                  title={item.tooltip}
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
                </Link>
              ) : (
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
                  )}
                  onClick={() => item.items && toggleExpanded(item.title)}
                  title={item.tooltip}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className="rounded-full px-2 py-0.5 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {item.items && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedItems[item.title] ? "rotate-180" : "",
                        )}
                      />
                    )}
                  </div>
                </button>
              )}

              {/* 하위 메뉴 */}
              {item.items && expandedItems[item.title] && (
                <div className="mt-1 ml-6 space-y-1 border-l pl-3">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-3 py-2 text-sm hover:bg-muted transition-colors",
                        isActive(subItem.href)
                          ? "bg-primary/5 text-primary font-medium"
                          : "",
                      )}
                      title={subItem.tooltip}
                    >
                      <span>{subItem.title}</span>
                      {subItem.badge && (
                        <Badge
                          variant="outline"
                          className="ml-auto rounded-full px-2 py-0.5 text-xs"
                        >
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

      {/* 하단 사용자 정보 및 설정 */}
      <div className="border-t p-3">
        <div className="space-y-1">
          {/* 설정 및 지원 */}
          <div className="grid grid-cols-2 gap-1 mb-3">
            <button className="flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
              <Settings className="h-4 w-4" />
              <span>설정</span>
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
              <HelpCircle className="h-4 w-4" />
              <span>도움말</span>
            </button>
          </div>

          {/* 사용자 프로필 */}
          <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <Avatar className="h-6 w-6">
                <AvatarFallback>김</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="font-medium">김개발</div>
                <div className="text-xs text-muted-foreground">개발팀</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Pro</Badge>
              <ChevronDown className="h-3 w-3" />
            </div>
          </button>

          {/* 사용량 요약 (확장 가능) */}
          <div className="text-xs text-muted-foreground px-3 py-1">
            <div className="flex items-center justify-between">
              <span>이번 달 사용량</span>
              <span className="font-medium">1,247/2,000</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1 mt-1">
              <div className="bg-primary h-1 rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
  );
}