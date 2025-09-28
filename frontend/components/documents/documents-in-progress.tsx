"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  FileText,
  Image,
  File,
  RefreshCw,
  Pause,
  Play,
  X,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  Zap,
  BarChart3,
  Search,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDocumentsInProgress } from "@/hooks/use-documents-in-progress";
import { useToast } from "@/hooks/use-toast";

/**
 * 진행 중인 문서 컴포넌트
 *
 * @description
 * - 현재 처리 중인 문서 현황 표시
 * - OCR 및 검증 진행률 실시간 업데이트
 * - 처리 중단, 재시도, 취소 기능
 * - 문서별 상세 정보 및 로그 표시
 */
export function DocumentsInProgress() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus,] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const { toast } = useToast();

  const {
    documents,
    statistics,
    isLoading,
    pauseProcessing,
    resumeProcessing,
    retryProcessing,
    cancelProcessing,
    getDocumentLogs,
  } = useDocumentsInProgress();

  /**
   * 필터링된 문서 목록
   */
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;
    const matchesStage = selectedStage === "all" || doc.currentStage === selectedStage;
    
    return matchesSearch && matchesStatus && matchesStage;
  });

  /**
   * 처리 중단 핸들러
   */
  const handlePauseProcessing = async (documentId: string) => {
    try {
      await pauseProcessing(documentId);
      toast({
        title: "처리 중단",
        description: "문서 처리가 중단되었습니다.",
      });
    } catch (error) {
      toast({
        title: "처리 중단 실패",
        description: "문서 처리 중단 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 처리 재개 핸들러
   */
  const handleResumeProcessing = async (documentId: string) => {
    try {
      await resumeProcessing(documentId);
      toast({
        title: "처리 재개",
        description: "문서 처리가 재개되었습니다.",
      });
    } catch (error) {
      toast({
        title: "처리 재개 실패",
        description: "문서 처리 재개 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 처리 재시도 핸들러
   */
  const handleRetryProcessing = async (documentId: string) => {
    try {
      await retryProcessing(documentId);
      toast({
        title: "처리 재시도",
        description: "문서 처리를 재시도합니다.",
      });
    } catch (error) {
      toast({
        title: "처리 재시도 실패",
        description: "문서 처리 재시도 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 처리 취소 핸들러
   */
  const handleCancelProcessing = async (documentId: string) => {
    try {
      await cancelProcessing(documentId);
      toast({
        title: "처리 취소",
        description: "문서 처리가 취소되었습니다.",
      });
    } catch (error) {
      toast({
        title: "처리 취소 실패",
        description: "문서 처리 취소 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 파일 타입 아이콘 가져오기
   */
  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="h-4 w-4" />;
    if (type.includes("word")) return <FileText className="h-4 w-4" />;
    if (type.includes("image")) return <Image className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  /**
   * 상태 배지 색상 가져오기
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">처리 중</Badge>;
      case "paused":
        return <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">일시정지</Badge>;
      case "failed":
        return <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">실패</Badge>;
      case "retrying":
        return <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">재시도</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">알 수 없음</Badge>;
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
                <Clock className="h-8 w-8" />
                <h2 className="text-3xl font-bold">진행 중인 문서</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                현재 처리 중인 문서의 실시간 상태와 진행률을 확인하세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="w-fit rounded-2xl bg-white text-orange-700 hover:bg-white/90"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                새로고침
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 통계 카드 */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-3xl">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted animate-pulse rounded w-20" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded w-16 mb-2" />
                <div className="h-3 bg-muted animate-pulse rounded w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              처리 중
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.processing}
            </div>
            <p className="text-xs text-muted-foreground">
              활성 작업
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Pause className="h-4 w-4 text-yellow-600" />
              일시정지
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statistics.paused}
            </div>
            <p className="text-xs text-muted-foreground">
              대기 중
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              실패
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statistics.failed}
            </div>
            <p className="text-xs text-muted-foreground">
              재시도 필요
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              완료율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statistics.completionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              평균 완료율
            </p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* 메인 콘텐츠 */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="all" className="rounded-xl">전체</TabsTrigger>
          <TabsTrigger value="processing" className="rounded-xl">처리 중</TabsTrigger>
          <TabsTrigger value="paused" className="rounded-xl">일시정지</TabsTrigger>
          <TabsTrigger value="failed" className="rounded-xl">실패</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    진행 중인 문서
                  </CardTitle>
                  <CardDescription>
                    현재 처리 중인 문서의 상태와 진행률을 확인하세요.
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
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="px-3 py-2 rounded-2xl border border-input bg-background"
                  >
                    <option value="all">전체 단계</option>
                    <option value="upload">업로드</option>
                    <option value="ocr">OCR</option>
                    <option value="validation">검증</option>
                    <option value="indexing">인덱싱</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
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
                  ) : filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <motion.div
                        key={doc.id}
                        whileHover={{ scale: 1.01 }}
                        className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                              {getFileIcon(doc.type)}
                            </div>
                            <div>
                              <h4 className="font-medium">{doc.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                ID: {doc.id} • {doc.size} bytes
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(doc.status)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="rounded-xl">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => getDocumentLogs(doc.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  로그 보기
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open(`/api/v1/documents/${doc.id}/download`)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  다운로드
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* 진행률 표시 */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">전체 진행률</span>
                            <span className="font-medium">{doc.overallProgress}%</span>
                          </div>
                          <Progress value={doc.overallProgress} className="h-2" />
                          
                          {/* 단계별 진행률 */}
                          <div className="grid grid-cols-4 gap-2">
                            {doc.stages.map((stage, index) => (
                              <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">{stage.name}</span>
                                  <span className="font-medium">{stage.progress}%</span>
                                </div>
                                <Progress 
                                  value={stage.progress} 
                                  className="h-1"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 액션 버튼 */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>시작: {doc.startedAt}</span>
                            {doc.estimatedCompletion && (
                              <>
                                <span>•</span>
                                <span>예상 완료: {doc.estimatedCompletion}</span>
                              </>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {doc.status === "processing" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePauseProcessing(doc.id)}
                                className="rounded-xl"
                              >
                                <Pause className="mr-2 h-3 w-3" />
                                일시정지
                              </Button>
                            )}
                            {doc.status === "paused" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResumeProcessing(doc.id)}
                                className="rounded-xl"
                              >
                                <Play className="mr-2 h-3 w-3" />
                                재개
                              </Button>
                            )}
                            {doc.status === "failed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRetryProcessing(doc.id)}
                                className="rounded-xl"
                              >
                                <RefreshCw className="mr-2 h-3 w-3" />
                                재시도
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelProcessing(doc.id)}
                              className="rounded-xl"
                            >
                              <X className="mr-2 h-3 w-3" />
                              취소
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">진행 중인 문서가 없습니다</p>
                      <p className="text-sm">모든 문서 처리가 완료되었습니다.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                처리 중인 문서
              </CardTitle>
              <CardDescription>
                현재 활발히 처리되고 있는 문서입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Zap className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">처리 중인 문서가 없습니다</p>
                <p className="text-sm">모든 문서가 처리 완료되었습니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paused" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pause className="h-5 w-5" />
                일시정지된 문서
              </CardTitle>
              <CardDescription>
                처리가 일시정지된 문서입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Pause className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">일시정지된 문서가 없습니다</p>
                <p className="text-sm">모든 문서가 정상적으로 처리되고 있습니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                실패한 문서
              </CardTitle>
              <CardDescription>
                처리 중 오류가 발생한 문서입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">실패한 문서가 없습니다</p>
                <p className="text-sm">모든 문서가 성공적으로 처리되었습니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
