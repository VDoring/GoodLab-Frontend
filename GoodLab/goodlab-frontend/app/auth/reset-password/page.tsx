"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { passwordDB } from "@/lib/mock-db";
import { ArrowLeft, Lock, Check } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // URL에서 이메일 가져오기
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "비밀번호는 최소 6자 이상이어야 합니다.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 비밀번호 검증
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        toast({
          title: "비밀번호 오류",
          description: passwordError,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // 비밀번호 일치 확인
      if (newPassword !== confirmPassword) {
        toast({
          title: "비밀번호 불일치",
          description: "비밀번호가 일치하지 않습니다.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Mock: 2초 대기 (비밀번호 재설정 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 비밀번호 업데이트
      passwordDB.set(email, newPassword);

      // 성공
      setIsSuccess(true);
      toast({
        title: "비밀번호 변경 완료",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      });

      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);

    } catch (error) {
      toast({
        title: "오류 발생",
        description: "비밀번호 재설정에 실패했습니다. 다시 시도해주세요.",
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
            <CardTitle>비밀번호 재설정</CardTitle>
            <CardDescription>
              {email ? (
                <>
                  <strong>{email}</strong>의 새 비밀번호를 입력해주세요.
                </>
              ) : (
                "새 비밀번호를 입력해주세요."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSuccess ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">새 비밀번호</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="새 비밀번호 (최소 6자)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {newPassword && confirmPassword && (
                    <div className="text-xs">
                      {newPassword === confirmPassword ? (
                        <p className="text-green-600 flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          비밀번호가 일치합니다
                        </p>
                      ) : (
                        <p className="text-red-600">비밀번호가 일치하지 않습니다</p>
                      )}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "변경 중..." : "비밀번호 변경"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">비밀번호 변경 완료</h3>
                  <p className="text-sm text-gray-600">
                    비밀번호가 성공적으로 변경되었습니다.
                  </p>
                  <p className="text-xs text-gray-400">
                    3초 후 자동으로 로그인 페이지로 이동합니다...
                  </p>
                </div>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
