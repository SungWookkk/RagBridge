"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Search,
  Play,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Filter,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useReprocessingQueue } from "@/hooks/use-reprocessing-queue";
import { useToast } from "@/hooks/use-toast";

/**
 * 재처리 큐 컴포넌트
 *
 * @description
 * - 처리 실패한 문서들의 재처리 관리
 * - 큐 상태 모니터링 및 재처리 실행
 * - 실패 원인 분석 및 통계 제공
 */
export function ReprocessingQueue() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { toast } = useToast();

  const {
    queueItems,
    statistics,
    isLoading,
    reprocessDocument,
    reprocessAll,
    removeFromQueue,
    isReprocessing,
  } = useReprocessingQueue();

  /**
   * 필터링된 큐 아이템
   */
  const filteredItems = queueItems.filter((item) => {
    const matchesSearch = item.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.errorMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  /**
   * 재처리 실행 핸들러
   */
  const handleReprocess = async (documentId: string) => {
    try {
      await reprocessDocument(documentId);
      toast({
        title: "재처리 시작",
        description: "문서 재처리가 시작되었습니다.",
      });
    } catch (error) {
      toast({
        title: "재처리 실패",
        description: "문서 재처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 전체 재처리 핸들러
   */
  const handleReprocessAll = async () => {
    try {
      await reprocessAll();
      toast({
        title: "전체 재처리 시작",
        description: "모든 문서 재처리가 시작되었습니다.",
      });
    } catch (error) {
      toast({
        title: "전체 재처리 실패",
        description: "전체 재처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 큐에서 제거 핸들러
   */
  const handleRemoveFromQueue = async (documentId: string) => {
    try {
      await removeFromQueue(documentId);
      toast({
        title: "큐에서 제거",
        description: "문서가 재처리 큐에서 제거되었습니다.",
      });
    } catch (error) {
      toast({
        title: "제거 실패",
        description: "큐에서 제거 중 오류가 발생했습니다.",
        variant: "destructive",
      });
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
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-8 w-8" />
                <h2 className="text-3xl font-bold">재처리 큐 관리</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                처리 실패한 문서들을 재처리하고 큐 상태를 모니터링하세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="w-fit rounded-2xl bg-white text-orange-700 hover:bg-white/90"
                onClick={handleReprocessAll}
                disabled={isReprocessing || queueItems.length === 0}
              >
                <Play className="mr-2 h-4 w-4" />
                전체 재처리
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
              대기 중인 문서
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statistics.pending}
            </div>
            <p className="text-xs text-muted-foreground">
              재처리 대기 중
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-600" />
              재처리 중
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.processing}
            </div>
            <p className="text-xs text-muted-foreground">
              현재 재처리 중
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              재처리 완료
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statistics.completed}
            </div>
            <p className="text-xs text-muted-foreground">
              오늘 완료된 문서
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              평균 재처리 시간
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {statistics.avgProcessingTime}분
            </div>
            <p className="text-xs text-muted-foreground">
              최근 7일 평균
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 좌측: 큐 목록 */}
        <div className="lg:col-span-3">
          <Card className="rounded-3xl">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    재처리 큐
                  </CardTitle>
                  <CardDescription>
                    처리 실패한 문서 목록 및 재처리 상태
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="문서 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 rounded-2xl w-64"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 rounded-2xl border border-input bg-background"
                  >
                    <option value="all">전체 상태</option>
                    <option value="pending">대기 중</option>
                    <option value="processing">재처리 중</option>
                    <option value="failed">재처리 실패</option>
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
                  ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.01 }}
                        className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{item.documentName}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.uploadedAt} • {item.fileType}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`${
                                item.status === "pending"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : item.status === "processing"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }`}
                            >
                              {item.status === "pending" ? "대기 중" : 
                               item.status === "processing" ? "재처리 중" : "실패"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-xl"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-1">오류 메시지:</p>
                          <p className="text-sm bg-red-50 p-2 rounded-xl text-red-700">
                            {item.errorMessage}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>재시도 횟수: {item.retryCount}</span>
                            <span>•</span>
                            <span>마지막 시도: {item.lastAttempt}</span>
                          </div>
                          <div className="flex gap-2">
                            {item.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => handleReprocess(item.id)}
                                disabled={isReprocessing}
                                className="rounded-xl"
                              >
                                <Play className="mr-2 h-3 w-3" />
                                재처리
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveFromQueue(item.id)}
                              className="rounded-xl"
                            >
                              <Trash2 className="mr-2 h-3 w-3" />
                              제거
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <RefreshCw className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">재처리 큐가 비어있습니다</p>
                      <p className="text-sm">처리 실패한 문서가 없습니다.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 우측: 상세 정보 및 액션 */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {/* 큐 상태 요약 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg">큐 상태 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">전체 문서</span>
                    <span className="font-medium">{queueItems.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">대기 중</span>
                    <span className="font-medium text-yellow-600">{statistics.pending}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">재처리 중</span>
                    <span className="font-medium text-blue-600">{statistics.processing}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">실패</span>
                    <span className="font-medium text-red-600">{statistics.failed}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 빠른 액션 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg">빠른 액션</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full rounded-2xl"
                  onClick={handleReprocessAll}
                  disabled={isReprocessing || queueItems.length === 0}
                >
                  <Play className="mr-2 h-4 w-4" />
                  전체 재처리
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-2xl"
                  disabled={queueItems.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  큐 내보내기
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-2xl"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  필터 설정
                </Button>
              </CardContent>
            </Card>

            {/* 최근 활동 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg">최근 활동</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">문서 재처리 완료</p>
                      <p className="text-xs text-muted-foreground">2분 전</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">재처리 시작</p>
                      <p className="text-xs text-muted-foreground">5분 전</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-red-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">처리 실패</p>
                      <p className="text-xs text-muted-foreground">10분 전</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
