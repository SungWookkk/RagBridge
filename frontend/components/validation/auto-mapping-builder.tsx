"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Link,
  Search,
  Plus,
  Play,
  Eye,
  Settings,
  FileText,
  CheckCircle,
  Clock,
  Trash2,
  ArrowRight,
  Target,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAutoMapping } from "@/hooks/use-auto-mapping";
import { useToast } from "@/hooks/use-toast";

/**
 * 자동 매핑 규칙 스키마 정의
 *
 * @description
 * - 소스 필드와 타겟 필드 간 매핑 규칙
 * - 매핑 타입별 설정 옵션
 */
const autoMappingSchema = z.object({
  name: z.string().min(1, "매핑 규칙 이름을 입력해주세요"),
  description: z.string().optional(),
  sourceField: z.string().min(1, "소스 필드를 선택해주세요"),
  targetField: z.string().min(1, "타겟 필드를 선택해주세요"),
  mappingType: z.enum(["exact", "fuzzy", "regex", "ai"]),
  confidence: z.number().min(0).max(100).default(80),
  isActive: z.boolean().default(true),
  transformRules: z.array(z.object({
    type: z.enum(["uppercase", "lowercase", "trim", "format", "custom"]),
    value: z.string().optional(),
  })).optional(),
});

type AutoMappingRuleFormData = z.infer<typeof autoMappingSchema>;

type AutoMappingRule = AutoMappingRuleFormData & {
  id: string;
};

/**
 * 자동 매핑 빌더 컴포넌트
 *
 * @description
 * - 필드 자동 매핑 규칙 설정 및 관리
 * - 소스/타겟 필드 매핑, 변환 규칙 설정
 * - 매핑 테스트 및 성능 모니터링
 */
