"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  FileCheck,
  Clock,
  Brain,
  Zap,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSystemMetrics } from "@/hooks/use-system-metrics";

/**
 * 하드코딩된 차트 데이터
 *
 * @description
 * - 문서 처리량 추이 데이터 (시간별)
 * - AI 모델 성능 데이터
 * - 시스템 상태 데이터
 */
const chartData = [
  {
    time: "09:00",
    documents: 120,
    accuracy: 95.2,
    processingTime: 2.3,
    errors: 2,
  },
  {
    time: "10:00",
    documents: 180,
    accuracy: 96.1,
    processingTime: 2.1,
    errors: 1,
  },
  {
    time: "11:00",
    documents: 220,
    accuracy: 95.8,
    processingTime: 2.4,
    errors: 3,
  },
  {
    time: "12:00",
    documents: 195,
    accuracy: 96.5,
    processingTime: 2.0,
    errors: 1,
  },
  {
    time: "13:00",
    documents: 165,
    accuracy: 95.9,
    processingTime: 2.2,
    errors: 2,
  },
  {
    time: "14:00",
    documents: 240,
    accuracy: 96.8,
    processingTime: 1.9,
    errors: 1,
  },
  {
    time: "15:00",
    documents: 280,
    accuracy: 96.2,
    processingTime: 2.1,
    errors: 2,
  },
  {
    time: "16:00",
    documents: 320,
    accuracy: 95.7,
    processingTime: 2.3,
    errors: 4,
  },
  {
    time: "17:00",
    documents: 290,
    accuracy: 96.3,
    processingTime: 2.0,
    errors: 2,
  },
  {
    time: "18:00",
    documents: 180,
    accuracy: 96.0,
    processingTime: 2.2,
    errors: 1,
  },
];

/**
 * 처리 단계별 분포 데이터
 */
const processingStepsData = [
  { name: "OCR 처리", value: 25, color: "#3b82f6" },
  { name: "필드 추출", value: 20, color: "#8b5cf6" },
  { name: "검증", value: 15, color: "#06b6d4" },
  { name: "임베딩", value: 20, color: "#10b981" },
  { name: "인덱싱", value: 20, color: "#f59e0b" },
];

/**
 * 시스템 모니터링 컴포넌트
 *
 * @description
 * - 실시간 시스템 상태 및 성능 지표
 * - AI 모델 성능 모니터링
 * - 스트림 처리 상태 및 알림 관리
 * - Recharts를 사용한 인터랙티브 차트 구현
 */
export function SystemMonitoring() {
  const { metrics, isLoading } = useSystemMetrics();

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
              {isLoading
                ? "..."
                : `${metrics.processingTimeImprovement > 0 ? "-" : "+"}${Math.abs(metrics.processingTimeImprovement)}초 개선`}
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
              {isLoading
                ? "..."
                : `${(metrics.modelAccuracy * 100).toFixed(1)}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "..."
                : `+${(metrics.accuracyImprovement * 100).toFixed(1)}% 향상`}
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
              {isLoading
                ? "..."
                : `${metrics.activeStreams}/${metrics.totalStreams}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "..."
                : metrics.activeStreams === metrics.totalStreams
                  ? "모든 토픽 정상"
                  : "일부 토픽 점검 필요"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 차트 및 상세 정보 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 문서 처리량 추이 차트 */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              문서 처리량 추이
            </CardTitle>
            <CardDescription>시간별 문서 처리량과 성능 지표</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="time"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ color: "#374151", fontWeight: "600" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="documents"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: "#10b981", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 처리 단계별 분포 차트 */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              처리 단계별 분포
            </CardTitle>
            <CardDescription>
              AI 파이프라인 단계별 처리 시간 분포
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processingStepsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {processingStepsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number, name: string) => [
                      `${value}%`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* 범례 */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {processingStepsData.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: step.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 추가 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 처리 시간 추이 차트 */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              처리 시간 추이
            </CardTitle>
            <CardDescription>시간별 평균 처리 시간과 에러율</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="time"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ color: "#374151", fontWeight: "600" }}
                  />
                  <Bar
                    dataKey="processingTime"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 스트림 처리 상태 */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              스트림 처리 상태
            </CardTitle>
            <CardDescription>
              시스템 토픽별 처리 상태와 성능 모니터링
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-2xl bg-muted/30"
                    >
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
                : metrics.streamStatus.map((stream, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-2xl bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${stream.status === "정상" ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <div>
                          <p className="font-medium text-sm">{stream.topic}</p>
                          <p className="text-xs text-muted-foreground">
                            처리량: {stream.throughput}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${stream.status === "정상" ? "text-green-600" : "text-red-600"}`}
                        >
                          {stream.status}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          랙: {stream.lag}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
