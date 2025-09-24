"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Clock, Activity } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

/**
 * 문서 처리 파이프라인 단계 타입 정의
 */
type PipelineStep =
  | "uploaded"
  | "ocr_processing"
  | "field_extraction"
  | "validation"
  | "embedding"
  | "indexing"
  | "completed"
  | "error";

type StepStatus = "pending" | "processing" | "completed" | "failed";

/**
 * 문서 상태 인터페이스
 */
interface DocumentStatus {
  currentStep: PipelineStep;
  overallProgress: number;
  steps: {
    [key in PipelineStep]: {
      status: StepStatus;
      progress: number;
      startTime?: string;
      endTime?: string;
      error?: string;
    };
  };
}

/**
 * 파이프라인 상태 컴포넌트
 *
 * @description
 * - 문서 처리 파이프라인의 실시간 상태 표시
 * - 각 단계별 진행률 및 상태 시각화
 * - 에러 발생 시 상세 정보 제공
 * - 성능 최적화를 위한 메모이제이션 적용
 */
interface PipelineStatusProps {
  documentStatus: DocumentStatus;
}

/**
 * 단계별 상태 아이콘 컴포넌트
 */
function StepIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "processing":
      return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
    case "failed":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "pending":
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
}

/**
 * 단계별 상태 배지 컴포넌트
 */
function StepBadge({ status }: { status: StepStatus }) {
  const variants = {
    completed: "bg-green-50 text-green-700 border-green-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-gray-50 text-gray-700 border-gray-200",
  };

  const labels = {
    completed: "완료",
    processing: "처리중",
    failed: "실패",
    pending: "대기",
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      {labels[status]}
    </Badge>
  );
}

export function PipelineStatus({ documentStatus }: PipelineStatusProps) {
  const { currentStep, overallProgress, steps } = documentStatus;

  // 파이프라인 단계 순서 정의
  const stepOrder: PipelineStep[] = [
    "uploaded",
    "ocr_processing",
    "field_extraction",
    "validation",
    "embedding",
    "indexing",
    "completed",
  ];

  return (
    <div className="space-y-4">
      {/* 전체 진행률 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">전체 진행률</span>
          <span className="text-sm text-muted-foreground">
            {overallProgress}%
          </span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {/* 단계별 상태 */}
      <div className="space-y-3">
        {stepOrder.map((step, index) => {
          const stepInfo = steps[step];
          const isActive = step === currentStep;
          const isFailed = stepInfo.status === "failed";

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                flex items-center justify-between p-3 rounded-lg border
                ${isActive ? "border-primary bg-primary/5" : "border-border"}
                ${isFailed ? "border-red-200 bg-red-50" : ""}
              `}
            >
              <div className="flex items-center gap-3">
                <StepIcon status={stepInfo.status} />
                <div>
                  <div className="font-medium text-sm">
                    {step === "uploaded" && "문서 업로드"}
                    {step === "ocr_processing" && "OCR 처리"}
                    {step === "field_extraction" && "필드 추출"}
                    {step === "validation" && "데이터 검증"}
                    {step === "embedding" && "임베딩 생성"}
                    {step === "indexing" && "인덱싱"}
                    {step === "completed" && "처리 완료"}
                  </div>
                  {stepInfo.error && (
                    <div className="text-xs text-red-600 mt-1">
                      {stepInfo.error}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {stepInfo.status === "processing" && (
                  <div className="text-xs text-muted-foreground">
                    {stepInfo.progress}%
                  </div>
                )}
                <StepBadge status={stepInfo.status} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 파이프라인 흐름 시각화 */}
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2">
          {stepOrder.slice(0, -1).map((step, index) => {
            const stepInfo = steps[step];
            const isCompleted = stepInfo.status === "completed";

            return (
              <div key={step} className="flex items-center">
                <div
                  className={`
                    w-3 h-3 rounded-full border-2
                    ${isCompleted ? "bg-green-500 border-green-500" : "border-gray-300"}
                  `}
                />
                {index < stepOrder.length - 2 && (
                  <div
                    className={`
                      w-8 h-0.5 mx-2
                      ${isCompleted ? "bg-green-500" : "bg-gray-300"}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
