"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  X,
  Search,
  Settings,
  Download,
  Clock,
  Zap,
  Database,
  Cpu,
  Network,
  FileText,
  Users,
  Shield,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAlertCenter } from "@/hooks/use-alert-center";
import { useToast } from "@/hooks/use-toast";

/**
 * 알림 센터 컴포넌트
 *
 * @description
 * - 시스템 알림 및 오류 메시지 관리
 * - 알림 설정 및 필터링
 * - 알림 히스토리 및 통계
 */
export function AlertCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("active");
  const { toast } = useToast();

  const {
    alerts,
    statistics,
    isLoading,
    acknowledgeAlert,
    dismissAlert,
    markAsResolved,
    exportAlerts,
  } = useAlertCenter();

  /**
   * 필터링된 알림 목록
   */
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === "all" || alert.severity === selectedSeverity;
    const matchesCategory = selectedCategory === "all" || alert.category === selectedCategory;
    const matchesStatus = activeTab === "all" || 
                         (activeTab === "active" && alert.status === "active") ||
                         (activeTab === "acknowledged" && alert.status === "acknowledged") ||
                         (activeTab === "resolved" && alert.status === "resolved");
    
    return matchesSearch && matchesSeverity && matchesCategory && matchesStatus;
  });

  /**
   * 알림 확인 핸들러
   */
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await acknowledgeAlert(alertId);
      toast({
        title: "알림 확인 완료",
        description: "알림이 성공적으로 확인되었습니다.",
      });
    } catch (error) {
      toast({
        title: "알림 확인 실패",
        description: "알림 확인 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 알림 해제 핸들러
   */
  const handleDismissAlert = async (alertId: string) => {
    try {
      await dismissAlert(alertId);
      toast({
        title: "알림 해제 완료",
        description: "알림이 성공적으로 해제되었습니다.",
      });
    } catch (error) {
      toast({
        title: "알림 해제 실패",
        description: "알림 해제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 알림 해결 핸들러
   */
  const handleMarkAsResolved = async (alertId: string) => {
    try {
      await markAsResolved(alertId);
      toast({
        title: "알림 해결 완료",
        description: "알림이 성공적으로 해결되었습니다.",
      });
    } catch (error) {
      toast({
        title: "알림 해결 실패",
        description: "알림 해결 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 알림 내보내기 핸들러
   */
  const handleExportAlerts = async () => {
    try {
      await exportAlerts();
      toast({
        title: "알림 내보내기 완료",
        description: "알림 목록이 성공적으로 내보내기되었습니다.",
      });
    } catch (error) {
      toast({
        title: "알림 내보내기 실패",
        description: "알림 내보내기 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 카테고리 아이콘 가져오기
   */
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "system":
        return <Cpu className="h-4 w-4" />;
      case "performance":
        return <Zap className="h-4 w-4" />;
      case "database":
        return <Database className="h-4 w-4" />;
      case "network":
        return <Network className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "user":
        return <Users className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
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
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Bell className="h-8 w-8" />
                <h2 className="text-3xl font-bold">알림 센터</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                시스템 알림과 오류 메시지를 관리하고 모니터링하세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="w-fit rounded-2xl bg-white text-red-700 hover:bg-white/90"
                onClick={handleExportAlerts}
              >
                <Download className="mr-2 h-4 w-4" />
                내보내기
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              활성 알림
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statistics.active}
            </div>
            <p className="text-xs text-muted-foreground">
              확인 필요
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              확인됨
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statistics.acknowledged}
            </div>
            <p className="text-xs text-muted-foreground">
              처리 중
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              해결됨
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statistics.resolved}
            </div>
            <p className="text-xs text-muted-foreground">
              오늘 해결
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" />
              총 알림
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.total}
            </div>
            <p className="text-xs text-muted-foreground">
              이번 주
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 콘텐츠 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="active" className="rounded-xl">활성 알림</TabsTrigger>
          <TabsTrigger value="acknowledged" className="rounded-xl">확인됨</TabsTrigger>
          <TabsTrigger value="resolved" className="rounded-xl">해결됨</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    활성 알림
                  </CardTitle>
                  <CardDescription>
                    확인이 필요한 알림 목록입니다.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="알림 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 rounded-2xl w-64"
                    />
                  </div>
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="px-3 py-2 rounded-2xl border border-input bg-background"
                  >
                    <option value="all">전체 심각도</option>
                    <option value="high">높음</option>
                    <option value="medium">중간</option>
                    <option value="low">낮음</option>
                  </select>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 rounded-2xl border border-input bg-background"
                  >
                    <option value="all">전체 카테고리</option>
                    <option value="system">시스템</option>
                    <option value="performance">성능</option>
                    <option value="database">데이터베이스</option>
                    <option value="network">네트워크</option>
                    <option value="security">보안</option>
                    <option value="document">문서</option>
                    <option value="user">사용자</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-2xl bg-muted/30 animate-pulse"
                      >
                        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    ))
                  ) : filteredAlerts.length > 0 ? (
                    filteredAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        whileHover={{ scale: 1.01 }}
                        className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                              alert.severity === "high" ? "bg-red-100" :
                              alert.severity === "medium" ? "bg-yellow-100" : "bg-blue-100"
                            }`}>
                              {getCategoryIcon(alert.category)}
                            </div>
                            <div>
                              <h4 className="font-medium">{alert.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {alert.message}
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
                            <Badge variant="outline" className="text-xs">
                              {alert.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{alert.timestamp}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bell className="h-3 w-3" />
                              <span>알림 ID: {alert.id}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                              className="rounded-xl"
                            >
                              <Eye className="mr-2 h-3 w-3" />
                              확인
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsResolved(alert.id)}
                              className="rounded-xl"
                            >
                              <CheckCircle className="mr-2 h-3 w-3" />
                              해결
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDismissAlert(alert.id)}
                              className="rounded-xl"
                            >
                              <X className="mr-2 h-3 w-3" />
                              해제
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Bell className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">활성 알림이 없습니다</p>
                      <p className="text-sm">모든 알림이 확인되었습니다.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acknowledged" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                확인된 알림
              </CardTitle>
              <CardDescription>
                확인되었지만 아직 해결되지 않은 알림입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">확인된 알림이 없습니다</p>
                <p className="text-sm">모든 알림이 해결되었습니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                해결된 알림
              </CardTitle>
              <CardDescription>
                성공적으로 해결된 알림 목록입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">해결된 알림이 없습니다</p>
                <p className="text-sm">최근에 해결된 알림이 없습니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                알림 설정
              </CardTitle>
              <CardDescription>
                알림 수신 설정을 관리하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">시스템 알림</h4>
                      <p className="text-sm text-muted-foreground">시스템 오류 및 경고 알림</p>
                    </div>
                    <Badge variant="outline" className="text-xs">활성</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-xl">
                      <Settings className="mr-2 h-3 w-3" />
                      설정
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">성능 알림</h4>
                      <p className="text-sm text-muted-foreground">성능 지표 임계값 초과 알림</p>
                    </div>
                    <Badge variant="outline" className="text-xs">활성</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-xl">
                      <Settings className="mr-2 h-3 w-3" />
                      설정
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">보안 알림</h4>
                      <p className="text-sm text-muted-foreground">보안 관련 이벤트 알림</p>
                    </div>
                    <Badge variant="outline" className="text-xs">활성</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-xl">
                      <Settings className="mr-2 h-3 w-3" />
                      설정
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
