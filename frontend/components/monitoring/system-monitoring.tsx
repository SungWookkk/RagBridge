"use client"

import { motion } from "framer-motion"
import {
  Activity,
  BarChart3,
  FileCheck,
  Clock,
  Brain,
  Zap,
  TrendingUp,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSystemMetrics } from "@/hooks/use-system-metrics"

/**
 * 시스템 모니터링 컴포넌트
 * 
 * @description
 * - 실시간 시스템 상태 및 성능 지표
 * - AI 모델 성능 모니터링
 * - 스트림 처리 상태 및 알림 관리
 * - 성능 최적화를 위한 컴포넌트 분리
 */
export function SystemMonitoring() {
  const { metrics, isLoading } = useSystemMetrics()

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8" />
                <h2 className="text-3xl font-bold">시스템 모니터링</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                문서 처리 시스템 상태와 AI 모델 성능을 실시간으로 확인하세요.
              </p>
            </div>
            <Button className="w-fit rounded-2xl bg-white text-orange-700 hover:bg-white/90">
              <BarChart3 className="mr-2 h-4 w-4" />
              상세 분석
            </Button>
          </div>
        </motion.div>
      </section>

      {/* 성능 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-green-600" />
              처리된 문서
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? "..." : metrics.processedDocuments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "..." : `+${metrics.documentGrowth}% 지난 시간 대비`}
            </p>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              평균 처리 시간
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? "..." : `${metrics.avgProcessingTime}초`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "..." : `${metrics.processingTimeImprovement > 0 ? '-' : '+'}${Math.abs(metrics.processingTimeImprovement)}초 개선`}
            </p>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              모델 정확도
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {isLoading ? "..." : `${(metrics.modelAccuracy * 100).toFixed(1)}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "..." : `+${(metrics.accuracyImprovement * 100).toFixed(1)}% 향상`}
            </p>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" />
              시스템 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {isLoading ? "..." : `${metrics.activeStreams}/${metrics.totalStreams}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "..." : metrics.activeStreams === metrics.totalStreams ? "모든 토픽 정상" : "일부 토픽 점검 필요"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 차트 및 상세 정보 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              문서 처리량 추이
            </CardTitle>
            <CardDescription>
              시간별 문서 처리량과 성능 지표
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-2xl">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">실시간 차트 영역</p>
                <p className="text-xs text-muted-foreground">Chart.js 또는 Recharts로 구현 예정</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              스트림 처리 상태
            </CardTitle>
            <CardDescription>
              시스템 토픽별 처리 상태와 성능 모니터링
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-muted rounded-full animate-pulse" />
                      <div className="space-y-1">
                        <div className="h-3 bg-muted rounded animate-pulse w-32" />
                        <div className="h-2 bg-muted rounded animate-pulse w-24" />
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="h-3 bg-muted rounded animate-pulse w-12" />
                      <div className="h-2 bg-muted rounded animate-pulse w-8" />
                    </div>
                  </div>
                ))
              ) : (
                metrics.streamStatus.map((stream, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${stream.status === '정상' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium text-sm">{stream.topic}</p>
                        <p className="text-xs text-muted-foreground">처리량: {stream.throughput}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${stream.status === '정상' ? 'text-green-600' : 'text-red-600'}`}>
                        {stream.status}
                      </p>
                      <p className="text-xs text-muted-foreground">랙: {stream.lag}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
