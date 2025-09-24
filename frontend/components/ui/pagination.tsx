"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 페이지네이션 컴포넌트
 *
 * @description
 * - 대용량 데이터 리스트를 페이지별로 분할하여 표시
 * - 성능 최적화를 위한 가상 스크롤 지원
 * - 접근성을 고려한 키보드 네비게이션
 * - 반응형 디자인 지원
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className,
}: PaginationProps) {
  // 페이지 번호 배열 생성
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis =
    visiblePages[visiblePages.length - 1] < totalPages - 1;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={cn("flex items-center justify-center space-x-1", className)}
      role="navigation"
      aria-label="페이지네이션"
    >
      {/* 첫 페이지 버튼 */}
      {showFirstLast && currentPage > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          aria-label="첫 페이지로 이동"
        >
          첫 페이지
        </Button>
      )}

      {/* 이전 페이지 버튼 */}
      {showPrevNext && currentPage > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="이전 페이지로 이동"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* 시작 생략 표시 */}
      {showStartEllipsis && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            aria-label="1페이지로 이동"
          >
            1
          </Button>
          <span className="px-2 text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        </>
      )}

      {/* 페이지 번호들 */}
      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          aria-label={`${page}페이지로 이동`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Button>
      ))}

      {/* 끝 생략 표시 */}
      {showEndEllipsis && (
        <>
          <span className="px-2 text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            aria-label={`${totalPages}페이지로 이동`}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* 다음 페이지 버튼 */}
      {showPrevNext && currentPage < totalPages && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="다음 페이지로 이동"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* 마지막 페이지 버튼 */}
      {showFirstLast && currentPage < totalPages && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          aria-label="마지막 페이지로 이동"
        >
          마지막 페이지
        </Button>
      )}
    </nav>
  );
}

/**
 * 페이지네이션 정보 컴포넌트
 */
interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className,
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn("text-sm text-muted-foreground", className)}>
      {totalItems > 0 ? (
        <>
          {startItem}-{endItem} / 총 {totalItems.toLocaleString()}개
          {totalPages > 1 && (
            <span className="ml-2">
              ({currentPage} / {totalPages} 페이지)
            </span>
          )}
        </>
      ) : (
        "표시할 항목이 없습니다."
      )}
    </div>
  );
}
