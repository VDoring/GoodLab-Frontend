import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-primary mb-2">
            GoodLab
          </CardTitle>
          <CardDescription className="text-base">
            교수와 학생이 함께 사용하는 팀 프로젝트 관리 및 분석 플랫폼
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/auth/login" className="block">
            <Button className="w-full" size="lg">
              로그인
            </Button>
          </Link>
          <Link href="/auth/signup" className="block">
            <Button variant="secondary" className="w-full" size="lg">
              회원가입
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
