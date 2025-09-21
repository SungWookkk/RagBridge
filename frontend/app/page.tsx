"use client"

import { RagBridgeDashboard } from "@/components/ragbridge-dashboard"

/**
 * RagBridge 메인 페이지
 * 
 * @description
 * - RagBridge 플랫폼의 메인 대시보드 페이지
 * - Kafka + AI 문서 OCR·검증·RAG 플랫폼의 중앙 관리 인터페이스
 * - 멀티테넌트 SaaS 환경에 최적화된 사용자 경험 제공
 * - 문서 업로드부터 RAG 응답까지의 전체 워크플로우 관리
 */
export default function Home() {
  return (
    <main className="overflow-hidden">
      <RagBridgeDashboard />
    </main>
  )
}
