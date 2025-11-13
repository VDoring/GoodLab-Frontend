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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Users, Crown, Trash2, Settings, Edit, Calendar } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRoomStore, useTeamStore, useAuthStore } from "@/store";
import { teamMemberDB, userDB } from "@/lib/mock-db";
import { useToast } from "@/hooks/use-toast";
import { useRequireAdmin } from "@/hooks";

const teamSchema = z.object({
  name: z.string().min(2, { message: "팀 이름은 최소 2자 이상이어야 합니다." }),
});

const roomSchema = z.object({
  title: z.string().min(2, { message: "방 제목은 최소 2자 이상이어야 합니다." }),
  description: z.string().optional(),
  start_date: z.string().min(1, { message: "시작일을 선택해주세요." }),
  end_date: z.string().min(1, { message: "종료일을 선택해주세요." }),
});

type TeamFormData = z.infer<typeof teamSchema>;
type RoomFormData = z.infer<typeof roomSchema>;

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [isEditRoomDialogOpen, setIsEditRoomDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { hasPermission } = useRequireAdmin();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const rooms = useRoomStore((state) => state.rooms);
  const fetchRooms = useRoomStore((state) => state.fetchRooms);
  const updateRoom = useRoomStore((state) => state.updateRoom);
  const deleteRoom = useRoomStore((state) => state.deleteRoom);
  const teams = useTeamStore((state) => state.teams);
  const fetchTeamsByRoom = useTeamStore((state) => state.fetchTeamsByRoom);
  const createTeam = useTeamStore((state) => state.createTeam);
  const deleteTeam = useTeamStore((state) => state.deleteTeam);
  const getTeamMembers = useTeamStore((state) => state.getTeamMembers);

  const room = rooms.find((r) => r.id === roomId);

  useEffect(() => {
    if (hasPermission) {
      fetchRooms();
      fetchTeamsByRoom(roomId);
    }
  }, [hasPermission, roomId, fetchRooms, fetchTeamsByRoom]);

  if (!hasPermission) {
    return null;
  }

  if (!room) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">방을 찾을 수 없습니다.</p>
        </div>
      </MainLayout>
    );
  }

  // 팀별 멤버 및 리더 정보 가져오기
  const getTeamDetails = (teamId: string) => {
    const members = getTeamMembers(teamId);
    const team = teams.find((t) => t.id === teamId);
    const leader = team?.leader_id ? userDB.getById(team.leader_id) : null;
    return { members, leader };
  };

  // Team form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
  });

  // Room form
  const {
    register: registerRoom,
    handleSubmit: handleSubmitRoom,
    formState: { errors: errorsRoom },
    reset: resetRoom,
    setValue: setValueRoom,
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      title: room?.title || "",
      description: room?.description || "",
      start_date: room?.start_date || "",
      end_date: room?.end_date || "",
    },
  });

  // Update room form when room data changes
  useEffect(() => {
    if (room) {
      setValueRoom("title", room.title);
      setValueRoom("description", room.description || "");
      setValueRoom("start_date", room.start_date || "");
      setValueRoom("end_date", room.end_date || "");
    }
  }, [room, setValueRoom]);

  const onSubmit = async (data: TeamFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      createTeam({
        room_id: roomId,
        name: data.name,
      });

      toast({
        title: "팀 생성 완료",
        description: `${data.name}이(가) 성공적으로 생성되었습니다.`,
      });

      setIsCreateTeamDialogOpen(false);
      reset();
      fetchTeamsByRoom(roomId);
    } catch (error) {
      console.error("Team creation error:", error);
      toast({
        title: "팀 생성 실패",
        description: "팀 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitRoomEdit = async (data: RoomFormData) => {
    setIsLoading(true);
    try {
      const success = updateRoom(roomId, {
        title: data.title,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
      });

      if (success) {
        toast({
          title: "방 수정 완료",
          description: "방 정보가 성공적으로 수정되었습니다.",
        });
        setIsEditRoomDialogOpen(false);
        fetchRooms();
      } else {
        toast({
          title: "방 수정 실패",
          description: "방을 찾을 수 없습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Room update error:", error);
      toast({
        title: "방 수정 실패",
        description: "방 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRoom = () => {
    if (confirm(`정말 "${room?.title}" 방을 삭제하시겠습니까? 방 안의 모든 팀과 데이터가 삭제됩니다.`)) {
      const success = deleteRoom(roomId);
      if (success) {
        toast({
          title: "방 삭제 완료",
          description: `${room?.title}이(가) 삭제되었습니다.`,
        });
        router.push('/professor/rooms');
      } else {
        toast({
          title: "방 삭제 실패",
          description: "방을 찾을 수 없습니다.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteTeam = (teamId: string, teamName: string) => {
    if (confirm(`정말 "${teamName}" 팀을 삭제하시겠습니까?`)) {
      const success = deleteTeam(teamId);
      if (success) {
        toast({
          title: "팀 삭제 완료",
          description: `${teamName}이(가) 삭제되었습니다.`,
        });
        fetchTeamsByRoom(roomId);
      } else {
        toast({
          title: "팀 삭제 실패",
          description: "팀을 찾을 수 없습니다.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Room Info */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{room.title}</h1>
              <p className="text-muted-foreground">{room.description}</p>
            </div>
            <div className="flex gap-2">
              <Dialog open={isEditRoomDialogOpen} onOpenChange={setIsEditRoomDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    방 설정
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleSubmitRoom(onSubmitRoomEdit)}>
                    <DialogHeader>
                      <DialogTitle>방 설정</DialogTitle>
                      <DialogDescription>
                        방 정보를 수정하거나 삭제할 수 있습니다.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="room-title">방 제목 *</Label>
                        <Input
                          id="room-title"
                          placeholder="캡스톤 디자인"
                          {...registerRoom("title")}
                        />
                        {errorsRoom.title && (
                          <p className="text-sm text-destructive">
                            {errorsRoom.title.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="room-description">설명</Label>
                        <Textarea
                          id="room-description"
                          placeholder="방에 대한 설명을 입력하세요"
                          {...registerRoom("description")}
                        />
                        {errorsRoom.description && (
                          <p className="text-sm text-destructive">
                            {errorsRoom.description.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="room-start-date" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            시작일 *
                          </Label>
                          <Input
                            id="room-start-date"
                            type="date"
                            {...registerRoom("start_date")}
                          />
                          {errorsRoom.start_date && (
                            <p className="text-sm text-destructive">
                              {errorsRoom.start_date.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="room-end-date" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            종료일 *
                          </Label>
                          <Input
                            id="room-end-date"
                            type="date"
                            {...registerRoom("end_date")}
                          />
                          {errorsRoom.end_date && (
                            <p className="text-sm text-destructive">
                              {errorsRoom.end_date.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="border-t pt-4 mt-2">
                        <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                          <div>
                            <p className="font-medium text-destructive">위험 구역</p>
                            <p className="text-sm text-muted-foreground">
                              이 방과 모든 팀을 삭제합니다
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteRoom}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            방 삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsEditRoomDialogOpen(false)}
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
            </div>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>기간: {room.start_date} ~ {room.end_date}</span>
            <span>팀 수: {teams.length}개</span>
          </div>
        </div>

        {/* Teams Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">팀 목록</h2>
            <Dialog
              open={isCreateTeamDialogOpen}
              onOpenChange={setIsCreateTeamDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  새 팀 만들기
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <DialogHeader>
                    <DialogTitle>새 팀 만들기</DialogTitle>
                    <DialogDescription>
                      {room.title}에 새로운 팀을 추가합니다.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">팀 이름 *</Label>
                      <Input
                        id="name"
                        placeholder="팀 A"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsCreateTeamDialogOpen(false)}
                    >
                      취소
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "생성 중..." : "생성하기"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Teams List */}
          <div className="space-y-4">
            {teams.map((team) => {
              const { members, leader } = getTeamDetails(team.id);
              return (
                <Card key={team.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {team.name}
                        {leader && (
                          <span className="text-sm font-normal text-muted-foreground">
                            (팀장: {leader.name})
                          </span>
                        )}
                        {!leader && (
                          <span className="text-sm font-normal text-muted-foreground">
                            (팀장 없음)
                          </span>
                        )}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Link href={`/team/${team.id}`}>
                          <Button variant="outline" size="sm">
                            관리
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTeam(team.id, team.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      멤버 {members.length}명
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">팀원 목록</div>
                      <div className="flex flex-wrap gap-2">
                        {members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                          >
                            {member.name}
                            {leader?.id === member.id && (
                              <Crown className="h-3 w-3 text-yellow-500" />
                            )}
                          </div>
                        ))}
                        {members.length === 0 && (
                          <span className="text-sm text-muted-foreground">
                            팀원이 없습니다
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {teams.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                아직 생성된 팀이 없습니다.
              </p>
              <Button onClick={() => setIsCreateTeamDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                첫 번째 팀 만들기
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
