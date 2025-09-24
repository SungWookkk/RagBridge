"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

/**
 * 가상 스크롤 컴포넌트
 *
 * @description
 * - 대용량 리스트를 효율적으로 렌더링
 * - DOM 노드 수를 제한하여 성능 최적화
 * - 스크롤 위치에 따라 동적으로 아이템 렌더링
 * - 접근성을 고려한 키보드 네비게이션
 */
interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className,
  onScroll,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 가상화 계산
  const virtualizedItems = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight),
    );

    // 오버스캔 적용
    const startIndexWithOverscan = Math.max(0, startIndex - overscan);
    const endIndexWithOverscan = Math.min(
      items.length - 1,
      endIndex + overscan,
    );

    return {
      totalHeight,
      startIndex: startIndexWithOverscan,
      endIndex: endIndexWithOverscan,
      visibleItems: items.slice(
        startIndexWithOverscan,
        endIndexWithOverscan + 1,
      ),
    };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  // 스크롤 핸들러
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    },
    [onScroll],
  );

  // 키보드 네비게이션
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!containerRef.current) return;

      const { key } = e;
      const currentScrollTop = containerRef.current.scrollTop;
      const scrollAmount = itemHeight * 3; // 3개 아이템씩 스크롤

      switch (key) {
        case "ArrowDown":
          e.preventDefault();
          containerRef.current.scrollTop = Math.min(
            currentScrollTop + scrollAmount,
            virtualizedItems.totalHeight - containerHeight,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          containerRef.current.scrollTop = Math.max(
            currentScrollTop - scrollAmount,
            0,
          );
          break;
        case "Home":
          e.preventDefault();
          containerRef.current.scrollTop = 0;
          break;
        case "End":
          e.preventDefault();
          containerRef.current.scrollTop =
            virtualizedItems.totalHeight - containerHeight;
          break;
      }
    },
    [itemHeight, containerHeight, virtualizedItems.totalHeight],
  );

  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="listbox"
      aria-label="가상 스크롤 리스트"
    >
      <div
        style={{
          height: virtualizedItems.totalHeight,
          position: "relative",
        }}
      >
        <div
          style={{
            transform: `translateY(${virtualizedItems.startIndex * itemHeight}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {virtualizedItems.visibleItems.map((item, index) => (
            <div
              key={virtualizedItems.startIndex + index}
              style={{ height: itemHeight }}
              role="option"
              aria-selected={false}
              aria-posinset={virtualizedItems.startIndex + index + 1}
              aria-setsize={items.length}
            >
              {renderItem(item, virtualizedItems.startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 가상 스크롤 훅
 */
interface UseVirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualScroll<T>(
  items: T[],
  { itemHeight, containerHeight, overscan = 5 }: UseVirtualScrollOptions,
) {
  const [scrollTop, setScrollTop] = useState(0);

  const virtualizedItems = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight),
    );

    const startIndexWithOverscan = Math.max(0, startIndex - overscan);
    const endIndexWithOverscan = Math.min(
      items.length - 1,
      endIndex + overscan,
    );

    return {
      totalHeight,
      startIndex: startIndexWithOverscan,
      endIndex: endIndexWithOverscan,
      visibleItems: items.slice(
        startIndexWithOverscan,
        endIndexWithOverscan + 1,
      ),
    };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const handleScroll = useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop);
  }, []);

  return {
    virtualizedItems,
    handleScroll,
    scrollTop,
  };
}

/**
 * 무한 스크롤 가상 스크롤 컴포넌트
 */
interface InfiniteVirtualScrollProps<T> extends VirtualScrollProps<T> {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
}

export function InfiniteVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className,
  onScroll,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 1000,
}: InfiniteVirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const virtualizedItems = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight),
    );

    const startIndexWithOverscan = Math.max(0, startIndex - overscan);
    const endIndexWithOverscan = Math.min(
      items.length - 1,
      endIndex + overscan,
    );

    return {
      totalHeight,
      startIndex: startIndexWithOverscan,
      endIndex: endIndexWithOverscan,
      visibleItems: items.slice(
        startIndexWithOverscan,
        endIndexWithOverscan + 1,
      ),
    };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);

      // 무한 스크롤 트리거
      if (
        hasNextPage &&
        !isFetchingNextPage &&
        newScrollTop + containerHeight >=
          virtualizedItems.totalHeight - threshold
      ) {
        fetchNextPage();
      }
    },
    [
      onScroll,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      containerHeight,
      virtualizedItems.totalHeight,
      threshold,
    ],
  );

  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      tabIndex={0}
      role="listbox"
      aria-label="무한 가상 스크롤 리스트"
    >
      <div
        style={{
          height: virtualizedItems.totalHeight,
          position: "relative",
        }}
      >
        <div
          style={{
            transform: `translateY(${virtualizedItems.startIndex * itemHeight}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {virtualizedItems.visibleItems.map((item, index) => (
            <div
              key={virtualizedItems.startIndex + index}
              style={{ height: itemHeight }}
              role="option"
              aria-selected={false}
              aria-posinset={virtualizedItems.startIndex + index + 1}
              aria-setsize={items.length}
            >
              {renderItem(item, virtualizedItems.startIndex + index)}
            </div>
          ))}
        </div>
      </div>

      {/* 로딩 인디케이터 */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
