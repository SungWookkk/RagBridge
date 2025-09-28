"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  Search,
  Clock,
  User,
  BarChart3,
  TrendingUp,
  Download,
  Trash2,
  Eye,
  Star,
  Copy,
  Zap,
  Target,
  BookOpen,
  MessageSquare,
  FileText,
  Image,
  File,
  MoreHorizontal,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSearchHistory, SearchHistoryItem } from "@/hooks/use-search-history";
import { useToast } from "@/hooks/use-toast";

/**
 * 검색 기록 컴포넌트
 *
 * @description
 * - 이전 검색 결과 및 히스토리 표시
 * - 검색 통계 및 분석 정보
 * - 검색 패턴 및 트렌드 분석
 * - 검색 기록 관리 및 내보내기
 */
export function SearchHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, ] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast } = useToast();

  const {
    searchHistory,
    statistics,
    isLoading,
    deleteHistoryItem,
    clearHistory,
    exportHistory,
    getHistoryItem,
    saveToFavorites,
  } = useSearchHistory();

  /**
   * 필터링된 검색 기록
   */
  const filteredHistory = searchHistory.filter((item) => {
    const matchesSearch = item.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDateRange = selectedDateRange === "all" || 
                            (selectedDateRange === "today" && isToday(item.timestamp)) ||
                            (selectedDateRange === "week" && isThisWeek(item.timestamp)) ||
                            (selectedDateRange === "month" && isThisMonth(item.timestamp));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    
    return matchesSearch && matchesDateRange && matchesCategory && matchesStatus;
  });

  /**
   * 날짜 범위 확인 함수들
   */
  const isToday = (dateString: string): boolean => {
    const today = new Date().toDateString();
    const itemDate = new Date(dateString).toDateString();
    return today === itemDate;
  };

  const isThisWeek = (dateString: string): boolean => {
    const now = new Date();
    const itemDate = new Date(dateString);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return itemDate >= weekAgo;
  };

  const isThisMonth = (dateString: string): boolean => {
    const now = new Date();
    const itemDate = new Date(dateString);
    return now.getMonth() === itemDate.getMonth() && now.getFullYear() === itemDate.getFullYear();
  };

  /**
   * 검색 기록 삭제 핸들러
   */
  const handleDeleteHistoryItem = async (itemId: string) => {
    try {
      await deleteHistoryItem(itemId);
      toast({
        title: "삭제 완료",
        description: "검색 기록이 삭제되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "검색 기록 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 검색 기록 전체 삭제 핸들러
   */
  const handleClearHistory = async () => {
    try {
      await clearHistory();
      toast({
        title: "전체 삭제 완료",
        description: "모든 검색 기록이 삭제되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "전체 삭제 실패",
        description: "검색 기록 전체 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 검색 기록 내보내기 핸들러
   */
  const handleExportHistory = async () => {
    try {
      await exportHistory();
      toast({
        title: "내보내기 완료",
        description: "검색 기록이 성공적으로 내보내기되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "내보내기 실패",
        description: "검색 기록 내보내기 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 즐겨찾기 추가 핸들러
   */
  const handleSaveToFavorites = async (item: SearchHistoryItem) => {
    try {
      await saveToFavorites(item.query, item.answer);
      toast({
        title: "즐겨찾기 추가",
        description: "검색 결과가 즐겨찾기에 추가되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "즐겨찾기 추가 실패",
        description: "즐겨찾기 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 아이템 선택 토글
   */
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  /**
   * 전체 선택 토글
   */
  const toggleAllSelection = () => {
    if (selectedItems.length === filteredHistory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredHistory.map(item => item.id));
    }
  };

  /**
   * 카테고리 아이콘 가져오기
   */
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "계약서":
        return <FileText className="h-4 w-4" />;
      case "프로젝트":
        return <Target className="h-4 w-4" />;
      case "보고서":
        return <BarChart3 className="h-4 w-4" />;
      case "매뉴얼":
        return <BookOpen className="h-4 w-4" />;
      case "이미지":
        return <Image className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  /**
   * 상태 배지 색상 가져오기
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">성공</Badge>;
      case "partial":
        return <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">부분</Badge>;
      case "failed":
        return <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">실패</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">알 수 없음</Badge>;
    }
  };

  /**
   * 신뢰도 색상 가져오기
   */
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 70) return "text-yellow-600";
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
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <History className="h-8 w-8" />
                <h2 className="text-3xl font-bold">검색 기록</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                이전 검색 결과와 히스토리를 확인하고 분석하세요.
              </p>
            </div>
            <div className="flex gap-2">
              {selectedItems.length > 0 && (
                <>
                  <Button
                    className="w-fit rounded-2xl bg-white text-green-700 hover:bg-white/90"
                    onClick={handleExportHistory}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    내보내기 ({selectedItems.length})
                  </Button>
                  <Button
                    className="w-fit rounded-2xl bg-white text-red-700 hover:bg-white/90"
                    onClick={() => {
                      selectedItems.forEach(id => handleDeleteHistoryItem(id));
                      setSelectedItems([]);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    삭제 ({selectedItems.length})
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-600" />
              총 검색 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.totalSearches}
            </div>
            <p className="text-xs text-muted-foreground">
              전체 검색 횟수
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              성공률
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statistics.successRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              성공한 검색
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              평균 응답 시간
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statistics.averageResponseTime}초
            </div>
            <p className="text-xs text-muted-foreground">
              검색당 평균
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              인기 카테고리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {statistics.mostPopularCategory}
            </div>
            <p className="text-xs text-muted-foreground">
              가장 많이 검색
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 콘텐츠 */}
      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl">
          <TabsTrigger value="history" className="rounded-xl">검색 기록</TabsTrigger>
          <TabsTrigger value="statistics" className="rounded-xl">통계</TabsTrigger>
          <TabsTrigger value="trends" className="rounded-xl">트렌드</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    검색 기록
                  </CardTitle>
                  <CardDescription>
                    이전 검색 결과와 히스토리입니다.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="검색 기록 검색..."
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
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 rounded-2xl border border-input bg-background"
                  >
                    <option value="all">전체 카테고리</option>
                    <option value="계약서">계약서</option>
                    <option value="프로젝트">프로젝트</option>
                    <option value="보고서">보고서</option>
                    <option value="매뉴얼">매뉴얼</option>
                    <option value="이미지">이미지</option>
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
                  ) : filteredHistory.length > 0 ? (
                    <>
                      {/* 전체 선택 체크박스 */}
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === filteredHistory.length}
                          onChange={toggleAllSelection}
                          className="rounded"
                        />
                        <span className="text-sm font-medium">
                          전체 선택 ({selectedItems.length}/{filteredHistory.length})
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearHistory}
                          className="rounded-xl ml-auto"
                        >
                          <Trash2 className="mr-2 h-3 w-3" />
                          전체 삭제
                        </Button>
                      </div>

                      {filteredHistory.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.01 }}
                          className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleItemSelection(item.id)}
                                className="rounded"
                              />
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100">
                                {getCategoryIcon(item.category)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{item.query}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {item.answer}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(item.status)}
                              <Badge variant="outline" className="text-xs">
                                신뢰도: <span className={getConfidenceColor(item.confidence)}>{item.confidence}%</span>
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="rounded-xl">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => getHistoryItem(item.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    상세 보기
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSaveToFavorites(item)}>
                                    <Star className="mr-2 h-4 w-4" />
                                    즐겨찾기 추가
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.answer)}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    답변 복사
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteHistoryItem(item.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    삭제
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* 검색 정보 */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{item.timestamp}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{item.user}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MessageSquare className="h-3 w-3" />
                              <span>결과: {item.resultCount}개</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Zap className="h-3 w-3" />
                              <span>응답: {item.responseTime}초</span>
                            </div>
                          </div>

                          {/* 액션 버튼 */}
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => getHistoryItem(item.id)}
                              className="rounded-xl"
                            >
                              <Eye className="mr-2 h-3 w-3" />
                              상세 보기
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSaveToFavorites(item)}
                              className="rounded-xl"
                            >
                              <Star className="mr-2 h-3 w-3" />
                              즐겨찾기
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => navigator.clipboard.writeText(item.answer)}
                              className="rounded-xl"
                            >
                              <Copy className="mr-2 h-3 w-3" />
                              복사
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">검색 기록이 없습니다</p>
                      <p className="text-sm">아직 검색 기록이 없습니다.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                검색 통계
              </CardTitle>
              <CardDescription>
                검색 사용량 및 성능 통계입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">통계 데이터 준비 중</p>
                <p className="text-sm">검색 통계 차트가 여기에 표시됩니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                검색 트렌드
              </CardTitle>
              <CardDescription>
                검색 패턴 및 트렌드 분석입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">트렌드 데이터 준비 중</p>
                <p className="text-sm">검색 트렌드 차트가 여기에 표시됩니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
