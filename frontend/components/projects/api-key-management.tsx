"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Key,
  Search,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Shield,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAPIKeys } from "@/hooks/use-api-keys";
import { useToast } from "@/hooks/use-toast";

/**
 * API 키 생성 스키마 정의
 */
const createAPIKeySchema = z.object({
  name: z.string().min(1, "API 키 이름을 입력해주세요"),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, "최소 하나의 권한을 선택해주세요"),
  expiresAt: z.string().optional(),
});

type CreateAPIKeyData = z.infer<typeof createAPIKeySchema>;

/**
 * API 키 관리 컴포넌트
 *
 * @description
 * - API 접근 키 생성 및 관리
 * - 키별 권한 설정 및 사용량 모니터링
 * - 보안 설정 및 키 회전 관리
 */
export function APIKeyManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("keys");
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const {
    apiKeys,
    statistics,
    isLoading,
    createAPIKey,
    updateAPIKey,
    deleteAPIKey,
    regenerateAPIKey,
    toggleAPIKeyStatus,
  } = useAPIKeys();

  const form = useForm<CreateAPIKeyData>({
    resolver: zodResolver(createAPIKeySchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
      expiresAt: "",
    },
  });

  /**
   * 필터링된 API 키 목록
   */
  const filteredKeys = apiKeys.filter((key) => {
    const matchesSearch = key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         key.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || key.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  /**
   * API 키 생성 핸들러
   */
  const handleCreateAPIKey = async (data: CreateAPIKeyData) => {
    try {
      const newKey = await createAPIKey(data);
      toast({
        title: "API 키 생성 완료",
        description: `${data.name} API 키가 성공적으로 생성되었습니다.`,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "API 키 생성 실패",
        description: "API 키 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * API 키 복사 핸들러
   */
  const handleCopyKey = async (keyValue: string) => {
    try {
      await navigator.clipboard.writeText(keyValue);
      toast({
        title: "복사 완료",
        description: "API 키가 클립보드에 복사되었습니다.",
      });
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "API 키 복사 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * API 키 재생성 핸들러
   */
  const handleRegenerateKey = async (keyId: string) => {
    try {
      await regenerateAPIKey(keyId);
      toast({
        title: "API 키 재생성 완료",
        description: "새로운 API 키가 생성되었습니다.",
      });
    } catch (error) {
      toast({
        title: "API 키 재생성 실패",
        description: "API 키 재생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * API 키 상태 토글 핸들러
   */
  const handleToggleStatus = async (keyId: string) => {
    try {
      await toggleAPIKeyStatus(keyId);
      toast({
        title: "상태 변경 완료",
        description: "API 키 상태가 성공적으로 변경되었습니다.",
      });
    } catch (error) {
      toast({
        title: "상태 변경 실패",
        description: "API 키 상태 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * API 키 삭제 핸들러
   */
  const handleDeleteKey = async (keyId: string) => {
    try {
      await deleteAPIKey(keyId);
      toast({
        title: "API 키 삭제 완료",
        description: "API 키가 성공적으로 삭제되었습니다.",
      });
    } catch (error) {
      toast({
        title: "API 키 삭제 실패",
        description: "API 키 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 시크릿 표시/숨김 토글
   */
  const toggleSecretVisibility = (keyId: string) => {
    setShowSecret(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Key className="h-8 w-8" />
                <h2 className="text-3xl font-bold">API 키 관리</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                API 접근 키를 생성하고 관리하여 외부 시스템과의 연동을 설정하세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="w-fit rounded-2xl bg-white text-orange-700 hover:bg-white/90"
                onClick={() => setActiveTab("create")}
              >
                <Plus className="mr-2 h-4 w-4" />
                새 API 키
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Key className="h-4 w-4 text-blue-600" />
              전체 API 키
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.totalKeys}
            </div>
            <p className="text-xs text-muted-foreground">
              생성된 키 수
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              활성 키
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statistics.activeKeys}
            </div>
            <p className="text-xs text-muted-foreground">
              사용 가능한 키
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-600" />
              오늘 사용량
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {statistics.todayUsage}
            </div>
            <p className="text-xs text-muted-foreground">
              API 호출 횟수
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              만료 예정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statistics.expiringSoon}
            </div>
            <p className="text-xs text-muted-foreground">
              30일 내 만료
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 콘텐츠 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 rounded-2xl">
          <TabsTrigger value="keys" className="rounded-xl">API 키 목록</TabsTrigger>
          <TabsTrigger value="create" className="rounded-xl">새 키 생성</TabsTrigger>
          <TabsTrigger value="usage" className="rounded-xl">사용량 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API 키 목록
                  </CardTitle>
                  <CardDescription>
                    생성된 API 키를 관리하고 모니터링하세요.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="API 키 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 rounded-2xl w-64"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 rounded-2xl border border-input bg-background"
                  >
                    <option value="all">전체 상태</option>
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                    <option value="expired">만료</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-2xl bg-muted/30 animate-pulse"
                      >
                        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    ))
                  ) : filteredKeys.length > 0 ? (
                    filteredKeys.map((key) => (
                      <motion.div
                        key={key.id}
                        whileHover={{ scale: 1.01 }}
                        className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100">
                              <Key className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{key.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {key.description || "설명 없음"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`${
                                key.status === "active"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : key.status === "inactive"
                                  ? "bg-gray-50 text-gray-700 border-gray-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }`}
                            >
                              {key.status === "active" ? "활성" : 
                               key.status === "inactive" ? "비활성" : "만료"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-xl"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* API 키 값 */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2">
                            <Input
                              value={showSecret[key.id] ? key.keyValue : "••••••••••••••••••••••••••••••••"}
                              readOnly
                              className="rounded-2xl font-mono text-sm"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleSecretVisibility(key.id)}
                              className="rounded-xl"
                            >
                              {showSecret[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopyKey(key.keyValue)}
                              className="rounded-xl"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>생성: {key.createdAt}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              <span>마지막 사용: {key.lastUsed}</span>
                            </div>
                            {key.expiresAt && (
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                <span>만료: {key.expiresAt}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleStatus(key.id)}
                              className="rounded-xl"
                            >
                              <Shield className="mr-2 h-3 w-3" />
                              {key.status === "active" ? "비활성화" : "활성화"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRegenerateKey(key.id)}
                              className="rounded-xl"
                            >
                              <RefreshCw className="mr-2 h-3 w-3" />
                              재생성
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteKey(key.id)}
                              className="rounded-xl"
                            >
                              <Trash2 className="mr-2 h-3 w-3" />
                              삭제
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Key className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">API 키가 없습니다</p>
                      <p className="text-sm">새 API 키를 생성해보세요.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                새 API 키 생성
              </CardTitle>
              <CardDescription>
                새로운 API 키를 생성하고 권한을 설정하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleCreateAPIKey)} className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">API 키 이름</label>
                  <Input
                    {...form.register("name")}
                    placeholder="예: 프로덕션 서버 API 키"
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
                    placeholder="API 키에 대한 설명을 입력하세요"
                    className="rounded-2xl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">권한 설정</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "read", label: "읽기 권한", description: "문서 조회 및 검색" },
                      { id: "write", label: "쓰기 권한", description: "문서 업로드 및 수정" },
                      { id: "admin", label: "관리 권한", description: "시스템 설정 및 관리" },
                      { id: "billing", label: "과금 권한", description: "사용량 및 과금 정보" },
                    ].map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2 p-3 rounded-2xl border">
                        <input
                          type="checkbox"
                          value={permission.id}
                          {...form.register("permissions")}
                          className="rounded"
                        />
                        <div>
                          <label className="text-sm font-medium">{permission.label}</label>
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.permissions && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.permissions.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">만료일 (선택사항)</label>
                  <Input
                    {...form.register("expiresAt")}
                    type="date"
                    className="rounded-2xl"
                  />
                </div>

                <Button type="submit" className="w-full rounded-2xl">
                  <Key className="mr-2 h-4 w-4" />
                  API 키 생성
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                API 사용량 분석
              </CardTitle>
              <CardDescription>
                API 키별 사용량 및 성능 지표를 확인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">총 요청 수</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <p className="text-xs text-blue-700">이번 달</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-900">성공률</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">99.2%</div>
                    <p className="text-xs text-green-700">최근 7일</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-900">평균 응답시간</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">245ms</div>
                    <p className="text-xs text-orange-700">최근 24시간</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30">
                  <h4 className="font-medium mb-3">최근 API 호출</h4>
                  <div className="space-y-2">
                    {[
                      { endpoint: "/api/v1/documents/upload", method: "POST", status: 200, time: "2분 전" },
                      { endpoint: "/api/v1/search/query", method: "GET", status: 200, time: "5분 전" },
                      { endpoint: "/api/v1/documents/status", method: "GET", status: 200, time: "8분 전" },
                      { endpoint: "/api/v1/validation/rules", method: "GET", status: 200, time: "12분 전" },
                    ].map((call, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-xl bg-background">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {call.method}
                          </Badge>
                          <span className="text-sm font-mono">{call.endpoint}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              call.status === 200
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {call.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{call.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
