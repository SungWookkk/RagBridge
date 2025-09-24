"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

/**
 * 문서 상태 타입 정의
 */
type PipelineStep =
  | "uploaded"
  | "ocr_processing"
  | "field_extraction"
  | "validation"
  | "embedding"
  | "indexing"
  | "completed"
  | "error";
type StepStatus = "pending" | "processing" | "completed" | "failed";

interface DocumentStatus {
  currentStep: PipelineStep;
  overallProgress: number;
  steps: {
    [key in PipelineStep]: {
      status: StepStatus;
      progress: number;
      startTime?: string;
      endTime?: string;
      error?: string;
    };
  };
}

interface Document {
  id: string;
  name: string;
  tenantId: string;
  status: DocumentStatus;
  fileType: string;
  uploadedAt: string;
  size: string;
  category: string;
  expectedFields: string[];
  extractedFields: Record<string, any>;
  validationErrors: string[];
  confidenceScore: number;
  processingTime: number;
}

/**
 * 문서 목록 조회 훅
 *
 * @description
 * - 문서 목록을 가져오는 React Query 훅
 * - 실시간 업데이트를 위한 refetch 기능
 * - 에러 처리 및 로딩 상태 관리
 */
export function useDocuments() {
  const {
    data: documents = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: async (): Promise<Document[]> => {
      // 실제 API 호출 시에는 이 부분을 실제 엔드포인트로 교체
      // const response = await api.get('/api/v1/documents')
      // return response.data

      // 현재는 샘플 데이터 반환
      return [
        {
          id: "1",
          name: "회사 정책서.pdf",
          tenantId: "tenant-001",
          status: {
            currentStep: "completed",
            overallProgress: 100,
            steps: {
              uploaded: { status: "completed", progress: 100 },
              ocr_processing: { status: "completed", progress: 100 },
              field_extraction: { status: "completed", progress: 100 },
              validation: { status: "completed", progress: 100 },
              embedding: { status: "completed", progress: 100 },
              indexing: { status: "completed", progress: 100 },
              completed: { status: "completed", progress: 100 },
              error: { status: "pending", progress: 0 },
            },
          },
          fileType: "PDF",
          uploadedAt: "2시간 전",
          size: "2.4 MB",
          category: "Policy",
          expectedFields: ["제목", "발행일", "부서명"],
          extractedFields: {
            제목: "회사 정책서",
            발행일: "2024-01-15",
            부서명: "인사팀",
          },
          validationErrors: [],
          confidenceScore: 0.95,
          processingTime: 12.5,
        },
        {
          id: "2",
          name: "기술 문서.docx",
          tenantId: "tenant-001",
          status: {
            currentStep: "embedding",
            overallProgress: 80,
            steps: {
              uploaded: { status: "completed", progress: 100 },
              ocr_processing: { status: "completed", progress: 100 },
              field_extraction: { status: "completed", progress: 100 },
              validation: { status: "completed", progress: 100 },
              embedding: { status: "processing", progress: 60 },
              indexing: { status: "pending", progress: 0 },
              completed: { status: "pending", progress: 0 },
              error: { status: "pending", progress: 0 },
            },
          },
          fileType: "DOCX",
          uploadedAt: "1일 전",
          size: "1.8 MB",
          category: "Technical",
          expectedFields: ["문서명", "버전", "작성자"],
          extractedFields: {
            문서명: "기술 문서",
            버전: "v2.1",
            작성자: "개발팀",
          },
          validationErrors: [],
          confidenceScore: 0.88,
          processingTime: 8.2,
        },
        {
          id: "3",
          name: "회의록.pdf",
          tenantId: "tenant-001",
          status: {
            currentStep: "validation",
            overallProgress: 45,
            steps: {
              uploaded: { status: "completed", progress: 100 },
              ocr_processing: { status: "completed", progress: 100 },
              field_extraction: { status: "completed", progress: 100 },
              validation: { status: "processing", progress: 30 },
              embedding: { status: "pending", progress: 0 },
              indexing: { status: "pending", progress: 0 },
              completed: { status: "pending", progress: 0 },
              error: { status: "pending", progress: 0 },
            },
          },
          fileType: "PDF",
          uploadedAt: "3일 전",
          size: "0.9 MB",
          category: "Meeting",
          expectedFields: ["회의명", "날짜", "참석자"],
          extractedFields: { 회의명: "주간 회의", 날짜: "2024-01-12" },
          validationErrors: ["참석자 정보 누락"],
          confidenceScore: 0.72,
          processingTime: 5.1,
        },
      ];
    },
    // TODO: 실제 API 연동 시 필요에 따라 폴링 활성화
    // refetchInterval: 30000, // 30초마다 자동 새로고침 (실제 API 연동 시)
    refetchInterval: false, // 목 데이터 사용 중이므로 폴링 비활성화
    staleTime: 5 * 60 * 1000, // 5분 후 stale 상태로 변경 (providers.tsx와 일치)
  });

  return {
    documents,
    isLoading,
    error,
    refetch,
  };
}

/**
 * 특정 문서 조회 훅
 *
 * @param documentId - 조회할 문서 ID
 */
export function useDocument(documentId: string) {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: async (): Promise<Document | null> => {
      // 실제 API 호출
      // const response = await api.get(`/api/v1/documents/${documentId}`)
      // return response.data

      // 현재는 샘플 데이터 반환
      return null;
    },
    enabled: !!documentId,
  });
}

/**
 * 문서 업로드 훅
 *
 * @description
 * - 파일 업로드 및 처리 상태 관리
 * - 업로드 진행률 추적
 * - 에러 처리 및 성공 상태 관리
 */
export function useDocumentUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadDocument = async (file: File, expectedFields?: string[]) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (expectedFields) {
        formData.append("expectedFields", JSON.stringify(expectedFields));
      }

      // 실제 API 호출 시에는 이 부분을 실제 엔드포인트로 교체
      // const response = await api.post('/api/v1/documents/upload', formData, {
      //   onUploadProgress: (progressEvent) => {
      //     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total!)
      //     setUploadProgress(progress)
      //   }
      // })

      // 시뮬레이션
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      setIsUploading(false);
      return { success: true, documentId: "new-document-id" };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "업로드 중 오류가 발생했습니다.";

      setUploadError(errorMessage);
      setIsUploading(false);

      // Race condition 방지: 지역 변수로 에러 메시지 반환
      return { success: false, error: errorMessage };
    }
  };

  return {
    uploadDocument,
    uploadProgress,
    isUploading,
    uploadError,
  };
}
