"use client";

import { useState, useCallback } from "react";

/**
 * 검색 결과 인터페이스
 */
interface SearchResult {
  id: string;
  title: string;
  content: string;
  source: string;
  confidence: number;
  page?: number;
}

/**
 * 검색 히스토리 인터페이스
 */
interface SearchHistoryItem {
  query: string;
  result: string;
  time: string;
}

/**
 * 검색 기능 훅
 *
 * @description
 * - AI 기반 스마트 검색 기능
 * - 검색 히스토리 관리
 * - 검색 결과 캐싱 및 상태 관리
 */
export function useSearch() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([
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
  ]);

  /**
   * 검색 실행 함수
   *
   * @param query - 검색 쿼리
   */
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);

    try {
      // 실제 API 호출 시에는 이 부분을 실제 엔드포인트로 교체
      // const response = await api.post('/api/v1/search', { query })
      // const results = response.data

      // 현재는 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 샘플 검색 결과
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "회사 정책서 - 휴가 관련 규정",
          content:
            "직원은 연간 15일의 연차를 사용할 수 있으며, 휴가 신청은 최소 3일 전에 제출해야 합니다.",
          source: "회사 정책서.pdf",
          confidence: 0.95,
          page: 12,
        },
        {
          id: "2",
          title: "휴가 신청서 작성 가이드",
          content:
            "휴가 신청서는 HR 시스템을 통해 온라인으로 제출하며, 부서장의 승인이 필요합니다.",
          source: "HR 가이드.pdf",
          confidence: 0.88,
          page: 5,
        },
        {
          id: "3",
          title: "휴가 정산 및 보상 규정",
          content:
            "미사용 연차는 연말에 정산되며, 최대 5일까지 다음 연도로 이월 가능합니다.",
          source: "정산 규정.pdf",
          confidence: 0.82,
          page: 8,
        },
      ];

      setSearchResults(mockResults);

      // 검색 히스토리 추가
      const newHistoryItem: SearchHistoryItem = {
        query,
        result: `${mockResults.length}개 문서에서 관련 정보 발견`,
        time: "방금 전",
      };

      setSearchHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]); // 최대 10개 유지
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 검색 히스토리 삭제
   */
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  /**
   * 특정 검색 히스토리 삭제
   */
  const removeHistoryItem = useCallback((index: number) => {
    setSearchHistory((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    searchResults,
    isLoading,
    searchHistory,
    performSearch,
    clearHistory,
    removeHistoryItem,
  };
}
