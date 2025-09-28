"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Users,
  Search,
  Plus,
  Mail,
  Shield,
  User,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  MoreHorizontal,
  Crown,
  UserCheck,
  UserX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTeamMembers } from "@/hooks/use-team-members";
import { useToast } from "@/hooks/use-toast";

/**
 * 팀원 초대 스키마 정의
 */
const inviteMemberSchema = z.object({
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  role: z.enum(["admin", "editor", "viewer"]),
  message: z.string().optional(),
});

type InviteMemberData = z.infer<typeof inviteMemberSchema>;

/**
 * 팀원 관리 컴포넌트
 *
 * @description
 * - 팀원 초대 및 권한 관리
 * - 역할별 접근 권한 설정
 * - 팀원 활동 현황 및 통계
 */
export function TeamMemberManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [activeTab, setActiveTab] = useState("members");
  const { toast } = useToast();

  const {
    members,
    invitations,
    statistics,
    isLoading,
    inviteMember,
    updateMemberRole,
    removeMember,
    resendInvitation,
    cancelInvitation,
  } = useTeamMembers();

  const form = useForm<InviteMemberData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "viewer",
      message: "",
    },
  });

  /**
   * 필터링된 팀원 목록
   */
  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  /**
   * 팀원 초대 핸들러
   */
  const handleInviteMember = async (data: InviteMemberData) => {
    try {
      await inviteMember(data);
      toast({
        title: "초대 완료",
        description: `${data.email}에게 초대 메일을 발송했습니다.`,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "초대 실패",
        description: "팀원 초대 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 역할 변경 핸들러
   */
  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      await updateMemberRole(memberId, newRole);
      toast({
        title: "역할 변경 완료",
        description: "팀원의 역할이 성공적으로 변경되었습니다.",
      });
    } catch (error) {
      toast({
        title: "역할 변경 실패",
        description: "역할 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  /**
   * 팀원 제거 핸들러
   */
  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(memberId);
      toast({
        title: "팀원 제거 완료",
        description: "팀원이 성공적으로 제거되었습니다.",
      });
    } catch (error) {
      toast({
        title: "팀원 제거 실패",
        description: "팀원 제거 중 오류가 발생했습니다.",
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
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-8 text-white"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8" />
                <h2 className="text-3xl font-bold">팀원 관리</h2>
              </div>
              <p className="max-w-[600px] text-white/80">
                팀원을 초대하고 역할별 권한을 관리하세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="w-fit rounded-2xl bg-white text-purple-700 hover:bg-white/90"
                onClick={() => setActiveTab("invite")}
              >
                <Plus className="mr-2 h-4 w-4" />
                팀원 초대
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              전체 팀원
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.totalMembers}
            </div>
            <p className="text-xs text-muted-foreground">
              활성 팀원 수
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              활성 사용자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statistics.activeMembers}
            </div>
            <p className="text-xs text-muted-foreground">
              최근 7일 활동
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-orange-600" />
              대기 중인 초대
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {statistics.pendingInvitations}
            </div>
            <p className="text-xs text-muted-foreground">
              초대 수락 대기
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Crown className="h-4 w-4 text-purple-600" />
              관리자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {statistics.admins}
            </div>
            <p className="text-xs text-muted-foreground">
              관리자 권한 보유
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 콘텐츠 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 rounded-2xl">
          <TabsTrigger value="members" className="rounded-xl">팀원 목록</TabsTrigger>
          <TabsTrigger value="invite" className="rounded-xl">팀원 초대</TabsTrigger>
          <TabsTrigger value="permissions" className="rounded-xl">권한 설정</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    팀원 목록
                  </CardTitle>
                  <CardDescription>
                    현재 팀에 속한 모든 멤버를 관리하세요.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="팀원 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 rounded-2xl w-64"
                    />
                  </div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 rounded-2xl border border-input bg-background"
                  >
                    <option value="all">전체 역할</option>
                    <option value="admin">관리자</option>
                    <option value="editor">편집자</option>
                    <option value="viewer">뷰어</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-2xl bg-muted/30 animate-pulse"
                      >
                        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    ))
                  ) : filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <motion.div
                        key={member.id}
                        whileHover={{ scale: 1.01 }}
                        className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{member.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {member.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`${
                                member.role === "admin"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : member.role === "editor"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                              }`}
                            >
                              {member.role === "admin" ? "관리자" : 
                               member.role === "editor" ? "편집자" : "뷰어"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-xl"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>가입: {member.joinedAt}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <UserCheck className="h-3 w-3" />
                              <span>마지막 활동: {member.lastActive}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateRole(member.id, "admin")}
                              className="rounded-xl"
                            >
                              <Shield className="mr-2 h-3 w-3" />
                              역할 변경
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveMember(member.id)}
                              className="rounded-xl"
                            >
                              <Trash2 className="mr-2 h-3 w-3" />
                              제거
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">팀원이 없습니다</p>
                      <p className="text-sm">새 팀원을 초대해보세요.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invite" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 초대 폼 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  새 팀원 초대
                </CardTitle>
                <CardDescription>
                  이메일로 팀원을 초대하고 역할을 지정하세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(handleInviteMember)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">이메일 주소</label>
                    <Input
                      {...form.register("email")}
                      type="email"
                      placeholder="team@example.com"
                      className="rounded-2xl"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">역할</label>
                    <select
                      {...form.register("role")}
                      className="w-full p-3 rounded-2xl border border-input bg-background"
                    >
                      <option value="viewer">뷰어 - 문서 조회만 가능</option>
                      <option value="editor">편집자 - 문서 업로드 및 편집</option>
                      <option value="admin">관리자 - 모든 권한</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">초대 메시지 (선택사항)</label>
                    <Input
                      {...form.register("message")}
                      placeholder="팀에 오신 것을 환영합니다!"
                      className="rounded-2xl"
                    />
                  </div>

                  <Button type="submit" className="w-full rounded-2xl">
                    <Mail className="mr-2 h-4 w-4" />
                    초대 메일 발송
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* 대기 중인 초대 */}
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  대기 중인 초대
                </CardTitle>
                <CardDescription>
                  아직 수락하지 않은 초대 목록입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {invitations.length > 0 ? (
                      invitations.map((invitation) => (
                        <div
                          key={invitation.id}
                          className="p-3 rounded-2xl bg-muted/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm">{invitation.email}</p>
                              <p className="text-xs text-muted-foreground">
                                {invitation.role === "admin" ? "관리자" : 
                                 invitation.role === "editor" ? "편집자" : "뷰어"}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              대기 중
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>초대일: {invitation.sentAt}</span>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => resendInvitation(invitation.id)}
                                className="h-6 px-2 text-xs"
                              >
                                재발송
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => cancelInvitation(invitation.id)}
                                className="h-6 px-2 text-xs"
                              >
                                취소
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">대기 중인 초대가 없습니다.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                역할별 권한 설정
              </CardTitle>
              <CardDescription>
                각 역할의 권한을 상세히 설정할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 관리자 권한 */}
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium text-purple-900">관리자</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>모든 문서 접근</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>팀원 관리</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>시스템 설정</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>과금 관리</span>
                    </div>
                  </div>
                </div>

                {/* 편집자 권한 */}
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Edit className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">편집자</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>문서 업로드</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>문서 편집</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>검색 기능</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserX className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">팀원 관리</span>
                    </div>
                  </div>
                </div>

                {/* 뷰어 권한 */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">뷰어</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>문서 조회</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>검색 기능</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserX className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">문서 업로드</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserX className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">문서 편집</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
