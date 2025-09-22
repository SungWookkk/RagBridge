"use client"

import { motion } from "framer-motion"
import {
  FileText,
  Workflow,
  Activity,
  Upload,
  Eye,
  Target,
  Shield,
  Brain,
  Database,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useDocuments } from "@/hooks/use-documents"

/**
 * 최근 문서 처리 현황 컴포넌트
 * 
 * @description
 * - 최근 업로드된 문서들의 처리 상태 표시
 * - AI 처리 파이프라인 단계별 진행 상황
 * - 실시간 상태 업데이트 및 상세 정보 제공
 */
export function RecentDocuments() {
  const { documents, isLoading } = useDocuments()

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Workflow className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">문서 처리 현황</h2>
          </div>
        </div>
        <div className="rounded-3xl border p-8">
          <div className="text-center text-muted-foreground">문서 정보를 불러오는 중...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Workflow className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">문서 처리 현황</h2>
        </div>
        <Button variant="ghost" className="rounded-2xl">
          <Activity className="mr-2 h-4 w-4" />
          실시간 모니터링
        </Button>
      </div>
      
      <div className="rounded-3xl border">
        <div className="grid grid-cols-1 divide-y">
          {documents.slice(0, 3).map((document) => (
            <motion.div
              key={document.id}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              className="p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{document.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {document.fileType} • {document.category} • {document.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-xl">
                    {document.status.currentStep}
                  </Badge>
                  <Badge variant="outline" className="rounded-xl bg-green-50 text-green-700 border-green-200">
                    신뢰도: {(document.confidenceScore * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
              
              {/* AI 처리 단계별 진행 상황 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">AI 처리 진행률</span>
                  <span className="text-primary font-semibold">{document.status.overallProgress}%</span>
                </div>
                <Progress value={document.status.overallProgress} className="h-3 rounded-xl" />
                
                {/* 처리 단계별 상태 표시 */}
                <div className="flex items-center gap-2 text-xs">
                  {Object.entries(document.status.steps).slice(0, 6).map(([step, stepStatus]) => {
                    const stepIcons = {
                      uploaded: <Upload className="h-3 w-3" />,
                      ocr_processing: <Eye className="h-3 w-3" />,
                      field_extraction: <Target className="h-3 w-3" />,
                      validation: <Shield className="h-3 w-3" />,
                      embedding: <Brain className="h-3 w-3" />,
                      indexing: <Database className="h-3 w-3" />
                    }
                    
                    return (
                      <div key={step} className="flex items-center gap-1">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          stepStatus.status === 'completed' ? 'bg-green-100 text-green-600' :
                          stepStatus.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                          stepStatus.status === 'failed' ? 'bg-red-100 text-red-600' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {stepStatus.status === 'completed' ? <CheckCircle className="h-3 w-3" /> :
                           stepStatus.status === 'processing' ? stepIcons[step as keyof typeof stepIcons] :
                           stepStatus.status === 'failed' ? <AlertCircle className="h-3 w-3" /> :
                           <Clock className="h-3 w-3" />}
                        </div>
                        <span className="text-muted-foreground capitalize">{step.replace('_', ' ')}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
