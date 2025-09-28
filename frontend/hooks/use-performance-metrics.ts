import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";

/**
 * 성능 데이터 타입
 */
export interface PerformanceData {
  avgResponseTime: number;
  throughput: number;
  successRate: number;
  activeConnections: number;
}

/**
 * 시스템 메트릭 타입
 */
export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  cpuAvg: number;
  memoryAvg: number;
  diskAvg: number;
  networkAvg: number;
}

/**
 * AI 모델 메트릭 타입
 */
export interface AIModelMetrics {
  name: string;
  status: "healthy" | "warning" | "error";
  accuracy: number;
  latency: number;
  throughput: number;
  availability: number;
}

/**
 * 성능 알림 타입
 */
export interface PerformanceAlert {
  id: string;
  title: string;
  message: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
}

/**
 * 목 데이터: 성능 데이터
 */
const mockPerformanceData: PerformanceData = {
  avgResponseTime: 245,
  throughput: 1250,
  successRate: 99.2,
  activeConnections: 156,
};

/**
 * 목 데이터: 시스템 메트릭
 */
const mockSystemMetrics: SystemMetrics = {
  cpu: 65,
  memory: 78,
  disk: 45,
  network: 32,
  cpuAvg: 58,
  memoryAvg: 72,
  diskAvg: 42,
  networkAvg: 28,
};

/**
 * 목 데이터: AI 모델 메트릭
 */
const mockAIMetrics: AIModelMetrics[] = [
  {
    name: "OCR 모델",
    status: "healthy",
    accuracy: 94.5,
    latency: 120,
    throughput: 45,
    availability: 99.8,
  },
  {
    name: "임베딩 모델",
    status: "healthy",
    accuracy: 96.2,
    latency: 85,
    throughput: 120,
    availability: 99.9,
  },
  {
    name: "검증 모델",
    status: "warning",
    accuracy: 89.3,
    latency: 200,
    throughput: 30,
    availability: 98.5,
  },
  {
    name: "RAG 모델",
    status: "healthy",
    accuracy: 91.7,
    latency: 350,
    throughput: 25,
    availability: 99.2,
  },
];

/**
 * 목 데이터: 성능 알림
 */
const mockAlerts: PerformanceAlert[] = [
  {
    id: "1",
    title: "높은 CPU 사용률",
    message: "CPU 사용률이 80%를 초과했습니다. 시스템 성능에 영향을 줄 수 있습니다.",
    severity: "medium",
    timestamp: "2024-01-20 14:30",
  },
  {
    id: "2",
    title: "검증 모델 지연시간 증가",
    message: "검증 모델의 평균 지연시간이 200ms를 초과했습니다.",
    severity: "low",
    timestamp: "2024-01-20 13:45",
  },
  {
    id: "3",
    title: "메모리 사용률 경고",
    message: "메모리 사용률이 85%에 근접했습니다. 모니터링이 필요합니다.",
    severity: "medium",
    timestamp: "2024-01-20 12:20",
  },
];

/**
 * 성능 지표 훅
 */
export function usePerformanceMetrics() {
  const { toast } = useToast();

  /**
   * 성능 데이터 조회
   */
  const {
    data: performanceData = mockPerformanceData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["performance-data"],
    queryFn: async (): Promise<PerformanceData> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockPerformanceData;
    },
    staleTime: 30 * 1000, // 30초
    refetchInterval: 30 * 1000, // 30초마다 새로고침
  });

  /**
   * 시스템 메트릭 조회
   */
  const { data: systemMetrics = mockSystemMetrics } = useQuery({
    queryKey: ["system-metrics"],
    queryFn: async (): Promise<SystemMetrics> => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return mockSystemMetrics;
    },
    staleTime: 30 * 1000, // 30초
    refetchInterval: 30 * 1000, // 30초마다 새로고침
  });

  /**
   * AI 모델 메트릭 조회
   */
  const { data: aiMetrics = [] } = useQuery({
    queryKey: ["ai-metrics"],
    queryFn: async (): Promise<AIModelMetrics[]> => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      return mockAIMetrics;
    },
    staleTime: 60 * 1000, // 1분
    refetchInterval: 60 * 1000, // 1분마다 새로고침
  });

  /**
   * 성능 알림 조회
   */
  const { data: alerts = [] } = useQuery({
    queryKey: ["performance-alerts"],
    queryFn: async (): Promise<PerformanceAlert[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockAlerts;
    },
    staleTime: 2 * 60 * 1000, // 2분
    refetchInterval: 2 * 60 * 1000, // 2분마다 새로고침
  });

  /**
   * 메트릭 새로고침
   */
  const refreshMetrics = useMutation({
    mutationFn: async (): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // 실제로는 서버에서 최신 메트릭을 가져옴
      console.log("메트릭 새로고침 완료");
    },
    onSuccess: () => {
      toast({
        title: "메트릭 새로고침 완료",
        description: "성능 지표가 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      console.error("메트릭 새로고침 실패:", error);
      toast({
        title: "메트릭 새로고침 실패",
        description: "메트릭 새로고침 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 메트릭 내보내기
   */
  const exportMetrics = useMutation({
    mutationFn: async (timeRange: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // 실제로는 서버에서 메트릭 데이터를 내보내기
      console.log(`메트릭 내보내기: ${timeRange}`);
    },
    onSuccess: () => {
      toast({
        title: "메트릭 내보내기 완료",
        description: "성능 지표가 성공적으로 내보내기되었습니다.",
      });
    },
    onError: (error) => {
      console.error("메트릭 내보내기 실패:", error);
      toast({
        title: "메트릭 내보내기 실패",
        description: "메트릭 내보내기 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  return {
    performanceData,
    systemMetrics,
    aiMetrics,
    alerts,
    isLoading,
    error,
    refreshMetrics: refreshMetrics.mutateAsync,
    exportMetrics: exportMetrics.mutateAsync,
  };
}
