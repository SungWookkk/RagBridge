import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

/**
 * API 키 타입 정의
 */
export interface APIKey {
  id: string;
  name: string;
  description?: string;
  keyValue: string;
  permissions: string[];
  status: "active" | "inactive" | "expired";
  createdAt: string;
  lastUsed: string;
  expiresAt?: string;
  usageCount: number;
}

/**
 * API 키 통계 타입
 */
export interface APIKeyStatistics {
  totalKeys: number;
  activeKeys: number;
  todayUsage: number;
  expiringSoon: number;
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
}

/**
 * 목 데이터: API 키 목록
 */
const mockAPIKeys: APIKey[] = [
  {
    id: "1",
    name: "프로덕션 서버 API 키",
    description: "메인 애플리케이션 서버용 API 키",
    keyValue: "sk-prod-1234567890abcdef1234567890abcdef",
    permissions: ["read", "write"],
    status: "active",
    createdAt: "2024-01-15",
    lastUsed: "2분 전",
    usageCount: 1247,
  },
  {
    id: "2",
    name: "개발 환경 API 키",
    description: "개발 및 테스트 환경용 API 키",
    keyValue: "sk-dev-abcdef1234567890abcdef1234567890",
    permissions: ["read", "write", "admin"],
    status: "active",
    createdAt: "2024-01-16",
    lastUsed: "1시간 전",
    expiresAt: "2024-02-16",
    usageCount: 892,
  },
  {
    id: "3",
    name: "모니터링 시스템 API 키",
    description: "시스템 모니터링 및 로그 수집용",
    keyValue: "sk-mon-9876543210fedcba9876543210fedcba",
    permissions: ["read"],
    status: "inactive",
    createdAt: "2024-01-17",
    lastUsed: "1일 전",
    usageCount: 156,
  },
  {
    id: "4",
    name: "백업 시스템 API 키",
    description: "데이터 백업 및 복원용 API 키",
    keyValue: "sk-bak-55555555555555555555555555555555",
    permissions: ["read", "write"],
    status: "expired",
    createdAt: "2024-01-10",
    lastUsed: "1주일 전",
    expiresAt: "2024-01-20",
    usageCount: 23,
  },
  {
    id: "5",
    name: "분석 도구 API 키",
    description: "데이터 분석 및 리포트 생성용",
    keyValue: "sk-ana-11111111111111111111111111111111",
    permissions: ["read", "billing"],
    status: "active",
    createdAt: "2024-01-18",
    lastUsed: "30분 전",
    usageCount: 445,
  },
];

/**
 * API 키 관리 훅
 */
