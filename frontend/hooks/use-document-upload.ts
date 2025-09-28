import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * 문서 업로드 관련 타입 정의
 */
export interface UploadStatus {
  file: File;
  status: "uploading" | "success" | "error";
  progress: number;
  error?: string;
  documentId?: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploaded" | "processing" | "completed" | "failed";
  uploadedAt: string;
  processedAt?: string;
  error?: string;
}

/**
 * 문서 업로드 훅
 *
 * @description
 * - 파일 업로드 및 상태 관리
 * - 업로드 진행률 추적
 * - 업로드 실패 시 재시도 기능
 * - 업로드된 문서 목록 관리
 */
export function useDocumentUpload() {
  const queryClient = useQueryClient();
  const [uploadStatus, setUploadStatus] = useState<UploadStatus[]>([]);
  const { toast } = useToast();

  /**
   * 파일 업로드 뮤테이션
   */
  const uploadFilesMutation = useMutation({
    mutationFn: async (files: File[]): Promise<UploadedDocument[]> => {
      // TODO: 실제 API 호출로 교체
      // const formData = new FormData()
      // files.forEach(file => {
      //   formData.append('files', file)
      // })
      // const response = await api.post('/api/v1/documents/upload', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      //   onUploadProgress: (progressEvent) => {
      //     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      //     // 진행률 업데이트 로직
      //   }
      // })
      // return response.data

      // 목 데이터 시뮬레이션
      const uploadedDocuments: UploadedDocument[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 업로드 상태 초기화
        setUploadStatus(prev => [
          ...prev,
          {
            file,
            status: "uploading",
            progress: 0,
          }
        ]);

        // 업로드 진행률 시뮬레이션
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          
          setUploadStatus(prev => 
            prev.map((status, index) => 
              index === prev.length - 1 
                ? { ...status, progress }
                : status
            )
          );
        }

        // 업로드 완료
        const document: UploadedDocument = {
          id: `doc-${Date.now()}-${i}`,
          name: file.name,
          size: file.size,
          type: file.type,
          status: "uploaded",
          uploadedAt: new Date().toISOString(),
        };

        uploadedDocuments.push(document);

        // 성공 상태로 업데이트
        setUploadStatus(prev => 
          prev.map((status, index) => 
            index === prev.length - 1 
              ? { ...status, status: "success" as const, progress: 100 }
              : status
          )
        );
      }

      return uploadedDocuments;
    },
    onSuccess: (documents) => {
      // 문서 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      
      // Toast는 컴포넌트에서 호출하도록 제거
      // toast({
      //   title: "업로드 완료",
      //   description: `${documents.length}개 파일이 성공적으로 업로드되었습니다.`,
      //   variant: "success",
      // });
    },
    onError: (error) => {
      console.error("파일 업로드 실패:", error);
      
      // 에러 상태로 업데이트
      setUploadStatus(prev => 
        prev.map(status => 
          status.status === "uploading"
            ? { ...status, status: "error" as const, error: "업로드 중 오류가 발생했습니다." }
            : status
        )
      );
      
      // Toast는 컴포넌트에서 호출하도록 제거
      // toast({
      //   title: "업로드 실패",
      //   description: "파일 업로드 중 오류가 발생했습니다.",
      //   variant: "destructive",
      // });
    },
  });

  /**
   * 파일 업로드 함수
   */
  const uploadFiles = useCallback(async (files: File[]): Promise<void> => {
    // 업로드 상태 초기화
    setUploadStatus([]);
    
    try {
      await uploadFilesMutation.mutateAsync(files);
    } catch (error) {
      // 에러는 뮤테이션에서 처리됨
      throw error;
    }
  }, [uploadFilesMutation]);

  /**
   * 업로드 상태 초기화
   */
  const clearUploadStatus = useCallback(() => {
    setUploadStatus([]);
  }, []);

  /**
   * 업로드 재시도
   */
  const retryUpload = useCallback(async (index: number) => {
    const status = uploadStatus[index];
    if (!status || status.status !== "error") return;

    try {
      // 재시도 시뮬레이션
      setUploadStatus(prev => 
        prev.map((s, i) => 
          i === index 
            ? { ...s, status: "uploading" as const, progress: 0, error: undefined }
            : s
        )
      );

      // 업로드 진행률 시뮬레이션
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setUploadStatus(prev => 
          prev.map((s, i) => 
            i === index 
              ? { ...s, progress }
              : s
          )
        );
      }

      // 성공 상태로 업데이트
      setUploadStatus(prev => 
        prev.map((s, i) => 
          i === index 
            ? { ...s, status: "success" as const, progress: 100 }
            : s
        )
      );

      // Toast는 컴포넌트에서 호출하도록 제거
      // toast({
      //   title: "재시도 성공",
      //   description: "파일 업로드가 성공적으로 완료되었습니다.",
      //   variant: "success",
      // });
    } catch (error) {
      // 에러 상태로 업데이트
      setUploadStatus(prev => 
        prev.map((s, i) => 
          i === index 
            ? { ...s, status: "error" as const, error: "재시도 중 오류가 발생했습니다." }
            : s
        )
      );
      
      // Toast는 컴포넌트에서 호출하도록 제거
      // toast({
      //   title: "재시도 실패",
      //   description: "파일 업로드 재시도 중 오류가 발생했습니다.",
      //   variant: "destructive",
      // });
    }
  }, [uploadStatus]);

  /**
   * 파일 삭제
   */
  const deleteFile = useCallback(async (documentId: string): Promise<void> => {
    // TODO: 실제 API 호출로 교체
    // await api.delete(`/api/v1/documents/${documentId}`)

    // 목 데이터 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 문서 목록 새로고침
    queryClient.invalidateQueries({ queryKey: ["documents"] });
    
    // Toast는 컴포넌트에서 호출하도록 제거
    // toast({
    //   title: "파일 삭제 완료",
    //   description: "파일이 성공적으로 삭제되었습니다.",
    //   variant: "success",
    // });
  }, [queryClient]);

  /**
   * 업로드된 문서 목록 조회
   */
  const getUploadedDocuments = useCallback((): UploadedDocument[] => {
    // TODO: 실제 API 호출로 교체
    // const response = await api.get('/api/v1/documents')
    // return response.data

    // 목 데이터
    return [
      {
        id: "doc-001",
        name: "계약서_2024.pdf",
        size: 2048576,
        type: "application/pdf",
        status: "completed",
        uploadedAt: "2024-01-24T10:30:00Z",
        processedAt: "2024-01-24T10:35:00Z",
      },
      {
        id: "doc-002",
        name: "제안서_프로젝트.docx",
        size: 1536000,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        status: "processing",
        uploadedAt: "2024-01-24T11:15:00Z",
      },
      {
        id: "doc-003",
        name: "이미지_스캔본.jpg",
        size: 5120000,
        type: "image/jpeg",
        status: "failed",
        uploadedAt: "2024-01-24T12:00:00Z",
        error: "이미지 해상도가 너무 낮습니다.",
      },
    ];
  }, []);

  return {
    // 상태
    uploadStatus,
    isUploading: uploadFilesMutation.isPending,
    uploadProgress: uploadStatus.reduce((acc, status) => acc + status.progress, 0) / uploadStatus.length || 0,
    
    // 함수들
    uploadFiles,
    clearUploadStatus,
    retryUpload,
    deleteFile,
    getUploadedDocuments,
    
    // 뮤테이션 상태
    isSuccess: uploadFilesMutation.isSuccess,
    isError: uploadFilesMutation.isError,
    error: uploadFilesMutation.error,
  };
}