export function AutoMappingBuilder() {
  const [selectedRule, setSelectedRule] = useState<AutoMappingRule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("mapping");
  const { toast } = useToast();

  const {
    rules,
    sourceFields,
    targetFields,
    isLoading,
    createRule,
    updateRule,
    deleteRule,
    testMapping,
    isTesting,
  } = useAutoMapping();

  const form = useForm<AutoMappingRuleFormData>({
    resolver: zodResolver(autoMappingSchema),
    defaultValues: {
      name: "",
      description: "",
      sourceField: "",
      targetField: "",
      mappingType: "exact",
      confidence: 80,
      isActive: true,
      transformRules: [],
    },
  });

  /**
   * 필터링된 규칙 목록
   */
  const filteredRules = rules.filter((rule) =>
    rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.sourceField.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.targetField.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * 새 매핑 규칙 생성 핸들러
   */
  const handleCreateRule = async (data: AutoMappingRuleFormData) => {
    try {
      if (selectedRule) {
        await updateRule(selectedRule.id, data);
        toast({
          title: "매핑 규칙 업데이트 완료",
          description: `${data.name} 규칙이 성공적으로 업데이트되었습니다.`,
          variant: "success",
        });
      } else {
        await createRule(data);
        toast({
          title: "매핑 규칙 생성 완료",
          description: `${data.name} 규칙이 성공적으로 생성되었습니다.`,
          variant: "success",
        });
      }
      form.reset();
      setSelectedRule(null);
    } catch (error) {
      toast({
        title: selectedRule ? "매핑 규칙 업데이트 실패" : "매핑 규칙 생성 실패",
        description: "규칙 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 매핑 테스트 핸들러
   */
  const handleTestMapping = async () => {
    if (!selectedRule) return;

    try {
      const result = await testMapping(selectedRule.id, "테스트 데이터");
      toast({
        title: "매핑 테스트 완료",
        description: `매핑 결과: ${result.mappedValue} (신뢰도: ${result.confidence}%)`,
      });
    } catch (error) {
      toast({
        title: "매핑 테스트 실패",
        description: "매핑 테스트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 규칙 선택 핸들러
   */
  const handleSelectRule = (rule: AutoMappingRule) => {
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
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Link className="h-8 w-8" />
                <h2 className="text-3xl font-bold">자동 매핑 관리</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                문서 필드와 시스템 필드 간 자동 매핑 규칙을 설정하고 관리하세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="w-fit rounded-2xl bg-white text-green-700 hover:bg-white/90"
                onClick={() => {
                  setSelectedRule(null);
                  form.reset();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                새 매핑 규칙
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
                매핑 규칙 목록
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
                            {rule.mappingType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {rule.confidence}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{rule.sourceField}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span>{rule.targetField}</span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>매핑 규칙이 없습니다.</p>
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
                {selectedRule ? "매핑 규칙 편집" : "새 매핑 규칙 생성"}
              </CardTitle>
              <CardDescription>
                필드 매핑 규칙의 상세 설정을 구성하세요.
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
                      placeholder="예: 이름 필드 매핑"
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
                      placeholder="매핑 규칙에 대한 설명을 입력하세요"
                      className="rounded-2xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">소스 필드</label>
                      <select
                        {...form.register("sourceField")}
                        className="w-full p-3 rounded-2xl border border-input bg-background"
                      >
                        <option value="">소스 필드 선택</option>
                        {sourceFields.map((field) => (
                          <option key={field.id} value={field.name}>
                            {field.name} ({field.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">타겟 필드</label>
                      <select
                        {...form.register("targetField")}
                        className="w-full p-3 rounded-2xl border border-input bg-background"
                      >
                        <option value="">타겟 필드 선택</option>
                        {targetFields.map((field) => (
                          <option key={field.id} value={field.name}>
                            {field.name} ({field.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">매핑 타입</label>
                      <select
                        {...form.register("mappingType")}
                        className="w-full p-3 rounded-2xl border border-input bg-background"
                      >
                        <option value="exact">정확 매칭</option>
                        <option value="fuzzy">유사 매칭</option>
                        <option value="regex">정규식</option>
                        <option value="ai">AI 매칭</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">신뢰도 임계값 (%)</label>
                      <Input
                        {...form.register("confidence", { valueAsNumber: true })}
                        type="number"
                        min="0"
                        max="100"
                        placeholder="80"
                        className="rounded-2xl"
                      />
                    </div>
                  </div>
                </div>

                {/* 매핑 설정 탭 */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 rounded-2xl">
                    <TabsTrigger value="mapping" className="rounded-xl">매핑</TabsTrigger>
                    <TabsTrigger value="transform" className="rounded-xl">변환</TabsTrigger>
                    <TabsTrigger value="advanced" className="rounded-xl">고급</TabsTrigger>
                  </TabsList>

                  <TabsContent value="mapping" className="space-y-4">
                    <div className="p-4 rounded-2xl bg-muted/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">매핑 설정</span>
                        </div>
                        <Badge variant="outline">정확 매칭</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">소스:</span>
                          <span className="font-medium">{form.watch("sourceField") || "선택되지 않음"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">타겟:</span>
                          <span className="font-medium">{form.watch("targetField") || "선택되지 않음"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">신뢰도:</span>
                          <span className="font-medium">{form.watch("confidence")}%</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="transform" className="space-y-4">
                    <div className="p-4 rounded-2xl bg-muted/30">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">데이터 변환 규칙</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <label className="text-sm">대문자 변환</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <label className="text-sm">공백 제거</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <label className="text-sm">특수문자 제거</label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4">
                    <div className="p-4 rounded-2xl bg-muted/30">
                      <div className="flex items-center gap-2 mb-4">
                        <Settings className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">고급 설정</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            {...form.register("isActive")}
                            type="checkbox"
                            className="rounded"
                          />
                          <label className="text-sm">규칙 활성화</label>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>• 매핑 실패 시 기본값 사용</p>
                          <p>• 중복 매핑 시 우선순위 적용</p>
                          <p>• 매핑 결과 로깅 활성화</p>
                        </div>
                      </div>
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
                        onClick={handleTestMapping}
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
                매핑 테스트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedRule ? (
                  <>
                    {/* 매핑 정보 */}
                    <div className="p-4 rounded-2xl bg-muted/30">
                      <h4 className="font-medium mb-2">{selectedRule.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">소스:</span>
                          <Badge variant="outline" className="text-xs">
                            {selectedRule.sourceField}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">타겟:</span>
                          <Badge variant="outline" className="text-xs">
                            {selectedRule.targetField}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">타입:</span>
                          <Badge variant="outline" className="text-xs">
                            {selectedRule.mappingType}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* 테스트 입력 */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">테스트 데이터</label>
                      <Input
                        placeholder="매핑할 데이터를 입력하세요"
                        className="rounded-2xl"
                      />
                    </div>

                    {/* 테스트 결과 */}
                    <div className="p-4 rounded-2xl bg-muted/30">
                      <h4 className="font-medium mb-2">매핑 결과</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>매핑 테스트를 실행해보세요</span>
                        </div>
                        <div className="text-muted-foreground">
                          <p>신뢰도: 0%</p>
                          <p>변환: 적용되지 않음</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>매핑 규칙을 선택하면</p>
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
