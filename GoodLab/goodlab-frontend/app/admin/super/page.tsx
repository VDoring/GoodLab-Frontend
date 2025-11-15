"use client";

import { useState, useEffect } from "react";
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
import type { User, UserRole, PermissionChangeHistory } from "@/types";
import { userDB, initializeMockDB, permissionChangeHistoryDB } from "@/lib/mock-db";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";

export default function SuperAdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);

  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"grant" | "revoke" | null>(null);
  const [permissionHistory, setPermissionHistory] = useState<PermissionChangeHistory[]>([]);

  useEffect(() => {
    // 슈퍼관리자 권한 체크
    if (!user || user.role !== 'super_admin') {
      router.push('/403');
      return;
    }

    loadUsers();
  }, [user, router]);

  const loadUsers = () => {
    initializeMockDB();
    const allUsers = userDB.getAll();
    setUsers(allUsers);

    // 권한 변경 이력도 로드
    const history = permissionChangeHistoryDB.getRecent(20);
    setPermissionHistory(history);
  };

  if (!user || user.role !== 'super_admin') {
    return null;
  }

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
    if (!selectedUser || !actionType || !user) return;

    const oldRole = selectedUser.role;
    const newRole: UserRole = actionType === "grant" ? "admin" : "user";
    const success = userDB.update(selectedUser.id, { role: newRole });

    if (success) {
      // 권한 변경 이력 기록
      permissionChangeHistoryDB.create({
        target_user_id: selectedUser.id,
        target_user_name: selectedUser.name,
        target_user_email: selectedUser.email,
        changed_by: user.id,
        changed_by_name: user.name,
        action: actionType === "grant" ? "grant_admin" : "revoke_admin",
        old_role: oldRole,
        new_role: newRole,
      });

      toast({
        title: actionType === "grant" ? "교수 권한 부여 완료" : "교수 권한 회수 완료",
        description: `${selectedUser.name}님의 권한이 변경되었습니다.`,
      });

      // 사용자 목록 다시 로드
      loadUsers();
    } else {
      toast({
        title: "권한 변경 실패",
        description: "사용자를 찾을 수 없습니다.",
        variant: "destructive",
      });
    }

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

        {/* Permission Change History */}
        <Card>
          <CardHeader>
            <CardTitle>권한 변경 이력</CardTitle>
            <CardDescription>
              최근 20개의 권한 변경 기록
            </CardDescription>
          </CardHeader>
          <CardContent>
            {permissionHistory.length > 0 ? (
              <div className="space-y-3">
                {permissionHistory.map((history) => (
                  <div
                    key={history.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {history.action === 'grant_admin' ? (
                          <Shield className="h-4 w-4 text-blue-600" />
                        ) : (
                          <ShieldOff className="h-4 w-4 text-gray-600" />
                        )}
                        <span className="font-medium">
                          {history.target_user_name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({history.target_user_email})
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {history.action === 'grant_admin'
                          ? `교수 권한 부여`
                          : `교수 권한 회수`}
                        {' • '}
                        <span className="font-medium">{getRoleLabel(history.old_role)}</span>
                        {' → '}
                        <span className="font-medium">{getRoleLabel(history.new_role)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        변경자: {history.changed_by_name} • {new Date(history.created_at).toLocaleString('ko-KR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                권한 변경 이력이 없습니다.
              </div>
            )}
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
