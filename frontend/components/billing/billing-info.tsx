"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Download,
  Calendar,
  CheckCircle,
  ArrowRight,
  Star,
  Crown,
  Zap,
  Users,
  FileText,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBillingInfo } from "@/hooks/use-billing-info";
import { useToast } from "@/hooks/use-toast";

/**
 * 요금 정보 컴포넌트
 *
 * @description
 * - 요금제 및 결제 정보 관리
 * - 결제 내역 및 청구서 조회
 * - 요금제 변경 및 업그레이드
 */
export function BillingInfo() {
  const [activeTab, setActiveTab] = useState("current");
  const { toast } = useToast();

  const {
    currentPlan,
    availablePlans,
    billingHistory,
    paymentMethods,
    isLoading,
    upgradePlan,
    downloadInvoice,
    updatePaymentMethod,
  } = useBillingInfo();

  /**
   * 요금제 업그레이드 핸들러
   */
  const handleUpgradePlan = async (planId: string) => {
    try {
      await upgradePlan(planId);
      toast({
        title: "요금제 업그레이드 완료",
        description: "새 요금제로 성공적으로 변경되었습니다.",
        variant: "success",
      });
    } catch (error) {
      console.error("요금제 업그레이드 실패:", error);
      toast({
        title: "요금제 업그레이드 실패",
        description: "요금제 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 청구서 다운로드 핸들러
   */
  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      await downloadInvoice(invoiceId);
      toast({
        title: "청구서 다운로드 완료",
        description: "청구서가 성공적으로 다운로드되었습니다.",
        variant: "success",
      });
    } catch (error) {
      console.error("청구서 다운로드 실패:", error);
      toast({
        title: "청구서 다운로드 실패",
        description: "청구서 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
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
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8" />
                <h2 className="text-3xl font-bold">요금 정보</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                현재 요금제를 확인하고 결제 정보를 관리하세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="w-fit rounded-2xl bg-white text-purple-700 hover:bg-white/90"
                onClick={() => setActiveTab("plans")}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                요금제 변경
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 현재 요금제 카드 */}
      <Card className="rounded-3xl border-l-4 border-l-purple-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple-600" />
                현재 요금제
              </CardTitle>
              <CardDescription>
                {currentPlan.name} • {currentPlan.billingCycle}
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {currentPlan.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                ₩{currentPlan.price.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                {currentPlan.billingCycle === "monthly" ? "월" : "년"} 요금
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {currentPlan.nextBillingDate}
              </div>
              <p className="text-sm text-muted-foreground">다음 결제일</p>
            </div>
            <div>
              <div className="text-2xl font-bold">
                ₩{currentPlan.totalSpent.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">이번 달 사용량</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 메인 콘텐츠 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="current" className="rounded-xl">현재 요금제</TabsTrigger>
          <TabsTrigger value="plans" className="rounded-xl">요금제 비교</TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl">결제 내역</TabsTrigger>
          <TabsTrigger value="payment" className="rounded-xl">결제 수단</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-3xl">
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 bg-muted animate-pulse rounded w-20" />
                        <div className="h-4 bg-muted animate-pulse rounded w-16" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 요금제 상세 정보 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  요금제 상세 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">문서 처리</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currentPlan.features.documents}</span>
                      <Badge variant="outline" className="text-xs">문서/월</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">검색 쿼리</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currentPlan.features.queries}</span>
                      <Badge variant="outline" className="text-xs">쿼리/월</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">팀원 수</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currentPlan.features.teamMembers}</span>
                      <Badge variant="outline" className="text-xs">명</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">스토리지</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currentPlan.features.storage}</span>
                      <Badge variant="outline" className="text-xs">GB</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 사용량 요약 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  이번 달 사용량
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">문서 처리</span>
                      <span className="text-sm font-medium">1,247 / 2,000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">검색 쿼리</span>
                      <span className="text-sm font-medium">8,920 / 10,000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">팀원 수</span>
                      <span className="text-sm font-medium">5 / 10</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '50%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">스토리지</span>
                      <span className="text-sm font-medium">2.3 / 5.0 GB</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '46%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          )}
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availablePlans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.02 }}
                className={`relative rounded-3xl border-2 p-6 ${
                  plan.id === currentPlan.id
                    ? "border-purple-500 bg-purple-50"
                    : plan.isPopular
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-background"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">인기</Badge>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {plan.id === "pro" ? (
                      <Crown className="h-6 w-6 text-purple-600" />
                    ) : plan.id === "team" ? (
                      <Users className="h-6 w-6 text-blue-600" />
                    ) : (
                      <FileText className="h-6 w-6 text-gray-600" />
                    )}
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    ₩{plan.price.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.billingCycle === "monthly" ? "월" : "년"} 요금
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{plan.features.documents.toLocaleString()} 문서/월</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{plan.features.queries.toLocaleString()} 쿼리/월</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{plan.features.teamMembers}명 팀원</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{plan.features.storage}GB 스토리지</span>
                  </div>
                  {plan.features.prioritySupport && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">우선 지원</span>
                    </div>
                  )}
                </div>

                <Button
                  className={`w-full rounded-2xl ${
                    plan.id === currentPlan.id
                      ? "bg-purple-600 hover:bg-purple-700"
                      : plan.isPopular
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                  onClick={() => handleUpgradePlan(plan.id)}
                  disabled={plan.id === currentPlan.id}
                >
                  {plan.id === currentPlan.id ? "현재 요금제" : "선택하기"}
                </Button>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                결제 내역
              </CardTitle>
              <CardDescription>
                최근 결제 내역과 청구서를 확인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-muted/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{invoice.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          {invoice.date} • {invoice.planName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">₩{invoice.amount.toLocaleString()}</div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            invoice.status === "paid"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {invoice.status === "paid" ? "결제 완료" : "결제 실패"}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="rounded-xl"
                      >
                        <Download className="mr-2 h-3 w-3" />
                        다운로드
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                결제 수단
              </CardTitle>
              <CardDescription>
                등록된 결제 수단을 관리하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-blue-100">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {method.type} •••• {method.lastFour}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        만료일: {method.expiryDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <Badge variant="outline" className="text-xs">
                        기본
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl"
                    >
                      <Settings className="mr-2 h-3 w-3" />
                      수정
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full rounded-2xl mt-4"
                onClick={() => updatePaymentMethod("new", {})}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                새 결제 수단 추가
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
