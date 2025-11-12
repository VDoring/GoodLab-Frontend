"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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
import { Plus, Users, Crown, Trash2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const teamSchema = z.object({
  name: z.string().min(2, { message: "팀 이름은 최소 2자 이상이어야 합니다." }),
});

type TeamFormData = z.infer<typeof teamSchema>;

export default function RoomDetailPage() {
  const params = useParams();
  const roomId = params.id as string;
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Replace with actual data from store
  const room = {
    id: roomId,
    title: "캡스톤 디자인 (2026-1학기)",
    description: "2026년 1학기 캡스톤 디자인 프로젝트",
    start_date: "2026-03-01",
    end_date: "2026-06-30",
  };

  const teams = [
    {
      id: "1",
      name: "팀 A",
      leader: { id: "1", name: "김철수" },
      members: [
        { id: "1", name: "김철수" },
        { id: "2", name: "이영희" },
        { id: "3", name: "박민수" },
      ],
    },
    {
      id: "2",
      name: "팀 B",
      leader: null,
      members: [
        { id: "4", name: "최지훈" },
        { id: "5", name: "정수민" },
      ],
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
  });

  const onSubmit = async (data: TeamFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement team creation
      console.log("Team data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("팀 생성 성공! (백엔드 연동 필요)");
      setIsCreateTeamDialogOpen(false);
      reset();
    } catch (error) {
      console.error("Team creation error:", error);
      alert("팀 생성 실패");
    } finally {
      setIsLoading(false);
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
            <Button variant="outline">방 설정</Button>
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
            {teams.map((team) => (
              <Card key={team.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {team.name}
                      {team.leader && (
                        <span className="text-sm font-normal text-muted-foreground">
                          (팀장: {team.leader.name})
                        </span>
                      )}
                      {!team.leader && (
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
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    멤버 {team.members.length}명
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">팀원 목록</div>
                    <div className="flex flex-wrap gap-2">
                      {team.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                        >
                          {member.name}
                          {team.leader?.id === member.id && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
