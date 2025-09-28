import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * 알림 센터 관련 타입 정의
 */
export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "high" | "medium" | "low";
  category: "system" | "performance" | "database" | "network" | "security" | "document" | "user";
  status: "active" | "acknowledged" | "resolved";
  timestamp: string;
  source?: string;
  metadata?: Record<string, any>;
}

export interface AlertStatistics {
  active: number;
  acknowledged: number;
  resolved: number;
  total: number;
}

export interface AlertSettings {
  id: string;
  name: string;
  enabled: boolean;
  severity: string[];
  categories: string[];
  notificationMethods: string[];
}

/**
 * 알림 센터 데이터 훅
 *
 * @description
 * - 알림 목록 조회 및 관리
 * - 알림 통계 및 설정 관리
 * - 알림 상태 변경 (확인, 해제, 해결)
 */
export function useAlertCenter() {
  const queryClient = useQueryClient();

  /**
   * 알림 목록 조회
   */
  const {
    data: alerts = [],
    isLoading: isLoadingAlerts,
    error: alertsError,
  } = useQuery({
    queryKey: ["alerts"],
    queryFn: async (): Promise<Alert[]> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/monitoring/alerts')
      // return response.data

      // 목 데이터
      return [
        {
          id: "alert-001",
          title: "시스템 CPU 사용률 높음",
          message: "시스템 CPU 사용률이 90%를 초과했습니다. 성능 저하가 발생할 수 있습니다.",
          severity: "high",
          category: "system",
          status: "active",
          timestamp: "2024-01-24 14:30:00",
          source: "monitoring-system",
          metadata: {
            cpu_usage: 92.5,
            threshold: 90,
            duration: "5분",
          },
        },
        {
          id: "alert-002",
          title: "데이터베이스 연결 지연",
          message: "데이터베이스 응답 시간이 평소보다 3배 느립니다.",
          severity: "medium",
          category: "database",
          status: "active",
          timestamp: "2024-01-24 14:25:00",
          source: "database-monitor",
          metadata: {
            response_time: 1500,
            normal_time: 500,
            connection_count: 45,
          },
        },
        {
          id: "alert-003",
          title: "문서 처리 실패",
          message: "문서 ID: doc-12345 처리 중 오류가 발생했습니다.",
          severity: "medium",
          category: "document",
          status: "acknowledged",
          timestamp: "2024-01-24 14:20:00",
          source: "document-processor",
          metadata: {
            document_id: "doc-12345",
            error_code: "PARSE_ERROR",
            retry_count: 2,
          },
        },
        {
          id: "alert-004",
          title: "네트워크 대역폭 사용량 증가",
          message: "네트워크 대역폭 사용량이 평소보다 2배 증가했습니다.",
          severity: "low",
          category: "network",
          status: "resolved",
          timestamp: "2024-01-24 14:15:00",
          source: "network-monitor",
          metadata: {
            bandwidth_usage: 800,
            normal_usage: 400,
            peak_time: "14:00-15:00",
          },
        },
        {
          id: "alert-005",
          title: "보안 로그인 시도 감지",
          message: "의심스러운 로그인 시도가 감지되었습니다.",
          severity: "high",
          category: "security",
          status: "active",
          timestamp: "2024-01-24 14:10:00",
          source: "security-monitor",
          metadata: {
            ip_address: "192.168.1.100",
            attempt_count: 5,
            user_agent: "Mozilla/5.0...",
          },
        },
      ];
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchInterval: 30 * 1000, // 30초마다 새로고침
  });

  /**
   * 알림 통계 조회
   */
  const {
    data: statistics = {
      active: 0,
      acknowledged: 0,
      resolved: 0,
      total: 0,
    },
    isLoading: isLoadingStatistics,
  } = useQuery({
    queryKey: ["alert-statistics"],
    queryFn: async (): Promise<AlertStatistics> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/monitoring/alerts/statistics')
      // return response.data

      // 목 데이터 (실제 알림 데이터 기반으로 계산)
      const activeCount = alerts.filter(alert => alert.status === "active").length;
      const acknowledgedCount = alerts.filter(alert => alert.status === "acknowledged").length;
      const resolvedCount = alerts.filter(alert => alert.status === "resolved").length;

      return {
        active: activeCount,
        acknowledged: acknowledgedCount,
        resolved: resolvedCount,
        total: alerts.length,
      };
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchInterval: 60 * 1000, // 1분마다 새로고침
  });

  /**
   * 알림 설정 조회
   */
  const {
    data: alertSettings = [],
    isLoading: isLoadingSettings,
  } = useQuery({
    queryKey: ["alert-settings"],
    queryFn: async (): Promise<AlertSettings[]> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/monitoring/alerts/settings')
      // return response.data

      // 목 데이터
      return [
        {
          id: "system-alerts",
          name: "시스템 알림",
          enabled: true,
          severity: ["high", "medium"],
          categories: ["system", "performance"],
          notificationMethods: ["email", "slack"],
        },
        {
          id: "security-alerts",
          name: "보안 알림",
          enabled: true,
          severity: ["high"],
          categories: ["security"],
          notificationMethods: ["email", "slack", "sms"],
        },
        {
          id: "document-alerts",
          name: "문서 알림",
          enabled: true,
          severity: ["high", "medium", "low"],
          categories: ["document"],
          notificationMethods: ["email"],
        },
      ];
    },
    staleTime: 10 * 60 * 1000, // 10분
  });

  /**
   * 알림 확인 뮤테이션
   */
  const acknowledgeAlertMutation = useMutation({
    mutationFn: async (alertId: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post(`/api/v1/monitoring/alerts/${alertId}/acknowledge`)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: (_, alertId) => {
      // 로컬 상태 업데이트
      queryClient.setQueryData(["alerts"], (oldAlerts: Alert[] = []) =>
        oldAlerts.map(alert =>
          alert.id === alertId
            ? { ...alert, status: "acknowledged" as const }
            : alert
        )
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["alert-statistics"] });
    },
    onError: (error) => {
      console.error("알림 확인 실패:", error);
    },
  });

  /**
   * 알림 해제 뮤테이션
   */
  const dismissAlertMutation = useMutation({
    mutationFn: async (alertId: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post(`/api/v1/monitoring/alerts/${alertId}/dismiss`)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: (_, alertId) => {
      // 로컬 상태에서 제거
      queryClient.setQueryData(["alerts"], (oldAlerts: Alert[] = []) =>
        oldAlerts.filter(alert => alert.id !== alertId)
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["alert-statistics"] });
    },
    onError: (error) => {
      console.error("알림 해제 실패:", error);
    },
  });

  /**
   * 알림 해결 뮤테이션
   */
  const markAsResolvedMutation = useMutation({
    mutationFn: async (alertId: string): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.post(`/api/v1/monitoring/alerts/${alertId}/resolve`)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: (_, alertId) => {
      // 로컬 상태 업데이트
      queryClient.setQueryData(["alerts"], (oldAlerts: Alert[] = []) =>
        oldAlerts.map(alert =>
          alert.id === alertId
            ? { ...alert, status: "resolved" as const }
            : alert
        )
      );
      
      // 통계 새로고침
      queryClient.invalidateQueries({ queryKey: ["alert-statistics"] });
    },
    onError: (error) => {
      console.error("알림 해결 실패:", error);
    },
  });

  /**
   * 알림 내보내기 뮤테이션
   */
  const exportAlertsMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // const response = await api.get('/api/v1/monitoring/alerts/export')
      // const blob = new Blob([response.data], { type: 'text/csv' })
      // const url = window.URL.createObjectURL(blob)
      // const link = document.createElement('a')
      // link.href = url
      // link.download = `alerts-${new Date().toISOString().split('T')[0]}.csv`
      // link.click()

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
    },
    onError: (error) => {
      console.error("알림 내보내기 실패:", error);
    },
  });

  /**
   * 알림 설정 업데이트 뮤테이션
   */
  const updateAlertSettingsMutation = useMutation({
    mutationFn: async (settings: AlertSettings): Promise<void> => {
      // TODO: 실제 API 호출로 교체
      // await api.put(`/api/v1/monitoring/alerts/settings/${settings.id}`, settings)

      // 목 데이터 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      // 설정 새로고침
      queryClient.invalidateQueries({ queryKey: ["alert-settings"] });
    },
    onError: (error) => {
      console.error("알림 설정 업데이트 실패:", error);
    },
  });

  return {
    // 데이터
    alerts,
    statistics,
    alertSettings,
    
    // 로딩 상태
    isLoading: isLoadingAlerts || isLoadingStatistics || isLoadingSettings,
    
    // 에러 상태
    error: alertsError,
    
    // 뮤테이션 함수들
    acknowledgeAlert: acknowledgeAlertMutation.mutateAsync,
    dismissAlert: dismissAlertMutation.mutateAsync,
    markAsResolved: markAsResolvedMutation.mutateAsync,
    exportAlerts: exportAlertsMutation.mutateAsync,
    updateAlertSettings: updateAlertSettingsMutation.mutateAsync,
    
    // 뮤테이션 상태
    isAcknowledging: acknowledgeAlertMutation.isPending,
    isDismissing: dismissAlertMutation.isPending,
    isResolving: markAsResolvedMutation.isPending,
    isExporting: exportAlertsMutation.isPending,
    isUpdatingSettings: updateAlertSettingsMutation.isPending,
  };
}
