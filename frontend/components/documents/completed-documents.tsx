"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  FileText,
  Image,
  File,
  Download,
  Share,
  Eye,
  Search,
  Calendar,
  User,
  Clock,
  BarChart3,
  Zap,
  Shield,
  Star,
  MoreHorizontal,
  Archive,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCompletedDocuments } from "@/hooks/use-completed-documents";
import { useToast } from "@/hooks/use-toast";

/**
 * 완료된 문서 컴포넌트
 *
 * @description
 * - 처리 완료된 문서 목록 표시
 * - 문서 검색 및 필터링 기능
 * - 문서 다운로드, 공유, 미리보기 기능
 * - 처리 결과 및 통계 정보 표시
 */
export function CompletedDocuments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const { toast } = useToast();

  const {
    documents,
    statistics,
    isLoading,
    downloadDocument,
    shareDocument,
    archiveDocument,
    deleteDocument,
    getDocumentPreview,
  } = useCompletedDocuments();

  /**
   * 필터링된 문서 목록
   */
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDateRange = selectedDateRange === "all" || 
                            (selectedDateRange === "today" && isToday(doc.completedAt)) ||
                            (selectedDateRange === "week" && isThisWeek(doc.completedAt)) ||
                            (selectedDateRange === "month" && isThisMonth(doc.completedAt));
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;
    
    return matchesSearch && matchesDateRange && matchesStatus;
  });

  /**
   * 날짜 범위 확인 함수들
   */
  const isToday = (dateString: string): boolean => {
    const today = new Date().toDateString();
    const docDate = new Date(dateString).toDateString();
    return today === docDate;
  };

  const isThisWeek = (dateString: string): boolean => {
    const now = new Date();
    const docDate = new Date(dateString);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return docDate >= weekAgo;
  };

  const isThisMonth = (dateString: string): boolean => {
    const now = new Date();
    const docDate = new Date(dateString);
    return now.getMonth() === docDate.getMonth() && now.getFullYear() === docDate.getFullYear();
  };

  /**
   * 문서 다운로드 핸들러
   */
  const handleDownloadDocument = async (documentId: string) => {
    try {
      await downloadDocument(documentId);
      toast({
        title: "다운로드 시작",
        description: "문서 다운로드가 시작되었습니다.",
        variant: "info",
      });
    } catch (error) {
      console.error("문서 다운로드 실패:", error);
      toast({
        title: "다운로드 실패",
        description: "문서 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 문서 공유 핸들러
   */
  const handleShareDocument = async (documentId: string) => {
    try {
      const shareUrl = await shareDocument(documentId);
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "공유 링크 복사",
        description: "문서 공유 링크가 클립보드에 복사되었습니다.",
        variant: "success",
      });
    } catch (error) {
      console.error("문서 공유 실패:", error);
      toast({
        title: "공유 실패",
        description: "문서 공유 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 문서 아카이브 핸들러
   */
  const handleArchiveDocument = async (documentId: string) => {
    try {
      await archiveDocument(documentId);
      toast({
        title: "아카이브 완료",
        description: "문서가 아카이브되었습니다.",
        variant: "success",
      });
    } catch (error) {
      console.error("문서 아카이브 실패:", error);
      toast({
        title: "아카이브 실패",
        description: "문서 아카이브 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 문서 삭제 핸들러
   */
  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      toast({
        title: "삭제 완료",
        description: "문서가 삭제되었습니다.",
        variant: "success",
      });
    } catch (error) {
      console.error("문서 삭제 실패:", error);
      toast({
        title: "삭제 실패",
        description: "문서 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 문서 선택 토글
   */
  const toggleDocumentSelection = (documentId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  /**
   * 전체 선택 토글
   */
  const toggleAllSelection = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  /**
   * 파일 타입 아이콘 가져오기
   */
  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="h-4 w-4" />;
    if (type.includes("word")) return <FileText className="h-4 w-4" />;
    if (type.includes("image")) return <Image className="h-4 w-4" alt="" />;
    return <File className="h-4 w-4" />;
  };

  /**
   * 상태 배지 색상 가져오기
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">완료</Badge>;
      case "archived":
        return <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">아카이브</Badge>;
      case "shared":
        return <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">공유됨</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">알 수 없음</Badge>;
    }
  };

  /**
   * 품질 점수 색상 가져오기
   */
  const getQualityColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8" />
                <h2 className="text-3xl font-bold">완료된 문서</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                처리 완료된 문서를 검색하고 관리하세요.
              </p>
            </div>
            <div className="flex gap-2">
              {selectedDocuments.length > 0 && (
                <>
                  <Button
                    className="w-fit rounded-2xl bg-white text-green-700 hover:bg-white/90"
                    onClick={() => {
                      selectedDocuments.forEach(id => handleDownloadDocument(id));
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    배치 다운로드 ({selectedDocuments.length})
                  </Button>
                  <Button
                    className="w-fit rounded-2xl bg-white text-blue-700 hover:bg-white/90"
                    onClick={() => {
                      selectedDocuments.forEach(id => handleArchiveDocument(id));
                    }}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    배치 아카이브 ({selectedDocuments.length})
                  </Button>
                </>
              )}
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
        <Card className="rounded-3xl border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              완료된 문서
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statistics.completed}
            </div>
            <p className="text-xs text-muted-foreground">
              총 완료 문서
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              평균 처리 시간
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.averageProcessingTime}분
            </div>
            <p className="text-xs text-muted-foreground">
              문서당 평균
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              평균 품질 점수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statistics.averageQualityScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              OCR 정확도
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              보안 등급
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {statistics.securityCompliance}%
            </div>
            <p className="text-xs text-muted-foreground">
              보안 준수율
            </p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* 메인 콘텐츠 */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="all" className="rounded-xl">전체</TabsTrigger>
          <TabsTrigger value="recent" className="rounded-xl">최근</TabsTrigger>
          <TabsTrigger value="archived" className="rounded-xl">아카이브</TabsTrigger>
          <TabsTrigger value="shared" className="rounded-xl">공유됨</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    완료된 문서
                  </CardTitle>
                  <CardDescription>
                    처리 완료된 문서 목록입니다.
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
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className="px-3 py-2 rounded-2xl border border-input bg-background"
                  >
                    <option value="all">전체 기간</option>
                    <option value="today">오늘</option>
                    <option value="week">이번 주</option>
                    <option value="month">이번 달</option>
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 rounded-2xl border border-input bg-background"
                  >
                    <option value="all">전체 상태</option>
                    <option value="completed">완료</option>
                    <option value="archived">아카이브</option>
                    <option value="shared">공유됨</option>
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
                    <>
                      {/* 전체 선택 체크박스 */}
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.length === filteredDocuments.length}
                          onChange={toggleAllSelection}
                          className="rounded"
                        />
                        <span className="text-sm font-medium">
                          전체 선택 ({selectedDocuments.length}/{filteredDocuments.length})
                        </span>
                      </div>

                      {filteredDocuments.map((doc) => (
                        <motion.div
                          key={doc.id}
                          whileHover={{ scale: 1.01 }}
                          className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedDocuments.includes(doc.id)}
                                onChange={() => toggleDocumentSelection(doc.id)}
                                className="rounded"
                              />
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
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
                              <Badge variant="outline" className="text-xs">
                                품질: <span className={getQualityColor(doc.qualityScore)}>{doc.qualityScore}%</span>
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="rounded-xl">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => getDocumentPreview(doc.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    미리보기
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDownloadDocument(doc.id)}>
                                    <Download className="mr-2 h-4 w-4" />
                                    다운로드
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleShareDocument(doc.id)}>
                                    <Share className="mr-2 h-4 w-4" />
                                    공유
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleArchiveDocument(doc.id)}>
                                    <Archive className="mr-2 h-4 w-4" />
                                    아카이브
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    삭제
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* 문서 태그 */}
                          {doc.tags.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-1">
                                {doc.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 문서 정보 */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>업로더: {doc.uploader}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>완료: {doc.completedAt}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>처리 시간: {doc.processingTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Shield className="h-3 w-3" />
                              <span>보안: {doc.securityLevel}</span>
                            </div>
                          </div>

                          {/* 액션 버튼 */}
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => getDocumentPreview(doc.id)}
                              className="rounded-xl"
                            >
                              <Eye className="mr-2 h-3 w-3" />
                              미리보기
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShareDocument(doc.id)}
                              className="rounded-xl"
                            >
                              <Share className="mr-2 h-3 w-3" />
                              공유
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDownloadDocument(doc.id)}
                              className="rounded-xl"
                            >
                              <Download className="mr-2 h-3 w-3" />
                              다운로드
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">완료된 문서가 없습니다</p>
                      <p className="text-sm">처리 완료된 문서가 없습니다.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                최근 완료된 문서
              </CardTitle>
              <CardDescription>
                최근 7일 내에 완료된 문서입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">최근 완료된 문서가 없습니다</p>
                <p className="text-sm">최근 7일 내에 완료된 문서가 없습니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                아카이브된 문서
              </CardTitle>
              <CardDescription>
                아카이브된 문서 목록입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Archive className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">아카이브된 문서가 없습니다</p>
                <p className="text-sm">아카이브된 문서가 없습니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share className="h-5 w-5" />
                공유된 문서
              </CardTitle>
              <CardDescription>
                공유된 문서 목록입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Share className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">공유된 문서가 없습니다</p>
                <p className="text-sm">공유된 문서가 없습니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