export function useAPIKeys() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * API 키 목록 조회
   */
  const {
    data: apiKeys = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async (): Promise<APIKey[]> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockAPIKeys;
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchInterval: false,
  });

  /**
   * API 키 통계 조회
   */
  const { data: statistics } = useQuery({
    queryKey: ["api-key-statistics"],
    queryFn: async (): Promise<APIKeyStatistics> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const totalKeys = apiKeys.length;
      const activeKeys = apiKeys.filter(key => key.status === "active").length;
      const todayUsage = apiKeys.reduce((sum, key) => sum + Math.floor(key.usageCount * 0.1), 0);
      const expiringSoon = apiKeys.filter(key => {
        if (!key.expiresAt) return false;
        const expireDate = new Date(key.expiresAt);
        const now = new Date();
        const diffTime = expireDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays > 0;
      }).length;

      return {
        totalKeys,
        activeKeys,
        todayUsage,
        expiringSoon,
        totalRequests: apiKeys.reduce((sum, key) => sum + key.usageCount, 0),
        successRate: 99.2,
        avgResponseTime: 245,
      };
    },
    staleTime: 2 * 60 * 1000, // 2분
    refetchInterval: 30 * 1000, // 30초마다 새로고침
  });

  /**
   * API 키 생성
   */
  const createAPIKey = useMutation({
    mutationFn: async (data: { name: string; description?: string; permissions: string[]; expiresAt?: string }): Promise<APIKey> => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      const newKey: APIKey = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        keyValue: `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        permissions: data.permissions,
        status: "active",
        createdAt: new Date().toLocaleDateString("ko-KR"),
        lastUsed: "방금 전",
        expiresAt: data.expiresAt,
        usageCount: 0,
      };

      return newKey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      queryClient.invalidateQueries({ queryKey: ["api-key-statistics"] });
      toast({
        title: "API 키 생성 완료",
        description: "새 API 키가 성공적으로 생성되었습니다.",
      });
    },
    onError: (error) => {
      console.error("API 키 생성 실패:", error);
      toast({
        title: "API 키 생성 실패",
        description: "API 키 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * API 키 업데이트
   */
  const updateAPIKey = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<APIKey> }): Promise<APIKey> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const keyIndex = mockAPIKeys.findIndex(key => key.id === id);
      if (keyIndex === -1) {
        throw new Error("API 키를 찾을 수 없습니다");
      }

      const updatedKey: APIKey = {
        ...mockAPIKeys[keyIndex],
        ...data,
      };

      return updatedKey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast({
        title: "API 키 업데이트 완료",
        description: "API 키가 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      console.error("API 키 업데이트 실패:", error);
      toast({
        title: "API 키 업데이트 실패",
        description: "API 키 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * API 키 삭제
   */
  const deleteAPIKey = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const keyIndex = mockAPIKeys.findIndex(key => key.id === id);
      if (keyIndex === -1) {
        throw new Error("API 키를 찾을 수 없습니다");
      }

      mockAPIKeys.splice(keyIndex, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      queryClient.invalidateQueries({ queryKey: ["api-key-statistics"] });
      toast({
        title: "API 키 삭제 완료",
        description: "API 키가 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error) => {
      console.error("API 키 삭제 실패:", error);
      toast({
        title: "API 키 삭제 실패",
        description: "API 키 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * API 키 재생성
   */
  const regenerateAPIKey = useMutation({
    mutationFn: async (id: string): Promise<APIKey> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const keyIndex = mockAPIKeys.findIndex(key => key.id === id);
      if (keyIndex === -1) {
        throw new Error("API 키를 찾을 수 없습니다");
      }

      const updatedKey: APIKey = {
        ...mockAPIKeys[keyIndex],
        keyValue: `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        lastUsed: "방금 전",
      };

      return updatedKey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast({
        title: "API 키 재생성 완료",
        description: "새로운 API 키가 생성되었습니다.",
      });
    },
    onError: (error) => {
      console.error("API 키 재생성 실패:", error);
      toast({
        title: "API 키 재생성 실패",
        description: "API 키 재생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * API 키 상태 토글
   */
  const toggleAPIKeyStatus = useMutation({
    mutationFn: async (id: string): Promise<APIKey> => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const keyIndex = mockAPIKeys.findIndex(key => key.id === id);
      if (keyIndex === -1) {
        throw new Error("API 키를 찾을 수 없습니다");
      }

      const currentStatus = mockAPIKeys[keyIndex].status;
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      const updatedKey: APIKey = {
        ...mockAPIKeys[keyIndex],
        status: newStatus,
      };

      return updatedKey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      queryClient.invalidateQueries({ queryKey: ["api-key-statistics"] });
      toast({
        title: "상태 변경 완료",
        description: "API 키 상태가 성공적으로 변경되었습니다.",
      });
    },
    onError: (error) => {
      console.error("API 키 상태 변경 실패:", error);
      toast({
        title: "상태 변경 실패",
        description: "API 키 상태 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  return {
    apiKeys,
    statistics: statistics || {
      totalKeys: 0,
      activeKeys: 0,
      todayUsage: 0,
      expiringSoon: 0,
      totalRequests: 0,
      successRate: 0,
      avgResponseTime: 0,
    },
    isLoading,
    error,
    createAPIKey: createAPIKey.mutateAsync,
    updateAPIKey: (id: string, data: Partial<APIKey>) => 
      updateAPIKey.mutateAsync({ id, data }),
    deleteAPIKey: deleteAPIKey.mutateAsync,
    regenerateAPIKey: regenerateAPIKey.mutateAsync,
    toggleAPIKeyStatus: toggleAPIKeyStatus.mutateAsync,
  };
}
