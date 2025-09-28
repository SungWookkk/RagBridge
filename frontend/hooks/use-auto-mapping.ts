import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

/**
 * 자동 매핑 규칙 타입 정의
 */
export interface AutoMappingRule {
  id: string;
  name: string;
  description?: string;
  sourceField: string;
  targetField: string;
  mappingType: "exact" | "fuzzy" | "regex" | "ai";
  confidence: number;
  isActive: boolean;
  transformRules?: Array<{
    type: "uppercase" | "lowercase" | "trim" | "format" | "custom";
    value?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * 필드 타입 정의
 */
export interface Field {
  id: string;
  name: string;
  type: string;
  description?: string;
}

/**
 * 매핑 테스트 결과 타입
 */
export interface MappingTestResult {
  mappedValue: string;
  confidence: number;
  transformApplied: boolean;
  details?: Record<string, any>;
}

/**
 * 목 데이터: 자동 매핑 규칙
 */
const mockAutoMappingRules: AutoMappingRule[] = [
  {
    id: "1",
    name: "이름 필드 매핑",
    description: "문서의 이름 필드를 시스템 사용자명으로 매핑",
    sourceField: "document_name",
    targetField: "user_name",
    mappingType: "exact",
    confidence: 95,
    isActive: true,
    transformRules: [
      { type: "trim" },
      { type: "uppercase" }
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "이메일 주소 매핑",
    description: "이메일 필드를 표준 형식으로 매핑",
    sourceField: "email_address",
    targetField: "email",
    mappingType: "regex",
    confidence: 90,
    isActive: true,
    transformRules: [
      { type: "lowercase" },
      { type: "trim" }
    ],
    createdAt: "2024-01-16T14:30:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
  },
  {
    id: "3",
    name: "전화번호 매핑",
    description: "다양한 형식의 전화번호를 표준 형식으로 매핑",
    sourceField: "phone_number",
    targetField: "phone",
    mappingType: "fuzzy",
    confidence: 85,
    isActive: true,
    transformRules: [
      { type: "format", value: "XXX-XXXX-XXXX" }
    ],
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
  },
  {
    id: "4",
    name: "주소 정보 매핑",
    description: "AI를 활용한 주소 필드 매핑",
    sourceField: "address_info",
    targetField: "address",
    mappingType: "ai",
    confidence: 80,
    isActive: true,
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
];

/**
 * 목 데이터: 소스 필드
 */
const mockSourceFields: Field[] = [
  { id: "1", name: "document_name", type: "text", description: "문서에 표시된 이름" },
  { id: "2", name: "email_address", type: "email", description: "이메일 주소" },
  { id: "3", name: "phone_number", type: "text", description: "전화번호" },
  { id: "4", name: "address_info", type: "text", description: "주소 정보" },
  { id: "5", name: "company_name", type: "text", description: "회사명" },
  { id: "6", name: "department", type: "text", description: "부서명" },
  { id: "7", name: "position", type: "text", description: "직책" },
  { id: "8", name: "employee_id", type: "text", description: "사원번호" },
];

/**
 * 목 데이터: 타겟 필드
 */
const mockTargetFields: Field[] = [
  { id: "1", name: "user_name", type: "text", description: "시스템 사용자명" },
  { id: "2", name: "email", type: "email", description: "표준 이메일 필드" },
  { id: "3", name: "phone", type: "text", description: "표준 전화번호 필드" },
  { id: "4", name: "address", type: "text", description: "표준 주소 필드" },
  { id: "5", name: "organization", type: "text", description: "조직 정보" },
  { id: "6", name: "role", type: "text", description: "역할 정보" },
  { id: "7", name: "id", type: "text", description: "고유 식별자" },
];

/**
 * 자동 매핑 관리 훅
 */
export function useAutoMapping() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * 자동 매핑 규칙 목록 조회
   */
  const {
    data: rules = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auto-mapping-rules"],
    queryFn: async (): Promise<AutoMappingRule[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockAutoMappingRules;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: false,
  });

  /**
   * 소스 필드 목록 조회
   */
  const { data: sourceFields = [] } = useQuery({
    queryKey: ["source-fields"],
    queryFn: async (): Promise<Field[]> => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockSourceFields;
    },
    staleTime: 10 * 60 * 1000,
  });

  /**
   * 타겟 필드 목록 조회
   */
  const { data: targetFields = [] } = useQuery({
    queryKey: ["target-fields"],
    queryFn: async (): Promise<Field[]> => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockTargetFields;
    },
    staleTime: 10 * 60 * 1000,
  });

  /**
   * 자동 매핑 규칙 생성
   */
  const createRule = useMutation({
    mutationFn: async (data: Omit<AutoMappingRule, "id" | "createdAt" | "updatedAt">): Promise<AutoMappingRule> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newRule: AutoMappingRule = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return newRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auto-mapping-rules"] });
      toast({
        title: "매핑 규칙 생성 완료",
        description: "새 자동 매핑 규칙이 성공적으로 생성되었습니다.",
      });
    },
    onError: (error) => {
      console.error("매핑 규칙 생성 실패:", error);
      toast({
        title: "매핑 규칙 생성 실패",
        description: "규칙 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 자동 매핑 규칙 업데이트
   */
  const updateRule = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AutoMappingRule> }): Promise<AutoMappingRule> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const existingRule = mockAutoMappingRules.find(rule => rule.id === id);
      if (!existingRule) {
        throw new Error("규칙을 찾을 수 없습니다");
      }

      const updatedRule: AutoMappingRule = {
        ...existingRule,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      return updatedRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auto-mapping-rules"] });
      toast({
        title: "매핑 규칙 업데이트 완료",
        description: "자동 매핑 규칙이 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      console.error("매핑 규칙 업데이트 실패:", error);
      toast({
        title: "매핑 규칙 업데이트 실패",
        description: "규칙 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 자동 매핑 규칙 삭제
   */
  const deleteRule = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const ruleIndex = mockAutoMappingRules.findIndex(rule => rule.id === id);
      if (ruleIndex === -1) {
        throw new Error("규칙을 찾을 수 없습니다");
      }

      mockAutoMappingRules.splice(ruleIndex, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auto-mapping-rules"] });
      toast({
        title: "매핑 규칙 삭제 완료",
        description: "자동 매핑 규칙이 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error) => {
      console.error("매핑 규칙 삭제 실패:", error);
      toast({
        title: "매핑 규칙 삭제 실패",
        description: "규칙 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 매핑 테스트
   */
  const testMapping = useMutation({
    mutationFn: async ({ ruleId, testData }: { ruleId: string; testData: string }): Promise<MappingTestResult> => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      const rule = mockAutoMappingRules.find(r => r.id === ruleId);
      if (!rule) {
        throw new Error("규칙을 찾을 수 없습니다");
      }

      // 간단한 매핑 테스트 로직
      let mappedValue = testData;
      let confidence = 0;
      let transformApplied = false;

      switch (rule.mappingType) {
        case "exact":
          confidence = testData === rule.sourceField ? 100 : 0;
          break;
        case "fuzzy":
          confidence = Math.random() * 30 + 70; // 70-100% 랜덤
          break;
        case "regex":
          confidence = Math.random() * 20 + 80; // 80-100% 랜덤
          break;
        case "ai":
          confidence = Math.random() * 25 + 75; // 75-100% 랜덤
          break;
      }

      // 변환 규칙 적용
      if (rule.transformRules) {
        transformApplied = true;
        rule.transformRules.forEach(transform => {
          switch (transform.type) {
            case "uppercase":
              mappedValue = mappedValue.toUpperCase();
              break;
            case "lowercase":
              mappedValue = mappedValue.toLowerCase();
              break;
            case "trim":
              mappedValue = mappedValue.trim();
              break;
            case "format":
              if (transform.value) {
                // 간단한 포맷팅 로직
                mappedValue = transform.value.replace(/X/g, "0");
              }
              break;
          }
        });
      }

      return {
        mappedValue,
        confidence: Math.round(confidence),
        transformApplied,
        details: {
          ruleId,
          testData,
          mappingType: rule.mappingType,
          transformRules: rule.transformRules,
        },
      };
    },
    onError: (error) => {
      console.error("매핑 테스트 실패:", error);
      toast({
        title: "매핑 테스트 실패",
        description: "매핑 테스트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  return {
    rules,
    sourceFields,
    targetFields,
    isLoading,
    error,
    createRule: createRule.mutateAsync,
    updateRule: (id: string, data: Partial<AutoMappingRule>) => 
      updateRule.mutateAsync({ id, data }),
    deleteRule: deleteRule.mutateAsync,
    testMapping: (ruleId: string, testData: string) => 
      testMapping.mutateAsync({ ruleId, testData }),
    isTesting: testMapping.isPending,
  };
}
