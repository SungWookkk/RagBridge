import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * 완료된 문서 관련 타입 정의
 */
export interface CompletedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  status: "completed" | "archived" | "shared";
  uploader: string;
  uploadedAt: string;
  completedAt: string;
  processingTime: string;
  qualityScore: number;
  securityLevel: "public" | "internal" | "confidential" | "restricted";
  tags: string[];
  extractedFields?: Record<string, any>;
  validationResults?: {
    passed: boolean;
    errors: string[];
    warnings: string[];
  };
  downloadCount: number;
  shareCount: number;
  lastAccessedAt?: string;
}

export interface CompletedDocumentsStatistics {
  completed: number;
  averageProcessingTime: number;
  averageQualityScore: number;
  securityCompliance: number;
  totalSize: number;
  mostCommonTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  dailyCompletions: Array<{
    date: string;
    count: number;
  }>;
}

export interface DocumentPreview {
  id: string;
  content: string;
  pages: number;
  thumbnail?: string;
  extractedText: string;
  metadata: Record<string, any>;
}

/**
 * 완료된 문서 데이터 훅
 *
 * @description
 * - 완료된 문서 목록 조회 및 관리
 * - 문서 다운로드, 공유, 아카이브, 삭제 기능
 * - 문서 미리보기 및 통계 정보
 * - 검색 및 필터링 기능
 */
