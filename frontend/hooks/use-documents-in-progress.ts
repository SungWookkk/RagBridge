import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * 진행 중인 문서 관련 타입 정의
 */
export interface ProcessingStage {
  name: string;
  progress: number;
  status: "pending" | "processing" | "completed" | "failed";
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface DocumentInProgress {
  id: string;
  name: string;
  type: string;
  size: number;
  status: "processing" | "paused" | "failed" | "retrying" | "completed";
  overallProgress: number;
  currentStage: string;
  stages: ProcessingStage[];
  startedAt: string;
  estimatedCompletion?: string;
  error?: string;
  retryCount: number;
  maxRetries: number;
}

export interface ProcessingStatistics {
  processing: number;
  paused: number;
  failed: number;
  completionRate: number;
  averageProcessingTime: number;
  totalDocuments: number;
}

export interface DocumentLog {
  id: string;
  documentId: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
  stage: string;
  metadata?: Record<string, any>;
}

/**
 * 진행 중인 문서 데이터 훅
 *
 * @description
 * - 진행 중인 문서 목록 조회 및 관리
 * - 문서 처리 상태 제어 (일시정지, 재개, 재시도, 취소)
 * - 실시간 진행률 및 통계 정보
 * - 문서별 처리 로그 조회
 */
export function useDocumentsInProgress() {
  const queryClient = useQueryClient();

  /**
   * 진행 중인 문서 목록 조회
   */
  const {
    data: documents = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["documents-in-progress"],
    queryFn: async (): Promise<DocumentInProgress[]> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/documents/processing')
      // return response.data

      // 목 데이터
      return [
        {
          id: "doc-001",
          name: "계약서_2024.pdf",
          type: "application/pdf",
          size: 2048576,
          status: "processing",
          overallProgress: 65,
          currentStage: "validation",
          stages: [
            { name: "업로드", progress: 100, status: "completed", completedAt: "2024-01-24T10:30:00Z" },
            { name: "OCR", progress: 100, status: "completed", completedAt: "2024-01-24T10:32:00Z" },
            { name: "검증", progress: 65, status: "processing", startedAt: "2024-01-24T10:33:00Z" },
            { name: "인덱싱", progress: 0, status: "pending" },
          ],
          startedAt: "2024-01-24T10:30:00Z",
          estimatedCompletion: "2024-01-24T10:40:00Z",
          retryCount: 0,
          maxRetries: 3,
        },
        {
          id: "doc-002",
          name: "제안서_프로젝트.docx",
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 1536000,
          status: "paused",
          overallProgress: 30,
          currentStage: "ocr",
          stages: [
            { name: "업로드", progress: 100, status: "completed", completedAt: "2024-01-24T11:15:00Z" },
            { name: "OCR", progress: 30, status: "paused", startedAt: "2024-01-24T11:16:00Z" },
            { name: "검증", progress: 0, status: "pending" },
            { name: "인덱싱", progress: 0, status: "pending" },
          ],
          startedAt: "2024-01-24T11:15:00Z",
          estimatedCompletion: "2024-01-24T11:35:00Z",
          retryCount: 0,
          maxRetries: 3,
        },
        {
          id: "doc-003",
          name: "이미지_스캔본.jpg",
          type: "image/jpeg",
          size: 5120000,
          status: "failed",
          overallProgress: 15,
          currentStage: "ocr",
          stages: [
            { name: "업로드", progress: 100, status: "completed", completedAt: "2024-01-24T12:00:00Z" },
            { name: "OCR", progress: 15, status: "failed", startedAt: "2024-01-24T12:01:00Z", error: "이미지 해상도가 너무 낮습니다." },
            { name: "검증", progress: 0, status: "pending" },
            { name: "인덱싱", progress: 0, status: "pending" },
          ],
          startedAt: "2024-01-24T12:00:00Z",
          error: "OCR 처리 중 오류가 발생했습니다.",
          retryCount: 2,
          maxRetries: 3,
        },
        {
          id: "doc-004",
          name: "보고서_분석.pdf",
          type: "application/pdf",
          size: 3072000,
          status: "retrying",
          overallProgress: 45,
          currentStage: "validation",
          stages: [
            { name: "업로드", progress: 100, status: "completed", completedAt: "2024-01-24T13:00:00Z" },
            { name: "OCR", progress: 100, status: "completed", completedAt: "2024-01-24T13:02:00Z" },
            { name: "검증", progress: 45, status: "processing", startedAt: "2024-01-24T13:03:00Z" },
            { name: "인덱싱", progress: 0, status: "pending" },
          ],
          startedAt: "2024-01-24T13:00:00Z",
          estimatedCompletion: "2024-01-24T13:15:00Z",
          retryCount: 1,
          maxRetries: 3,
        },
      ];
    },
    staleTime: 30 * 1000, // 30초
    refetchInterval: 10 * 1000, // 10초마다 새로고침
  });

  /**
   * 처리 통계 조회
   */
  const {
    data: statistics = {
      processing: 0,
      paused: 0,
      failed: 0,
      completionRate: 0,
      averageProcessingTime: 0,
      totalDocuments: 0,
    },
  } = useQuery({
    queryKey: ["processing-statistics"],
    queryFn: async (): Promise<ProcessingStatistics> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/documents/processing/statistics')
      // return response.data

      // 목 데이터 (실제 문서 데이터 기반으로 계산)
      const processing = documents.filter(doc => doc.status === "processing").length;
      const paused = documents.filter(doc => doc.status === "paused").length;
      const failed = documents.filter(doc => doc.status === "failed").length;
      const totalDocuments = documents.length;
      const completionRate = totalDocuments > 0 ? Math.round((documents.reduce((acc, doc) => acc + doc.overallProgress, 0) / totalDocuments)) : 0;

      return {
        processing,
        paused,
        failed,
        completionRate,
        averageProcessingTime: 15, // 분
        totalDocuments,
      };
    },
    staleTime: 60 * 1000, // 1분
    refetchInterval: 30 * 1000, // 30초마다 새로고침
  });

  /**
   * 문서 처리 일시정지 뮤테이션
   */
  const pauseProcessingMutation = useMutation({
    mutationFn: async (documentId: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post(`/api/v1/documents/${documentId}/pause`)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: (_, documentId) => {
      // 로컬 상태 업데이트
      queryClient.setQueryData(["documents-in-progress"], (oldDocuments: DocumentInProgress[] = []) =>
        oldDocuments.map(doc =>
          doc.id === documentId
            ? { ...doc, status: "paused" as const }
            : doc
        )
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["processing-statistics"] });
    },
    onError: (error) => {
      console.error("문서 처리 일시정지 실패:", error);
    },
  });

  /**
   * 문서 처리 재개 뮤테이션
   */
  const resumeProcessingMutation = useMutation({
    mutationFn: async (documentId: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post(`/api/v1/documents/${documentId}/resume`)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: (_, documentId) => {
      // 로컬 상태 업데이트
      queryClient.setQueryData(["documents-in-progress"], (oldDocuments: DocumentInProgress[] = []) =>
        oldDocuments.map(doc =>
          doc.id === documentId
            ? { ...doc, status: "processing" as const }
            : doc
        )
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["processing-statistics"] });
    },
    onError: (error) => {
      console.error("문서 처리 재개 실패:", error);
    },
  });

  /**
   * 문서 처리 재시도 뮤테이션
   */
  const retryProcessingMutation = useMutation({
    mutationFn: async (documentId: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post(`/api/v1/documents/${documentId}/retry`)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: (_, documentId) => {
      // 로컬 상태 업데이트
      queryClient.setQueryData(["documents-in-progress"], (oldDocuments: DocumentInProgress[] = []) =>
        oldDocuments.map(doc =>
          doc.id === documentId
            ? { ...doc, status: "retrying" as const, retryCount: doc.retryCount + 1 }
            : doc
        )
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["processing-statistics"] });
    },
    onError: (error) => {
      console.error("문서 처리 재시도 실패:", error);
    },
  });

  /**
   * 문서 처리 취소 뮤테이션
   */
  const cancelProcessingMutation = useMutation({
    mutationFn: async (documentId: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post(`/api/v1/documents/${documentId}/cancel`)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: (_, documentId) => {
      // 로컬 상태에서 제거
      queryClient.setQueryData(["documents-in-progress"], (oldDocuments: DocumentInProgress[] = []) =>
        oldDocuments.filter(doc => doc.id !== documentId)
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["processing-statistics"] });
    },
    onError: (error) => {
      console.error("문서 처리 취소 실패:", error);
    },
  });

  /**
   * 문서 로그 조회
   */
  const getDocumentLogs = async (documentId: string): Promise<DocumentLog[]> => {
    // TODO: 실제 API 호출로 교체
    // const response = await api.get(`/api/v1/documents/${documentId}/logs`)
    // return response.data

    // 목 데이터
    return [
      {
        id: "log-001",
        documentId,
        timestamp: "2024-01-24T10:30:00Z",
        level: "info",
        message: "문서 업로드 시작",
        stage: "upload",
        metadata: { fileSize: 2048576, fileName: "계약서_2024.pdf" },
      },
      {
        id: "log-002",
        documentId,
        timestamp: "2024-01-24T10:30:05Z",
        level: "info",
        message: "문서 업로드 완료",
        stage: "upload",
        metadata: { duration: 5, status: "success" },
      },
      {
        id: "log-003",
        documentId,
        timestamp: "2024-01-24T10:31:00Z",
        level: "info",
        message: "OCR 처리 시작",
        stage: "ocr",
        metadata: { pages: 10, resolution: "300dpi" },
      },
      {
        id: "log-004",
        documentId,
        timestamp: "2024-01-24T10:32:00Z",
        level: "info",
        message: "OCR 처리 완료",
        stage: "ocr",
        metadata: { duration: 60, confidence: 0.95 },
      },
      {
        id: "log-005",
        documentId,
        timestamp: "2024-01-24T10:33:00Z",
        level: "info",
        message: "검증 처리 시작",
        stage: "validation",
        metadata: { rules: ["field_mapping", "format_check"] },
      },
    ];
  };

  return {
    // 데이터
    documents,
    statistics,
    
    // 로딩 상태
    isLoading,
    
    // 에러 상태
    error,
    
    // 뮤테이션 함수들
    pauseProcessing: pauseProcessingMutation.mutateAsync,
    resumeProcessing: resumeProcessingMutation.mutateAsync,
    retryProcessing: retryProcessingMutation.mutateAsync,
    cancelProcessing: cancelProcessingMutation.mutateAsync,
    getDocumentLogs,
    
    // 뮤테이션 상태
    isPausing: pauseProcessingMutation.isPending,
    isResuming: resumeProcessingMutation.isPending,
    isRetrying: retryProcessingMutation.isPending,
    isCancelling: cancelProcessingMutation.isPending,
  };
}
