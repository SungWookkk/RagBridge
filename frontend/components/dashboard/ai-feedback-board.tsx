"use client";

import { motion } from "framer-motion";
import {
  ThumbsUp,
  Star,
  MessageSquare,
  TrendingUp,
  Brain,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

/**
 * AI 답변 품질 피드백 보드 컴포넌트
 *
 * @description
 * - 최근 질의응답별 만족도 표시
 * - 사용자가 남긴 피드백 및 개선 요청
 * - AI 모델 성능 지표 및 개선 제안
 * - 사용자 경험 중심의 피드백 관리
 */
export function AIFeedbackBoard() {
  /**
   * 최근 질의응답 피드백 데이터
   * - 사용자가 평가한 AI 답변의 품질 정보
   * - 만족도, 정확도, 유용성 등 다차원 평가
   */
  const recentFeedback = [
    {
      id: 1,
      query: "회사 정책서에서 휴가 신청 절차는 어떻게 되나요?",
      rating: 5,
      satisfaction: "매우 만족",
      accuracy: 95,
      usefulness: 90,
      userComment: "정확하고 상세한 답변이었습니다.",
      timestamp: "2시간 전",
    },
    {
      id: 2,
      query: "기술 문서에서 API 사용법을 알려주세요",
      rating: 4,
      satisfaction: "만족",
      accuracy: 85,
      usefulness: 80,
      userComment: "도움이 되었지만 더 구체적인 예시가 필요합니다.",
      timestamp: "5시간 전",
    },
    {
      id: 3,
      query: "회의록에서 프로젝트 일정을 찾아주세요",
      rating: 3,
      satisfaction: "보통",
      accuracy: 70,
      usefulness: 75,
      userComment: "관련 정보는 찾았지만 정확한 일정이 없었습니다.",
      timestamp: "1일 전",
    },
  ];

  /**
   * 개선 요청 데이터
   * - 사용자가 제안한 AI 모델 개선 사항
   * - 우선순위와 구현 가능성 평가
   */
  const improvementRequests = [
    {
      id: 1,
      title: "이미지 내 텍스트 인식 정확도 향상",
      description: "스캔된 문서의 OCR 정확도를 높여주세요",
      priority: "high",
      votes: 12,
      status: "in_progress",
      estimatedCompletion: "2주 후",
    },
    {
      id: 2,
      title: "다국어 문서 지원 추가",
      description: "영어, 중국어 문서도 처리할 수 있게 해주세요",
      priority: "medium",
      votes: 8,
      status: "planned",
      estimatedCompletion: "1개월 후",
    },
    {
      id: 3,
      title: "실시간 협업 편집 기능",
      description: "여러 사용자가 동시에 문서를 편집할 수 있게 해주세요",
      priority: "low",
      votes: 5,
      status: "reviewing",
      estimatedCompletion: "3개월 후",
    },
  ];

  /**
   * AI 성능 지표 데이터
   * - 모델의 전반적인 성능 메트릭
   * - 시간별 성능 변화 추이
   */
  const performanceMetrics = {
    overallSatisfaction: 4.2,
    averageAccuracy: 87,
    responseTime: 1.8,
    totalQueries: 1247,
    positiveFeedback: 78,
    negativeFeedback: 12,
    neutralFeedback: 10,
  };

  /**
   * 만족도별 색상 매핑
   * - 시각적 구분을 위한 색상 체계
   */
  const getSatisfactionColor = (satisfaction: string) => {
    switch (satisfaction) {
      case "매우 만족":
        return "bg-green-50 text-green-700 border-green-200";
      case "만족":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "보통":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "불만족":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "매우 불만족":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  /**
   * 우선순위별 색상 매핑
   * - 개선 요청의 우선순위를 시각적으로 표현
   */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  /**
   * 상태별 색상 매핑
   * - 개선 요청의 진행 상태를 시각적으로 표현
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "planned":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "reviewing":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI 성능 지표 요약 */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            AI 성능 지표
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-green-700">
                {performanceMetrics.overallSatisfaction}
              </div>
              <div className="text-sm text-muted-foreground">평균 만족도</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-center justify-center mb-2">
                <Brain className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {performanceMetrics.averageAccuracy}%
              </div>
              <div className="text-sm text-muted-foreground">평균 정확도</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {performanceMetrics.responseTime}초
              </div>
              <div className="text-sm text-muted-foreground">평균 응답시간</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-red-50">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-pink-500" />
              </div>
              <div className="text-2xl font-bold text-pink-700">
                {performanceMetrics.totalQueries}
              </div>
              <div className="text-sm text-muted-foreground">총 질의 수</div>
            </div>
          </div>

          {/* 피드백 분포 */}
          <div className="mt-6 space-y-3">
            <h4 className="font-medium">피드백 분포</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">긍정적 피드백</span>
                <span className="text-sm font-medium">{performanceMetrics.positiveFeedback}%</span>
              </div>
              <Progress value={performanceMetrics.positiveFeedback} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-700">중립적 피드백</span>
                <span className="text-sm font-medium">{performanceMetrics.neutralFeedback}%</span>
              </div>
              <Progress value={performanceMetrics.neutralFeedback} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-700">부정적 피드백</span>
                <span className="text-sm font-medium">{performanceMetrics.negativeFeedback}%</span>
              </div>
              <Progress value={performanceMetrics.negativeFeedback} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 최근 피드백 */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            최근 피드백
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentFeedback.map((feedback) => (
            <motion.div
              key={feedback.id}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              className="p-4 rounded-2xl border hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium mb-2">{feedback.query}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < feedback.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <Badge
                      variant="outline"
                      className={`rounded-xl ${getSatisfactionColor(feedback.satisfaction)}`}
                    >
                      {feedback.satisfaction}
                    </Badge>
                  </div>
                  {feedback.userComment && (
                    <p className="text-sm text-muted-foreground italic">
                      &ldquo;{feedback.userComment}&rdquo;
                    </p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground ml-4">
                  {feedback.timestamp}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">정확도</span>
                    <span className="font-medium">{feedback.accuracy}%</span>
                  </div>
                  <Progress value={feedback.accuracy} className="h-1" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">유용성</span>
                    <span className="font-medium">{feedback.usefulness}%</span>
                  </div>
                  <Progress value={feedback.usefulness} className="h-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* 개선 요청 */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-green-600" />
            개선 요청
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {improvementRequests.map((request) => (
            <motion.div
              key={request.id}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              className="p-4 rounded-2xl border hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">{request.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {request.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`rounded-xl ${getPriorityColor(request.priority)}`}
                    >
                      {request.priority === "high" ? "높음" : request.priority === "medium" ? "보통" : "낮음"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`rounded-xl ${getStatusColor(request.status)}`}
                    >
                      {request.status === "in_progress" ? "진행 중" : 
                       request.status === "planned" ? "계획됨" : 
                       request.status === "reviewing" ? "검토 중" : "완료"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="flex items-center gap-1 mb-1">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{request.votes}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    예상 완료: {request.estimatedCompletion}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-xl">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  지지하기
                </Button>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  댓글
                </Button>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  <ArrowRight className="h-4 w-4 mr-1" />
                  상세보기
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
