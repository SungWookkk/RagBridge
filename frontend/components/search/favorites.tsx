"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Search,
  Tag,
  Calendar,
  User,
  BarChart3,
  Download,
  Share,
  Trash2,
  Edit,
  Copy,
  Bookmark,
  Heart,
  Zap,
  Target,
  BookOpen,
  MessageSquare,
  FileText,
  Image,
  File,
  MoreHorizontal,
  X,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useFavorites } from "@/hooks/use-favorites";
import { useToast } from "@/hooks/use-toast";

/**
 * 즐겨찾기 컴포넌트
 *
 * @description
 * - 자주 사용하는 검색 결과 관리
 * - 즐겨찾기 분류 및 태그 관리
 * - 즐겨찾기 검색 및 필터링
 * - 즐겨찾기 공유 및 내보내기
 */
export function Favorites() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const {
    favorites,
    categories,
    tags,
    statistics,
    isLoading,
    removeFavorite,
    clearFavorites,
    exportFavorites,
    shareFavorite,
    addTag,
    removeTag,
  } = useFavorites();

  /**
   * 필터링된 즐겨찾기 목록
   */
  const filteredFavorites = favorites.filter((item) => {
    const matchesSearch = item.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => item.tags.includes(tag));
    const matchesTab = activeTab === "all" || 
                      (activeTab === "recent" && isRecent(item.savedAt)) ||
                      (activeTab === "popular" && item.accessCount > 5);
    
    return matchesSearch && matchesCategory && matchesTags && matchesTab;
  });

  /**
   * 최근 추가된 항목 확인
   */
  const isRecent = (dateString: string): boolean => {
    const now = new Date();
    const itemDate = new Date(dateString);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return itemDate >= weekAgo;
  };

  /**
   * 즐겨찾기 제거 핸들러
   */
  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await removeFavorite(favoriteId);
      toast({
        title: "즐겨찾기 제거",
        description: "즐겨찾기에서 제거되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "즐겨찾기 제거 실패",
        description: "즐겨찾기 제거 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 즐겨찾기 전체 삭제 핸들러
   */
  const handleClearFavorites = async () => {
    try {
      await clearFavorites();
      toast({
        title: "전체 삭제 완료",
        description: "모든 즐겨찾기가 삭제되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "전체 삭제 실패",
        description: "즐겨찾기 전체 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 즐겨찾기 내보내기 핸들러
   */
  const handleExportFavorites = async () => {
    try {
      await exportFavorites();
      toast({
        title: "내보내기 완료",
        description: "즐겨찾기가 성공적으로 내보내기되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "내보내기 실패",
        description: "즐겨찾기 내보내기 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 즐겨찾기 공유 핸들러
   */
  const handleShareFavorite = async (favoriteId: string) => {
    try {
      const shareUrl = await shareFavorite(favoriteId);
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "공유 링크 복사",
        description: "즐겨찾기 공유 링크가 클립보드에 복사되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "공유 실패",
        description: "즐겨찾기 공유 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 태그 추가 핸들러
   */
  const handleAddTag = async (favoriteId: string, tag: string) => {
    try {
      await addTag(favoriteId, tag);
      toast({
        title: "태그 추가",
        description: "태그가 추가되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "태그 추가 실패",
        description: "태그 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 태그 제거 핸들러
   */
  const handleRemoveTag = async (favoriteId: string, tag: string) => {
    try {
      await removeTag(favoriteId, tag);
      toast({
        title: "태그 제거",
        description: "태그가 제거되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "태그 제거 실패",
        description: "태그 제거 중 오류가 발생했습니다.",
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
    if (selectedItems.length === filteredFavorites.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFavorites.map(item => item.id));
    }
  };

  /**
   * 태그 선택 토글
   */
  const toggleTagSelection = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
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
                <Star className="h-8 w-8" />
                <h2 className="text-3xl font-bold">즐겨찾기</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                자주 사용하는 검색 결과를 저장하고 관리하세요.
              </p>
            </div>
            <div className="flex gap-2">
              {selectedItems.length > 0 && (
                <>
                  <Button
                    className="w-fit rounded-2xl bg-white text-green-700 hover:bg-white/90"
                    onClick={handleExportFavorites}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    내보내기 ({selectedItems.length})
                  </Button>
                  <Button
                    className="w-fit rounded-2xl bg-white text-red-700 hover:bg-white/90"
                    onClick={() => {
                      selectedItems.forEach(id => handleRemoveFavorite(id));
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
        <Card className="rounded-3xl border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              총 즐겨찾기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statistics.totalFavorites}
            </div>
            <p className="text-xs text-muted-foreground">
              저장된 항목
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4 text-blue-600" />
              태그 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.totalTags}
            </div>
            <p className="text-xs text-muted-foreground">
              사용된 태그
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              평균 접근
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statistics.averageAccess}
            </div>
            <p className="text-xs text-muted-foreground">
              항목당 평균
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-purple-600" />
              인기 카테고리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {statistics.mostPopularCategory}
            </div>
            <p className="text-xs text-muted-foreground">
              가장 많이 저장
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 콘텐츠 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 rounded-2xl">
          <TabsTrigger value="all" className="rounded-xl">전체</TabsTrigger>
          <TabsTrigger value="recent" className="rounded-xl">최근</TabsTrigger>
          <TabsTrigger value="popular" className="rounded-xl">인기</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5" />
                    즐겨찾기
                  </CardTitle>
                  <CardDescription>
                    저장된 검색 결과들입니다.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="즐겨찾기 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 rounded-2xl w-64"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 rounded-2xl border border-input bg-background"
                  >
                    <option value="all">전체 카테고리</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* 태그 필터 */}
              <div className="mb-4 p-3 rounded-2xl bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm font-medium">태그 필터:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTagSelection(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

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
                  ) : filteredFavorites.length > 0 ? (
                    <>
                      {/* 전체 선택 체크박스 */}
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === filteredFavorites.length}
                          onChange={toggleAllSelection}
                          className="rounded"
                        />
                        <span className="text-sm font-medium">
                          전체 선택 ({selectedItems.length}/{filteredFavorites.length})
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearFavorites}
                          className="rounded-xl ml-auto"
                        >
                          <Trash2 className="mr-2 h-3 w-3" />
                          전체 삭제
                        </Button>
                      </div>

                      {filteredFavorites.map((item) => (
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
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-100">
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
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                접근 {item.accessCount}회
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="rounded-xl">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleShareFavorite(item.id)}>
                                    <Share className="mr-2 h-4 w-4" />
                                    공유
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.answer)}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    답변 복사
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRemoveFavorite(item.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    편집
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleRemoveFavorite(item.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    삭제
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* 태그 표시 */}
                          {item.tags.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-1">
                                {item.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                    <button
                                      onClick={() => handleRemoveTag(item.id, tag)}
                                      className="ml-1 hover:text-red-600"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 즐겨찾기 정보 */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>저장: {item.savedAt}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>사용자: {item.user}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Zap className="h-3 w-3" />
                              <span>접근: {item.accessCount}회</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MessageSquare className="h-3 w-3" />
                              <span>신뢰도: {item.confidence}%</span>
                            </div>
                          </div>

                          {/* 액션 버튼 */}
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShareFavorite(item.id)}
                              className="rounded-xl"
                            >
                              <Share className="mr-2 h-3 w-3" />
                              공유
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigator.clipboard.writeText(item.answer)}
                              className="rounded-xl"
                            >
                              <Copy className="mr-2 h-3 w-3" />
                              복사
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                const newTag = prompt("새 태그를 입력하세요:");
                                if (newTag) handleAddTag(item.id, newTag);
                              }}
                              className="rounded-xl"
                            >
                              <Plus className="mr-2 h-3 w-3" />
                              태그 추가
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Star className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">즐겨찾기가 없습니다</p>
                      <p className="text-sm">아직 저장된 즐겨찾기가 없습니다.</p>
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
                <Calendar className="h-5 w-5" />
                최근 추가된 즐겨찾기
              </CardTitle>
              <CardDescription>
                최근 7일 내에 추가된 즐겨찾기입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">최근 즐겨찾기가 없습니다</p>
                <p className="text-sm">최근 7일 내에 추가된 즐겨찾기가 없습니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                인기 즐겨찾기
              </CardTitle>
              <CardDescription>
                자주 접근되는 즐겨찾기입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Heart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">인기 즐겨찾기가 없습니다</p>
                <p className="text-sm">자주 접근되는 즐겨찾기가 없습니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
