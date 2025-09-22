"use client"

import { motion } from "framer-motion"
import {
  Upload,
  Brain,
  Workflow,
  Activity,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RecentDocuments } from "./recent-documents"
import { ProjectOverview } from "./project-overview"

/**
 * 대시보드 개요 컴포넌트
 * 
 * @description
 * - 전체 문서 처리 현황 및 요약 정보 표시
 * - 실시간 처리 상태 모니터링
 * - 빠른 액션 버튼 및 주요 지표 제공
 * - 성능 최적화를 위한 컴포넌트 분리
 */
export function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* 웰컴 섹션 */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 p-8 text-white"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI 파이프라인 활성
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-300/30 rounded-xl">
                  <Activity className="h-3 w-3 mr-1" />
                  실시간 처리 중
                </Badge>
              </div>
              <h2 className="text-3xl font-bold">SmartDocs 문서 처리 시스템</h2>
              <p className="max-w-[600px] text-white/80">
                AI 기반 스마트 문서 처리 플랫폼으로 문서를 쉽고 빠르게 관리하세요.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="rounded-2xl bg-white text-emerald-700 hover:bg-white/90 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  문서 업로드
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl bg-transparent border-white text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  스마트 검색 시작
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="relative h-40 w-40"
              >
                <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <Brain className="h-16 w-16 text-white/60" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-4 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <Workflow className="h-12 w-12 text-white/50" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1.2, 1, 1.2] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-8 rounded-full bg-white/30 flex items-center justify-center"
                >
                  <Activity className="h-8 w-8 text-white/40" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 최근 문서 처리 현황 */}
      <RecentDocuments />

      {/* 프로젝트 개요 */}
      <ProjectOverview />
    </div>
  )
}
