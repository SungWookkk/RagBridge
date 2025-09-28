"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Database,
  Cpu,
  HardDrive,
  Network,
  Monitor,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePerformanceMetrics } from "@/hooks/use-performance-metrics";
import { useToast } from "@/hooks/use-toast";

/**
 * 성능 지표 컴포넌트
 *
 * @description
 * - 처리 속도 및 응답시간 모니터링
 * - AI 모델 성능 지표
 * - 시스템 리소스 사용량 분석
 */
export function PerformanceMetrics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("1h");
  const { toast } = useToast();

  const {
    performanceData,
    systemMetrics,
    aiMetrics,
    alerts,
    refreshMetrics,
    exportMetrics,
  } = usePerformanceMetrics();

  /**
   * 메트릭 새로고침 핸들러
   */
  const handleRefreshMetrics = async () => {
    try {
      await refreshMetrics();
      toast({
        title: "메트릭 새로고침 완료",
        description: "성능 지표가 성공적으로 업데이트되었습니다.",
      });
    } catch (error) {
      toast({
        title: "메트릭 새로고침 실패",
        description: "메트릭 새로고침 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 메트릭 내보내기 핸들러
   */
  const handleExportMetrics = async () => {
    try {
      await exportMetrics(timeRange);
      toast({
        title: "메트릭 내보내기 완료",
        description: "성능 지표가 성공적으로 내보내기되었습니다.",
      });
    } catch (error) {
      toast({
        title: "메트릭 내보내기 실패",
        description: "메트릭 내보내기 중 오류가 발생했습니다.",
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
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8" />
                <h2 className="text-3xl font-bold">성능 지표</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                시스템 성능과 AI 모델 지표를 실시간으로 모니터링하세요.
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-white/20 bg-white/10 text-white"
              >
                <option value="1h">최근 1시간</option>
                <option value="6h">최근 6시간</option>
                <option value="24h">최근 24시간</option>
                <option value="7d">최근 7일</option>
              </select>
              <Button
                className="w-fit rounded-2xl bg-white text-blue-700 hover:bg-white/90"
                onClick={handleRefreshMetrics}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                새로고침
              </Button>
              <Button
                className="w-fit rounded-2xl bg-white text-blue-700 hover:bg-white/90"
                onClick={handleExportMetrics}
              >
                <Download className="mr-2 h-4 w-4" />
                내보내기
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
          className="rounded-3xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900">성능 경고</h3>
              <p className="text-sm text-red-700">
                {alerts[0].message}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl border-red-300 text-red-700 hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              평균 응답시간
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {performanceData.avgResponseTime}ms
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -5% 전일 대비
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              처리량
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {performanceData.throughput.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% 전일 대비
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              성공률
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {performanceData.successRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +0.3% 전일 대비
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4 text-orange-600" />
              활성 연결
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {performanceData.activeConnections}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% 전일 대비
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 콘텐츠 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="overview" className="rounded-xl">개요</TabsTrigger>
          <TabsTrigger value="system" className="rounded-xl">시스템</TabsTrigger>
          <TabsTrigger value="ai" className="rounded-xl">AI 모델</TabsTrigger>
          <TabsTrigger value="alerts" className="rounded-xl">알림</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 성능 트렌드 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  성능 트렌드
                </CardTitle>
                <CardDescription>
                  최근 24시간 성능 지표 변화를 확인하세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-2xl">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>성능 트렌드 차트</p>
                    <p className="text-sm">차트 라이브러리 연동 필요</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 시스템 상태 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  시스템 상태
                </CardTitle>
                <CardDescription>
                  전체 시스템의 현재 상태를 확인하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">API 서버</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        정상
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">데이터베이스</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        정상
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Kafka 스트림</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        정상
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">AI 모델 서버</span>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                        경고
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CPU 사용률 */}
            <Card className="rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-600" />
                  CPU 사용률
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {systemMetrics.cpu}%
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${systemMetrics.cpu}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  평균: {systemMetrics.cpuAvg}%
                </p>
              </CardContent>
            </Card>

            {/* 메모리 사용률 */}
            <Card className="rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-green-600" />
                  메모리 사용률
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {systemMetrics.memory}%
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${systemMetrics.memory}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  평균: {systemMetrics.memoryAvg}%
                </p>
              </CardContent>
            </Card>

            {/* 디스크 사용률 */}
            <Card className="rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-purple-600" />
                  디스크 사용률
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {systemMetrics.disk}%
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${systemMetrics.disk}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  평균: {systemMetrics.diskAvg}%
                </p>
              </CardContent>
            </Card>

            {/* 네트워크 사용률 */}
            <Card className="rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Network className="h-4 w-4 text-orange-600" />
                  네트워크 사용률
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {systemMetrics.network}%
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${systemMetrics.network}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  평균: {systemMetrics.networkAvg}%
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI 모델 성능 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI 모델 성능
                </CardTitle>
                <CardDescription>
                  각 AI 모델의 성능 지표를 확인하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiMetrics.map((model) => (
                  <div key={model.name} className="p-3 rounded-2xl bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{model.name}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          model.status === "healthy"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : model.status === "warning"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {model.status === "healthy" ? "정상" : 
                         model.status === "warning" ? "경고" : "오류"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">정확도:</span>
                        <span className="ml-2 font-medium">{model.accuracy}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">지연시간:</span>
                        <span className="ml-2 font-medium">{model.latency}ms</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">처리량:</span>
                        <span className="ml-2 font-medium">{model.throughput}/s</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">가용성:</span>
                        <span className="ml-2 font-medium">{model.availability}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 모델 사용량 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  모델 사용량
                </CardTitle>
                <CardDescription>
                  각 모델의 사용량 비율을 확인하세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-2xl">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>모델 사용량 차트</p>
                    <p className="text-sm">차트 라이브러리 연동 필요</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                성능 알림
              </CardTitle>
              <CardDescription>
                시스템 성능 관련 알림을 확인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-muted/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                        alert.severity === "high" ? "bg-red-100" :
                        alert.severity === "medium" ? "bg-yellow-100" : "bg-blue-100"
                      }`}>
                        <AlertTriangle className={`h-5 w-5 ${
                          alert.severity === "high" ? "text-red-600" :
                          alert.severity === "medium" ? "text-yellow-600" : "text-blue-600"
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          alert.severity === "high" ? "bg-red-50 text-red-700 border-red-200" :
                          alert.severity === "medium" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                          "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {alert.severity === "high" ? "높음" : 
                         alert.severity === "medium" ? "중간" : "낮음"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
