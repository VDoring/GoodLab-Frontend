"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Crown,
  Trash2,
  Github,
  FileText,
  BarChart3,
  Settings as SettingsIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTeamStore, useRoomStore, useAuthStore } from "@/store";
import { teamMemberDB, userDB } from "@/lib/mock-db";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks";

const integrationSchema = z.object({
  github_url: z
    .string()
    .url({ message: "올바른 GitHub URL을 입력해주세요." })
    .optional()
    .or(z.literal("")),
  notion_url: z
    .string()
    .url({ message: "올바른 Notion URL을 입력해주세요." })
    .optional()
    .or(z.literal("")),
});

type IntegrationFormData = z.infer<typeof integrationSchema>;

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  const [isIntegrationDialogOpen, setIsIntegrationDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated } = useRequireAuth();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const teams = useTeamStore((state) => state.teams);
  const fetchTeam = useTeamStore((state) => state.fetchTeam);
  const updateTeam = useTeamStore((state) => state.updateTeam);
  const getTeamMembers = useTeamStore((state) => state.getTeamMembers);
  const changeTeamLeader = useTeamStore((state) => state.changeTeamLeader);
  const removeMemberFromTeam = useTeamStore((state) => state.removeMemberFromTeam);
  const rooms = useRoomStore((state) => state.rooms);
  const fetchRooms = useRoomStore((state) => state.fetchRooms);

  const team = teams.find((t) => t.id === teamId);
  const room = team ? rooms.find((r) => r.id === team.room_id) : null;
  const members = getTeamMembers(teamId);
  const leader = team?.leader_id ? userDB.getById(team.leader_id) : null;

  // 팀 멤버인지 확인
  const isTeamMember = user ? members.some(m => m.id === user.id) : false;
  const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin');

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeam(teamId);
      fetchRooms();
    }
  }, [isAuthenticated, teamId, fetchTeam, fetchRooms]);

  if (!isAuthenticated) {
    return null;
  }

  if (!team || !room) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">팀을 찾을 수 없습니다.</p>
        </div>
      </MainLayout>
    );
  }

  // 팀 멤버가 아니고 관리자도 아니면 접근 불가
  if (!isTeamMember && !isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">이 팀에 접근 권한이 없습니다.</p>
            <Button onClick={() => router.push('/dashboard')}>
              대시보드로 돌아가기
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IntegrationFormData>({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      github_url: team.github_url || "",
      notion_url: team.notion_url || "",
    },
  });

  const onSubmitIntegration = async (data: IntegrationFormData) => {
    setIsLoading(true);
    try {
      const success = updateTeam(teamId, {
        github_url: data.github_url || undefined,
        notion_url: data.notion_url || undefined,
      });

      if (success) {
        toast({
          title: "연동 설정 저장 완료",
          description: "GitHub와 Notion 연동 정보가 저장되었습니다.",
        });
        setIsIntegrationDialogOpen(false);
        fetchTeam(teamId);
      } else {
        throw new Error("Failed to update team");
      }
    } catch (error) {
      console.error("Integration error:", error);
      toast({
        title: "연동 설정 저장 실패",
        description: "연동 정보 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetLeader = (userId: string) => {
    // 권한 체크: 교수/슈퍼관리자만 가능
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      toast({
        title: "권한 없음",
        description: "팀장 지정은 교수만 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    const member = members.find((m) => m.id === userId);
    if (!member) return;

    if (confirm(`${member.name}님을 팀장으로 지정하시겠습니까?`)) {
      changeTeamLeader(teamId, userId);
      toast({
        title: "팀장 변경 완료",
        description: `${member.name}님이 새로운 팀장이 되었습니다.`,
      });
      fetchTeam(teamId);
    }
  };

  const handleRemoveLeader = () => {
    // 권한 체크: 교수/슈퍼관리자만 가능
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      toast({
        title: "권한 없음",
        description: "팀장 해제는 교수만 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    if (!leader) return;

    if (confirm(`${leader.name}님의 팀장 권한을 해제하시겠습니까?`)) {
      changeTeamLeader(teamId, null);
      toast({
        title: "팀장 해제 완료",
        description: `${leader.name}님의 팀장 권한이 해제되었습니다.`,
      });
      fetchTeam(teamId);
    }
  };

  const handleRemoveMember = (userId: string) => {
    // 권한 체크: 교수/슈퍼관리자만 가능
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      toast({
        title: "권한 없음",
        description: "팀원 방출은 교수만 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    const member = members.find((m) => m.id === userId);
    if (!member) return;

    if (confirm(`정말 ${member.name}님을 팀에서 방출하시겠습니까?`)) {
      removeMemberFromTeam(teamId, userId);
      toast({
        title: "팀원 방출 완료",
        description: `${member.name}님이 팀에서 제거되었습니다.`,
      });
      fetchTeam(teamId);
    }
  };

  const handleStartAnalysis = () => {
    router.push(`/team/${teamId}/analysis`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Team Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-8 w-8" />
              {team.name}
            </h1>
            <p className="text-muted-foreground">
              {room.title}
            </p>
            {leader && (
              <p className="text-sm text-muted-foreground mt-1">
                팀장: {leader.name}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsIntegrationDialogOpen(true)}
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              연동 설정
            </Button>
            <Button onClick={handleStartAnalysis}>
              <BarChart3 className="mr-2 h-4 w-4" />
              분석 시작
            </Button>
          </div>
        </div>

        {/* Integration Status */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                GitHub 연동
              </CardTitle>
              <Github className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {team.github_url ? (
                <>
                  <div className="text-xs text-green-600 mb-2">✅ 연동 완료</div>
                  <a
                    href={team.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline truncate block"
                  >
                    {team.github_url}
                  </a>
                </>
              ) : (
                <div className="text-xs text-muted-foreground">
                  ❌ 연동 필요
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Notion 연동
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {team.notion_url ? (
                <>
                  <div className="text-xs text-green-600 mb-2">✅ 연동 완료</div>
                  <a
                    href={team.notion_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline truncate block"
                  >
                    {team.notion_url}
                  </a>
                </>
              ) : (
                <div className="text-xs text-muted-foreground">
                  ❌ 연동 필요
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>팀원 목록</CardTitle>
            <CardDescription>
              총 {members.length}명의 팀원
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member) => {
                const isLeader = leader?.id === member.id;
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar_url} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{member.name}</p>
                          {isLeader && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    {/* 교수/슈퍼관리자만 팀장 지정/해제 및 팀원 방출 가능 */}
                    {user && (user.role === 'admin' || user.role === 'super_admin') && (
                      <div className="flex gap-2">
                        {isLeader ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveLeader()}
                          >
                            <Crown className="mr-1 h-4 w-4 text-yellow-500" />
                            팀장 해제
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetLeader(member.id)}
                            >
                              팀장 지정
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {members.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  아직 팀원이 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Dialog */}
      <Dialog
        open={isIntegrationDialogOpen}
        onOpenChange={setIsIntegrationDialogOpen}
      >
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={handleSubmit(onSubmitIntegration)}>
            <DialogHeader>
              <DialogTitle>연동 설정</DialogTitle>
              <DialogDescription>
                GitHub와 Notion을 연동하여 팀 활동을 분석하세요
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="github_url" className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub Repository URL
                </Label>
                <Input
                  id="github_url"
                  placeholder="https://github.com/username/repository"
                  {...register("github_url")}
                />
                {errors.github_url && (
                  <p className="text-sm text-destructive">
                    {errors.github_url.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="notion_url" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notion Workspace URL
                </Label>
                <Input
                  id="notion_url"
                  placeholder="https://notion.so/workspace"
                  {...register("notion_url")}
                />
                {errors.notion_url && (
                  <p className="text-sm text-destructive">
                    {errors.notion_url.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsIntegrationDialogOpen(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
