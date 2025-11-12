"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, ShieldOff, Search, Users, UserCog } from "lucide-react";
import type { User, UserRole } from "@/types";

export default function SuperAdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"grant" | "revoke" | null>(null);

  // TODO: Replace with actual data from store
  const users: User[] = [
    {
      id: "1",
      email: "hong@example.com",
      name: "홍길동",
      role: "admin",
      avatar_url: "",
      created_at: "2026-01-15T10:00:00Z",
    },
    {
      id: "2",
      email: "kim@example.com",
      name: "김철수",
      role: "user",
      avatar_url: "",
      created_at: "2026-02-01T14:30:00Z",
    },
    {
      id: "3",
      email: "lee@example.com",
      name: "이영희",
      role: "team_leader",
      avatar_url: "",
      created_at: "2026-02-05T09:15:00Z",
    },
    {
      id: "4",
      email: "park@example.com",
      name: "박민수",
      role: "user",
      avatar_url: "",
      created_at: "2026-02-10T11:20:00Z",
    },
  ];

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    users: users.filter((u) => u.role === "user").length,
    leaders: users.filter((u) => u.role === "team_leader").length,
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "team_leader":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return "슈퍼관리자";
      case "admin":
        return "교수";
      case "team_leader":
        return "팀장";
      default:
        return "일반";
    }
  };

  const handleGrantAdmin = (user: User) => {
    setSelectedUser(user);
    setActionType("grant");
  };

  const handleRevokeAdmin = (user: User) => {
    setSelectedUser(user);
    setActionType("revoke");
  };

  const handleConfirmAction = () => {
    if (!selectedUser || !actionType) return;

    // TODO: Implement actual permission change
    console.log(
      `${actionType === "grant" ? "Grant" : "Revoke"} admin to:`,
      selectedUser.id
    );
    alert(
      `${actionType === "grant" ? "교수 권한 부여" : "교수 권한 회수"} 완료! (백엔드 연동 필요)`
    );

    setSelectedUser(null);
    setActionType(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8" />
            슈퍼관리자 대시보드
          </h1>
          <p className="text-muted-foreground">
            사용자 권한 관리 및 시스템 현황
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 사용자</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">교수</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.admins}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">팀장</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leaders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">일반 사용자</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
            </CardContent>
          </Card>
        </div>

        {/* User List */}
        <Card>
          <CardHeader>
            <CardTitle>사용자 목록</CardTitle>
            <CardDescription>
              교수 권한을 부여하거나 회수할 수 있습니다
            </CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="이름 또는 이메일로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar_url} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="mt-1">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs rounded ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user.role === "admin" ? (
                      <Button
                        variant="outline"
                        onClick={() => handleRevokeAdmin(user)}
                      >
                        <ShieldOff className="mr-2 h-4 w-4" />
                        교수 권한 회수
                      </Button>
                    ) : (
                      <Button onClick={() => handleGrantAdmin(user)}>
                        <Shield className="mr-2 h-4 w-4" />
                        교수 권한 부여
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={!!selectedUser && !!actionType}
        onOpenChange={() => {
          setSelectedUser(null);
          setActionType(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "grant" ? "교수 권한 부여" : "교수 권한 회수"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>
                  {actionType === "grant"
                    ? `${selectedUser.name}님에게 교수 권한을 부여하시겠습니까?`
                    : `${selectedUser.name}님의 교수 권한을 회수하시겠습니까?`}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedUser(null);
                setActionType(null);
              }}
            >
              취소
            </Button>
            <Button
              variant={actionType === "revoke" ? "destructive" : "default"}
              onClick={handleConfirmAction}
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
