"use client";

import { motion } from "framer-motion";
import {
  FileCheck,
  AlertCircle,
  Clock,
  Users,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

/**
 * 사용자 중심 작업 큐 컴포넌트
 *
 * @description
 * - 내가 맡은 검토 대기 문서 목록
 * - 최근 실패 건 재처리 큐
 * - 팀원들의 피드백 요청
 * - 역할 기반 작업 우선순위 관리
 */
export function UserTaskQueue() {
  /**
   * 검토 대기 문서 데이터
   * - 승인이 필요한 문서들의 목록
   * - 우선순위와 마감일 정보 포함
   */
  const reviewQueue = [
    {
      id: 1,
      title: "2024년 1분기 정책서",
      type: "Policy",
      requester: "김인사",
      priority: "high",
      deadline: "오늘",
      status: "pending",
      progress: 0,
    },
    {
      id: 2,
      title: "신입사원 교육 자료",
      type: "Training",
      requester: "박교육",
      priority: "medium",
      deadline: "내일",
      status: "in_progress",
      progress: 60,
    },
    {
      id: 3,
      title: "보안 정책 업데이트",
      type: "Security",
      requester: "이보안",
      priority: "low",
      deadline: "3일 후",
      status: "pending",
      progress: 0,
    },
  ];

  /**
   * 재처리 요청 데이터
   * - 처리 실패한 문서들의 재처리 요청
   * - 실패 원인과 해결 방안 제시
   */
  const reprocessQueue = [
    {
      id: 1,
      title: "계약서 템플릿.pdf",
      error: "OCR 인식률 낮음",
      suggestedAction: "이미지 품질 개선 후 재업로드",
      retryCount: 1,
      maxRetries: 3,
    },
    {
      id: 2,
      title: "회의록 스캔본.jpg",
      error: "필드 매핑 실패",
      suggestedAction: "수동 필드 매핑 필요",
      retryCount: 2,
      maxRetries: 3,
    },
  ];

  /**
   * 팀 피드백 요청 데이터
   * - 동료들의 피드백 요청 목록
   * - 협업이 필요한 작업들
   */
  const feedbackRequests = [
    {
      id: 1,
      title: "문서 검증 룰 검토",
      requester: "최품질",
      type: "validation",
      urgency: "medium",
      description: "새로운 문서 유형에 대한 검증 룰이 필요합니다",
    },
    {
      id: 2,
      title: "AI 모델 성능 개선",
      requester: "정개발",
      type: "model",
      urgency: "high",
      description: "현재 모델의 정확도를 높이기 위한 피드백을 요청합니다",
    },
  ];

  /**
   * 우선순위별 색상 매핑
   * - 시각적 구분을 위한 색상 체계
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
   * 상태별 아이콘 매핑
   * - 각 상태를 직관적으로 표현하는 아이콘
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <RefreshCw className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileCheck className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 검토 대기 문서 */}
      <Card className="rounded-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-blue-600" />
              내가 맡은 검토 대기
            </CardTitle>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              {reviewQueue.length}건
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviewQueue.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              className="p-4 rounded-2xl border hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                    <FileCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.type} • 요청자: {item.requester}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`rounded-xl ${getPriorityColor(item.priority)}`}
                  >
                    {item.priority === "high" ? "긴급" : item.priority === "medium" ? "보통" : "낮음"}
                  </Badge>
                  <Badge variant="outline" className="rounded-xl">
                    {item.deadline}
                  </Badge>
                </div>
              </div>

              {/* 진행률 표시 */}
              {item.status === "in_progress" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">검토 진행률</span>
                    <span className="font-medium">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <span className="text-sm text-muted-foreground">
                    {item.status === "pending" ? "대기 중" : "진행 중"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Eye className="h-4 w-4 mr-1" />
                    미리보기
                  </Button>
                  <Button size="sm" className="rounded-xl">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    검토하기
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* 재처리 요청 */}
      <Card className="rounded-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              재처리 요청
            </CardTitle>
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
              {reprocessQueue.length}건
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {reprocessQueue.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              className="p-4 rounded-2xl border border-orange-200 bg-orange-50/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-orange-700">
                      오류: {item.error}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-orange-100 text-orange-700 border-orange-200"
                >
                  {item.retryCount}/{item.maxRetries}회 시도
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>권장 조치:</strong> {item.suggestedAction}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    재처리
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <Eye className="h-4 w-4 mr-1" />
                    상세보기
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* 팀 피드백 요청 */}
      <Card className="rounded-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              팀 피드백 요청
            </CardTitle>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              {feedbackRequests.length}건
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedbackRequests.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              className="p-4 rounded-2xl border hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-blue-100">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      요청자: {item.requester} • {item.type}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`rounded-xl ${
                    item.urgency === "high"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {item.urgency === "high" ? "긴급" : "보통"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {item.description}
              </p>

              <div className="flex gap-2">
                <Button size="sm" className="rounded-xl">
                  <ArrowRight className="h-4 w-4 mr-1" />
                  피드백 작성
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Eye className="h-4 w-4 mr-1" />
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
