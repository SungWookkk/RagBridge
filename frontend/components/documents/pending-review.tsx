"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  FileText,
  Image,
  File,
  CheckCircle,
  X,
  Eye,
  Download,
  AlertCircle,
  User,
  Calendar,
  Search,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Users,
  Shield,
  BarChart3,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePendingReview } from "@/hooks/use-pending-review";
import { useToast } from "@/hooks/use-toast";

/**
 * 검토 대기 문서 컴포넌트
 *
 * @description
 * - 승인이 필요한 문서 목록 표시
 * - 휴먼 검토 및 승인/거부 기능
 * - 검증 오류 및 수정 사항 표시
 * - 배치 승인 및 우선순위 관리
 */
export function PendingReview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    documents,
    statistics,
    isLoading,
    approveDocument,
    rejectDocument,
    requestRevision,
    batchApprove,
    batchReject,
  } = usePendingReview();

  /**
   * 필터링된 문서 목록
   */
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === "all" || doc.priority === selectedPriority;
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    
    return matchesSearch && matchesPriority && matchesCategory;
  });

  /**
   * 문서 승인 핸들러
   */
  const handleApproveDocument = async (documentId: string) => {
    try {
      await approveDocument(documentId);
      toast({
        title: "문서 승인 완료",
        description: "문서가 성공적으로 승인되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "문서 승인 실패",
        description: "문서 승인 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 문서 거부 핸들러
   */
  const handleRejectDocument = async (documentId: string, reason: string) => {
    try {
      await rejectDocument(documentId, reason);
      toast({
        title: "문서 거부 완료",
        description: "문서가 성공적으로 거부되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "문서 거부 실패",
        description: "문서 거부 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 문서 수정 요청 핸들러
   */
  const handleRequestRevision = async (documentId: string, comments: string) => {
    try {
      await requestRevision(documentId, comments);
      toast({
        title: "수정 요청 완료",
        description: "문서 수정 요청이 전송되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "수정 요청 실패",
        description: "문서 수정 요청 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 배치 승인 핸들러
   */
  const handleBatchApprove = async () => {
    if (selectedDocuments.length === 0) return;

    try {
      await batchApprove(selectedDocuments);
      toast({
        title: "배치 승인 완료",
        description: `${selectedDocuments.length}개 문서가 성공적으로 승인되었습니다.`,
      });
      setSelectedDocuments([]);
    } catch (error) {
      toast({
        title: "배치 승인 실패",
        description: "배치 승인 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 배치 거부 핸들러
   */
  const handleBatchReject = async (reason: string) => {
    if (selectedDocuments.length === 0) return;

    try {
      await batchReject(selectedDocuments, reason);
      toast({
        title: "배치 거부 완료",
        description: `${selectedDocuments.length}개 문서가 성공적으로 거부되었습니다.`,
      });
      setSelectedDocuments([]);
    } catch (error) {
      toast({
        title: "배치 거부 실패",
        description: "배치 거부 중 오류가 발생했습니다.",
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
    if (type.includes("image")) return <Image className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  /**
   * 우선순위 배지 색상 가져오기
   */
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">높음</Badge>;
      case "medium":
        return <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">중간</Badge>;
      case "low":
        return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">낮음</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">알 수 없음</Badge>;
    }
  };

  /**
   * 카테고리 배지 색상 가져오기
   */
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "validation":
        return <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">검증</Badge>;
      case "format":
        return <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">형식</Badge>;
      case "content":
        return <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">내용</Badge>;
      case "security":
        return <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">보안</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">기타</Badge>;
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
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8" />
                <h2 className="text-3xl font-bold">검토 대기</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                승인이 필요한 문서를 검토하고 승인 또는 거부하세요.
              </p>
            </div>
            <div className="flex gap-2">
              {selectedDocuments.length > 0 && (
                <>
                  <Button
                    className="w-fit rounded-2xl bg-white text-green-700 hover:bg-white/90"
                    onClick={handleBatchApprove}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    배치 승인 ({selectedDocuments.length})
                  </Button>
                  <Button
                    className="w-fit rounded-2xl bg-white text-red-700 hover:bg-white/90"
                    onClick={() => handleBatchReject("배치 거부")}
                  >
                    <X className="mr-2 h-4 w-4" />
                    배치 거부 ({selectedDocuments.length})
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
        <Card className="rounded-3xl border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              대기 중
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statistics.pending}
            </div>
            <p className="text-xs text-muted-foreground">
              검토 대기
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              높은 우선순위
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statistics.highPriority}
            </div>
            <p className="text-xs text-muted-foreground">
              긴급 검토
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              검토자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.reviewers}
            </div>
            <p className="text-xs text-muted-foreground">
              활성 검토자
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              평균 처리 시간
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statistics.averageProcessingTime}분
            </div>
            <p className="text-xs text-muted-foreground">
              검토 완료
            </p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* 메인 콘텐츠 */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="all" className="rounded-xl">전체</TabsTrigger>
          <TabsTrigger value="high" className="rounded-xl">높은 우선순위</TabsTrigger>
          <TabsTrigger value="validation" className="rounded-xl">검증 오류</TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl">보안 검토</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    검토 대기 문서
                  </CardTitle>
                  <CardDescription>
                    승인이 필요한 문서 목록입니다.
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
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-3 py-2 rounded-2xl border border-input bg-background"
                  >
                    <option value="all">전체 우선순위</option>
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
                    <option value="validation">검증</option>
                    <option value="format">형식</option>
                    <option value="content">내용</option>
                    <option value="security">보안</option>
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
                              {getPriorityBadge(doc.priority)}
                              {getCategoryBadge(doc.category)}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="rounded-xl">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedDocument(doc.id);
                                    setShowReviewModal(true);
                                  }}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    상세 보기
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => window.open(`/api/v1/documents/${doc.id}/download`)}>
                                    <Download className="mr-2 h-4 w-4" />
                                    다운로드
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* 검증 오류 표시 */}
                          {doc.validationErrors && doc.validationErrors.length > 0 && (
                            <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200">
                              <h5 className="font-medium text-red-800 mb-2">검증 오류</h5>
                              <ul className="space-y-1">
                                {doc.validationErrors.map((error, index) => (
                                  <li key={index} className="text-sm text-red-700">
                                    • {error}
                                  </li>
                                ))}
                              </ul>
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
                              <span>업로드: {doc.uploadedAt}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>대기: {doc.waitingTime}</span>
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
                              onClick={() => handleRequestRevision(doc.id, "수정이 필요합니다.")}
                              className="rounded-xl"
                            >
                              <Edit className="mr-2 h-3 w-3" />
                              수정 요청
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectDocument(doc.id, "검토 기준에 맞지 않습니다.")}
                              className="rounded-xl"
                            >
                              <ThumbsDown className="mr-2 h-3 w-3" />
                              거부
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApproveDocument(doc.id)}
                              className="rounded-xl"
                            >
                              <ThumbsUp className="mr-2 h-3 w-3" />
                              승인
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">검토 대기 문서가 없습니다</p>
                      <p className="text-sm">모든 문서가 검토 완료되었습니다.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="high" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                높은 우선순위 문서
              </CardTitle>
              <CardDescription>
                긴급하게 검토가 필요한 문서입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">높은 우선순위 문서가 없습니다</p>
                <p className="text-sm">모든 긴급 문서가 처리되었습니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                검증 오류 문서
              </CardTitle>
              <CardDescription>
                검증 과정에서 오류가 발생한 문서입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">검증 오류 문서가 없습니다</p>
                <p className="text-sm">모든 문서가 검증을 통과했습니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                보안 검토 문서
              </CardTitle>
              <CardDescription>
                보안 검토가 필요한 문서입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">보안 검토 문서가 없습니다</p>
                <p className="text-sm">모든 문서가 보안 검토를 통과했습니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 검토 모달 */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-4xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              문서 상세 검토
            </DialogTitle>
            <DialogDescription>
              문서의 상세 내용을 검토하고 승인 또는 거부하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedDocument && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-muted/30">
                  <h4 className="font-medium mb-2">문서 정보</h4>
                  <p className="text-sm text-muted-foreground">
                    문서 ID: {selectedDocument}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30">
                  <h4 className="font-medium mb-2">검토 내용</h4>
                  <p className="text-sm text-muted-foreground">
                    문서 내용이 여기에 표시됩니다.
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewModal(false)}
                    className="rounded-2xl"
                  >
                    취소
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleRejectDocument(selectedDocument, "검토 기준에 맞지 않습니다.");
                      setShowReviewModal(false);
                    }}
                    className="rounded-2xl"
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    거부
                  </Button>
                  <Button
                    onClick={() => {
                      handleApproveDocument(selectedDocument);
                      setShowReviewModal(false);
                    }}
                    className="rounded-2xl"
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    승인
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
