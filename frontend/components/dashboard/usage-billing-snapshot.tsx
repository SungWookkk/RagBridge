"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Brain,
  Users,
  Settings,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

/**
 * 사용량 및 과금 스냅샷 컴포넌트
 *
 * @description
 * - 월간 사용량 및 예상 과금 표시
 * - 잔여 쿼터 및 알림 설정
 * - 사용량 트렌드 및 패턴 분석
 * - 비용 최적화 제안 및 권장사항
 */
export function UsageBillingSnapshot() {
  /**
   * 현재 사용량 데이터
   * - 월간 사용량 현황 및 한도 정보
   * - 각 서비스별 사용량 세부 정보
   */
  const currentUsage = {
    documentsProcessed: 1247,
    documentsLimit: 2000,
    aiQueries: 3421,
    queriesLimit: 5000,
    storageUsed: 2.4, // GB
    storageLimit: 10, // GB
    teamMembers: 8,
    membersLimit: 15,
  };

  /**
   * 과금 정보 데이터
   * - 현재 요금제 및 예상 비용
   * - 사용량 기반 과금 계산
   */
  const billingInfo = {
    currentPlan: "Pro",
    monthlyFee: 99000,
    usageFee: 15000,
    totalEstimated: 114000,
    nextBillingDate: "2024-02-15",
    paymentMethod: "신용카드 (****1234)",
  };

  /**
   * 사용량 트렌드 데이터
   * - 최근 7일간의 사용량 변화
   * - 패턴 분석 및 예측 정보
   */
  const usageTrend = [
    { day: "월", documents: 45, queries: 120 },
    { day: "화", documents: 52, queries: 135 },
    { day: "수", documents: 38, queries: 98 },
    { day: "목", documents: 61, queries: 156 },
    { day: "금", documents: 48, queries: 124 },
    { day: "토", documents: 23, queries: 67 },
    { day: "일", documents: 31, queries: 89 },
  ];

  /**
   * 알림 설정 데이터
   * - 사용량 임계값 알림 설정
   * - 과금 관련 알림 설정
   */
  const alertSettings = [
    {
      id: 1,
      type: "usage",
      title: "문서 처리량 80% 도달",
      enabled: true,
      threshold: 80,
      current: 62,
    },
    {
      id: 2,
      type: "billing",
      title: "월간 예상 과금 10만원 초과",
      enabled: true,
      threshold: 100000,
      current: 114000,
    },
    {
      id: 3,
      type: "storage",
      title: "저장공간 90% 사용",
      enabled: false,
      threshold: 90,
      current: 24,
    },
  ];

  /**
   * 사용량 계산 함수
   * - 각 항목별 사용률을 백분율로 계산
   */
  const calculateUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  /**
   * 사용량 상태 색상 매핑
   * - 사용량에 따른 시각적 경고 표시
   */
  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 80) return "text-orange-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  /**
   * 사용량 상태 배경 색상 매핑
   * - 프로그레스 바 색상 결정
   */
  const getUsageBgColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 80) return "bg-orange-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* 현재 사용량 요약 */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            이번 달 사용량
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 문서 처리량 */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <Badge
                  variant="outline"
                  className={`${getUsageColor(
                    calculateUsagePercentage(currentUsage.documentsProcessed, currentUsage.documentsLimit)
                  )} border-current`}
                >
                  {calculateUsagePercentage(currentUsage.documentsProcessed, currentUsage.documentsLimit)}%
                </Badge>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {currentUsage.documentsProcessed.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                / {currentUsage.documentsLimit.toLocaleString()} 문서
              </div>
              <Progress
                value={calculateUsagePercentage(currentUsage.documentsProcessed, currentUsage.documentsLimit)}
                className="h-2 mt-2"
              />
            </div>

            {/* AI 질의 수 */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center justify-between mb-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <Badge
                  variant="outline"
                  className={`${getUsageColor(
                    calculateUsagePercentage(currentUsage.aiQueries, currentUsage.queriesLimit)
                  )} border-current`}
                >
                  {calculateUsagePercentage(currentUsage.aiQueries, currentUsage.queriesLimit)}%
                </Badge>
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {currentUsage.aiQueries.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                / {currentUsage.queriesLimit.toLocaleString()} 질의
              </div>
              <Progress
                value={calculateUsagePercentage(currentUsage.aiQueries, currentUsage.queriesLimit)}
                className="h-2 mt-2"
              />
            </div>

            {/* 저장공간 */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50">
              <div className="flex items-center justify-between mb-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                <Badge
                  variant="outline"
                  className={`${getUsageColor(
                    calculateUsagePercentage(currentUsage.storageUsed, currentUsage.storageLimit)
                  )} border-current`}
                >
                  {calculateUsagePercentage(currentUsage.storageUsed, currentUsage.storageLimit)}%
                </Badge>
              </div>
              <div className="text-2xl font-bold text-green-700">
                {currentUsage.storageUsed}GB
              </div>
              <div className="text-sm text-muted-foreground">
                / {currentUsage.storageLimit}GB 저장공간
              </div>
              <Progress
                value={calculateUsagePercentage(currentUsage.storageUsed, currentUsage.storageLimit)}
                className="h-2 mt-2"
              />
            </div>

            {/* 팀 멤버 */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-orange-600" />
                <Badge
                  variant="outline"
                  className={`${getUsageColor(
                    calculateUsagePercentage(currentUsage.teamMembers, currentUsage.membersLimit)
                  )} border-current`}
                >
                  {calculateUsagePercentage(currentUsage.teamMembers, currentUsage.membersLimit)}%
                </Badge>
              </div>
              <div className="text-2xl font-bold text-orange-700">
                {currentUsage.teamMembers}명
              </div>
              <div className="text-sm text-muted-foreground">
                / {currentUsage.membersLimit}명 팀원
              </div>
              <Progress
                value={calculateUsagePercentage(currentUsage.teamMembers, currentUsage.membersLimit)}
                className="h-2 mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 과금 정보 */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            이번 달 예상 과금
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 과금 상세 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
                <span className="text-sm text-muted-foreground">현재 요금제</span>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  {billingInfo.currentPlan}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
                <span className="text-sm text-muted-foreground">기본 요금</span>
                <span className="font-medium">{billingInfo.monthlyFee.toLocaleString()}원</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
                <span className="text-sm text-muted-foreground">사용량 요금</span>
                <span className="font-medium">{billingInfo.usageFee.toLocaleString()}원</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
                <span className="font-medium text-green-800">총 예상 과금</span>
                <span className="text-xl font-bold text-green-700">
                  {billingInfo.totalEstimated.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 결제 정보 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
                <span className="text-sm text-muted-foreground">다음 결제일</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{billingInfo.nextBillingDate}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
                <span className="text-sm text-muted-foreground">결제 수단</span>
                <span className="font-medium">{billingInfo.paymentMethod}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-xl">
                  <Settings className="h-4 w-4 mr-1" />
                  결제 수단 변경
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  요금제 변경
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 사용량 트렌드 */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            최근 7일 사용량 트렌드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageTrend.map((day, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30">
                <div className="w-12 text-sm font-medium text-muted-foreground">
                  {day.day}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">문서 처리</span>
                    <span className="font-medium">{day.documents}개</span>
                  </div>
                  <Progress value={(day.documents / 70) * 100} className="h-1" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">AI 질의</span>
                    <span className="font-medium">{day.queries}회</span>
                  </div>
                  <Progress value={(day.queries / 200) * 100} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 알림 설정 */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alertSettings.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    alert.enabled ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {alert.enabled ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">
                    현재: {alert.current.toLocaleString()}
                    {alert.type === "billing" ? "원" : "%"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`${
                    alert.enabled
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {alert.enabled ? "활성" : "비활성"}
                </Badge>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
