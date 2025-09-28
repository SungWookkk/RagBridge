import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * 즐겨찾기 관련 타입 정의
 */
export interface FavoriteItem {
  id: string;
  query: string;
  answer: string;
  savedAt: string;
  user: string;
  category: string;
  tags: string[];
  accessCount: number;
  confidence: number;
  lastAccessedAt?: string;
  isShared: boolean;
  sharedWith?: string[];
  metadata?: Record<string, any>;
}

export interface FavoriteStatistics {
  totalFavorites: number;
  totalTags: number;
  averageAccess: number;
  mostPopularCategory: string;
  categoryDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  tagFrequency: Array<{
    tag: string;
    count: number;
    percentage: number;
  }>;
  recentAdditions: number;
  mostAccessed: Array<{
    id: string;
    query: string;
    accessCount: number;
  }>;
}

/**
 * 즐겨찾기 데이터 훅
 *
 * @description
 * - 즐겨찾기 목록 조회 및 관리
 * - 즐겨찾기 추가, 수정, 삭제 기능
 * - 태그 관리 및 분류 기능
 * - 즐겨찾기 공유 및 내보내기
 * - 즐겨찾기 통계 및 분석
 */
export function useFavorites() {
  const queryClient = useQueryClient();

  /**
   * 즐겨찾기 목록 조회
   */
  const {
    data: favorites = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: async (): Promise<FavoriteItem[]> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/rag/favorites')
      // return response.data

      // 목 데이터
      return [
        {
          id: "fav-001",
          query: "계약서에서 지급 조건은 어떻게 되어 있나요?",
          answer: "계약서에서 지급 조건은 일반적으로 계약 체결 후 30일 이내에 지급하도록 되어 있습니다. 선급금 30%, 중간금 40%, 잔금 30%로 구성되며, 지연 시 연 5%의 지연 이자가 부과됩니다.",
          savedAt: "2024-01-24T14:30:00Z",
          user: "김철수",
          category: "계약서",
          tags: ["지급", "조건", "계약", "법무"],
          accessCount: 12,
          confidence: 92,
          lastAccessedAt: "2024-01-24T16:45:00Z",
          isShared: true,
          sharedWith: ["박민수", "최지영"],
          metadata: {
            sources: ["계약서_2024.pdf", "제안서_프로젝트.docx"],
            responseTime: 1.2,
          },
        },
        {
          id: "fav-002",
          query: "프로젝트 일정은 언제까지인가요?",
          answer: "프로젝트 일정은 2024년 6월 30일까지로 계획되어 있습니다. 주요 마일스톤은 3월 말 1차 검토, 5월 말 2차 검토, 6월 말 최종 완료입니다.",
          savedAt: "2024-01-24T13:15:00Z",
          user: "박민수",
          category: "프로젝트",
          tags: ["일정", "마감", "계획", "프로젝트"],
          accessCount: 8,
          confidence: 88,
          lastAccessedAt: "2024-01-24T15:30:00Z",
          isShared: false,
          metadata: {
            sources: ["제안서_프로젝트.docx", "프로젝트_계획서.pdf"],
            responseTime: 0.8,
          },
        },
        {
          id: "fav-003",
          query: "보고서 요약을 해주세요",
          answer: "보고서 요약: 2024년 1분기 매출은 전년 대비 15% 증가했습니다. 주요 성장 요인은 신규 고객 확보와 기존 고객의 사용량 증가입니다.",
          savedAt: "2024-01-24T12:00:00Z",
          user: "최지영",
          category: "보고서",
          tags: ["요약", "매출", "성장", "분석"],
          accessCount: 15,
          confidence: 95,
          lastAccessedAt: "2024-01-24T17:20:00Z",
          isShared: true,
          sharedWith: ["김철수", "윤서연", "이준호"],
          metadata: {
            sources: ["보고서_분석.pdf"],
            responseTime: 2.1,
          },
        },
        {
          id: "fav-004",
          query: "매뉴얼 사용법을 알려주세요",
          answer: "매뉴얼 사용법: 1) 로그인 후 대시보드 접속 2) 문서 업로드 3) 검증 규칙 설정 4) 처리 결과 확인. 자세한 내용은 매뉴얼 3-5페이지를 참조하세요.",
          savedAt: "2024-01-24T11:45:00Z",
          user: "윤서연",
          category: "매뉴얼",
          tags: ["사용법", "가이드", "매뉴얼", "시작하기"],
          accessCount: 6,
          confidence: 75,
          lastAccessedAt: "2024-01-24T14:15:00Z",
          isShared: false,
          metadata: {
            sources: ["매뉴얼_사용법.docx"],
            responseTime: 1.5,
          },
        },
        {
          id: "fav-005",
          query: "계약서에서 해지 조건은 무엇인가요?",
          answer: "계약서에서 해지 조건은 다음과 같습니다: 1) 상호 합의에 의한 해지 2) 일방적 해지 시 30일 전 서면 통지 3) 중대한 계약 위반 시 즉시 해지 가능",
          savedAt: "2024-01-24T09:15:00Z",
          user: "정수진",
          category: "계약서",
          tags: ["해지", "조건", "계약", "법무"],
          accessCount: 4,
          confidence: 90,
          lastAccessedAt: "2024-01-24T13:00:00Z",
          isShared: false,
          metadata: {
            sources: ["계약서_2024.pdf", "법무_가이드.docx"],
            responseTime: 1.8,
          },
        },
      ];
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchInterval: 60 * 1000, // 1분마다 새로고침
  });

  /**
   * 즐겨찾기 통계 조회
   */
  const {
    data: statistics = {
      totalFavorites: 0,
      totalTags: 0,
      averageAccess: 0,
      mostPopularCategory: "",
      categoryDistribution: [],
      tagFrequency: [],
      recentAdditions: 0,
      mostAccessed: [],
    },
  } = useQuery({
    queryKey: ["favorites-statistics"],
    queryFn: async (): Promise<FavoriteStatistics> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/rag/favorites/statistics')
      // return response.data

      // 목 데이터 (실제 즐겨찾기 데이터 기반으로 계산)
      const totalFavorites = favorites.length;
      const averageAccess = totalFavorites > 0 
        ? Math.round(favorites.reduce((acc, item) => acc + item.accessCount, 0) / totalFavorites)
        : 0;

      // 카테고리별 분포
      const categoryCounts = favorites.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const categoryDistribution = Object.entries(categoryCounts)
        .map(([category, count]) => ({
          category,
          count,
          percentage: Math.round((count / totalFavorites) * 100),
        }))
        .sort((a, b) => b.count - a.count);

      const mostPopularCategory = categoryDistribution[0]?.category || "";

      // 태그별 빈도
      const tagCounts = favorites.reduce((acc, item) => {
        item.tags.forEach(tag => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const tagFrequency = Object.entries(tagCounts)
        .map(([tag, count]) => ({
          tag,
          count,
          percentage: Math.round((count / totalFavorites) * 100),
        }))
        .sort((a, b) => b.count - a.count);

      const totalTags = tagFrequency.length;

      // 최근 추가된 항목 (7일 이내)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentAdditions = favorites.filter(item => 
        new Date(item.savedAt) >= weekAgo
      ).length;

      // 가장 많이 접근된 항목
      const mostAccessed = favorites
        .sort((a, b) => b.accessCount - a.accessCount)
        .slice(0, 5)
        .map(item => ({
          id: item.id,
          query: item.query,
          accessCount: item.accessCount,
        }));

      return {
        totalFavorites,
        totalTags,
        averageAccess,
        mostPopularCategory,
        categoryDistribution,
        tagFrequency,
        recentAdditions,
        mostAccessed,
      };
    },
    staleTime: 10 * 60 * 1000, // 10분
    refetchInterval: 5 * 60 * 1000, // 5분마다 새로고침
  });

  /**
   * 카테고리 목록 조회
   */
  const {
    data: categories = [],
  } = useQuery({
    queryKey: ["favorite-categories"],
    queryFn: async (): Promise<string[]> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/rag/favorites/categories')
      // return response.data

      // 목 데이터 (실제 즐겨찾기 데이터에서 추출)
      const uniqueCategories = [...new Set(favorites.map(item => item.category))];
      return uniqueCategories.sort();
    },
    staleTime: 30 * 60 * 1000, // 30분
  });

  /**
   * 태그 목록 조회
   */
  const {
    data: tags = [],
  } = useQuery({
    queryKey: ["favorite-tags"],
    queryFn: async (): Promise<string[]> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/rag/favorites/tags')
      // return response.data

      // 목 데이터 (실제 즐겨찾기 데이터에서 추출)
      const allTags = favorites.flatMap(item => item.tags);
      const uniqueTags = [...new Set(allTags)];
      return uniqueTags.sort();
    },
    staleTime: 30 * 60 * 1000, // 30분
  });

  /**
   * 즐겨찾기 제거 뮤테이션
   */
  const removeFavoriteMutation = useMutation({
    mutationFn: async (favoriteId: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.delete(`/api/v1/rag/favorites/${favoriteId}`)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: (_, favoriteId) => {
      // 로컬 상태에서 제거
      queryClient.setQueryData(["favorites"], (oldFavorites: FavoriteItem[] = []) =>
        oldFavorites.filter(item => item.id !== favoriteId)
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["favorites-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["favorite-categories"] });
      queryClient.invalidateQueries({ queryKey: ["favorite-tags"] });
    },
    onError: (error) => {
      console.error("즐겨찾기 제거 실패:", error);
    },
  });

  /**
   * 즐겨찾기 수정 뮤테이션
   */
  const updateFavoriteMutation = useMutation({
    mutationFn: async ({ favoriteId, updates }: { favoriteId: string; updates: Partial<FavoriteItem> }): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.put(`/api/v1/rag/favorites/${favoriteId}`, updates)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: (_, { favoriteId, updates }) => {
      // 로컬 상태 업데이트
      queryClient.setQueryData(["favorites"], (oldFavorites: FavoriteItem[] = []) =>
        oldFavorites.map(item =>
          item.id === favoriteId
            ? { ...item, ...updates }
            : item
        )
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["favorites-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["favorite-categories"] });
      queryClient.invalidateQueries({ queryKey: ["favorite-tags"] });
    },
    onError: (error) => {
      console.error("즐겨찾기 수정 실패:", error);
    },
  });

  /**
   * 즐겨찾기 전체 삭제 뮤테이션
   */
  const clearFavoritesMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.delete('/api/v1/rag/favorites')

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      // 로컬 상태 초기화
      queryClient.setQueryData(["favorites"], []);
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["favorites-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["favorite-categories"] });
      queryClient.invalidateQueries({ queryKey: ["favorite-tags"] });
    },
    onError: (error) => {
      console.error("즐겨찾기 전체 삭제 실패:", error);
    },
  });

  /**
   * 즐겨찾기 내보내기 뮤테이션
   */
  const exportFavoritesMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/rag/favorites/export')
      // const blob = new Blob([response.data], { type: 'text/csv' })
      // const url = window.URL.createObjectURL(blob)
      // const link = document.createElement('a')
      // link.href = url
      // link.download = `favorites-${new Date().toISOString().split('T')[0]}.csv`
      // link.click()

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
    },
    onError: (error) => {
      console.error("즐겨찾기 내보내기 실패:", error);
    },
  });

  /**
   * 즐겨찾기 공유 뮤테이션
   */
  const shareFavoriteMutation = useMutation({
    mutationFn: async (favoriteId: string): Promise<string> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.post(`/api/v1/rag/favorites/${favoriteId}/share`)
      // return response.data.shareUrl

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
      return `https://ragbridge.com/shared/favorites/${favoriteId}`;
    },
    onSuccess: (shareUrl, favoriteId) => {
      // 공유 상태 업데이트
      queryClient.setQueryData(["favorites"], (oldFavorites: FavoriteItem[] = []) =>
        oldFavorites.map(item =>
          item.id === favoriteId
            ? { ...item, isShared: true }
            : item
        )
      );
    },
    onError: (error) => {
      console.error("즐겨찾기 공유 실패:", error);
    },
  });

  /**
   * 태그 추가 뮤테이션
   */
  const addTagMutation = useMutation({
    mutationFn: async ({ favoriteId, tag }: { favoriteId: string; tag: string }): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post(`/api/v1/rag/favorites/${favoriteId}/tags`, { tag })

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: (_, { favoriteId, tag }) => {
      // 로컬 상태 업데이트
      queryClient.setQueryData(["favorites"], (oldFavorites: FavoriteItem[] = []) =>
        oldFavorites.map(item =>
          item.id === favoriteId
            ? { ...item, tags: [...item.tags, tag] }
            : item
        )
      );
      
      // 태그 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["favorite-tags"] });
      queryClient.invalidateQueries({ queryKey: ["favorites-statistics"] });
    },
    onError: (error) => {
      console.error("태그 추가 실패:", error);
    },
  });

  /**
   * 태그 제거 뮤테이션
   */
  const removeTagMutation = useMutation({
    mutationFn: async ({ favoriteId, tag }: { favoriteId: string; tag: string }): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.delete(`/api/v1/rag/favorites/${favoriteId}/tags/${tag}`)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: (_, { favoriteId, tag }) => {
      // 로컬 상태 업데이트
      queryClient.setQueryData(["favorites"], (oldFavorites: FavoriteItem[] = []) =>
        oldFavorites.map(item =>
          item.id === favoriteId
            ? { ...item, tags: item.tags.filter(t => t !== tag) }
            : item
        )
      );
      
      // 태그 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["favorite-tags"] });
      queryClient.invalidateQueries({ queryKey: ["favorites-statistics"] });
    },
    onError: (error) => {
      console.error("태그 제거 실패:", error);
    },
  });

  /**
   * 즐겨찾기 제거 함수
   */
  const removeFavorite = async (favoriteId: string): Promise<void> => {
    await removeFavoriteMutation.mutateAsync(favoriteId);
  };

  /**
   * 즐겨찾기 수정 함수
   */
  const updateFavorite = async (favoriteId: string, updates: Partial<FavoriteItem>): Promise<void> => {
    await updateFavoriteMutation.mutateAsync({ favoriteId, updates });
  };

  /**
   * 즐겨찾기 전체 삭제 함수
   */
  const clearFavorites = async (): Promise<void> => {
    await clearFavoritesMutation.mutateAsync();
  };

  /**
   * 즐겨찾기 내보내기 함수
   */
  const exportFavorites = async (): Promise<void> => {
    await exportFavoritesMutation.mutateAsync();
  };

  /**
   * 즐겨찾기 공유 함수
   */
  const shareFavorite = async (favoriteId: string): Promise<string> => {
    return await shareFavoriteMutation.mutateAsync(favoriteId);
  };

  /**
   * 태그 추가 함수
   */
  const addTag = async (favoriteId: string, tag: string): Promise<void> => {
    await addTagMutation.mutateAsync({ favoriteId, tag });
  };

  /**
   * 태그 제거 함수
   */
  const removeTag = async (favoriteId: string, tag: string): Promise<void> => {
    await removeTagMutation.mutateAsync({ favoriteId, tag });
  };

  return {
    // 데이터
    favorites,
    categories,
    tags,
    statistics,
    
    // 로딩 상태
    isLoading,
    
    // 에러 상태
    error,
    
    // 함수들
    removeFavorite,
    updateFavorite,
    clearFavorites,
    exportFavorites,
    shareFavorite,
    addTag,
    removeTag,
    
    // 뮤테이션 상태
    isRemoving: removeFavoriteMutation.isPending,
    isUpdating: updateFavoriteMutation.isPending,
    isClearing: clearFavoritesMutation.isPending,
    isExporting: exportFavoritesMutation.isPending,
    isSharing: shareFavoriteMutation.isPending,
    isAddingTag: addTagMutation.isPending,
    isRemovingTag: removeTagMutation.isPending,
  };
}
