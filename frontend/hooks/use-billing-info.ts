import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

/**
 * 요금제 타입 정의
 */
export interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  status: "active" | "inactive" | "cancelled";
  features: {
    documents: number;
    queries: number;
    teamMembers: number;
    storage: number;
    prioritySupport?: boolean;
  };
  nextBillingDate: string;
  totalSpent: number;
  isPopular?: boolean;
}

/**
 * 결제 내역 타입
 */
export interface BillingHistory {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "failed" | "pending";
  planName: string;
  invoiceUrl?: string;
}

/**
 * 결제 수단 타입
 */
export interface PaymentMethod {
  id: string;
  type: string;
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
}

/**
 * 목 데이터: 현재 요금제
 */
const mockCurrentPlan: Plan = {
  id: "pro",
  name: "Pro",
  price: 99000,
  billingCycle: "monthly",
  status: "active",
  features: {
    documents: 2000,
    queries: 10000,
    teamMembers: 10,
    storage: 5,
    prioritySupport: true,
  },
  nextBillingDate: "2024-02-20",
  totalSpent: 124700,
};

/**
 * 목 데이터: 사용 가능한 요금제
 */
const mockAvailablePlans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 29000,
    billingCycle: "monthly",
    status: "inactive",
    features: {
      documents: 500,
      queries: 2000,
      teamMembers: 3,
      storage: 1,
    },
    nextBillingDate: "",
    totalSpent: 0,
  },
  {
    id: "pro",
    name: "Pro",
    price: 99000,
    billingCycle: "monthly",
    status: "active",
    features: {
      documents: 2000,
      queries: 10000,
      teamMembers: 10,
      storage: 5,
      prioritySupport: true,
    },
    nextBillingDate: "2024-02-20",
    totalSpent: 124700,
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299000,
    billingCycle: "monthly",
    status: "inactive",
    features: {
      documents: 10000,
      queries: 50000,
      teamMembers: 50,
      storage: 25,
      prioritySupport: true,
    },
    nextBillingDate: "",
    totalSpent: 0,
  },
];

/**
 * 목 데이터: 결제 내역
 */
const mockBillingHistory: BillingHistory[] = [
  {
    id: "1",
    date: "2024-01-20",
    description: "Pro 요금제 - 2024년 1월",
    amount: 99000,
    status: "paid",
    planName: "Pro",
    invoiceUrl: "/invoices/2024-01-20.pdf",
  },
  {
    id: "2",
    date: "2023-12-20",
    description: "Pro 요금제 - 2023년 12월",
    amount: 99000,
    status: "paid",
    planName: "Pro",
    invoiceUrl: "/invoices/2023-12-20.pdf",
  },
  {
    id: "3",
    date: "2023-11-20",
    description: "Pro 요금제 - 2023년 11월",
    amount: 99000,
    status: "paid",
    planName: "Pro",
    invoiceUrl: "/invoices/2023-11-20.pdf",
  },
  {
    id: "4",
    date: "2023-10-20",
    description: "Pro 요금제 - 2023년 10월",
    amount: 99000,
    status: "paid",
    planName: "Pro",
    invoiceUrl: "/invoices/2023-10-20.pdf",
  },
];

/**
 * 목 데이터: 결제 수단
 */
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "Visa",
    lastFour: "4242",
    expiryDate: "12/25",
    isDefault: true,
  },
  {
    id: "2",
    type: "Mastercard",
    lastFour: "5555",
    expiryDate: "08/26",
    isDefault: false,
  },
];

/**
 * 요금 정보 훅
 */
export function useBillingInfo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * 현재 요금제 조회
   */
  const {
    data: currentPlan = mockCurrentPlan,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["current-plan"],
    queryFn: async (): Promise<Plan> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockCurrentPlan;
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchInterval: false,
  });

  /**
   * 사용 가능한 요금제 조회
   */
  const { data: availablePlans = [] } = useQuery({
    queryKey: ["available-plans"],
    queryFn: async (): Promise<Plan[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockAvailablePlans;
    },
    staleTime: 10 * 60 * 1000, // 10분
    refetchInterval: false,
  });

  /**
   * 결제 내역 조회
   */
  const { data: billingHistory = [] } = useQuery({
    queryKey: ["billing-history"],
    queryFn: async (): Promise<BillingHistory[]> => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return mockBillingHistory;
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchInterval: false,
  });

  /**
   * 결제 수단 조회
   */
  const { data: paymentMethods = [] } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: async (): Promise<PaymentMethod[]> => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockPaymentMethods;
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchInterval: false,
  });

  /**
   * 요금제 업그레이드
   */
  const upgradePlan = useMutation({
    mutationFn: async (planId: string): Promise<Plan> => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const newPlan = mockAvailablePlans.find(plan => plan.id === planId);
      if (!newPlan) {
        throw new Error("요금제를 찾을 수 없습니다");
      }

      // 현재 요금제 업데이트
      const updatedPlan: Plan = {
        ...newPlan,
        status: "active",
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalSpent: 0,
      };

      return updatedPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-plan"] });
      queryClient.invalidateQueries({ queryKey: ["available-plans"] });
      toast({
        title: "요금제 업그레이드 완료",
        description: "새 요금제로 성공적으로 변경되었습니다.",
      });
    },
    onError: (error) => {
      console.error("요금제 업그레이드 실패:", error);
      toast({
        title: "요금제 업그레이드 실패",
        description: "요금제 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 청구서 다운로드
   */
  const downloadInvoice = useMutation({
    mutationFn: async (invoiceId: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const invoice = mockBillingHistory.find(inv => inv.id === invoiceId);
      if (!invoice) {
        throw new Error("청구서를 찾을 수 없습니다");
      }

      // 실제로는 서버에서 PDF 파일을 다운로드
      console.log(`청구서 다운로드: ${invoice.invoiceUrl}`);
    },
    onSuccess: () => {
      toast({
        title: "청구서 다운로드 완료",
        description: "청구서가 성공적으로 다운로드되었습니다.",
      });
    },
    onError: (error) => {
      console.error("청구서 다운로드 실패:", error);
      toast({
        title: "청구서 다운로드 실패",
        description: "청구서 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 결제 수단 업데이트
   */
  const updatePaymentMethod = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PaymentMethod> }): Promise<PaymentMethod> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const methodIndex = mockPaymentMethods.findIndex(method => method.id === id);
      if (methodIndex === -1) {
        throw new Error("결제 수단을 찾을 수 없습니다");
      }

      const updatedMethod: PaymentMethod = {
        ...mockPaymentMethods[methodIndex],
        ...data,
      };

      return updatedMethod;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast({
        title: "결제 수단 업데이트 완료",
        description: "결제 수단이 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      console.error("결제 수단 업데이트 실패:", error);
      toast({
        title: "결제 수단 업데이트 실패",
        description: "결제 수단 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  return {
    currentPlan,
    availablePlans,
    billingHistory,
    paymentMethods,
    isLoading,
    error,
    upgradePlan: upgradePlan.mutateAsync,
    downloadInvoice: downloadInvoice.mutateAsync,
    updatePaymentMethod: (id: string, data: Partial<PaymentMethod>) => 
      updatePaymentMethod.mutateAsync({ id, data }),
  };
}
