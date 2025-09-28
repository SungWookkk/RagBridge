import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

/**
 * 검증 규칙 타입 정의
 *
 * @description
 * - 검증 규칙의 기본 구조 및 속성
 * - API 응답과 일치하는 타입 정의
 */
export interface ValidationRule {
  id: string;
  name: string;
  description?: string;
  fieldType: "text" | "number" | "date" | "email" | "phone" | "custom";
  validationType: "regex" | "threshold" | "human_review";
  regex?: string;
  threshold?: number;
  humanReviewRequired?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 검증 규칙 생성 요청 타입
 */
export interface CreateValidationRuleRequest {
  name: string;
  description?: string;
  fieldType: ValidationRule["fieldType"];
  validationType: ValidationRule["validationType"];
  regex?: string;
  threshold?: number;
  humanReviewRequired?: boolean;
  isActive?: boolean;
}

/**
 * 검증 규칙 테스트 결과 타입
 */
export interface ValidationTestResult {
  passed: boolean;
  message: string;
  details?: Record<string, any>;
}

/**
 * 목 데이터: 검증 규칙 목록
 *
 * @description
 * - 실제 API 연동 전까지 사용할 샘플 데이터
 * - 다양한 검증 타입과 필드 타입을 포함
 */
const mockValidationRules: ValidationRule[] = [
  {
    id: "1",
    name: "이메일 형식 검증",
    description: "표준 이메일 형식을 검증합니다",
    fieldType: "email",
    validationType: "regex",
    regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "전화번호 형식 검증",
    description: "한국 전화번호 형식을 검증합니다",
    fieldType: "phone",
    validationType: "regex",
    regex: "^01[0-9]-?[0-9]{4}-?[0-9]{4}$",
    isActive: true,
    createdAt: "2024-01-16T14:30:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
  },
  {
    id: "3",
    name: "신뢰도 임계값 검증",
    description: "AI 추출 신뢰도가 80% 이상인지 검증합니다",
    fieldType: "number",
    validationType: "threshold",
    threshold: 80,
    isActive: true,
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
  },
  {
    id: "4",
    name: "중요 문서 휴먼검토",
    description: "중요한 문서는 반드시 휴먼검토를 거칩니다",
    fieldType: "text",
    validationType: "human_review",
    humanReviewRequired: true,
    isActive: true,
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "5",
    name: "날짜 형식 검증",
    description: "YYYY-MM-DD 형식의 날짜를 검증합니다",
    fieldType: "date",
    validationType: "regex",
    regex: "^\\d{4}-\\d{2}-\\d{2}$",
    isActive: false,
    createdAt: "2024-01-19T11:20:00Z",
    updatedAt: "2024-01-19T11:20:00Z",
  },
];

/**
 * 검증 규칙 관리 훅
 *
 * @description
 * - 검증 규칙의 CRUD 작업을 관리
 * - React Query를 사용한 서버 상태 관리
 * - 목 데이터 기반으로 구현 (실제 API 연동 전)
 */
export function useValidationRules() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * 검증 규칙 목록 조회
   *
   * @description
   * - 모든 검증 규칙을 조회
   * - 목 데이터를 사용하여 즉시 반환
   * - 실제 API 연동 시 GET /api/v1/validation/rules로 교체
   */
  const {
    data: rules = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["validation-rules"],
    queryFn: async (): Promise<ValidationRule[]> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/validation/rules')
      // return response.data

      // 목 데이터 반환 (실제 API 응답 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockValidationRules;
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchInterval: false, // 목 데이터 사용 중이므로 폴링 비활성화
  });

  /**
   * 검증 규칙 생성 뮤테이션
   *
   * @description
   * - 새 검증 규칙을 생성
   * - 성공 시 캐시 무효화로 목록 새로고침
   * - 실제 API 연동 시 POST /api/v1/validation/rules로 교체
   */
  const createRule = useMutation({
    mutationFn: async (data: CreateValidationRuleRequest): Promise<ValidationRule> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.post('/api/v1/validation/rules', data)
      // return response.data

      // 목 데이터 생성 (실제 API 응답 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newRule: ValidationRule = {
        id: Date.now().toString(),
        ...data,
        isActive: data.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return newRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["validation-rules"] });
      toast({
        title: "규칙 생성 완료",
        description: "새 검증 규칙이 성공적으로 생성되었습니다.",
      });
    },
    onError: (error) => {
      console.error("규칙 생성 실패:", error);
      toast({
        title: "규칙 생성 실패",
        description: "규칙 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 검증 규칙 업데이트 뮤테이션
   *
   * @description
   * - 기존 검증 규칙을 수정
   * - 성공 시 캐시 무효화로 목록 새로고침
   * - 실제 API 연동 시 PUT /api/v1/validation/rules/:id로 교체
   */
  const updateRule = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ValidationRule> }): Promise<ValidationRule> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.put(`/api/v1/validation/rules/${id}`, data)
      // return response.data

      // 목 데이터 업데이트 (실제 API 응답 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const existingRule = mockValidationRules.find(rule => rule.id === id);
      if (!existingRule) {
        throw new Error("규칙을 찾을 수 없습니다");
      }

      const updatedRule: ValidationRule = {
        ...existingRule,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      return updatedRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["validation-rules"] });
      toast({
        title: "규칙 업데이트 완료",
        description: "검증 규칙이 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      console.error("규칙 업데이트 실패:", error);
      toast({
        title: "규칙 업데이트 실패",
        description: "규칙 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 검증 규칙 삭제 뮤테이션
   *
   * @description
   * - 검증 규칙을 삭제
   * - 성공 시 캐시 무효화로 목록 새로고침
   * - 실제 API 연동 시 DELETE /api/v1/validation/rules/:id로 교체
   */
  const deleteRule = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.delete(`/api/v1/validation/rules/${id}`)

      // 목 데이터 삭제 (실제 API 응답 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const ruleIndex = mockValidationRules.findIndex(rule => rule.id === id);
      if (ruleIndex === -1) {
        throw new Error("규칙을 찾을 수 없습니다");
      }

      mockValidationRules.splice(ruleIndex, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["validation-rules"] });
      toast({
        title: "규칙 삭제 완료",
        description: "검증 규칙이 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error) => {
      console.error("규칙 삭제 실패:", error);
      toast({
        title: "규칙 삭제 실패",
        description: "규칙 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 검증 규칙 테스트 뮤테이션
   *
   * @description
   * - 검증 규칙에 대해 테스트 데이터로 검증 실행
   * - 테스트 결과를 반환
   * - 실제 API 연동 시 POST /api/v1/validation/test로 교체
   */
  const testRule = useMutation({
    mutationFn: async ({ ruleId, testData }: { ruleId: string; testData: string }): Promise<ValidationTestResult> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.post('/api/v1/validation/test', { ruleId, testData })
      // return response.data

      // 목 데이터 테스트 (실제 API 응답 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      const rule = mockValidationRules.find(r => r.id === ruleId);
      if (!rule) {
        throw new Error("규칙을 찾을 수 없습니다");
      }

      // 간단한 테스트 로직 (실제로는 서버에서 처리)
      let passed = false;
      let message = "";

      switch (rule.validationType) {
        case "regex":
          if (rule.regex) {
            const regex = new RegExp(rule.regex);
            passed = regex.test(testData);
            message = passed ? "정규식 검증 통과" : "정규식 검증 실패";
          }
          break;
        case "threshold":
          const numericValue = parseFloat(testData);
          if (!isNaN(numericValue) && rule.threshold) {
            passed = numericValue >= rule.threshold;
            message = passed 
              ? `임계값(${rule.threshold}%) 이상` 
              : `임계값(${rule.threshold}%) 미만`;
          }
          break;
        case "human_review":
          passed = testData.length > 0;
          message = passed ? "휴먼검토 대상" : "휴먼검토 불필요";
          break;
      }

      return {
        passed,
        message,
        details: {
          ruleId,
          testData,
          validationType: rule.validationType,
        },
      };
    },
    onError: (error) => {
      console.error("규칙 테스트 실패:", error);
      toast({
        title: "테스트 실패",
        description: "규칙 테스트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  return {
    rules,
    isLoading,
    error,
    createRule: createRule.mutateAsync,
    updateRule: (id: string, data: Partial<ValidationRule>) => 
      updateRule.mutateAsync({ id, data }),
    deleteRule: deleteRule.mutateAsync,
    testRule: (ruleId: string, testData: string) => 
      testRule.mutateAsync({ ruleId, testData }),
    isTesting: testRule.isPending,
  };
}
