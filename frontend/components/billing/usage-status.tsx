"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  FileText,
  Search,
  Users,
  Database,
  Zap,
  Settings,
  Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUsageStatus } from "@/hooks/use-usage-status";
import { useToast } from "@/hooks/use-toast";

/**
 * 사용량 현황 컴포넌트
 *
 * @description
 * - 월간 사용량 및 한도 확인
 * - 실시간 사용량 모니터링
 * - 사용량 알림 및 임계값 설정
 */
export function UsageStatus() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const {
    usageData,
    statistics,
    alerts,
    isLoading,
    dismissAlert,
  } = useUsageStatus();

  /**
   * 알림 해제 핸들러
   */
  const handleDismissAlert = async (alertId: string) => {
    try {
      await dismissAlert(alertId);
      toast({
        title: "알림 해제 완료",
        description: "알림이 성공적으로 해제되었습니다.",
      });
    } catch (error) {
      toast({
        title: "알림 해제 실패",
        description: "알림 해제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8" />
                <h2 className="text-3xl font-bold">사용량 현황</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                현재 사용량과 한도를 확인하고 알림을 설정하세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="w-fit rounded-2xl bg-white text-emerald-700 hover:bg-white/90"
                onClick={() => setActiveTab("alerts")}
              >
                <Bell className="mr-2 h-4 w-4" />
                알림 설정
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 알림 배너 */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-900">사용량 알림</h3>
              <p className="text-sm text-amber-700">
                {alerts[0].message}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDismissAlert(alerts[0].id)}
              className="rounded-xl border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              해제
            </Button>
          </div>
        </motion.div>
      )}

      {/* 사용량 카드 */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-3xl">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted animate-pulse rounded w-20" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded w-16 mb-2" />
                <div className="h-3 bg-muted animate-pulse rounded w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              문서 처리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {usageData.documents.used.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              / {usageData.documents.limit.toLocaleString()} 문서
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(usageData.documents.used / usageData.documents.limit) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((usageData.documents.used / usageData.documents.limit) * 100)}% 사용
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4 text-green-600" />
              검색 쿼리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {usageData.queries.used.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              / {usageData.queries.limit.toLocaleString()} 쿼리
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(usageData.queries.used / usageData.queries.limit) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((usageData.queries.used / usageData.queries.limit) * 100)}% 사용
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              팀원 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {usageData.teamMembers.used}
            </div>
            <p className="text-xs text-muted-foreground">
              / {usageData.teamMembers.limit} 명
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(usageData.teamMembers.used / usageData.teamMembers.limit) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((usageData.teamMembers.used / usageData.teamMembers.limit) * 100)}% 사용
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4 text-orange-600" />
              스토리지
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {usageData.storage.used}GB
            </div>
            <p className="text-xs text-muted-foreground">
              / {usageData.storage.limit}GB
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(usageData.storage.used / usageData.storage.limit) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((usageData.storage.used / usageData.storage.limit) * 100)}% 사용
            </p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* 메인 콘텐츠 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="overview" className="rounded-xl">개요</TabsTrigger>
          <TabsTrigger value="trends" className="rounded-xl">트렌드</TabsTrigger>
          <TabsTrigger value="alerts" className="rounded-xl">알림</TabsTrigger>
          <TabsTrigger value="limits" className="rounded-xl">한도</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 사용량 요약 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  이번 달 사용량 요약
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">문서 처리</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{usageData.documents.used.toLocaleString()}</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round((usageData.documents.used / usageData.documents.limit) * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">검색 쿼리</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{usageData.queries.used.toLocaleString()}</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round((usageData.queries.used / usageData.queries.limit) * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">팀원 수</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{usageData.teamMembers.used}</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round((usageData.teamMembers.used / usageData.teamMembers.limit) * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">스토리지</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{usageData.storage.used}GB</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round((usageData.storage.used / usageData.storage.limit) * 100)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 통계 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  사용량 통계
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">
                      {statistics.avgDailyUsage}
                    </div>
                    <p className="text-xs text-blue-700">일평균 사용량</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-green-50 border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      {statistics.peakUsage}
                    </div>
                    <p className="text-xs text-green-700">최대 사용량</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">
                      {statistics.growthRate}%
                    </div>
                    <p className="text-xs text-purple-700">성장률</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">
                      {statistics.efficiency}%
                    </div>
                    <p className="text-xs text-orange-700">효율성</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                사용량 트렌드
              </CardTitle>
              <CardDescription>
                최근 30일간의 사용량 변화를 확인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-2xl">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>사용량 트렌드 차트</p>
                  <p className="text-sm">차트 라이브러리 연동 필요</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                알림 설정
              </CardTitle>
              <CardDescription>
                사용량 임계값에 도달하면 알림을 받을 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">문서 처리 알림</h4>
                      <p className="text-sm text-muted-foreground">문서 처리 사용량이 임계값에 도달하면 알림</p>
                    </div>
                    <Badge variant="outline">80%</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-xl">
                      <Settings className="mr-2 h-3 w-3" />
                      설정
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">검색 쿼리 알림</h4>
                      <p className="text-sm text-muted-foreground">검색 쿼리 사용량이 임계값에 도달하면 알림</p>
                    </div>
                    <Badge variant="outline">90%</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-xl">
                      <Settings className="mr-2 h-3 w-3" />
                      설정
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">스토리지 알림</h4>
                      <p className="text-sm text-muted-foreground">스토리지 사용량이 임계값에 도달하면 알림</p>
                    </div>
                    <Badge variant="outline">85%</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-xl">
                      <Settings className="mr-2 h-3 w-3" />
                      설정
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                한도 및 제한
              </CardTitle>
              <CardDescription>
                현재 요금제의 한도와 제한사항을 확인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">문서 처리</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {usageData.documents.limit.toLocaleString()}
                  </div>
                  <p className="text-sm text-blue-700">월간 문서 처리 한도</p>
                </div>

                <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">검색 쿼리</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {usageData.queries.limit.toLocaleString()}
                  </div>
                  <p className="text-sm text-green-700">월간 검색 쿼리 한도</p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-900">팀원 수</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {usageData.teamMembers.limit}
                  </div>
                  <p className="text-sm text-purple-700">최대 팀원 수</p>
                </div>

                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-900">스토리지</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {usageData.storage.limit}GB
                  </div>
                  <p className="text-sm text-orange-700">최대 스토리지 용량</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-amber-900">한도 초과 시</span>
                </div>
                <p className="text-sm text-amber-700">
                  한도를 초과하면 추가 요금이 부과되거나 서비스가 제한될 수 있습니다. 
                  사용량을 모니터링하고 필요시 요금제를 업그레이드하세요.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
