import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

/**
 * 사용량 데이터 타입 정의
 */
export interface UsageData {
  documents: {
    used: number;
    limit: number;
  };
  queries: {
    used: number;
    limit: number;
  };
  teamMembers: {
    used: number;
    limit: number;
  };
  storage: {
    used: number;
    limit: number;
  };
}

/**
 * 사용량 통계 타입
 */
export interface UsageStatistics {
  avgDailyUsage: number;
  peakUsage: number;
  growthRate: number;
  efficiency: number;
}

/**
 * 사용량 알림 타입
 */
export interface UsageAlert {
  id: string;
  type: string;
  message: string;
  severity: "low" | "medium" | "high";
  createdAt: string;
  isActive: boolean;
}

/**
 * 목 데이터: 사용량 데이터
 */
const mockUsageData: UsageData = {
  documents: {
    used: 1247,
    limit: 2000,
  },
  queries: {
    used: 8920,
    limit: 10000,
  },
  teamMembers: {
    used: 5,
    limit: 10,
  },
  storage: {
    used: 2.3,
    limit: 5.0,
  },
};

/**
 * 목 데이터: 사용량 통계
 */
const mockStatistics: UsageStatistics = {
  avgDailyUsage: 42,
  peakUsage: 156,
  growthRate: 23,
  efficiency: 87,
};

/**
 * 목 데이터: 사용량 알림
 */
const mockAlerts: UsageAlert[] = [
  {
    id: "1",
    type: "queries",
    message: "검색 쿼리 사용량이 90%에 도달했습니다. (8,920/10,000)",
    severity: "medium",
    createdAt: "2024-01-20 14:30",
    isActive: true,
  },
];

/**
 * 사용량 현황 훅
 */
export function useUsageStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * 사용량 데이터 조회
   */
  const {
    data: usageData = mockUsageData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["usage-data"],
    queryFn: async (): Promise<UsageData> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockUsageData;
    },
    staleTime: 2 * 60 * 1000, // 2분
    refetchInterval: 30 * 1000, // 30초마다 새로고침
  });

  /**
   * 사용량 통계 조회
   */
  const { data: statistics = mockStatistics } = useQuery({
    queryKey: ["usage-statistics"],
    queryFn: async (): Promise<UsageStatistics> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockStatistics;
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchInterval: false,
  });

  /**
   * 사용량 알림 조회
   */
  const { data: alerts = [] } = useQuery({
    queryKey: ["usage-alerts"],
    queryFn: async (): Promise<UsageAlert[]> => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockAlerts.filter(alert => alert.isActive);
    },
    staleTime: 1 * 60 * 1000, // 1분
    refetchInterval: 30 * 1000, // 30초마다 새로고침
  });

  /**
   * 임계값 업데이트
   */
  const updateThreshold = useMutation({
    mutationFn: async ({ type, value }: { type: string; value: number }): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // 실제로는 서버에 임계값 업데이트 요청
      console.log(`임계값 업데이트: ${type} = ${value}%`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usage-alerts"] });
      toast({
        title: "임계값 업데이트 완료",
        description: "사용량 임계값이 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      console.error("임계값 업데이트 실패:", error);
      toast({
        title: "임계값 업데이트 실패",
        description: "임계값 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 알림 해제
   */
  const dismissAlert = useMutation({
    mutationFn: async (alertId: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const alertIndex = mockAlerts.findIndex(alert => alert.id === alertId);
      if (alertIndex !== -1) {
        mockAlerts[alertIndex].isActive = false;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usage-alerts"] });
      toast({
        title: "알림 해제 완료",
        description: "사용량 알림이 성공적으로 해제되었습니다.",
      });
    },
    onError: (error) => {
      console.error("알림 해제 실패:", error);
      toast({
        title: "알림 해제 실패",
        description: "알림 해제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  return {
    usageData,
    statistics,
    alerts,
    isLoading,
    error,
    updateThreshold: (type: string, value: number) => 
      updateThreshold.mutateAsync({ type, value }),
    dismissAlert: dismissAlert.mutateAsync,
  };
}
