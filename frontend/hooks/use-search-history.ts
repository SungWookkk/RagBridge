import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * 검색 기록 관련 타입 정의
 */
export interface SearchHistoryItem {
  id: string;
  query: string;
  answer: string;
  timestamp: string;
  user: string;
  category: string;
  status: "success" | "partial" | "failed";
  resultCount: number;
  confidence: number;
  responseTime: number;
  sources: string[];
  tags: string[];
}

export interface SearchStatistics {
  totalSearches: number;
  successRate: number;
  averageResponseTime: number;
  mostPopularCategory: string;
  dailySearches: Array<{
    date: string;
    count: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  averageConfidence: number;
  topQueries: Array<{
    query: string;
    count: number;
    category: string;
  }>;
}

export interface SearchTrends {
  weeklyTrends: Array<{
    week: string;
    searches: number;
    successRate: number;
  }>;
  categoryTrends: Array<{
    category: string;
    trend: "up" | "down" | "stable";
    change: number;
  }>;
  popularKeywords: Array<{
    keyword: string;
    frequency: number;
    trend: "up" | "down" | "stable";
  }>;
  peakHours: Array<{
    hour: number;
    searches: number;
  }>;
}

/**
 * 검색 기록 데이터 훅
 *
 * @description
 * - 검색 히스토리 조회 및 관리
 * - 검색 통계 및 트렌드 분석
 * - 검색 기록 삭제, 내보내기, 즐겨찾기 기능
 * - 검색 패턴 및 성능 분석
 */
export function useSearchHistory() {
  const queryClient = useQueryClient();

  /**
   * 검색 기록 목록 조회
   */
  const {
    data: searchHistory = [],
    isLoading,
    error,
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
          answer: "계약서에서 지급 조건은 일반적으로 계약 체결 후 30일 이내에 지급하도록 되어 있습니다. 선급금 30%, 중간금 40%, 잔금 30%로 구성되며, 지연 시 연 5%의 지연 이자가 부과됩니다.",
          timestamp: "2024-01-24T14:30:00Z",
          user: "김철수",
          category: "계약서",
          status: "success",
          resultCount: 3,
          confidence: 92,
          responseTime: 1.2,
          sources: ["계약서_2024.pdf", "제안서_프로젝트.docx", "보고서_분석.pdf"],
          tags: ["지급", "조건", "계약"],
        },
        {
          id: "hist-002",
          query: "프로젝트 일정은 언제까지인가요?",
          answer: "프로젝트 일정은 2024년 6월 30일까지로 계획되어 있습니다. 주요 마일스톤은 3월 말 1차 검토, 5월 말 2차 검토, 6월 말 최종 완료입니다.",
          timestamp: "2024-01-24T13:15:00Z",
          user: "박민수",
          category: "프로젝트",
          status: "success",
          resultCount: 2,
          confidence: 88,
          responseTime: 0.8,
          sources: ["제안서_프로젝트.docx", "프로젝트_계획서.pdf"],
          tags: ["일정", "마감", "계획"],
        },
        {
          id: "hist-003",
          query: "보고서 요약을 해주세요",
          answer: "보고서 요약: 2024년 1분기 매출은 전년 대비 15% 증가했습니다. 주요 성장 요인은 신규 고객 확보와 기존 고객의 사용량 증가입니다.",
          timestamp: "2024-01-24T12:00:00Z",
          user: "최지영",
          category: "보고서",
          status: "success",
          resultCount: 1,
          confidence: 95,
          responseTime: 2.1,
          sources: ["보고서_분석.pdf"],
          tags: ["요약", "매출", "성장"],
        },
        {
          id: "hist-004",
          query: "매뉴얼 사용법을 알려주세요",
          answer: "매뉴얼 사용법: 1) 로그인 후 대시보드 접속 2) 문서 업로드 3) 검증 규칙 설정 4) 처리 결과 확인. 자세한 내용은 매뉴얼 3-5페이지를 참조하세요.",
          timestamp: "2024-01-24T11:45:00Z",
          user: "윤서연",
          category: "매뉴얼",
          status: "partial",
          resultCount: 1,
          confidence: 75,
          responseTime: 1.5,
          sources: ["매뉴얼_사용법.docx"],
          tags: ["사용법", "가이드", "매뉴얼"],
        },
        {
          id: "hist-005",
          query: "이미지에서 텍스트를 추출해주세요",
          answer: "이미지 텍스트 추출에 실패했습니다. 이미지 해상도가 낮거나 텍스트가 명확하지 않습니다. 더 선명한 이미지를 업로드해 주세요.",
          timestamp: "2024-01-24T10:30:00Z",
          user: "이준호",
          category: "이미지",
          status: "failed",
          resultCount: 0,
          confidence: 0,
          responseTime: 3.2,
          sources: [],
          tags: ["이미지", "텍스트", "추출"],
        },
        {
          id: "hist-006",
          query: "계약서에서 해지 조건은 무엇인가요?",
          answer: "계약서에서 해지 조건은 다음과 같습니다: 1) 상호 합의에 의한 해지 2) 일방적 해지 시 30일 전 서면 통지 3) 중대한 계약 위반 시 즉시 해지 가능",
          timestamp: "2024-01-24T09:15:00Z",
          user: "정수진",
          category: "계약서",
          status: "success",
          resultCount: 2,
          confidence: 90,
          responseTime: 1.8,
          sources: ["계약서_2024.pdf", "법무_가이드.docx"],
          tags: ["해지", "조건", "계약"],
        },
      ];
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchInterval: 60 * 1000, // 1분마다 새로고침
  });

  /**
   * 검색 통계 조회
   */
  const {
    data: statistics = {
      totalSearches: 0,
      successRate: 0,
      averageResponseTime: 0,
      mostPopularCategory: "",
      dailySearches: [],
      categoryDistribution: [],
      averageConfidence: 0,
      topQueries: [],
    },
  } = useQuery({
    queryKey: ["search-statistics"],
    queryFn: async (): Promise<SearchStatistics> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/rag/statistics')
      // return response.data

      // 목 데이터 (실제 검색 기록 기반으로 계산)
      const totalSearches = searchHistory.length;
      const successfulSearches = searchHistory.filter(item => item.status === "success").length;
      const successRate = totalSearches > 0 ? Math.round((successfulSearches / totalSearches) * 100) : 0;
      const averageResponseTime = totalSearches > 0 
        ? Math.round((searchHistory.reduce((acc, item) => acc + item.responseTime, 0) / totalSearches) * 10) / 10
        : 0;
      const averageConfidence = totalSearches > 0
        ? Math.round(searchHistory.reduce((acc, item) => acc + item.confidence, 0) / totalSearches)
        : 0;

      // 카테고리별 분포
      const categoryCounts = searchHistory.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const categoryDistribution = Object.entries(categoryCounts)
        .map(([category, count]) => ({
          category,
          count,
          percentage: Math.round((count / totalSearches) * 100),
        }))
        .sort((a, b) => b.count - a.count);

      const mostPopularCategory = categoryDistribution[0]?.category || "";

      // 일별 검색 통계 (최근 7일)
      const dailySearches = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 20) + 5,
        };
      }).reverse();

      // 인기 검색어
      const queryCounts = searchHistory.reduce((acc, item) => {
        acc[item.query] = (acc[item.query] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topQueries = Object.entries(queryCounts)
        .map(([query, count]) => ({
          query,
          count,
          category: searchHistory.find(item => item.query === query)?.category || "",
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalSearches,
        successRate,
        averageResponseTime,
        mostPopularCategory,
        dailySearches,
        categoryDistribution,
        averageConfidence,
        topQueries,
      };
    },
    staleTime: 10 * 60 * 1000, // 10분
    refetchInterval: 5 * 60 * 1000, // 5분마다 새로고침
  });

  /**
   * 검색 트렌드 조회
   */
  const {
    data: trends = {
      weeklyTrends: [],
      categoryTrends: [],
      popularKeywords: [],
      peakHours: [],
    },
  } = useQuery({
    queryKey: ["search-trends"],
    queryFn: async (): Promise<SearchTrends> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/rag/trends')
      // return response.data

      // 목 데이터
      return {
        weeklyTrends: [
          { week: "2024-W03", searches: 45, successRate: 92 },
          { week: "2024-W04", searches: 52, successRate: 88 },
          { week: "2024-W05", searches: 48, successRate: 95 },
          { week: "2024-W06", searches: 61, successRate: 90 },
        ],
        categoryTrends: [
          { category: "계약서", trend: "up", change: 15 },
          { category: "프로젝트", trend: "stable", change: 2 },
          { category: "보고서", trend: "down", change: -8 },
          { category: "매뉴얼", trend: "up", change: 12 },
          { category: "이미지", trend: "down", change: -5 },
        ],
        popularKeywords: [
          { keyword: "지급 조건", frequency: 25, trend: "up" },
          { keyword: "프로젝트 일정", frequency: 18, trend: "stable" },
          { keyword: "보고서 요약", frequency: 15, trend: "down" },
          { keyword: "사용법", frequency: 12, trend: "up" },
          { keyword: "해지 조건", frequency: 8, trend: "up" },
        ],
        peakHours: [
          { hour: 9, searches: 15 },
          { hour: 10, searches: 22 },
          { hour: 11, searches: 18 },
          { hour: 14, searches: 25 },
          { hour: 15, searches: 20 },
          { hour: 16, searches: 16 },
        ],
      };
    },
    staleTime: 30 * 60 * 1000, // 30분
    refetchInterval: 15 * 60 * 1000, // 15분마다 새로고침
  });

  /**
   * 검색 기록 삭제 뮤테이션
   */
  const deleteHistoryItemMutation = useMutation({
    mutationFn: async (itemId: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.delete(`/api/v1/rag/history/${itemId}`)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: (_, itemId) => {
      // 로컬 상태에서 제거
      queryClient.setQueryData(["search-history"], (oldHistory: SearchHistoryItem[] = []) =>
        oldHistory.filter(item => item.id !== itemId)
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["search-statistics"] });
    },
    onError: (error) => {
      console.error("검색 기록 삭제 실패:", error);
    },
  });

  /**
   * 검색 기록 전체 삭제 뮤테이션
   */
  const clearHistoryMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.delete('/api/v1/rag/history')

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      // 로컬 상태 초기화
      queryClient.setQueryData(["search-history"], []);
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["search-statistics"] });
    },
    onError: (error) => {
      console.error("검색 기록 전체 삭제 실패:", error);
    },
  });

  /**
   * 검색 기록 내보내기 뮤테이션
   */
  const exportHistoryMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/rag/history/export')
      // const blob = new Blob([response.data], { type: 'text/csv' })
      // const url = window.URL.createObjectURL(blob)
      // const link = document.createElement('a')
      // link.href = url
      // link.download = `search-history-${new Date().toISOString().split('T')[0]}.csv`
      // link.click()

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
    },
    onError: (error) => {
      console.error("검색 기록 내보내기 실패:", error);
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
   * 검색 기록 삭제 함수
   */
  const deleteHistoryItem = async (itemId: string): Promise<void> => {
    await deleteHistoryItemMutation.mutateAsync(itemId);
  };

  /**
   * 검색 기록 전체 삭제 함수
   */
  const clearHistory = async (): Promise<void> => {
    await clearHistoryMutation.mutateAsync();
  };

  /**
   * 검색 기록 내보내기 함수
   */
  const exportHistory = async (): Promise<void> => {
    await exportHistoryMutation.mutateAsync();
  };

  /**
   * 검색 기록 상세 조회 함수
   */
  const getHistoryItem = async (itemId: string): Promise<SearchHistoryItem | null> => {
    // TODO: 실제 API 호출로 교체
    // const response = await api.get(`/api/v1/rag/history/${itemId}`)
    // return response.data

    // 목 데이터
    const item = searchHistory.find(history => history.id === itemId);
    return item || null;
  };

  /**
   * 즐겨찾기 추가 함수
   */
  const saveToFavorites = async (query: string, answer: string): Promise<void> => {
    await saveToFavoritesMutation.mutateAsync({ query, answer });
  };

  return {
    // 데이터
    searchHistory,
    statistics,
    trends,
    
    // 로딩 상태
    isLoading,
    
    // 에러 상태
    error,
    
    // 함수들
    deleteHistoryItem,
    clearHistory,
    exportHistory,
    getHistoryItem,
    saveToFavorites,
    
    // 뮤테이션 상태
    isDeleting: deleteHistoryItemMutation.isPending,
    isClearing: clearHistoryMutation.isPending,
    isExporting: exportHistoryMutation.isPending,
    isSavingToFavorites: saveToFavoritesMutation.isPending,
  };
}
