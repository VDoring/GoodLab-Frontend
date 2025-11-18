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
  Megaphone,
  Pin,
  Edit,
  Plus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTeamStore, useRoomStore, useAuthStore, useAnnouncementStore } from "@/store";
import { teamMemberDB, userDB } from "@/lib/mock-db";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks";

const integrationSchema = z.object({
  github_url: z
    .string()
    .url({ message: "올바른 GitHub URL을 입력해주세요." })
    .optional()
    .or(z.literal("")),
});

type IntegrationFormData = z.infer<typeof integrationSchema>;

const announcementSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  const [isIntegrationDialogOpen, setIsIntegrationDialogOpen] = useState(false);
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<string | null>(null);

  const { isAuthenticated } = useRequireAuth();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const currentTeam = useTeamStore((state) => state.currentTeam);
  const fetchTeam = useTeamStore((state) => state.fetchTeam);
  const updateTeam = useTeamStore((state) => state.updateTeam);
  const getTeamMembers = useTeamStore((state) => state.getTeamMembers);
  const changeTeamLeader = useTeamStore((state) => state.changeTeamLeader);
  const removeMemberFromTeam = useTeamStore((state) => state.removeMemberFromTeam);
  const rooms = useRoomStore((state) => state.rooms);
  const fetchRooms = useRoomStore((state) => state.fetchRooms);

  // Announcement store
  const {
    fetchAnnouncements,
    getAnnouncementsByTeam,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    togglePin,
  } = useAnnouncementStore();

  // All hooks must be called before conditional returns
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IntegrationFormData>({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      github_url: currentTeam?.github_url || "",
    },
  });

  const {
    register: registerAnnouncement,
    handleSubmit: handleSubmitAnnouncement,
    formState: { errors: announcementErrors },
    reset: resetAnnouncement,
    setValue: setAnnouncementValue,
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const team = currentTeam;
  const room = team ? rooms.find((r) => r.id === team.room_id) : null;
  const members = getTeamMembers(teamId);
  const leader = team?.leader_id ? userDB.getById(team.leader_id) : null;
  const announcements = getAnnouncementsByTeam(teamId);

  // 팀 멤버인지 확인
  const isTeamMember = user ? members.some(m => m.id === user.id) : false;
  const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin');
  const isTeamLeader = user && team?.leader_id === user.id;

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeam(teamId);
      fetchRooms();
      fetchAnnouncements();
    }
  }, [isAuthenticated, teamId, fetchTeam, fetchRooms, fetchAnnouncements]);

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

  const onSubmitIntegration = async (data: IntegrationFormData) => {
    setIsLoading(true);
    try {
      const success = updateTeam(teamId, {
        github_url: data.github_url || undefined,
      });

      if (success) {
        toast({
          title: "연동 설정 저장 완료",
          description: "GitHub 연동 정보가 저장되었습니다.",
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

    // 팀장인 경우 경고
    if (leader?.id === userId) {
      if (!confirm(`${member.name}님은 현재 팀장입니다. 팀장을 방출하면 팀장이 자동으로 해제됩니다. 계속하시겠습니까?`)) {
        return;
      }
    } else {
      if (!confirm(`정말 ${member.name}님을 팀에서 방출하시겠습니까?`)) {
        return;
      }
    }

    removeMemberFromTeam(teamId, userId);
    toast({
      title: "팀원 방출 완료",
      description: `${member.name}님이 팀에서 제거되었습니다.`,
    });
    fetchTeam(teamId);
  };

  const handleStartAnalysis = () => {
    router.push(`/team/${teamId}/analysis`);
  };

  const handleOpenAnnouncementDialog = (announcementId?: string) => {
    if (announcementId) {
      const announcement = announcements.find((a) => a.id === announcementId);
      if (announcement) {
        setAnnouncementValue("title", announcement.title);
        setAnnouncementValue("content", announcement.content);
        setEditingAnnouncement(announcementId);
      }
    } else {
      resetAnnouncement();
      setEditingAnnouncement(null);
    }
    setIsAnnouncementDialogOpen(true);
  };

  const onSubmitAnnouncement = async (data: AnnouncementFormData) => {
    if (!user) return;

    // 권한 체크: 팀장 또는 교수/슈퍼관리자만 공지사항 생성/수정 가능
    if (!isAdmin && !isTeamLeader) {
      toast({
        title: "권한 없음",
        description: "공지사항은 팀장 또는 교수만 작성할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingAnnouncement) {
        // Update existing announcement
        const success = updateAnnouncement(editingAnnouncement, {
          title: data.title,
          content: data.content,
        });

        if (success) {
          toast({
            title: "공지사항 수정 완료",
            description: "공지사항이 성공적으로 수정되었습니다.",
          });
        }
      } else {
        // Create new announcement
        createAnnouncement({
          team_id: teamId,
          title: data.title,
          content: data.content,
          created_by: user.id,
          pinned: false,
        });

        toast({
          title: "공지사항 등록 완료",
          description: "새 공지사항이 등록되었습니다.",
        });
      }

      setIsAnnouncementDialogOpen(false);
      resetAnnouncement();
      setEditingAnnouncement(null);
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "공지사항 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnnouncement = (announcementId: string) => {
    // 권한 체크: 팀장 또는 교수/슈퍼관리자만 공지사항 삭제 가능
    if (!isAdmin && !isTeamLeader) {
      toast({
        title: "권한 없음",
        description: "공지사항은 팀장 또는 교수만 삭제할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("정말 이 공지사항을 삭제하시겠습니까?")) return;

    deleteAnnouncement(announcementId);
    toast({
      title: "공지사항 삭제 완료",
      description: "공지사항이 삭제되었습니다.",
    });
  };

  const handleTogglePin = (announcementId: string) => {
    // 권한 체크: 팀장 또는 교수/슈퍼관리자만 공지사항 고정/해제 가능
    if (!isAdmin && !isTeamLeader) {
      toast({
        title: "권한 없음",
        description: "공지사항 고정은 팀장 또는 교수만 할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    // togglePin 호출 전에 현재 상태를 저장
    const announcement = announcements.find((a) => a.id === announcementId);
    const wasPinned = announcement?.pinned || false;

    togglePin(announcementId);

    toast({
      title: wasPinned ? "고정 해제" : "고정 완료",
      description: wasPinned
        ? "공지사항 고정이 해제되었습니다."
        : "공지사항이 상단에 고정되었습니다.",
    });
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

        {/* Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                공지사항
              </CardTitle>
              <CardDescription>팀 공지사항을 확인하세요</CardDescription>
            </div>
            {(isAdmin || isTeamLeader) && (
              <Button
                size="sm"
                onClick={() => handleOpenAnnouncementDialog()}
              >
                <Plus className="mr-2 h-4 w-4" />
                공지 작성
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {announcements.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                등록된 공지사항이 없습니다.
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map((announcement) => {
                  const author = userDB.getById(announcement.created_by);
                  return (
                    <div
                      key={announcement.id}
                      className={`border rounded-lg p-4 ${
                        announcement.pinned
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {announcement.pinned && (
                            <Pin className="h-4 w-4 text-blue-600" />
                          )}
                          <h4 className="font-semibold text-lg">
                            {announcement.title}
                          </h4>
                        </div>
                        {(isAdmin || isTeamLeader) && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTogglePin(announcement.id)}
                            >
                              <Pin
                                className={`h-4 w-4 ${
                                  announcement.pinned
                                    ? "text-blue-600"
                                    : "text-gray-400"
                                }`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleOpenAnnouncementDialog(announcement.id)
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteAnnouncement(announcement.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap mb-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>작성자: {author?.name || "알 수 없음"}</span>
                        <span>•</span>
                        <span>
                          {new Date(announcement.created_at).toLocaleDateString(
                            "ko-KR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

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
              {members
                .sort((a, b) => {
                  // 팀장을 가장 상단에 표시
                  if (leader?.id === a.id) return -1;
                  if (leader?.id === b.id) return 1;
                  return 0;
                })
                .map((member) => {
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
                GitHub을 연동하여 팀 활동을 분석하세요
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

      {/* Announcement Dialog */}
      <Dialog
        open={isAnnouncementDialogOpen}
        onOpenChange={setIsAnnouncementDialogOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? "공지사항 수정" : "새 공지사항 작성"}
            </DialogTitle>
            <DialogDescription>
              팀원들에게 전달할 공지사항을 작성하세요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAnnouncement(onSubmitAnnouncement)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="announcement-title">제목</Label>
                <Input
                  id="announcement-title"
                  placeholder="공지사항 제목을 입력하세요"
                  {...registerAnnouncement("title")}
                />
                {announcementErrors.title && (
                  <p className="text-sm text-destructive">
                    {announcementErrors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="announcement-content">내용</Label>
                <textarea
                  id="announcement-content"
                  rows={6}
                  placeholder="공지사항 내용을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...registerAnnouncement("content")}
                />
                {announcementErrors.content && (
                  <p className="text-sm text-destructive">
                    {announcementErrors.content.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsAnnouncementDialogOpen(false);
                  resetAnnouncement();
                  setEditingAnnouncement(null);
                }}
              >
                취소
              </Button>
              <Button type="submit">
                {editingAnnouncement ? "수정" : "등록"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
