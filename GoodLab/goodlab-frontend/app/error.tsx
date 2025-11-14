"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6">
          <div className="mb-6 rounded-full bg-red-100 p-4">
            <AlertTriangle className="h-16 w-16 text-red-600" />
          </div>

          <h1 className="mb-2 text-4xl font-bold text-gray-900">500</h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            서버 오류
          </h2>

          <p className="mb-6 text-center text-gray-600">
            죄송합니다. 예상치 못한 오류가 발생했습니다.
            <br />
            문제가 계속되면 관리자에게 문의해주세요.
          </p>

          {error.message && (
            <div className="mb-6 w-full rounded-lg bg-gray-100 p-4">
              <p className="text-sm font-mono text-gray-700 break-all">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              onClick={() => reset()}
              className="flex-1 gap-2"
              variant="default"
            >
              <RefreshCw className="h-4 w-4" />
              다시 시도
            </Button>
            <Button asChild className="flex-1 gap-2" variant="outline">
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
                홈으로 가기
              </Link>
            </Button>
          </div>

          {error.digest && (
            <p className="mt-4 text-xs text-gray-500">
              오류 ID: {error.digest}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
