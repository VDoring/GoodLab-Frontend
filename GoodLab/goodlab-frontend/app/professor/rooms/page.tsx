"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { QRCodeDialog } from "@/components/features/qr-code-dialog";
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
import { Plus, Users, QrCode, Link as LinkIcon, Settings } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRoomStore } from "@/store";
import { useAuthStore } from "@/store";
import { roomMemberDB, teamDB } from "@/lib/mock-db";
import { useRequireAdmin } from "@/hooks";

const roomSchema = z.object({
  title: z.string().min(2, { message: "방 제목은 최소 2자 이상이어야 합니다." }),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type RoomFormData = z.infer<typeof roomSchema>;

export default function RoomsPage() {
  // 관리자 권한 체크
  const { hasPermission } = useRequireAdmin();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qrDialogRoom, setQrDialogRoom] = useState<{
    title: string;
    inviteCode: string;
  } | null>(null);

  const user = useAuthStore((state) => state.user);
  const rooms = useRoomStore((state) => state.rooms);
  const fetchRooms = useRoomStore((state) => state.fetchRooms);
  const createRoom = useRoomStore((state) => state.createRoom);

  useEffect(() => {
    if (hasPermission) {
      fetchRooms();
    }
  }, [hasPermission, fetchRooms]);

  if (!hasPermission) {
    return null;
  }

  // 방에 속한 팀 수와 멤버 수 계산
  const getRoomStats = (roomId: string) => {
    const teams = teamDB.getByRoomId(roomId);
    const members = roomMemberDB.getByRoomId(roomId);
    return {
      teamCount: teams.length,
      memberCount: members.length,
    };
  };

  const handleShowQR = (room: typeof rooms[0]) => {
    setQrDialogRoom({
      title: room.title,
      inviteCode: room.invite_code,
    });
  };

  const handleCopyLink = async (inviteCode: string) => {
    const inviteUrl = `${window.location.origin}/invite/${inviteCode}`;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      alert("링크가 복사되었습니다!");
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("링크 복사에 실패했습니다.");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
  });

  const onSubmit = async (data: RoomFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      createRoom({
        ...data,
        created_by: user.id,
      });

      alert("방이 성공적으로 생성되었습니다!");
      setIsCreateDialogOpen(false);
      reset();
      fetchRooms();
    } catch (error) {
      console.error("Room creation error:", error);
      alert("방 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">내 방 목록</h1>
            <p className="text-muted-foreground">
              방을 생성하고 관리하세요
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                방 만들기
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>새 방 만들기</DialogTitle>
                  <DialogDescription>
                    팀 프로젝트를 위한 새로운 방을 생성합니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">방 제목 *</Label>
                    <Input
                      id="title"
                      placeholder="캡스톤 디자인 (2026-1학기)"
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">설명</Label>
                    <Input
                      id="description"
                      placeholder="방에 대한 설명을 입력하세요"
                      {...register("description")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">시작일</Label>
                      <Input
                        id="start_date"
                        type="date"
                        {...register("start_date")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_date">종료일</Label>
                      <Input
                        id="end_date"
                        type="date"
                        {...register("end_date")}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsCreateDialogOpen(false)}
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

        {/* Rooms Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const stats = getRoomStats(room.id);
            return (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{room.title}</span>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {room.description || "설명 없음"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      팀: {stats.teamCount}개
                    </div>
                    <div className="text-muted-foreground">
                      참여자: {stats.memberCount}명
                    </div>
                  </div>
                  {(room.start_date || room.end_date) && (
                    <div className="text-xs text-muted-foreground">
                      {room.start_date} ~ {room.end_date}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleShowQR(room)}
                    >
                      <QrCode className="mr-1 h-4 w-4" />
                      QR
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleCopyLink(room.invite_code)}
                    >
                      <LinkIcon className="mr-1 h-4 w-4" />
                      링크
                    </Button>
                    <Link href={`/professor/rooms/${room.id}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">
                        <Settings className="mr-1 h-4 w-4" />
                        관리
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              아직 생성된 방이 없습니다.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              첫 번째 방 만들기
            </Button>
          </div>
        )}
      </div>

      {/* QR Code Dialog */}
      {qrDialogRoom && (
        <QRCodeDialog
          isOpen={!!qrDialogRoom}
          onClose={() => setQrDialogRoom(null)}
          title={qrDialogRoom.title}
          inviteUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${qrDialogRoom.inviteCode}`}
        />
      )}
    </MainLayout>
  );
}
