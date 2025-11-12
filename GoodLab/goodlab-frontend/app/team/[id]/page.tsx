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
  const teamId = params.id as string;
  const [isIntegrationDialogOpen, setIsIntegrationDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Replace with actual data from store
  const team = {
    id: teamId,
    name: "팀 A",
    room: { id: "1", title: "캡스톤 디자인 (2026-1학기)" },
    leader: { id: "1", name: "김철수", email: "kim@example.com", avatar: "" },
    github_url: "https://github.com/team-a/project",
    notion_url: "https://notion.so/team-a/workspace",
    members: [
      {
        id: "1",
        name: "김철수",
        email: "kim@example.com",
        avatar: "",
        isLeader: true,
      },
      {
        id: "2",
        name: "이영희",
        email: "lee@example.com",
        avatar: "",
        isLeader: false,
      },
      {
        id: "3",
        name: "박민수",
        email: "park@example.com",
        avatar: "",
        isLeader: false,
      },
    ],
  };

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
      // TODO: Implement integration update
      console.log("Integration data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("연동 설정이 저장되었습니다! (백엔드 연동 필요)");
      setIsIntegrationDialogOpen(false);
    } catch (error) {
      console.error("Integration error:", error);
      alert("연동 설정 저장 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetLeader = (userId: string) => {
    // TODO: Implement set leader
    console.log("Set leader:", userId);
    alert(`팀장 지정 기능 (백엔드 연동 필요)`);
  };

  const handleRemoveMember = (userId: string) => {
    // TODO: Implement remove member
    console.log("Remove member:", userId);
    if (confirm("정말 이 팀원을 방출하시겠습니까?")) {
      alert(`팀원 방출 기능 (백엔드 연동 필요)`);
    }
  };

  const handleStartAnalysis = () => {
    // TODO: Implement analysis start
    alert("분석을 시작합니다! (백엔드 연동 필요)");
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
              {team.room.title}
            </p>
            {team.leader && (
              <p className="text-sm text-muted-foreground mt-1">
                팀장: {team.leader.name}
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
              총 {team.members.length}명의 팀원
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.name}</p>
                        {member.isLeader && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!member.isLeader && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetLeader(member.id)}
                      >
                        팀장 지정
                      </Button>
                    )}
                    {!member.isLeader && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
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
