import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * AI 검색 관련 타입 정의
 */
export interface SearchResult {
  answer: string;
  confidence: number;
  sources: SearchSource[];
  query: string;
  timestamp: string;
  processingTime: number;
}

export interface SearchSource {
  documentId: string;
  documentName: string;
  page: number;
  confidence: number;
  highlight: string;
  metadata?: Record<string, any>;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  answer: string;
  timestamp: string;
  category: string;
  resultCount: number;
  confidence: number;
}

export interface FavoriteItem {
  id: string;
  query: string;
  answer: string;
  savedAt: string;
  category: string;
  tags: string[];
}

export interface SearchSuggestion {
  text: string;
  category: string;
  popularity: number;
}

/**
 * AI 검색 데이터 훅
 *
 * @description
 * - RAG 기반 지능형 검색
 * - 실시간 스트림 응답
 * - 검색 히스토리 및 즐겨찾기 관리
 * - 검색 제안 및 필터링
 */
export function useAISearch() {
  const queryClient = useQueryClient();
  const [currentQuery, setCurrentQuery] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  /**
   * 검색 결과 조회
   */
  const {
    data: searchResults = {
      answer: "",
      confidence: 0,
      sources: [],
      query: "",
      timestamp: "",
      processingTime: 0,
    },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ai-search-results", currentQuery],
    queryFn: async (): Promise<SearchResult> => {
      if (!currentQuery) {
        return {
          answer: "",
          confidence: 0,
          sources: [],
          query: "",
          timestamp: "",
          processingTime: 0,
        };
      }

      // TODO: 실제 API 호출로 교체
      // const response = await api.post('/api/v1/rag/query', {
      //   query: currentQuery,
      //   filters: selectedFilters,
      //   stream: true
      // })
      // return response.data

      // 목 데이터
      const mockAnswer = `검색하신 "${currentQuery}"에 대한 답변입니다. 
      
관련 문서를 분석한 결과, 다음과 같은 정보를 확인할 수 있습니다:

1. 주요 내용: 계약서에서 지급 조건은 일반적으로 계약 체결 후 30일 이내에 지급하도록 되어 있습니다.

2. 세부 사항: 
   - 선급금: 계약 금액의 30%는 계약 체결 시 지급
   - 중간금: 작업 진행률 50% 달성 시 40% 지급
   - 잔금: 작업 완료 및 검수 후 30% 지급

3. 특별 조건: 지연 지급 시 연 5%의 지연 이자를 부과합니다.

위 내용은 관련 계약서 문서들을 기반으로 한 정보입니다.`;

      return {
        answer: mockAnswer,
        confidence: 92,
        sources: [
          {
            documentId: "doc-001",
            documentName: "계약서_2024.pdf",
            page: 3,
            confidence: 95,
            highlight: "지급 조건: 계약 체결 후 30일 이내 지급...",
            metadata: { section: "지급 조건", paragraph: 2 },
          },
          {
            documentId: "doc-002",
            documentName: "제안서_프로젝트.docx",
            page: 5,
            confidence: 88,
            highlight: "프로젝트 비용 지급 일정표...",
            metadata: { section: "비용 계획", table: "지급 일정" },
          },
          {
            documentId: "doc-003",
            documentName: "보고서_분석.pdf",
            page: 12,
            confidence: 85,
            highlight: "지급 조건 분석 및 권고사항...",
            metadata: { section: "분석 결과", category: "지급 조건" },
          },
        ],
        query: currentQuery,
        timestamp: new Date().toISOString(),
        processingTime: 1.2,
      };
    },
    enabled: !!currentQuery,
    staleTime: 5 * 60 * 1000, // 5분
  });

  /**
   * 검색 히스토리 조회
   */
  const {
    data: searchHistory = [],
  } = useQuery({
    queryKey: ["search-history"],
    queryFn: async (): Promise<SearchHistoryItem[]> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/rag/history')
      // return response.data

      // 목 데이터
      return [
        {
          id: "hist-001",
          query: "계약서에서 지급 조건은 어떻게 되어 있나요?",
          answer: "계약서에서 지급 조건은 일반적으로 계약 체결 후 30일 이내에 지급하도록 되어 있습니다...",
          timestamp: "2024-01-24T14:30:00Z",
          category: "계약서",
          resultCount: 3,
          confidence: 92,
        },
        {
          id: "hist-002",
          query: "프로젝트 일정은 언제까지인가요?",
          answer: "프로젝트 일정은 2024년 6월 30일까지로 계획되어 있습니다...",
          timestamp: "2024-01-24T13:15:00Z",
          category: "프로젝트",
          resultCount: 2,
          confidence: 88,
        },
        {
          id: "hist-003",
          query: "보고서 요약을 해주세요",
          answer: "보고서 요약: 2024년 1분기 매출은 전년 대비 15% 증가했습니다...",
          timestamp: "2024-01-24T12:00:00Z",
          category: "보고서",
          resultCount: 1,
          confidence: 95,
        },
      ];
    },
    staleTime: 10 * 60 * 1000, // 10분
  });

  /**
   * 즐겨찾기 조회
   */
  const {
    data: favorites = [],
  } = useQuery({
    queryKey: ["search-favorites"],
    queryFn: async (): Promise<FavoriteItem[]> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/rag/favorites')
      // return response.data

      // 목 데이터
      return [
        {
          id: "fav-001",
          query: "계약서에서 지급 조건은 어떻게 되어 있나요?",
          answer: "계약서에서 지급 조건은 일반적으로 계약 체결 후 30일 이내에 지급하도록 되어 있습니다...",
          savedAt: "2024-01-24T14:30:00Z",
          category: "계약서",
          tags: ["지급", "조건", "계약"],
        },
        {
          id: "fav-002",
          query: "프로젝트 일정은 언제까지인가요?",
          answer: "프로젝트 일정은 2024년 6월 30일까지로 계획되어 있습니다...",
          savedAt: "2024-01-24T13:15:00Z",
          category: "프로젝트",
          tags: ["일정", "마감", "계획"],
        },
      ];
    },
    staleTime: 10 * 60 * 1000, // 10분
  });

  /**
   * 검색 제안 조회
   */
  const {
    data: searchSuggestions = [],
  } = useQuery({
    queryKey: ["search-suggestions"],
    queryFn: async (): Promise<SearchSuggestion[]> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/rag/suggestions')
      // return response.data

      // 목 데이터
      return [
        { text: "계약서 지급 조건", category: "계약서", popularity: 95 },
        { text: "프로젝트 일정", category: "프로젝트", popularity: 88 },
        { text: "보고서 요약", category: "보고서", popularity: 82 },
        { text: "매뉴얼 사용법", category: "매뉴얼", popularity: 75 },
        { text: "이미지 분석", category: "이미지", popularity: 70 },
      ];
    },
    staleTime: 30 * 60 * 1000, // 30분
  });

  /**
   * 검색 실행 뮤테이션
   */
  const searchMutation = useMutation({
    mutationFn: async ({ query, filters }: { query: string; filters: string[] }): Promise<SearchResult> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.post('/api/v1/rag/query', {
      //   query,
      //   filters,
      //   stream: true
      // })
      // return response.data

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        answer: `"${query}"에 대한 답변입니다.`,
        confidence: 90,
        sources: [],
        query,
        timestamp: new Date().toISOString(),
        processingTime: 1.0,
      };
    },
    onSuccess: (result) => {
      // 검색 히스토리 새로고침
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
    onError: (error) => {
      console.error("검색 실패:", error);
    },
  });

  /**
   * 즐겨찾기 추가 뮤테이션
   */
  const saveToFavoritesMutation = useMutation({
    mutationFn: async ({ query, answer }: { query: string; answer: string }): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post('/api/v1/rag/favorites', { query, answer })

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      // 즐겨찾기 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["search-favorites"] });
    },
    onError: (error) => {
      console.error("즐겨찾기 추가 실패:", error);
    },
  });

  /**
   * 즐겨찾기 제거 뮤테이션
   */
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (favoriteId: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.delete(`/api/v1/rag/favorites/${favoriteId}`)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      // 즐겨찾기 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["search-favorites"] });
    },
    onError: (error) => {
      console.error("즐겨찾기 제거 실패:", error);
    },
  });

  /**
   * 검색 히스토리 삭제 뮤테이션
   */
  const clearHistoryMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.delete('/api/v1/rag/history')

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      // 검색 히스토리 새로고침
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
    onError: (error) => {
      console.error("검색 히스토리 삭제 실패:", error);
    },
  });

  /**
   * 검색 실행 함수
   */
  const sendQuery = useCallback(async (query: string, filters: string[] = []): Promise<SearchResult> => {
    setCurrentQuery(query);
    setIsStreaming(true);
    
    try {
      const result = await searchMutation.mutateAsync({ query, filters });
      setIsStreaming(false);
      return result;
    } catch (error) {
      setIsStreaming(false);
      throw error;
    }
  }, [searchMutation]);

  /**
   * 즐겨찾기 추가 함수
   */
  const saveToFavorites = useCallback(async (query: string, answer: string): Promise<void> => {
    await saveToFavoritesMutation.mutateAsync({ query, answer });
  }, [saveToFavoritesMutation]);

  /**
   * 즐겨찾기 제거 함수
   */
  const removeFromFavorites = useCallback(async (favoriteId: string): Promise<void> => {
    await removeFromFavoritesMutation.mutateAsync(favoriteId);
  }, [removeFromFavoritesMutation]);

  /**
   * 검색 히스토리 삭제 함수
   */
  const clearHistory = useCallback(async (): Promise<void> => {
    await clearHistoryMutation.mutateAsync();
  }, [clearHistoryMutation]);

  /**
   * 검색 제안 조회 함수 (동기 버전)
   */
  const getSearchSuggestions = useCallback((query: string): SearchSuggestion[] => {
    if (!query.trim()) {
      return searchSuggestions.slice(0, 5); // 기본 5개 제안
    }
    
    // 쿼리와 일치하는 제안 필터링
    return searchSuggestions.filter(suggestion => 
      suggestion.text.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // 최대 5개
  }, [searchSuggestions]);

  return {
    // 데이터
    searchResults,
    searchHistory,
    favorites,
    searchSuggestions,
    
    // 상태
    isLoading: isLoading || searchMutation.isPending,
    isStreaming,
    currentQuery,
    
    // 에러
    error: error || searchMutation.error,
    
    // 함수들
    sendQuery,
    saveToFavorites,
    removeFromFavorites,
    clearHistory,
    getSearchSuggestions,
    
    // 뮤테이션 상태
    isSavingToFavorites: saveToFavoritesMutation.isPending,
    isRemovingFromFavorites: removeFromFavoritesMutation.isPending,
    isClearingHistory: clearHistoryMutation.isPending,
  };
}
