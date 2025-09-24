"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

/**
 * 시스템 메트릭 인터페이스
 */
interface SystemMetrics {
  processedDocuments: number;
  documentGrowth: number;
  avgProcessingTime: number;
  processingTimeImprovement: number;
  modelAccuracy: number;
  accuracyImprovement: number;
  activeStreams: number;
  totalStreams: number;
  streamStatus: Array<{
    topic: string;
    status: string;
    lag: number;
    throughput: string;
  }>;
}

/**
 * 시스템 메트릭 조회 훅
 *
 * @description
 * - 실시간 시스템 성능 지표 조회
 * - 스트림 처리 상태 모니터링
 * - AI 모델 성능 추적
 * - 자동 새로고침 및 에러 처리
 */
export function useSystemMetrics() {
  const {
    data: metrics,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["system-metrics"],
    queryFn: async (): Promise<SystemMetrics> => {
      // 실제 API 호출 시에는 이 부분을 실제 엔드포인트로 교체
      // const response = await api.get('/api/v1/monitoring/metrics')
      // return response.data

      // 현재는 샘플 데이터 반환
      return {
        processedDocuments: 1847,
        documentGrowth: 18,
        avgProcessingTime: 1.8,
        processingTimeImprovement: 0.3,
        modelAccuracy: 0.942,
        accuracyImprovement: 0.012,
        activeStreams: 8,
        totalStreams: 8,
        streamStatus: [
          {
            topic: "documents.uploaded",
            status: "정상",
            lag: 0,
            throughput: "245/min",
          },
          {
            topic: "documents.parsed",
            status: "정상",
            lag: 2,
            throughput: "198/min",
          },
          {
            topic: "documents.validated",
            status: "정상",
            lag: 1,
            throughput: "186/min",
          },
          {
            topic: "documents.embeddings",
            status: "정상",
            lag: 3,
            throughput: "172/min",
          },
        ],
      };
    },
    refetchInterval: 5000, // 5초마다 자동 새로고침
    staleTime: 3000, // 3초 후 stale 상태로 변경
  });

  return {
    metrics: metrics || {
      processedDocuments: 0,
      documentGrowth: 0,
      avgProcessingTime: 0,
      processingTimeImprovement: 0,
      modelAccuracy: 0,
      accuracyImprovement: 0,
      activeStreams: 0,
      totalStreams: 0,
      streamStatus: [],
    },
    isLoading,
    error,
    refetch,
  };
}

/**
 * 알림 관리 훅
 *
 * @description
 * - 시스템 알림 및 경고 관리
 * - 실시간 알림 수신
 * - 알림 읽음/삭제 기능
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "info" | "warning" | "error";
      title: string;
      message: string;
      timestamp: string;
      read: boolean;
    }>
  >([]);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 실제로는 WebSocket이나 Server-Sent Events로 실시간 알림 수신
    const mockNotifications = [
      {
        id: "1",
        type: "warning" as const,
        title: "처리 지연 감지",
        message: "documents.parsed 토픽에서 처리 지연이 감지되었습니다.",
        timestamp: "2분 전",
        read: false,
      },
      {
        id: "2",
        type: "info" as const,
        title: "모델 업데이트 완료",
        message: "AI 모델 v2.1이 성공적으로 배포되었습니다.",
        timestamp: "15분 전",
        read: false,
      },
      {
        id: "3",
        type: "error" as const,
        title: "OCR 처리 실패",
        message: "문서 ID: doc-123에서 OCR 처리 중 오류가 발생했습니다.",
        timestamp: "1시간 전",
        read: true,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
    setUnreadCount(0);
  };

  const removeNotification = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };
}
