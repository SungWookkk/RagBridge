"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  FileText,
  Search,
  Shield,
  Zap,
  CheckCircle,
  Sparkles,
  BarChart3,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * 메인 랜딩 페이지 컴포넌트
 *
 * @description
 * - 사용자를 환영하는 매력적인 랜딩 페이지
 * - 주요 기능 소개 및 대시보드 접근 제공
 * - 애니메이션 효과로 사용자 경험 향상
 * - 반응형 디자인으로 모든 디바이스 지원
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 배경 애니메이션 */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* 헤더 */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <Brain className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">SmartDocs</h1>
            <p className="text-sm text-gray-600">AI 문서 처리 플랫폼</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/auth/login">
            <Button>
              로그인
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </header>

      {/* 메인 히어로 섹션 */}
      <main className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200">
              <Sparkles className="w-4 h-4 mr-1" />
              AI 기반 스마트 문서 처리
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            문서를
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              스마트하게
            </span>
            <br />
            처리하세요
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            AI 기반 OCR, 검증, RAG 기술로 문서 업로드부터 스마트 검색까지
            <br />
            모든 과정을 자동화하고 최적화하세요.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                <Zap className="w-5 h-5 mr-2" />
                무료로 시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              데모 보기
            </Button>
          </motion.div>
        </div>

        {/* 주요 기능 카드들 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg">문서 업로드</CardTitle>
              <CardDescription>
                PDF, 이미지 등 다양한 문서를 쉽게 업로드하고 처리
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-lg">AI OCR</CardTitle>
              <CardDescription>
                고정확도 AI 기반 텍스트 추출 및 필드 인식
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-lg">스마트 검증</CardTitle>
              <CardDescription>
                자동 정합성 검증 및 휴먼검토 루프
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-lg">RAG 검색</CardTitle>
              <CardDescription>
                자연어 질의응답 및 출처 문서 하이라이트
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* 특징 섹션 */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              실시간 스트리밍 처리
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Kafka 기반 스트리밍 파이프라인으로 문서 처리를 실시간으로
              모니터링하고 즉시 결과를 확인할 수 있습니다.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span>실시간 처리 상태 모니터링</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span>자동 확장 및 부하 분산</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span>99.9% 가용성 보장</span>
              </div>
            </div>
          </div>

          <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-0">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">처리 성능</h3>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">99.9%</div>
                  <div className="text-sm text-gray-600">정확도</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    &lt;1초
                  </div>
                  <div className="text-sm text-gray-600">응답시간</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA 섹션 */}
        <motion.div
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <h2 className="text-4xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-xl mb-8 opacity-90">
            무료로 가입하고 AI 기반 문서 처리를 경험해보세요
          </p>
          <Link href="/auth/register">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Users className="w-5 h-5 mr-2" />
              회원가입하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </main>

      {/* 푸터 */}
      <footer className="relative z-10 border-t bg-white/50 backdrop-blur">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <Brain className="size-5" />
              </div>
              <div>
                <h3 className="font-bold">SmartDocs</h3>
                <p className="text-sm text-gray-600">AI 문서 처리 플랫폼</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 SmartDocs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
