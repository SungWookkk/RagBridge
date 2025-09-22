"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Brain,
  Sparkles,
  Search,
  Settings,
  Database,
  Activity,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useSearch } from "@/hooks/use-search"

/**
 * 스마트 검색 컴포넌트
 * 
 * @description
 * - AI 기반 자연어 질의응답 시스템
 * - 벡터 검색 및 문서 인덱스 관리
 * - 검색 히스토리 및 결과 분석
 * - 실시간 검색 결과 표시
 */
export function SmartSearch() {
  const [query, setQuery] = useState("")
  const { searchResults, isLoading, searchHistory, performSearch } = useSearch()

  const handleSearch = async () => {
    if (query.trim()) {
      await performSearch(query)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8" />
                <h2 className="text-3xl font-bold">스마트 검색</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                자연어로 질문하면 관련 문서를 찾아 답변해드립니다.
              </p>
            </div>
            <Button className="w-fit rounded-2xl bg-white text-purple-700 hover:bg-white/90">
              <Sparkles className="mr-2 h-4 w-4" />
              스마트 검색 시작
            </Button>
          </div>
        </motion.div>
      </section>

      {/* 검색 인터페이스 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 검색 입력 영역 */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              질문 입력
            </CardTitle>
            <CardDescription>
              자연어로 질문하시면 AI가 관련 문서를 찾아 답변해드립니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="예: 회사 정책에서 휴가 규정은 어떻게 되나요?" 
                className="w-full rounded-2xl bg-muted pl-9 pr-4 py-3 text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1 rounded-2xl"
                onClick={handleSearch}
                disabled={isLoading}
              >
                <Brain className="mr-2 h-4 w-4" />
                {isLoading ? "검색 중..." : "스마트 검색 실행"}
              </Button>
              <Button variant="outline" className="rounded-2xl">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 검색 결과 미리보기 */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              검색 결과
            </CardTitle>
            <CardDescription>
              관련 문서와 AI 답변을 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                <div className="p-4 rounded-2xl bg-muted/50">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-muted/50">
                    <p className="font-medium mb-2">{result.title}</p>
                    <p className="text-sm text-muted-foreground mb-2">{result.content}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>신뢰도: {(result.confidence * 100).toFixed(0)}%</span>
                      <span>•</span>
                      <span>{result.source}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-muted/50">
                  <p className="text-sm text-muted-foreground">검색어를 입력하고 스마트 검색을 실행해보세요.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 검색 히스토리 */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            최근 검색 히스토리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {searchHistory.length > 0 ? (
              searchHistory.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setQuery(item.query)
                    handleSearch()
                  }}
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.query}</p>
                    <p className="text-sm text-muted-foreground">{item.result}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{item.time}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                검색 히스토리가 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
