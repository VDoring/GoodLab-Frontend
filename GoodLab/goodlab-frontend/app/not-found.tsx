import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <FileQuestion className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-3xl">404 - 페이지를 찾을 수 없습니다</CardTitle>
          <CardDescription className="text-base">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/dashboard">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              대시보드로 돌아가기
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              홈으로 가기
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
