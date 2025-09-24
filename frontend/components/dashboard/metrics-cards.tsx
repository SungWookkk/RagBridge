"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Brain,
  Activity,
  Target,
  Clock,
  CheckCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * 메트릭 카드 데이터 인터페이스
 */
interface MetricData {
  processedDocuments: number;
  documentGrowth: number;
  avgProcessingTime: number;
  processingTimeImprovement: number;
  modelAccuracy: number;
  accuracyImprovement: number;
  activeStreams: number;
  totalStreams: number;
}

/**
 * 개별 메트릭 카드 컴포넌트
 */
interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs">{description}</CardDescription>
            {trend && (
              <Badge
                variant="outline"
                className={`
                  text-xs
                  ${
                    trend.isPositive
                      ? "text-green-600 border-green-200 bg-green-50"
                      : "text-red-600 border-red-200 bg-red-50"
                  }
                `}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(trend.value)}%
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * 메트릭 카드 그룹 컴포넌트
 *
 * @description
 * - 문서 처리 관련 주요 지표들을 카드 형태로 표시
 * - 트렌드 정보와 함께 시각적 표현
 * - 성능 최적화를 위한 메모이제이션 적용
 * - 애니메이션으로 사용자 경험 향상
 */
interface MetricsCardsProps {
  metrics: MetricData;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const {
    processedDocuments,
    documentGrowth,
    avgProcessingTime,
    processingTimeImprovement,
    modelAccuracy,
    accuracyImprovement,
    activeStreams,
    totalStreams,
  } = metrics;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="처리된 문서"
        value={processedDocuments.toLocaleString()}
        description="총 처리 완료된 문서 수"
        icon={FileText}
        trend={{
          value: documentGrowth,
          isPositive: documentGrowth > 0,
        }}
        delay={0}
      />

      <MetricCard
        title="평균 처리 시간"
        value={`${avgProcessingTime.toFixed(1)}초`}
        description="문서당 평균 처리 소요 시간"
        icon={Clock}
        trend={{
          value: processingTimeImprovement,
          isPositive: processingTimeImprovement > 0,
        }}
        delay={0.1}
      />

      <MetricCard
        title="모델 정확도"
        value={`${modelAccuracy.toFixed(1)}%`}
        description="AI 모델의 평균 정확도"
        icon={Brain}
        trend={{
          value: accuracyImprovement,
          isPositive: accuracyImprovement > 0,
        }}
        delay={0.2}
      />

      <MetricCard
        title="활성 스트림"
        value={`${activeStreams}/${totalStreams}`}
        description="현재 활성화된 처리 스트림"
        icon={Activity}
        delay={0.3}
      />
    </div>
  );
}

/**
 * 추가 메트릭 카드들 (성능 및 시스템 상태)
 */
interface AdditionalMetricsProps {
  metrics: {
    successRate: number;
    errorRate: number;
    queueSize: number;
    throughput: string;
  };
}

export function AdditionalMetrics({ metrics }: AdditionalMetricsProps) {
  const { successRate, errorRate, queueSize, throughput } = metrics;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="성공률"
        value={`${successRate.toFixed(1)}%`}
        description="문서 처리 성공 비율"
        icon={CheckCircle}
        trend={{
          value: successRate - 95, // 기준치 대비 비교
          isPositive: successRate >= 95,
        }}
        delay={0}
      />

      <MetricCard
        title="에러율"
        value={`${errorRate.toFixed(1)}%`}
        description="문서 처리 실패 비율"
        icon={Target}
        trend={{
          value: errorRate,
          isPositive: errorRate <= 5,
        }}
        delay={0.1}
      />

      <MetricCard
        title="대기 큐"
        value={queueSize}
        description="처리 대기 중인 문서 수"
        icon={Activity}
        delay={0.2}
      />

      <MetricCard
        title="처리량"
        value={throughput}
        description="분당 처리 문서 수"
        icon={TrendingUp}
        delay={0.3}
      />
    </div>
  );
}
