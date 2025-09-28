"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Shield,
  Search,
  Plus,
  Play,
  Eye,
  Settings,
  FileText,
  CheckCircle,
  Clock,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useValidationRules } from "@/hooks/use-validation-rules";
import { useToast } from "@/hooks/use-toast";

/**
 * 검증 규칙 스키마 정의
 *
 * @description
 * - 정규식, 임계값, 휴먼검토 설정을 포함한 검증 규칙
 * - 필드 타입별 검증 로직 정의
 */
const validationRuleSchema = z.object({
  name: z.string().min(1, "규칙 이름을 입력해주세요"),
  description: z.string().optional(),
  fieldType: z.enum(["text", "number", "date", "email", "phone", "custom"]),
  validationType: z.enum(["regex", "threshold", "human_review"]),
  regex: z.string().optional(),
  threshold: z.number().min(0).max(100).optional(),
  humanReviewRequired: z.boolean().optional(),
  isActive: z.boolean().default(true),
});

type ValidationRuleFormData = z.infer<typeof validationRuleSchema>;

type ValidationRule = ValidationRuleFormData & {
  id: string;
};

/**
 * 검증 규칙 빌더 컴포넌트
 *
 * @description
 * - 3열 레이아웃: 필드 리스트, 설정 폼, 테스트/미리보기
 * - React Hook Form + Zod 검증
 * - 실시간 테스트 및 미리보기 기능
 * - 규칙 생성, 수정, 삭제, 복사 기능
 */
