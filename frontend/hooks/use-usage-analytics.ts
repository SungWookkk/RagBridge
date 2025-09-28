import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";

/**
 * 사용량 분석 데이터 타입
 */
export interface UsageAnalyticsData {
  usageDistribution: Array<{
    category: string;
    usage: number;
    percentage: number;
  }>;
  costBreakdown: Array<{
    category: string;
    cost: number;
    usage: number;
    costPerUnit: number;
    efficiency: number;
  }>;
  costEfficiency: number;
}

/**
 * 트렌드 데이터 타입
 */
export interface TrendsData {
  usageGrowth: number;
  increasingTrends: string[];
  decreasingTrends: string[];
  stableTrends: string[];
}

/**
 * 인사이트 데이터 타입
 */
export interface InsightsData {
  optimizationSuggestions: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    savings: number;
  }>;
  warnings: Array<{
    id: string;
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
  }>;
  optimizationPotential: number;
}

/**
 * 예측 데이터 타입
 */
export interface PredictionsData {
  accuracy: number;
  nextMonth: {
    documents: number;
    queries: number;
    cost: number;
    documentsChange: number;
    queriesChange: number;
    costChange: number;
  };
  threeMonths: {
    documents: number;
    queries: number;
    cost: number;
    documentsChange: number;
    queriesChange: number;
    costChange: number;
  };
}

/**
 * 목 데이터: 사용량 분석
 */
const mockAnalyticsData: UsageAnalyticsData = {
  usageDistribution: [
    { category: "documents", usage: 1247, percentage: 45 },
    { category: "queries", usage: 8920, percentage: 35 },
    { category: "storage", usage: 2300, percentage: 15 },
    { category: "team", usage: 500, percentage: 5 },
  ],
  costBreakdown: [
    {
      category: "documents",
      cost: 124700,
      usage: 1247,
      costPerUnit: 100,
      efficiency: 85,
    },
    {
      category: "queries",
      cost: 89200,
      usage: 8920,
      costPerUnit: 10,
      efficiency: 92,
    },
    {
      category: "storage",
      cost: 23000,
      usage: 2300,
      costPerUnit: 10,
      efficiency: 78,
    },
    {
      category: "team",
      cost: 50000,
      usage: 500,
      costPerUnit: 100,
      efficiency: 88,
    },
  ],
  costEfficiency: 87,
};

/**
 * 목 데이터: 트렌드
 */
const mockTrends: TrendsData = {
  usageGrowth: 23,
  increasingTrends: ["documents", "queries"],
  decreasingTrends: ["storage"],
  stableTrends: ["team"],
};

/**
 * 목 데이터: 인사이트
 */
const mockInsights: InsightsData = {
  optimizationSuggestions: [
    {
      id: "1",
      title: "스토리지 최적화",
      description: "사용하지 않는 문서를 정리하여 스토리지 비용을 절약할 수 있습니다.",
      category: "storage",
      savings: 15000,
    },
    {
      id: "2",
      title: "쿼리 캐싱",
      description: "자주 사용하는 검색 쿼리를 캐싱하여 비용을 줄일 수 있습니다.",
      category: "queries",
      savings: 25000,
    },
    {
      id: "3",
      title: "배치 처리",
      description: "문서 처리를 배치로 묶어서 처리 효율성을 높일 수 있습니다.",
      category: "documents",
      savings: 30000,
    },
  ],
  warnings: [
    {
      id: "1",
      title: "사용량 급증 경고",
      description: "최근 문서 처리 사용량이 급증하고 있습니다. 한도를 초과할 가능성이 있습니다.",
      severity: "medium",
    },
    {
      id: "2",
      title: "비용 효율성 저하",
      description: "스토리지 사용량이 증가하면서 비용 효율성이 떨어지고 있습니다.",
      severity: "low",
    },
  ],
  optimizationPotential: 35,
};

/**
 * 목 데이터: 예측
 */
const mockPredictions: PredictionsData = {
  accuracy: 94,
  nextMonth: {
    documents: 1530,
    queries: 10980,
    cost: 287000,
    documentsChange: 23,
    queriesChange: 23,
    costChange: 15,
  },
  threeMonths: {
    documents: 1880,
    queries: 13500,
    cost: 352000,
    documentsChange: 51,
    queriesChange: 51,
    costChange: 41,
  },
};

/**
 * 사용량 분석 훅
 */
export function useUsageAnalytics() {
  const { toast } = useToast();

  /**
   * 사용량 분석 데이터 조회
   */
  const {
    data: analyticsData = mockAnalyticsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["usage-analytics"],
    queryFn: async (): Promise<UsageAnalyticsData> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockAnalyticsData;
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchInterval: false,
  });

  /**
   * 트렌드 데이터 조회
   */
  const { data: trends = mockTrends } = useQuery({
    queryKey: ["usage-trends"],
    queryFn: async (): Promise<TrendsData> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockTrends;
    },
    staleTime: 10 * 60 * 1000, // 10분
    refetchInterval: false,
  });

  /**
   * 인사이트 데이터 조회
   */
  const { data: insights = mockInsights } = useQuery({
    queryKey: ["usage-insights"],
    queryFn: async (): Promise<InsightsData> => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return mockInsights;
    },
    staleTime: 15 * 60 * 1000, // 15분
    refetchInterval: false,
  });

  /**
   * 예측 데이터 조회
   */
  const { data: predictions = mockPredictions } = useQuery({
    queryKey: ["usage-predictions"],
    queryFn: async (): Promise<PredictionsData> => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return mockPredictions;
    },
    staleTime: 30 * 60 * 1000, // 30분
    refetchInterval: false,
  });

  /**
   * 리포트 내보내기
   */
  const exportReport = useMutation({
    mutationFn: async (timeRange: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // 실제로는 서버에서 리포트 생성 및 다운로드
      console.log(`리포트 내보내기: ${timeRange}`);
    },
    onSuccess: () => {
      toast({
        title: "리포트 내보내기 완료",
        description: "사용량 분석 리포트가 성공적으로 내보내기되었습니다.",
      });
    },
    onError: (error) => {
      console.error("리포트 내보내기 실패:", error);
      toast({
        title: "리포트 내보내기 실패",
        description: "리포트 내보내기 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  return {
    analyticsData,
    trends,
    insights,
    predictions,
    isLoading,
    error,
    exportReport: exportReport.mutateAsync,
  };
}
