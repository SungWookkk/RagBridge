import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * 검토 대기 문서 관련 타입 정의
 */
export interface PendingReviewDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  priority: "high" | "medium" | "low";
  category: "validation" | "format" | "content" | "security";
  status: "pending" | "in_review" | "approved" | "rejected" | "revision_requested";
  uploader: string;
  uploadedAt: string;
  waitingTime: string;
  securityLevel: "public" | "internal" | "confidential" | "restricted";
  validationErrors?: string[];
  reviewComments?: string[];
  assignedReviewer?: string;
  estimatedReviewTime?: string;
}

export interface ReviewStatistics {
  pending: number;
  highPriority: number;
  reviewers: number;
  averageProcessingTime: number;
  totalDocuments: number;
  approvalRate: number;
  rejectionRate: number;
}

export interface DocumentReview {
  id: string;
  documentId: string;
  reviewer: string;
  status: "approved" | "rejected" | "revision_requested";
  comments: string;
  reviewedAt: string;
  revisionReason?: string;
}

/**
 * 검토 대기 문서 데이터 훅
 *
 * @description
 * - 검토 대기 문서 목록 조회 및 관리
 * - 문서 승인, 거부, 수정 요청 기능
 * - 배치 승인 및 거부 기능
 * - 검토 통계 및 진행률 추적
 */
