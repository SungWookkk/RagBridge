import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

/**
 * 팀원 타입 정의
 */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  joinedAt: string;
  lastActive: string;
  isActive: boolean;
  avatar?: string;
}

/**
 * 초대 타입 정의
 */
export interface Invitation {
  id: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  sentAt: string;
  expiresAt: string;
  status: "pending" | "accepted" | "expired";
}

/**
 * 팀원 통계 타입
 */
export interface TeamStatistics {
  totalMembers: number;
  activeMembers: number;
  pendingInvitations: number;
  admins: number;
  editors: number;
  viewers: number;
}

/**
 * 목 데이터: 팀원 목록
 */
const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "김개발",
    email: "kim@example.com",
    role: "admin",
    joinedAt: "2024-01-15",
    lastActive: "2시간 전",
    isActive: true,
  },
  {
    id: "2",
    name: "이디자인",
    email: "lee@example.com",
    role: "editor",
    joinedAt: "2024-01-16",
    lastActive: "1일 전",
    isActive: true,
  },
  {
    id: "3",
    name: "박마케팅",
    email: "park@example.com",
    role: "viewer",
    joinedAt: "2024-01-17",
    lastActive: "3일 전",
    isActive: true,
  },
  {
    id: "4",
    name: "최기획",
    email: "choi@example.com",
    role: "editor",
    joinedAt: "2024-01-18",
    lastActive: "1주일 전",
    isActive: false,
  },
  {
    id: "5",
    name: "정운영",
    email: "jung@example.com",
    role: "viewer",
    joinedAt: "2024-01-19",
    lastActive: "2주일 전",
    isActive: false,
  },
];

/**
 * 목 데이터: 초대 목록
 */
const mockInvitations: Invitation[] = [
  {
    id: "1",
    email: "newmember@example.com",
    role: "editor",
    sentAt: "2024-01-20 14:30",
    expiresAt: "2024-01-27 14:30",
    status: "pending",
  },
  {
    id: "2",
    email: "guest@example.com",
    role: "viewer",
    sentAt: "2024-01-19 10:15",
    expiresAt: "2024-01-26 10:15",
    status: "pending",
  },
];

/**
 * 팀원 관리 훅
 */
export function useTeamMembers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * 팀원 목록 조회
   */
  const {
    data: members = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["team-members"],
    queryFn: async (): Promise<TeamMember[]> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockTeamMembers;
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchInterval: false,
  });

  /**
   * 초대 목록 조회
   */
  const { data: invitations = [] } = useQuery({
    queryKey: ["team-invitations"],
    queryFn: async (): Promise<Invitation[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockInvitations;
    },
    staleTime: 2 * 60 * 1000, // 2분
    refetchInterval: false,
  });

  /**
   * 팀 통계 조회
   */
  const { data: statistics } = useQuery({
    queryKey: ["team-statistics"],
    queryFn: async (): Promise<TeamStatistics> => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const totalMembers = members.length;
      const activeMembers = members.filter(member => member.isActive).length;
      const pendingInvitations = invitations.filter(inv => inv.status === "pending").length;
      const admins = members.filter(member => member.role === "admin").length;
      const editors = members.filter(member => member.role === "editor").length;
      const viewers = members.filter(member => member.role === "viewer").length;

      return {
        totalMembers,
        activeMembers,
        pendingInvitations,
        admins,
        editors,
        viewers,
      };
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchInterval: false,
  });

  /**
   * 팀원 초대
   */
  const inviteMember = useMutation({
    mutationFn: async (data: { email: string; role: string; message?: string }): Promise<Invitation> => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      const newInvitation: Invitation = {
        id: Date.now().toString(),
        email: data.email,
        role: data.role as "admin" | "editor" | "viewer",
        sentAt: new Date().toLocaleString("ko-KR"),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString("ko-KR"),
        status: "pending",
      };

      return newInvitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["team-statistics"] });
      toast({
        title: "초대 완료",
        description: "팀원 초대가 성공적으로 발송되었습니다.",
      });
    },
    onError: (error) => {
      console.error("팀원 초대 실패:", error);
      toast({
        title: "초대 실패",
        description: "팀원 초대 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 팀원 역할 변경
   */
  const updateMemberRole = useMutation({
    mutationFn: async ({ memberId, newRole }: { memberId: string; newRole: string }): Promise<TeamMember> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const memberIndex = mockTeamMembers.findIndex(member => member.id === memberId);
      if (memberIndex === -1) {
        throw new Error("팀원을 찾을 수 없습니다");
      }

      const updatedMember: TeamMember = {
        ...mockTeamMembers[memberIndex],
        role: newRole as "admin" | "editor" | "viewer",
      };

      return updatedMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["team-statistics"] });
      toast({
        title: "역할 변경 완료",
        description: "팀원의 역할이 성공적으로 변경되었습니다.",
      });
    },
    onError: (error) => {
      console.error("역할 변경 실패:", error);
      toast({
        title: "역할 변경 실패",
        description: "역할 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 팀원 제거
   */
  const removeMember = useMutation({
    mutationFn: async (memberId: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const memberIndex = mockTeamMembers.findIndex(member => member.id === memberId);
      if (memberIndex === -1) {
        throw new Error("팀원을 찾을 수 없습니다");
      }

      mockTeamMembers.splice(memberIndex, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["team-statistics"] });
      toast({
        title: "팀원 제거 완료",
        description: "팀원이 성공적으로 제거되었습니다.",
      });
    },
    onError: (error) => {
      console.error("팀원 제거 실패:", error);
      toast({
        title: "팀원 제거 실패",
        description: "팀원 제거 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 초대 재발송
   */
  const resendInvitation = useMutation({
    mutationFn: async (invitationId: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const invitationIndex = mockInvitations.findIndex(inv => inv.id === invitationId);
      if (invitationIndex === -1) {
        throw new Error("초대를 찾을 수 없습니다");
      }

      mockInvitations[invitationIndex].sentAt = new Date().toLocaleString("ko-KR");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-invitations"] });
      toast({
        title: "초대 재발송 완료",
        description: "초대 메일이 다시 발송되었습니다.",
      });
    },
    onError: (error) => {
      console.error("초대 재발송 실패:", error);
      toast({
        title: "초대 재발송 실패",
        description: "초대 재발송 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  /**
   * 초대 취소
   */
  const cancelInvitation = useMutation({
    mutationFn: async (invitationId: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const invitationIndex = mockInvitations.findIndex(inv => inv.id === invitationId);
      if (invitationIndex === -1) {
        throw new Error("초대를 찾을 수 없습니다");
      }

      mockInvitations.splice(invitationIndex, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["team-statistics"] });
      toast({
        title: "초대 취소 완료",
        description: "초대가 성공적으로 취소되었습니다.",
      });
    },
    onError: (error) => {
      console.error("초대 취소 실패:", error);
      toast({
        title: "초대 취소 실패",
        description: "초대 취소 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  return {
    members,
    invitations,
    statistics: statistics || {
      totalMembers: 0,
      activeMembers: 0,
      pendingInvitations: 0,
      admins: 0,
      editors: 0,
      viewers: 0,
    },
    isLoading,
    error,
    inviteMember: inviteMember.mutateAsync,
    updateMemberRole: (memberId: string, newRole: string) => 
      updateMemberRole.mutateAsync({ memberId, newRole }),
    removeMember: removeMember.mutateAsync,
    resendInvitation: resendInvitation.mutateAsync,
    cancelInvitation: cancelInvitation.mutateAsync,
  };
}
