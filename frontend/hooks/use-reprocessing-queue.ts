import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

/**
 * 재처리 큐 아이템 타입 정의
 */
export interface ReprocessingQueueItem {
  id: string;
  documentName: string;
  fileType: string;
  uploadedAt: string;
  status: "pending" | "processing" | "failed" | "completed";
  errorMessage: string;
  retryCount: number;
  lastAttempt: string;
  priority: "low" | "medium" | "high";
  estimatedProcessingTime: number; // 분
}

/**
 * 재처리 큐 통계 타입
 */
export interface ReprocessingStatistics {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  avgProcessingTime: number;
  successRate: number;
}

/**
 * 목 데이터: 재처리 큐 아이템
 */
const mockQueueItems: ReprocessingQueueItem[] = [
  {
    id: "1",
    documentName: "2024년_1분기_보고서.pdf",
    fileType: "PDF",
    uploadedAt: "2024-01-20 14:30",
    status: "pending",
    errorMessage: "OCR 처리 중 텍스트 추출 실패: 이미지 품질이 낮아 텍스트를 인식할 수 없습니다.",
    retryCount: 2,
    lastAttempt: "2024-01-20 15:45",
    priority: "high",
    estimatedProcessingTime: 15,
  },
  {
    id: "2",
    documentName: "계약서_최종본.docx",
    fileType: "DOCX",
    uploadedAt: "2024-01-20 13:15",
    status: "processing",
    errorMessage: "필드 추출 실패: 문서 구조가 예상과 다릅니다.",
    retryCount: 1,
    lastAttempt: "2024-01-20 16:20",
    priority: "medium",
    estimatedProcessingTime: 8,
  },
  {
    id: "3",
    documentName: "사원증_스캔본.jpg",
    fileType: "JPG",
    uploadedAt: "2024-01-20 12:00",
    status: "failed",
    errorMessage: "이미지 해상도가 너무 낮아 OCR 처리가 불가능합니다. (최소 300 DPI 필요)",
    retryCount: 3,
    lastAttempt: "2024-01-20 16:30",
    priority: "low",
    estimatedProcessingTime: 5,
  },
  {
    id: "4",
    documentName: "재무제표_2023.xlsx",
    fileType: "XLSX",
    uploadedAt: "2024-01-20 11:30",
    status: "pending",
    errorMessage: "표 구조 분석 실패: 복잡한 병합 셀로 인해 데이터 추출이 어렵습니다.",
    retryCount: 1,
    lastAttempt: "2024-01-20 15:00",
    priority: "high",
    estimatedProcessingTime: 20,
  },
  {
    id: "5",
    documentName: "회의록_20240120.pdf",
    fileType: "PDF",
    uploadedAt: "2024-01-20 10:45",
    status: "pending",
    errorMessage: "임베딩 생성 실패: 서버 리소스 부족으로 인한 타임아웃",
    retryCount: 0,
    lastAttempt: "2024-01-20 14:15",
    priority: "medium",
    estimatedProcessingTime: 12,
  },
  {
    id: "6",
    documentName: "신청서_양식.pdf",
    fileType: "PDF",
    uploadedAt: "2024-01-20 09:20",
    status: "completed",
    errorMessage: "검증 규칙 위반: 필수 필드가 누락되었습니다.",
    retryCount: 1,
    lastAttempt: "2024-01-20 13:30",
    priority: "low",
    estimatedProcessingTime: 6,
  },
];

/**
 * 재처리 큐 관리 훅
 */
export function useReprocessingQueue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * 재처리 큐 목록 조회
   */
  const {
    data: queueItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reprocessing-queue"],
    queryFn: async (): Promise<ReprocessingQueueItem[]> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockQueueItems;
    },
    staleTime: 2 * 60 * 1000, // 2분
    refetchInterval: 30 * 1000, // 30초마다 새로고침
  });

  /**
   * 재처리 큐 통계 조회
   */
  const { data: statistics } = useQuery({
    queryKey: ["reprocessing-statistics"],
    queryFn: async (): Promise<ReprocessingStatistics> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const pending = queueItems.filter(item => item.status === "pending").length;
      const processing = queueItems.filter(item => item.status === "processing").length;
      const completed = queueItems.filter(item => item.status === "completed").length;
      const failed = queueItems.filter(item => item.status === "failed").length;
      
      const avgProcessingTime = Math.round(
        queueItems.reduce((sum, item) => sum + item.estimatedProcessingTime, 0) / queueItems.length
      );
      
      const successRate = queueItems.length > 0 
        ? Math.round((completed / queueItems.length) * 100)
        : 0;

      return {
        pending,
        processing,
        completed,
        failed,
        avgProcessingTime,
        successRate,
      };
    },
    staleTime: 1 * 60 * 1000, // 1분
    refetchInterval: 30 * 1000, // 30초마다 새로고침
  });

  /**
   * 개별 문서 재처리
   */
  const reprocessDocument = useMutation({
    mutationFn: async (documentId: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const itemIndex = mockQueueItems.findIndex(item => item.id === documentId);
      if (itemIndex === -1) {
        throw new Error("문서를 찾을 수 없습니다");
      }

      // 상태를 processing으로 변경
      mockQueueItems[itemIndex].status = "processing";
      mockQueueItems[itemIndex].retryCount += 1;
      mockQueueItems[itemIndex].lastAttempt = new Date().toLocaleString("ko-KR");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reprocessing-queue"] });
      queryClient.invalidateQueries({ queryKey: ["reprocessing-statistics"] });
      toast({
        title: "재처리 시작",
        description: "문서 재처리가 시작되었습니다.",
      });
    },
    onError: (error) => {
      console.error("재처리 실패:", error);
      toast({
        title: "재처리 실패",
        description: "문서 재처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 전체 문서 재처리
   */
  const reprocessAll = useMutation({
    mutationFn: async (): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // 모든 pending 상태의 문서를 processing으로 변경
      mockQueueItems.forEach(item => {
        if (item.status === "pending") {
          item.status = "processing";
          item.retryCount += 1;
          item.lastAttempt = new Date().toLocaleString("ko-KR");
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reprocessing-queue"] });
      queryClient.invalidateQueries({ queryKey: ["reprocessing-statistics"] });
      toast({
        title: "전체 재처리 시작",
        description: "모든 대기 중인 문서의 재처리가 시작되었습니다.",
      });
    },
    onError: (error) => {
      console.error("전체 재처리 실패:", error);
      toast({
        title: "전체 재처리 실패",
        description: "전체 재처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 큐에서 문서 제거
   */
  const removeFromQueue = useMutation({
    mutationFn: async (documentId: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const itemIndex = mockQueueItems.findIndex(item => item.id === documentId);
      if (itemIndex === -1) {
        throw new Error("문서를 찾을 수 없습니다");
      }

      mockQueueItems.splice(itemIndex, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reprocessing-queue"] });
      queryClient.invalidateQueries({ queryKey: ["reprocessing-statistics"] });
      toast({
        title: "큐에서 제거",
        description: "문서가 재처리 큐에서 제거되었습니다.",
      });
    },
    onError: (error) => {
      console.error("큐에서 제거 실패:", error);
      toast({
        title: "제거 실패",
        description: "큐에서 제거 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  return {
    queueItems,
    statistics: statistics || {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      avgProcessingTime: 0,
      successRate: 0,
    },
    isLoading,
    error,
    reprocessDocument: reprocessDocument.mutateAsync,
    reprocessAll: reprocessAll.mutateAsync,
    removeFromQueue: removeFromQueue.mutateAsync,
    isReprocessing: reprocessDocument.isPending || reprocessAll.isPending,
  };
}
