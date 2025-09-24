"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

/**
 * 워크스페이스 정보 인터페이스
 */
interface RAGWorkspace {
  id: string;
  name: string;
  description: string;
  tenantId: string;
  documents: number;
  processedDocuments: number;
  totalQueries: number;
  avgResponseTime: number;
  status: "active" | "training" | "maintenance";
  aiModel: string;
  validationRules: number;
  lastActivity: string;
  members: number;
}

/**
 * 워크스페이스 목록 조회 훅
 *
 * @description
 * - 워크스페이스 목록을 가져오는 React Query 훅
 * - 실시간 업데이트를 위한 refetch 기능
 * - 에러 처리 및 로딩 상태 관리
 */
export function useWorkspaces() {
  const {
    data: workspaces = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async (): Promise<RAGWorkspace[]> => {
      // 실제 API 호출 시에는 이 부분을 실제 엔드포인트로 교체
      // const response = await api.get('/api/v1/workspaces')
      // return response.data

      // 현재는 샘플 데이터 반환
      return [
        {
          id: "1",
          name: "법무팀 문서 분석",
          description: "계약서 및 정책 문서 자동 분석 및 검증 프로젝트",
          tenantId: "legal-dept",
          documents: 156,
          processedDocuments: 142,
          totalQueries: 2847,
          avgResponseTime: 1.2,
          status: "active",
          aiModel: "gpt-4-turbo",
          validationRules: 12,
          lastActivity: "5분 전",
          members: 4,
        },
        {
          id: "2",
          name: "기술문서 검색 시스템",
          description: "개발자 문서 검색 및 질의응답 전용 프로젝트",
          tenantId: "tech-dept",
          documents: 89,
          processedDocuments: 89,
          totalQueries: 15672,
          avgResponseTime: 0.8,
          status: "active",
          aiModel: "claude-3-sonnet",
          validationRules: 8,
          lastActivity: "1분 전",
          members: 6,
        },
        {
          id: "3",
          name: "HR 정책 문서 센터",
          description: "인사 정책 및 규정 문서 스마트 검색 시스템",
          tenantId: "hr-dept",
          documents: 34,
          processedDocuments: 28,
          totalQueries: 892,
          avgResponseTime: 1.5,
          status: "training",
          aiModel: "gpt-3.5-turbo",
          validationRules: 5,
          lastActivity: "30분 전",
          members: 3,
        },
      ];
    },
    refetchInterval: 10000, // 10초마다 자동 새로고침
    staleTime: 5000, // 5초 후 stale 상태로 변경
  });

  return {
    workspaces,
    isLoading,
    error,
    refetch,
  };
}

/**
 * 특정 워크스페이스 조회 훅
 *
 * @param workspaceId - 조회할 워크스페이스 ID
 */
export function useWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async (): Promise<RAGWorkspace | null> => {
      // 실제 API 호출
      // const response = await api.get(`/api/v1/workspaces/${workspaceId}`)
      // return response.data

      // 현재는 샘플 데이터 반환
      return null;
    },
    enabled: !!workspaceId,
  });
}

/**
 * 워크스페이스 생성 훅
 *
 * @description
 * - 새 워크스페이스 생성 및 처리 상태 관리
 * - 에러 처리 및 성공 상태 관리
 */
export function useCreateWorkspace() {
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const createWorkspace = async (workspaceData: Partial<RAGWorkspace>) => {
    setIsCreating(true);
    setCreateError(null);

    try {
      // 실제 API 호출
      // const response = await api.post('/api/v1/workspaces', workspaceData)
      // return response.data

      // 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsCreating(false);
      return { success: true, workspaceId: "new-workspace-id" };
    } catch (error) {
      setCreateError(
        error instanceof Error
          ? error.message
          : "워크스페이스 생성 중 오류가 발생했습니다.",
      );
      setIsCreating(false);
      return { success: false, error: createError };
    }
  };

  return {
    createWorkspace,
    isCreating,
    createError,
  };
}
