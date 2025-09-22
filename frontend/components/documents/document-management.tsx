"use client"

import { motion } from "framer-motion"
import {
  FileCheck,
  Upload,
  FileText,
  Workflow,
  Brain,
  Clock,
  Activity,
  Eye,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDocuments } from "@/hooks/use-documents"

/**
 * 문서 관리 컴포넌트
 * 
 * @description
 * - 문서 업로드, 처리 현황, 상태 모니터링
 * - AI 처리 파이프라인 단계별 추적
 * - 문서별 상세 정보 및 액션 제공
 * - 성능 최적화를 위한 컴포넌트 분리
 */
export function DocumentManagement() {
  const { documents, isLoading, refetch } = useDocuments()

  /**
   * 문서 목록 새로고침 핸들러
   * 
   * @description
   * - 사용자가 수동으로 문서 목록을 새로고침할 때 사용
   * - 실시간 업데이트가 필요한 상황에서 호출
   */
  const handleRefresh = () => {
    refetch()
  }

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <FileCheck className="h-8 w-8" />
                <h2 className="text-3xl font-bold">문서 처리 현황</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                업로드된 문서들의 처리 상태를 실시간으로 확인하세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="w-fit rounded-2xl bg-white text-emerald-700 hover:bg-white/90">
                <Upload className="mr-2 h-4 w-4" />
                문서 업로드
              </Button>
              <Button 
                variant="outline" 
                className="w-fit rounded-2xl bg-white/20 text-white border-white/30 hover:bg-white/30"
                onClick={handleRefresh}
              >
                <Activity className="mr-2 h-4 w-4" />
                새로고침
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 문서 처리 파이프라인 상세 테이블 */}
      <div className="rounded-3xl border overflow-hidden">
        <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-4 hidden md:grid md:grid-cols-12 text-sm font-medium">
          <div className="col-span-4 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            문서 정보
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            처리 단계
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI 신뢰도
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            처리 시간
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            작업
          </div>
        </div>
        
        <div className="divide-y">
          {isLoading ? (
            // 로딩 상태
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 md:grid md:grid-cols-12 items-center flex flex-col md:flex-row gap-4 md:gap-0">
                <div className="col-span-4 flex items-center gap-3 w-full md:w-auto">
                  <div className="h-12 w-12 bg-muted rounded-2xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                </div>
                <div className="col-span-8 flex items-center justify-center">
                  <div className="text-sm text-muted-foreground">문서 정보를 불러오는 중...</div>
                </div>
              </div>
            ))
          ) : (
            documents.map((document) => (
              <motion.div
                key={document.id}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                className="p-4 md:grid md:grid-cols-12 items-center flex flex-col md:flex-row gap-4 md:gap-0"
              >
                {/* 문서 정보 */}
                <div className="col-span-4 flex items-center gap-3 w-full md:w-auto">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{document.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {document.fileType} • {document.category} • {document.uploadedAt}
                    </p>
                    <p className="text-xs text-muted-foreground">{document.size}</p>
                  </div>
                </div>
                
                {/* 처리 단계 */}
                <div className="col-span-2 flex items-center gap-2 w-full md:w-auto">
                  <Badge variant="outline" className="rounded-xl capitalize">
                    {document.status.currentStep.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm font-medium">{document.status.overallProgress}%</span>
                </div>
                
                {/* AI 신뢰도 */}
                <div className="col-span-2 flex items-center gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-1">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{(document.confidenceScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${document.confidenceScore * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* 처리 시간 */}
                <div className="col-span-2 flex items-center gap-2 w-full md:w-auto">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{document.processingTime}초</span>
                </div>
                
                {/* 작업 버튼 */}
                <div className="col-span-2 flex items-center gap-2 w-full md:w-auto justify-end">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                    <Activity className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
