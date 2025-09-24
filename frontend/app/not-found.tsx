"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, ArrowLeft, Search, FileText, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * 404 Not Found 페이지 컴포넌트
 *
 * @description
 * - Next.js App Router의 not-found.tsx 파일로 자동 처리
 * - 사용자 친화적인 404 에러 페이지 디자인
 * - 메인 페이지로의 쉬운 네비게이션 제공
 * - 관련 기능으로의 빠른 접근 링크 포함
 * - 애니메이션 효과로 사용자 경험 향상
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* 배경 애니메이션 */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
      </motion.div>

      {/* 메인 콘텐츠 */}
      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="text-center mb-8">
          {/* 404 숫자 애니메이션 */}
          <motion.div
            className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.5,
            }}
          >
            404
          </motion.div>

          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            페이지를 찾을 수 없습니다
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </motion.p>
        </div>

        {/* 액션 버튼들 */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="w-5 h-5 mr-2" />
              메인 페이지로 이동
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            이전 페이지로 돌아가기
          </Button>
        </motion.div>

        {/* 추천 기능 카드들 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">문서 관리</CardTitle>
              <CardDescription>
                업로드된 문서를 확인하고 관리하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/documents">
                <Button variant="outline" className="w-full">
                  문서 관리로 이동
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">스마트 검색</CardTitle>
              <CardDescription>
                AI 기반 문서 검색과 질의응답을 이용하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/search">
                <Button variant="outline" className="w-full">
                  검색으로 이동
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <AlertCircle className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">시스템 모니터링</CardTitle>
              <CardDescription>
                시스템 상태와 처리 현황을 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/monitoring">
                <Button variant="outline" className="w-full">
                  모니터링으로 이동
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* 추가 정보 */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-gray-500 mb-4">
            문제가 지속되면 고객 지원팀에 문의해 주세요
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">문서 처리</Badge>
            <Badge variant="secondary">AI 검색</Badge>
            <Badge variant="secondary">실시간 모니터링</Badge>
            <Badge variant="secondary">스마트 검증</Badge>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
