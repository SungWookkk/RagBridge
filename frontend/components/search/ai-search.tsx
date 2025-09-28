"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Send,
  MessageSquare,
  FileText,
  Star,
  Copy,
  Download,
  History,
  Bookmark,
  Shield,
  Loader2,
  CheckCircle,
  X,
  Eye,
  BookOpen,
  Lightbulb,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAISearch } from "@/hooks/use-ai-search";
import { useToast } from "@/hooks/use-toast";

/**
 * AI 검색 컴포넌트
 *
 * @description
 * - 자연어로 질문하고 답변 받기
 * - RAG 기반 지능형 검색
 * - 출처 문서 및 하이라이트 표시
 * - 실시간 스트림 응답
 * - 검색 히스토리 및 즐겨찾기
 */
export function AISearch() {
  const [query, setQuery] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const {
    searchResults,
    searchHistory,
    favorites,
    isLoading,
    isStreaming: isServerStreaming,
    sendQuery,
    saveToFavorites,
    removeFromFavorites,
    clearHistory,
    getSearchSuggestions,
  } = useAISearch();

  /**
   * 검색 실행 핸들러
   */
  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setIsStreaming(true);
      setStreamingText("");
      
      // 스트림 응답 시뮬레이션
      const response = await sendQuery(query, selectedFilters);
      
      // 스트림 텍스트 애니메이션
      const words = response.answer.split(" ");
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setStreamingText(prev => prev + (i > 0 ? " " : "") + words[i]);
      }
      
      setIsStreaming(false);
    } catch (error) {
      setIsStreaming(false);
      toast({
        title: "검색 실패",
        description: "검색 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 즐겨찾기 추가 핸들러
   */
  const handleSaveToFavorites = async (query: string, answer: string) => {
    try {
      await saveToFavorites(query, answer);
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
   * 즐겨찾기 제거 핸들러
   */
  const handleRemoveFromFavorites = async (favoriteId: string) => {
    try {
      await removeFromFavorites(favoriteId);
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
   * 검색 히스토리 클리어 핸들러
   */
  const handleClearHistory = async () => {
    try {
      await clearHistory();
      toast({
        title: "히스토리 삭제",
        description: "검색 히스토리가 삭제되었습니다.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "히스토리 삭제 실패",
        description: "히스토리 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 검색 제안 클릭 핸들러
   */
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  /**
   * 필터 토글 핸들러
   */
  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  /**
   * 스크롤을 맨 아래로 이동
   */
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isStreaming) {
      scrollToBottom();
    }
  }, [streamingText, isStreaming]);

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Search className="h-8 w-8" />
                <h2 className="text-3xl font-bold">AI 검색</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                자연어로 질문하고 AI가 문서에서 답변을 찾아드립니다.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="w-fit rounded-2xl bg-white text-purple-700 hover:bg-white/90"
                onClick={() => setActiveTab("history")}
              >
                <History className="mr-2 h-4 w-4" />
                검색 기록
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 검색 영역 */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            지능형 검색
          </CardTitle>
          <CardDescription>
            궁금한 것을 자연어로 질문해보세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 검색 입력 */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="예: 계약서에서 지급 조건은 어떻게 되어 있나요?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9 rounded-2xl h-12"
                disabled={isLoading || isStreaming}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!query.trim() || isLoading || isStreaming}
              className="rounded-2xl h-12 px-6"
            >
              {isLoading || isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* 검색 필터 */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">필터:</span>
            {["계약서", "제안서", "보고서", "매뉴얼", "이미지"].map((filter) => (
              <Badge
                key={filter}
                variant={selectedFilters.includes(filter) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>

          {/* 검색 제안 */}
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">인기 검색어:</span>
            <div className="flex flex-wrap gap-2">
              {getSearchSuggestions(query).map((suggestion) => (
                <Badge
                  key={suggestion.text}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                >
                  {suggestion.text}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 메인 콘텐츠 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 rounded-2xl">
          <TabsTrigger value="search" className="rounded-xl">검색 결과</TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl">검색 기록</TabsTrigger>
          <TabsTrigger value="favorites" className="rounded-xl">즐겨찾기</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 검색 결과 */}
            <div className="lg:col-span-2">
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    AI 답변
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea ref={scrollAreaRef} className="h-96">
                    <div className="space-y-4">
                      {isStreaming ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 rounded-2xl bg-muted/30"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">답변 생성 중...</span>
                            {isServerStreaming && (
                              <Badge variant="outline" className="text-xs">
                                실시간 스트림
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{streamingText}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100" />
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200" />
                          </div>
                        </motion.div>
                      ) : searchResults.answer ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-2xl bg-muted/30"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium">AI 답변</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSaveToFavorites(query, searchResults.answer)}
                                className="rounded-xl"
                              >
                                <Star className="mr-2 h-3 w-3" />
                                즐겨찾기
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigator.clipboard.writeText(searchResults.answer)}
                                className="rounded-xl"
                              >
                                <Copy className="mr-2 h-3 w-3" />
                                복사
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed">{searchResults.answer}</p>
                          
                          {/* 신뢰도 표시 */}
                          <div className="mt-3 p-2 rounded-xl bg-green-50 border border-green-200">
                            <div className="flex items-center gap-2">
                              <Shield className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-700">
                                신뢰도: {searchResults.confidence}% • 출처: {searchResults.sources.length}개 문서
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">검색어를 입력하세요</p>
                          <p className="text-sm">자연어로 질문하면 AI가 답변을 찾아드립니다.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* 출처 문서 */}
            <div>
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    출처 문서
                  </CardTitle>
                  <CardDescription>
                    답변에 참조된 문서들입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {searchResults.sources.map((source, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{source.documentName}</h4>
                              <p className="text-xs text-muted-foreground">
                                페이지 {source.page} • 신뢰도 {source.confidence}%
                              </p>
                              {source.highlight && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {source.highlight}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end gap-1 mt-2">
                            <Button size="sm" variant="outline" className="rounded-xl h-6 px-2">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-xl h-6 px-2">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    검색 기록
                  </CardTitle>
                  <CardDescription>
                    최근 검색한 질문들입니다.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={handleClearHistory}
                  className="rounded-2xl"
                >
                  <X className="mr-2 h-4 w-4" />
                  전체 삭제
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {searchHistory.map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      className="p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setQuery(item.query)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.query}</h4>
                          <p className="text-xs text-muted-foreground">
                            {item.timestamp} • {item.resultCount}개 결과
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveToFavorites(item.query, item.answer);
                            }}
                            className="rounded-xl"
                          >
                            <Star className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5" />
                즐겨찾기
              </CardTitle>
              <CardDescription>
                저장된 검색 결과들입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {favorites.map((favorite, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      className="p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{favorite.query}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {favorite.answer}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {favorite.savedAt}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setQuery(favorite.query)}
                            className="rounded-xl"
                          >
                            <Search className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveFromFavorites(favorite.id)}
                            className="rounded-xl"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
