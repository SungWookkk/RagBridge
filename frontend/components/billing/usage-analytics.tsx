"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Download,
  Target,
  Zap,
  DollarSign,
  Clock,
  Users,
  FileText,
  Search,
  Database,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUsageAnalytics } from "@/hooks/use-usage-analytics";
import { useToast } from "@/hooks/use-toast";

/**
 * 사용량 분석 컴포넌트
 *
 * @description
 * - 사용 패턴 및 트렌드 분석
 * - 비용 최적화 제안
 * - 사용량 예측 및 인사이트
 */
export function UsageAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
  const { toast } = useToast();

  const {
    analyticsData,
    trends,
    insights,
    predictions,
    isLoading,
    exportReport,
  } = useUsageAnalytics();

  /**
   * 리포트 내보내기 핸들러
   */
  const handleExportReport = async () => {
    try {
      await exportReport(timeRange);
      toast({
        title: "리포트 내보내기 완료",
        description: "사용량 분석 리포트가 성공적으로 내보내기되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "리포트 내보내기 실패",
        description: "리포트 내보내기 중 오류가 발생했습니다.",
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
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8" />
                <h2 className="text-3xl font-bold">사용량 분석</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                사용 패턴을 분석하고 비용 최적화 방안을 찾아보세요.
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-white/20 bg-white/10 text-white"
              >
                <option value="7d">최근 7일</option>
                <option value="30d">최근 30일</option>
                <option value="90d">최근 90일</option>
                <option value="1y">최근 1년</option>
              </select>
              <Button
                className="w-fit rounded-2xl bg-white text-blue-700 hover:bg-white/90"
                onClick={handleExportReport}
              >
                <Download className="mr-2 h-4 w-4" />
                리포트 내보내기
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 주요 지표 카드 */}
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
        <Card className="rounded-3xl border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              사용량 증가율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{trends.usageGrowth}%
            </div>
            <p className="text-xs text-muted-foreground">
              전월 대비 증가
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              비용 효율성
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {analyticsData.costEfficiency}%
            </div>
            <p className="text-xs text-muted-foreground">
              비용 대비 효율성
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              예측 정확도
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {predictions.accuracy}%
            </div>
            <p className="text-xs text-muted-foreground">
              사용량 예측 정확도
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" />
              최적화 잠재력
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {insights.optimizationPotential}%
            </div>
            <p className="text-xs text-muted-foreground">
              비용 절감 가능성
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
          <TabsTrigger value="insights" className="rounded-xl">인사이트</TabsTrigger>
          <TabsTrigger value="predictions" className="rounded-xl">예측</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 사용량 분포 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  사용량 분포
                </CardTitle>
                <CardDescription>
                  기능별 사용량 비율을 확인하세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.usageDistribution.map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.category === "documents" && <FileText className="h-4 w-4 text-blue-600" />}
                          {item.category === "queries" && <Search className="h-4 w-4 text-green-600" />}
                          {item.category === "storage" && <Database className="h-4 w-4 text-purple-600" />}
                          {item.category === "team" && <Users className="h-4 w-4 text-orange-600" />}
                          <span className="font-medium capitalize">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.percentage}%</span>
                          <Badge variant="outline" className="text-xs">
                            {item.usage.toLocaleString()}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.category === "documents" ? "bg-blue-500" :
                            item.category === "queries" ? "bg-green-500" :
                            item.category === "storage" ? "bg-purple-500" : "bg-orange-500"
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 비용 분석 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  비용 분석
                </CardTitle>
                <CardDescription>
                  기능별 비용 분포 및 효율성을 확인하세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.costBreakdown.map((item) => (
                    <div key={item.category} className="p-3 rounded-2xl bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">₩{item.cost.toLocaleString()}</span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              item.efficiency > 80 ? "bg-green-50 text-green-700 border-green-200" :
                              item.efficiency > 60 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                              "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {item.efficiency}% 효율
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.usage.toLocaleString()} 사용량 • ₩{item.costPerUnit.toFixed(2)}/단위
                      </div>
                    </div>
                  ))}
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
                시간별 사용량 변화를 확인하세요.
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

          {/* 트렌드 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-green-600" />
                  증가 추세
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {trends.increasingTrends.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  증가 중인 지표
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ArrowDown className="h-4 w-4 text-red-600" />
                  감소 추세
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {trends.decreasingTrends.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  감소 중인 지표
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  안정 추세
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {trends.stableTrends.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  안정적인 지표
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 최적화 제안 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  최적화 제안
                </CardTitle>
                <CardDescription>
                  AI가 분석한 비용 최적화 방안입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.optimizationSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-3 rounded-2xl bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{suggestion.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {suggestion.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.category}
                      </Badge>
                      <span className="text-sm font-medium text-green-600">
                        ₩{suggestion.savings.toLocaleString()} 절약
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 주의사항 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  주의사항
                </CardTitle>
                <CardDescription>
                  사용량 분석 결과 주의할 점들입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.warnings.map((warning) => (
                  <div key={warning.id} className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-900">{warning.title}</span>
                    </div>
                    <p className="text-sm text-amber-700 mb-2">
                      {warning.description}
                    </p>
                    <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-300">
                      {warning.severity}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                사용량 예측
              </CardTitle>
              <CardDescription>
                AI 기반 사용량 예측 및 비용 전망입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">다음 달 예측</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
                      <span className="text-sm">문서 처리</span>
                      <div className="text-right">
                        <div className="font-medium">{predictions.nextMonth.documents.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {predictions.nextMonth.documentsChange > 0 ? "+" : ""}{predictions.nextMonth.documentsChange}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
                      <span className="text-sm">검색 쿼리</span>
                      <div className="text-right">
                        <div className="font-medium">{predictions.nextMonth.queries.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {predictions.nextMonth.queriesChange > 0 ? "+" : ""}{predictions.nextMonth.queriesChange}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
                      <span className="text-sm">예상 비용</span>
                      <div className="text-right">
                        <div className="font-medium">₩{predictions.nextMonth.cost.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {predictions.nextMonth.costChange > 0 ? "+" : ""}{predictions.nextMonth.costChange}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">3개월 후 예측</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
                      <span className="text-sm">문서 처리</span>
                      <div className="text-right">
                        <div className="font-medium">{predictions.threeMonths.documents.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {predictions.threeMonths.documentsChange > 0 ? "+" : ""}{predictions.threeMonths.documentsChange}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
                      <span className="text-sm">검색 쿼리</span>
                      <div className="text-right">
                        <div className="font-medium">{predictions.threeMonths.queries.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {predictions.threeMonths.queriesChange > 0 ? "+" : ""}{predictions.threeMonths.queriesChange}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
                      <span className="text-sm">예상 비용</span>
                      <div className="text-right">
                        <div className="font-medium">₩{predictions.threeMonths.cost.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {predictions.threeMonths.costChange > 0 ? "+" : ""}{predictions.threeMonths.costChange}%
                        </div>
                      </div>
                    </div>
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