export function ValidationRulesBuilder() {
  const [selectedRule, setSelectedRule] = useState<ValidationRule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("regex");
  const { toast } = useToast();

  const {
    rules,
    isLoading,
    createRule,
    updateRule,
    deleteRule,
    testRule,
    isTesting,
  } = useValidationRules();

  const form = useForm<ValidationRuleFormData>({
    resolver: zodResolver(validationRuleSchema),
    defaultValues: {
      name: "",
      description: "",
      fieldType: "text",
      validationType: "regex",
      regex: "",
      threshold: 80,
      humanReviewRequired: false,
      isActive: true,
    },
  });

  /**
   * 필터링된 규칙 목록
   *
   * @description
   * - 검색 쿼리에 따라 규칙 목록 필터링
   * - 이름, 설명, 필드 타입으로 검색 가능
   */
  const filteredRules = rules.filter((rule) =>
    rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.fieldType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * 새 규칙 생성 핸들러
   *
   * @description
   * - 폼 데이터를 검증하고 새 규칙 생성
   * - 성공 시 토스트 알림 및 폼 초기화
   */
  const handleCreateRule = async (data: ValidationRuleFormData) => {
    try {
      if (selectedRule) {
        await updateRule(selectedRule.id, data);
        toast({
          title: "규칙 업데이트 완료",
          description: `${data.name} 규칙이 성공적으로 업데이트되었습니다.`,
          variant: "success",
        });
      } else {
        await createRule(data);
        toast({
          title: "규칙 생성 완료",
          description: `${data.name} 규칙이 성공적으로 생성되었습니다.`,
          variant: "success",
        });
      }
      form.reset();
      setSelectedRule(null);
    } catch (error) {
      toast({
        title: selectedRule ? "규칙 업데이트 실패" : "규칙 생성 실패",
        description: "규칙 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 규칙 테스트 핸들러
   *
   * @description
   * - 선택된 규칙에 대해 테스트 실행
   * - 테스트 결과를 토스트로 표시
   */
  const handleTestRule = async () => {
    if (!selectedRule) return;

    try {
      const result = await testRule(selectedRule.id, "테스트 데이터");
      toast({
        title: "테스트 완료",
        description: `테스트 결과: ${result.passed ? "통과" : "실패"}`,
        variant: result.passed ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "테스트 실패",
        description: "규칙 테스트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 규칙 선택 핸들러
   *
   * @description
   * - 선택된 규칙을 폼에 로드
   * - 편집 모드로 전환
   */
  const handleSelectRule = (rule: ValidationRule) => {
    setSelectedRule(rule);
    form.reset(rule);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8" />
                <h2 className="text-3xl font-bold">검증 규칙 관리</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                문서 품질 검증을 위한 규칙을 설정하고 관리하세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="w-fit rounded-2xl bg-white text-blue-700 hover:bg-white/90"
                onClick={() => {
                  setSelectedRule(null);
                  form.reset();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                새 규칙
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3열 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 좌측: 필드 리스트 + 검색 */}
        <div className="lg:col-span-3">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                검증 규칙 목록
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="규칙 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-2xl"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-2xl bg-muted/30 animate-pulse"
                      >
                        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    ))
                  ) : filteredRules.length > 0 ? (
                    filteredRules.map((rule) => (
                      <motion.div
                        key={rule.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-3 rounded-2xl cursor-pointer transition-all ${
                          selectedRule?.id === rule.id
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-muted/30 hover:bg-muted/50"
                        }`}
                        onClick={() => handleSelectRule(rule)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{rule.name}</h4>
                          <div className="flex items-center gap-1">
                            {rule.isActive ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <Clock className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {rule.fieldType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {rule.validationType}
                          </Badge>
                        </div>
                        {rule.description && (
                          <p className="text-xs text-muted-foreground">
                            {rule.description}
                          </p>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>검증 규칙이 없습니다.</p>
                      <p className="text-sm">새 규칙을 생성해보세요.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 중앙: 설정 폼 */}
        <div className="lg:col-span-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {selectedRule ? "규칙 편집" : "새 규칙 생성"}
              </CardTitle>
              <CardDescription>
                검증 규칙의 상세 설정을 구성하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleCreateRule)} className="space-y-6">
                {/* 기본 정보 */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">규칙 이름</label>
                    <Input
                      {...form.register("name")}
                      placeholder="예: 이메일 형식 검증"
                      className="rounded-2xl"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">설명</label>
                    <Input
                      {...form.register("description")}
                      placeholder="규칙에 대한 설명을 입력하세요"
                      className="rounded-2xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">필드 타입</label>
                      <select
                        {...form.register("fieldType")}
                        className="w-full p-3 rounded-2xl border border-input bg-background"
                      >
                        <option value="text">텍스트</option>
                        <option value="number">숫자</option>
                        <option value="date">날짜</option>
                        <option value="email">이메일</option>
                        <option value="phone">전화번호</option>
                        <option value="custom">사용자 정의</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">검증 타입</label>
                      <select
                        {...form.register("validationType")}
                        className="w-full p-3 rounded-2xl border border-input bg-background"
                      >
                        <option value="regex">정규식</option>
                        <option value="threshold">임계값</option>
                        <option value="human_review">휴먼검토</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 검증 설정 탭 */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 rounded-2xl">
                    <TabsTrigger value="regex" className="rounded-xl">정규식</TabsTrigger>
                    <TabsTrigger value="threshold" className="rounded-xl">임계값</TabsTrigger>
                    <TabsTrigger value="human_review" className="rounded-xl">휴먼검토</TabsTrigger>
                  </TabsList>

                  <TabsContent value="regex" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">정규식 패턴</label>
                      <Input
                        {...form.register("regex")}
                        placeholder="예: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        className="rounded-2xl font-mono"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="threshold" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">임계값 (%)</label>
                      <Input
                        {...form.register("threshold", { valueAsNumber: true })}
                        type="number"
                        min="0"
                        max="100"
                        placeholder="80"
                        className="rounded-2xl"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="human_review" className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        {...form.register("humanReviewRequired")}
                        type="checkbox"
                        className="rounded"
                      />
                      <label className="text-sm font-medium">휴먼검토 필요</label>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* 액션 버튼 */}
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 rounded-2xl">
                    {selectedRule ? "규칙 업데이트" : "규칙 생성"}
                  </Button>
                  {selectedRule && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleTestRule}
                        disabled={isTesting}
                        className="rounded-2xl"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {isTesting ? "테스트 중..." : "테스트"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => deleteRule(selectedRule.id)}
                        className="rounded-2xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 우측: 테스트/미리보기 */}
        <div className="lg:col-span-3">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                테스트 & 미리보기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedRule ? (
                  <>
                    {/* 규칙 정보 */}
                    <div className="p-4 rounded-2xl bg-muted/30">
                      <h4 className="font-medium mb-2">{selectedRule.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">필드 타입:</span>
                          <Badge variant="outline" className="text-xs">
                            {selectedRule.fieldType}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">검증 타입:</span>
                          <Badge variant="outline" className="text-xs">
                            {selectedRule.validationType}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">상태:</span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              selectedRule.isActive
                                ? "text-green-600 border-green-200"
                                : "text-gray-600 border-gray-200"
                            }`}
                          >
                            {selectedRule.isActive ? "활성" : "비활성"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* 테스트 입력 */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">테스트 데이터</label>
                      <Input
                        placeholder="테스트할 데이터를 입력하세요"
                        className="rounded-2xl"
                      />
                    </div>

                    {/* 테스트 결과 */}
                    <div className="p-4 rounded-2xl bg-muted/30">
                      <h4 className="font-medium mb-2">테스트 결과</h4>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">테스트를 실행해보세요</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>규칙을 선택하면</p>
                    <p className="text-sm">테스트 및 미리보기가 표시됩니다.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
