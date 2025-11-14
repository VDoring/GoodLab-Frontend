"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { userDB } from "@/lib/mock-db";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 이메일이 존재하는지 확인
      const user = userDB.getByEmail(email);

      // 보안을 위해 이메일이 없어도 성공 메시지 표시 (실제로는)
      // Mock이므로 여기서는 실제로 확인
      if (!user) {
        toast({
          title: "이메일을 확인해주세요",
          description: "등록되지 않은 이메일입니다.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Mock: 2초 대기 (이메일 전송 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 이메일 전송 성공
      setEmailSent(true);
      toast({
        title: "이메일 전송 완료",
        description: "비밀번호 재설정 링크를 이메일로 전송했습니다.",
      });

      // Mock: 실제로는 이메일로 토큰이 전송되지만, 여기서는 바로 reset 페이지로 이동
      // 3초 후 자동으로 리셋 페이지로 이동
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }, 3000);

    } catch (error) {
      toast({
        title: "오류 발생",
        description: "이메일 전송에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">GoodLab</h1>
          <p className="mt-2 text-sm text-gray-600">
            팀 프로젝트 협업 관리 플랫폼
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>비밀번호 찾기</CardTitle>
            <CardDescription>
              가입하신 이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@goodlab.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "전송 중..." : "재설정 링크 보내기"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">이메일을 확인하세요</h3>
                  <p className="text-sm text-gray-600">
                    <strong>{email}</strong>로 비밀번호 재설정 링크를 전송했습니다.
                  </p>
                  <p className="text-xs text-gray-500">
                    이메일이 오지 않았다면 스팸 폴더를 확인해주세요.
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  3초 후 자동으로 재설정 페이지로 이동합니다...
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Link
              href="/auth/login"
              className="flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              로그인으로 돌아가기
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