export function useCompletedDocuments() {
  const queryClient = useQueryClient();

  /**
   * 완료된 문서 목록 조회
   */
  const {
    data: documents = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["completed-documents"],
    queryFn: async (): Promise<CompletedDocument[]> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/documents/completed')
      // return response.data

      // 목 데이터
      return [
        {
          id: "doc-001",
          name: "계약서_2024.pdf",
          type: "application/pdf",
          size: 2048576,
          status: "completed",
          uploader: "김철수",
          uploadedAt: "2024-01-24T10:30:00Z",
          completedAt: "2024-01-24T10:35:00Z",
          processingTime: "5분",
          qualityScore: 95,
          securityLevel: "confidential",
          tags: ["계약서", "법무", "2024"],
          extractedFields: {
            contractNumber: "CT-2024-001",
            contractAmount: "100,000,000원",
            contractPeriod: "2024-01-01 ~ 2024-12-31",
            parties: ["ABC회사", "XYZ회사"],
          },
          validationResults: {
            passed: true,
            errors: [],
            warnings: ["서명 필드 확인 필요"],
          },
          downloadCount: 3,
          shareCount: 1,
          lastAccessedAt: "2024-01-24T14:30:00Z",
        },
        {
          id: "doc-002",
          name: "제안서_프로젝트.docx",
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 1536000,
          status: "completed",
          uploader: "박민수",
          uploadedAt: "2024-01-24T11:15:00Z",
          completedAt: "2024-01-24T11:20:00Z",
          processingTime: "5분",
          qualityScore: 88,
          securityLevel: "internal",
          tags: ["제안서", "프로젝트", "기획"],
          extractedFields: {
            projectName: "새로운 플랫폼 개발",
            budget: "50,000,000원",
            timeline: "6개월",
            teamSize: "5명",
          },
          validationResults: {
            passed: true,
            errors: [],
            warnings: [],
          },
          downloadCount: 7,
          shareCount: 3,
          lastAccessedAt: "2024-01-24T15:45:00Z",
        },
        {
          id: "doc-003",
          name: "이미지_스캔본.jpg",
          type: "image/jpeg",
          size: 5120000,
          status: "completed",
          uploader: "최지영",
          uploadedAt: "2024-01-24T12:00:00Z",
          completedAt: "2024-01-24T12:08:00Z",
          processingTime: "8분",
          qualityScore: 72,
          securityLevel: "public",
          tags: ["스캔", "이미지", "문서"],
          extractedFields: {
            textContent: "스캔된 문서의 텍스트 내용...",
            confidence: 0.72,
          },
          validationResults: {
            passed: false,
            errors: ["이미지 해상도가 낮습니다"],
            warnings: ["텍스트 인식률이 80% 미만입니다"],
          },
          downloadCount: 2,
          shareCount: 0,
          lastAccessedAt: "2024-01-24T13:20:00Z",
        },
        {
          id: "doc-004",
          name: "보고서_분석.pdf",
          type: "application/pdf",
          size: 3072000,
          status: "archived",
          uploader: "윤서연",
          uploadedAt: "2024-01-24T13:00:00Z",
          completedAt: "2024-01-24T13:10:00Z",
          processingTime: "10분",
          qualityScore: 92,
          securityLevel: "restricted",
          tags: ["보고서", "분석", "데이터"],
          extractedFields: {
            reportType: "월간 성과 보고서",
            period: "2024년 1월",
            keyMetrics: ["매출", "고객수", "만족도"],
          },
          validationResults: {
            passed: true,
            errors: [],
            warnings: [],
          },
          downloadCount: 12,
          shareCount: 5,
          lastAccessedAt: "2024-01-24T16:00:00Z",
        },
        {
          id: "doc-005",
          name: "매뉴얼_사용법.docx",
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 1024000,
          status: "shared",
          uploader: "이준호",
          uploadedAt: "2024-01-24T14:00:00Z",
          completedAt: "2024-01-24T14:05:00Z",
          processingTime: "5분",
          qualityScore: 96,
          securityLevel: "internal",
          tags: ["매뉴얼", "사용법", "가이드"],
          extractedFields: {
            manualType: "사용자 매뉴얼",
            version: "v2.1",
            sections: ["시작하기", "기본 기능", "고급 기능"],
          },
          validationResults: {
            passed: true,
            errors: [],
            warnings: [],
          },
          downloadCount: 25,
          shareCount: 8,
          lastAccessedAt: "2024-01-24T17:30:00Z",
        },
      ];
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchInterval: 60 * 1000, // 1분마다 새로고침
  });

  /**
   * 완료된 문서 통계 조회
   */
  const {
    data: statistics = {
      completed: 0,
      averageProcessingTime: 0,
      averageQualityScore: 0,
      securityCompliance: 0,
      totalSize: 0,
      mostCommonTypes: [],
      dailyCompletions: [],
    },
  } = useQuery({
    queryKey: ["completed-documents-statistics"],
    queryFn: async (): Promise<CompletedDocumentsStatistics> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/documents/completed/statistics')
      // return response.data

      // 목 데이터 (실제 문서 데이터 기반으로 계산)
      const completed = documents.length;
      const averageProcessingTime = Math.round(
        documents.reduce((acc, doc) => acc + parseInt(doc.processingTime), 0) / completed
      );
      const averageQualityScore = Math.round(
        documents.reduce((acc, doc) => acc + doc.qualityScore, 0) / completed
      );
      const totalSize = documents.reduce((acc, doc) => acc + doc.size, 0);
      const securityCompliance = 98; // 보안 준수율

      // 파일 타입별 통계
      const typeCounts = documents.reduce((acc, doc) => {
        acc[doc.type] = (acc[doc.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostCommonTypes = Object.entries(typeCounts)
        .map(([type, count]) => ({
          type: type.split('/')[1] || type,
          count,
          percentage: Math.round((count / completed) * 100),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // 일별 완료 통계 (최근 7일)
      const dailyCompletions = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 10) + 1,
        };
      }).reverse();

      return {
        completed,
        averageProcessingTime,
        averageQualityScore,
        securityCompliance,
        totalSize,
        mostCommonTypes,
        dailyCompletions,
      };
    },
    staleTime: 10 * 60 * 1000, // 10분
    refetchInterval: 5 * 60 * 1000, // 5분마다 새로고침
  });

  /**
   * 문서 다운로드 뮤테이션
   */
  const downloadDocumentMutation = useMutation({
    mutationFn: async (documentId: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get(`/api/v1/documents/${documentId}/download`, {
      //   responseType: 'blob'
      // })
      // const blob = new Blob([response.data])
      // const url = window.URL.createObjectURL(blob)
      // const link = document.createElement('a')
      // link.href = url
      // link.download = `${document.name}`
      // link.click()

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: (_, documentId) => {
      // 다운로드 횟수 증가
      queryClient.setQueryData(["completed-documents"], (oldDocuments: CompletedDocument[] = []) =>
        oldDocuments.map(doc =>
          doc.id === documentId
            ? { ...doc, downloadCount: doc.downloadCount + 1, lastAccessedAt: new Date().toISOString() }
            : doc
        )
      );
    },
    onError: (error) => {
      console.error("문서 다운로드 실패:", error);
    },
  });

  /**
   * 문서 공유 뮤테이션
   */
  const shareDocumentMutation = useMutation({
    mutationFn: async (documentId: string): Promise<string> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.post(`/api/v1/documents/${documentId}/share`)
      // return response.data.shareUrl

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `https://ragbridge.com/shared/${documentId}`;
    },
    onSuccess: (shareUrl, documentId) => {
      // 공유 횟수 증가
      queryClient.setQueryData(["completed-documents"], (oldDocuments: CompletedDocument[] = []) =>
        oldDocuments.map(doc =>
          doc.id === documentId
            ? { ...doc, shareCount: doc.shareCount + 1, status: "shared" as const }
            : doc
        )
      );
    },
    onError: (error) => {
      console.error("문서 공유 실패:", error);
    },
  });

  /**
   * 문서 아카이브 뮤테이션
   */
  const archiveDocumentMutation = useMutation({
    mutationFn: async (documentId: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post(`/api/v1/documents/${documentId}/archive`)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: (_, documentId) => {
      // 상태를 아카이브로 변경
      queryClient.setQueryData(["completed-documents"], (oldDocuments: CompletedDocument[] = []) =>
        oldDocuments.map(doc =>
          doc.id === documentId
            ? { ...doc, status: "archived" as const }
            : doc
        )
      );
    },
    onError: (error) => {
      console.error("문서 아카이브 실패:", error);
    },
  });

  /**
   * 문서 삭제 뮤테이션
   */
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.delete(`/api/v1/documents/${documentId}`)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: (_, documentId) => {
      // 로컬 상태에서 제거
      queryClient.setQueryData(["completed-documents"], (oldDocuments: CompletedDocument[] = []) =>
        oldDocuments.filter(doc => doc.id !== documentId)
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["completed-documents-statistics"] });
    },
    onError: (error) => {
      console.error("문서 삭제 실패:", error);
    },
  });

  /**
   * 문서 미리보기 조회
   */
  const getDocumentPreview = async (documentId: string): Promise<DocumentPreview> => {
    // TODO: 실제 API 호출로 교체
    // const response = await api.get(`/api/v1/documents/${documentId}/preview`)
    // return response.data

    // 목 데이터
    const document = documents.find(doc => doc.id === documentId);
    if (!document) {
      throw new Error("문서를 찾을 수 없습니다.");
    }

    return {
      id: documentId,
      content: "문서 내용이 여기에 표시됩니다...",
      pages: document.type.includes("pdf") ? 10 : 1,
      thumbnail: document.type.includes("image") ? "/api/v1/documents/thumbnail" : undefined,
      extractedText: document.extractedFields?.textContent || "추출된 텍스트 내용...",
      metadata: {
        ...document.extractedFields,
        processingTime: document.processingTime,
        qualityScore: document.qualityScore,
        securityLevel: document.securityLevel,
      },
    };
  };

  /**
   * 문서 다운로드 함수
   */
  const downloadDocument = async (documentId: string): Promise<void> => {
    await downloadDocumentMutation.mutateAsync(documentId);
  };

  /**
   * 문서 공유 함수
   */
  const shareDocument = async (documentId: string): Promise<string> => {
    return await shareDocumentMutation.mutateAsync(documentId);
  };

  /**
   * 문서 아카이브 함수
   */
  const archiveDocument = async (documentId: string): Promise<void> => {
    await archiveDocumentMutation.mutateAsync(documentId);
  };

  /**
   * 문서 삭제 함수
   */
  const deleteDocument = async (documentId: string): Promise<void> => {
    await deleteDocumentMutation.mutateAsync(documentId);
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
    downloadDocument,
    shareDocument,
    archiveDocument,
    deleteDocument,
    getDocumentPreview,
    
    // 뮤테이션 상태
    isDownloading: downloadDocumentMutation.isPending,
    isSharing: shareDocumentMutation.isPending,
    isArchiving: archiveDocumentMutation.isPending,
    isDeleting: deleteDocumentMutation.isPending,
  };
}
