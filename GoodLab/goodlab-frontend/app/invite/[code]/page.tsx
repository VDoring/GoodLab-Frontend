"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useAuthStore } from "@/store";
import { roomDB, roomMemberDB } from "@/lib/mock-db";
import { useToast } from "@/hooks/use-toast";

type InviteStatus = 'checking' | 'valid' | 'invalid' | 'already_joined' | 'joined';

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [status, setStatus] = useState<InviteStatus>('checking');
  const [roomInfo, setRoomInfo] = useState<{ id: string; title: string; description?: string } | null>(null);

  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const checkInviteCode = () => {
      // 초대 코드로 방 찾기
      const room = roomDB.getByInviteCode(code);

      if (!room) {
        setStatus('invalid');
        return;
      }

      setRoomInfo({
        id: room.id,
        title: room.title,
        description: room.description,
      });

      // 사용자가 로그인하지 않은 경우
      if (!user) {
        setStatus('valid');
        return;
      }

      // 이미 참여 중인지 확인
      const members = roomMemberDB.getByRoomId(room.id);
      const alreadyJoined = members.some((m) => m.user_id === user.id);

      if (alreadyJoined) {
        setStatus('already_joined');
      } else {
        setStatus('valid');
      }
    };

    checkInviteCode();
  }, [code, user]);

  const handleJoinRoom = () => {
    if (!user || !roomInfo) {
      // 로그인되지 않은 경우 로그인 페이지로 이동
      router.push(`/auth/login?redirect=/invite/${code}`);
      return;
    }

    // 방에 참여
    roomMemberDB.add(roomInfo.id, user.id);

    toast({
      title: "방 참여 완료",
      description: `${roomInfo.title}에 성공적으로 참여했습니다.`,
    });

    setStatus('joined');

    // 2초 후 대시보드로 이동
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleGoToLogin = () => {
    router.push(`/auth/login?redirect=/invite/${code}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'checking' && (
            <>
              <div className="mx-auto mb-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
              <CardTitle>초대 코드 확인 중...</CardTitle>
              <CardDescription>잠시만 기다려주세요</CardDescription>
            </>
          )}

          {status === 'invalid' && (
            <>
              <div className="mx-auto mb-4">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle>유효하지 않은 초대 코드</CardTitle>
              <CardDescription>
                초대 코드가 만료되었거나 존재하지 않습니다.
              </CardDescription>
            </>
          )}

          {(status === 'valid' || status === 'already_joined') && roomInfo && (
            <>
              <div className="mx-auto mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>{roomInfo.title}</CardTitle>
              <CardDescription>
                {roomInfo.description || "프로젝트 협업 공간"}
              </CardDescription>
            </>
          )}

          {status === 'joined' && roomInfo && (
            <>
              <div className="mx-auto mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle>참여 완료!</CardTitle>
              <CardDescription>
                {roomInfo.title}에 성공적으로 참여했습니다.
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {status === 'valid' && (
            <>
              {!isAuthenticated && (
                <div className="text-sm text-center text-muted-foreground mb-4">
                  방에 참여하려면 먼저 로그인해야 합니다.
                </div>
              )}
              <Button className="w-full" onClick={isAuthenticated ? handleJoinRoom : handleGoToLogin}>
                {isAuthenticated ? '방 참여하기' : '로그인하고 참여하기'}
              </Button>
            </>
          )}

          {status === 'already_joined' && (
            <>
              <div className="text-sm text-center text-muted-foreground mb-4">
                이미 이 방에 참여 중입니다.
              </div>
              <Button className="w-full" onClick={handleGoToDashboard}>
                대시보드로 이동
              </Button>
            </>
          )}

          {status === 'invalid' && (
            <Button className="w-full" variant="outline" onClick={() => router.push('/')}>
              홈으로 돌아가기
            </Button>
          )}

          {status === 'joined' && (
            <div className="text-sm text-center text-muted-foreground">
              곧 대시보드로 이동합니다...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