export function usePendingReview() {
  const queryClient = useQueryClient();

  /**
   * 검토 대기 문서 목록 조회
   */
  const {
    data: documents = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pending-review-documents"],
    queryFn: async (): Promise<PendingReviewDocument[]> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/documents/pending-review')
      // return response.data

      // 목 데이터
      return [
        {
          id: "doc-001",
          name: "계약서_2024.pdf",
          type: "application/pdf",
          size: 2048576,
          priority: "high",
          category: "validation",
          status: "pending",
          uploader: "김철수",
          uploadedAt: "2024-01-24T10:30:00Z",
          waitingTime: "2시간 30분",
          securityLevel: "confidential",
          validationErrors: [
            "서명 필드가 누락되었습니다.",
            "계약 금액이 숫자 형식이 아닙니다.",
            "계약 기간이 유효하지 않습니다.",
          ],
          assignedReviewer: "이영희",
          estimatedReviewTime: "30분",
        },
        {
          id: "doc-002",
          name: "제안서_프로젝트.docx",
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 1536000,
          priority: "medium",
          category: "content",
          status: "pending",
          uploader: "박민수",
          uploadedAt: "2024-01-24T11:15:00Z",
          waitingTime: "1시간 45분",
          securityLevel: "internal",
          validationErrors: [
            "프로젝트 예산이 명시되지 않았습니다.",
            "일정표가 포함되지 않았습니다.",
          ],
          assignedReviewer: "정수진",
          estimatedReviewTime: "45분",
        },
        {
          id: "doc-003",
          name: "이미지_스캔본.jpg",
          type: "image/jpeg",
          size: 5120000,
          priority: "low",
          category: "format",
          status: "pending",
          uploader: "최지영",
          uploadedAt: "2024-01-24T12:00:00Z",
          waitingTime: "1시간",
          securityLevel: "public",
          validationErrors: [
            "이미지 해상도가 낮습니다.",
            "텍스트 인식률이 80% 미만입니다.",
          ],
          assignedReviewer: "강동현",
          estimatedReviewTime: "20분",
        },
        {
          id: "doc-004",
          name: "보고서_분석.pdf",
          type: "application/pdf",
          size: 3072000,
          priority: "high",
          category: "security",
          status: "pending",
          uploader: "윤서연",
          uploadedAt: "2024-01-24T13:00:00Z",
          waitingTime: "30분",
          securityLevel: "restricted",
          validationErrors: [
            "민감한 정보가 포함되어 있습니다.",
            "접근 권한 확인이 필요합니다.",
          ],
          assignedReviewer: "김보라",
          estimatedReviewTime: "60분",
        },
        {
          id: "doc-005",
          name: "매뉴얼_사용법.docx",
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 1024000,
          priority: "medium",
          category: "content",
          status: "pending",
          uploader: "이준호",
          uploadedAt: "2024-01-24T14:00:00Z",
          waitingTime: "15분",
          securityLevel: "internal",
          validationErrors: [
            "목차가 누락되었습니다.",
            "스크린샷이 포함되지 않았습니다.",
          ],
          assignedReviewer: "송미래",
          estimatedReviewTime: "25분",
        },
      ];
    },
    staleTime: 30 * 1000, // 30초
    refetchInterval: 15 * 1000, // 15초마다 새로고침
  });

  /**
   * 검토 통계 조회
   */
  const {
    data: statistics = {
      pending: 0,
      highPriority: 0,
      reviewers: 0,
      averageProcessingTime: 0,
      totalDocuments: 0,
      approvalRate: 0,
      rejectionRate: 0,
    },
  } = useQuery({
    queryKey: ["review-statistics"],
    queryFn: async (): Promise<ReviewStatistics> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/documents/review/statistics')
      // return response.data

      // 목 데이터 (실제 문서 데이터 기반으로 계산)
      const pending = documents.filter(doc => doc.status === "pending").length;
      const highPriority = documents.filter(doc => doc.priority === "high").length;
      const totalDocuments = documents.length;
      const approvalRate = 85; // 승인율
      const rejectionRate = 15; // 거부율

      return {
        pending,
        highPriority,
        reviewers: 5, // 활성 검토자 수
        averageProcessingTime: 35, // 평균 처리 시간 (분)
        totalDocuments,
        approvalRate,
        rejectionRate,
      };
    },
    staleTime: 60 * 1000, // 1분
    refetchInterval: 30 * 1000, // 30초마다 새로고침
  });

  /**
   * 문서 승인 뮤테이션
   */
  const approveDocumentMutation = useMutation({
    mutationFn: async (documentId: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post(`/api/v1/documents/${documentId}/approve`)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: (_, documentId) => {
      // 로컬 상태에서 제거
      queryClient.setQueryData(["pending-review-documents"], (oldDocuments: PendingReviewDocument[] = []) =>
        oldDocuments.filter(doc => doc.id !== documentId)
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["review-statistics"] });
    },
    onError: (error) => {
      console.error("문서 승인 실패:", error);
    },
  });

  /**
   * 문서 거부 뮤테이션
   */
  const rejectDocumentMutation = useMutation({
    mutationFn: async ({ documentId, reason }: { documentId: string; reason: string }): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post(`/api/v1/documents/${documentId}/reject`, { reason })

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: (_, { documentId }) => {
      // 로컬 상태에서 제거
      queryClient.setQueryData(["pending-review-documents"], (oldDocuments: PendingReviewDocument[] = []) =>
        oldDocuments.filter(doc => doc.id !== documentId)
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["review-statistics"] });
    },
    onError: (error) => {
      console.error("문서 거부 실패:", error);
    },
  });

  /**
   * 문서 수정 요청 뮤테이션
   */
  const requestRevisionMutation = useMutation({
    mutationFn: async ({ documentId, comments }: { documentId: string; comments: string }): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post(`/api/v1/documents/${documentId}/request-revision`, { comments })

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: (_, { documentId }) => {
      // 로컬 상태 업데이트
      queryClient.setQueryData(["pending-review-documents"], (oldDocuments: PendingReviewDocument[] = []) =>
        oldDocuments.map(doc =>
          doc.id === documentId
            ? { ...doc, status: "revision_requested" as const }
            : doc
        )
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["review-statistics"] });
    },
    onError: (error) => {
      console.error("문서 수정 요청 실패:", error);
    },
  });

  /**
   * 배치 승인 뮤테이션
   */
  const batchApproveMutation = useMutation({
    mutationFn: async (documentIds: string[]): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post('/api/v1/documents/batch-approve', { documentIds })

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
    },
    onSuccess: (_, documentIds) => {
      // 로컬 상태에서 제거
      queryClient.setQueryData(["pending-review-documents"], (oldDocuments: PendingReviewDocument[] = []) =>
        oldDocuments.filter(doc => !documentIds.includes(doc.id))
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["review-statistics"] });
    },
    onError: (error) => {
      console.error("배치 승인 실패:", error);
    },
  });

  /**
   * 배치 거부 뮤테이션
   */
  const batchRejectMutation = useMutation({
    mutationFn: async ({ documentIds, reason }: { documentIds: string[]; reason: string }): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post('/api/v1/documents/batch-reject', { documentIds, reason })

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
    },
    onSuccess: (_, { documentIds }) => {
      // 로컬 상태에서 제거
      queryClient.setQueryData(["pending-review-documents"], (oldDocuments: PendingReviewDocument[] = []) =>
        oldDocuments.filter(doc => !documentIds.includes(doc.id))
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["review-statistics"] });
    },
    onError: (error) => {
      console.error("배치 거부 실패:", error);
    },
  });

  /**
   * 문서 상세 정보 조회
   */
  const getDocumentDetails = async (documentId: string): Promise<PendingReviewDocument | null> => {
    // TODO: 실제 API 호출로 교체
    // const response = await api.get(`/api/v1/documents/${documentId}/details`)
    // return response.data

    // 목 데이터
    const document = documents.find(doc => doc.id === documentId);
    return document || null;
  };

  /**
   * 문서 승인 함수
   */
  const approveDocument = async (documentId: string): Promise<void> => {
    await approveDocumentMutation.mutateAsync(documentId);
  };

  /**
   * 문서 거부 함수
   */
  const rejectDocument = async (documentId: string, reason: string): Promise<void> => {
    await rejectDocumentMutation.mutateAsync({ documentId, reason });
  };

  /**
   * 문서 수정 요청 함수
   */
  const requestRevision = async (documentId: string, comments: string): Promise<void> => {
    await requestRevisionMutation.mutateAsync({ documentId, comments });
  };

  /**
   * 배치 승인 함수
   */
  const batchApprove = async (documentIds: string[]): Promise<void> => {
    await batchApproveMutation.mutateAsync(documentIds);
  };

  /**
   * 배치 거부 함수
   */
  const batchReject = async (documentIds: string[], reason: string): Promise<void> => {
    await batchRejectMutation.mutateAsync({ documentIds, reason });
  };

  return {
    // 데이터
    documents,
    statistics,
    
    // 로딩 상태
    isLoading,
    
    // 에러 상태
    error,
    
    // 함수들
    approveDocument,
    rejectDocument,
    requestRevision,
    batchApprove,
    batchReject,
    getDocumentDetails,
    
    // 뮤테이션 상태
    isApproving: approveDocumentMutation.isPending,
    isRejecting: rejectDocumentMutation.isPending,
    isRequestingRevision: requestRevisionMutation.isPending,
    isBatchApproving: batchApproveMutation.isPending,
    isBatchRejecting: batchRejectMutation.isPending,
  };
}
