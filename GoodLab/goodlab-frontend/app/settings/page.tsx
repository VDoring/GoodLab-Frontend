"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Bell, Moon, Globe, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { resetMockDB } from "@/lib/mock-db";

export default function SettingsPage() {
  const { isAuthenticated } = useRequireAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ko");

  if (!isAuthenticated) {
    return null;
  }

  const handleSaveSettings = () => {
    toast({
      title: "설정 저장 완료",
      description: "변경된 설정이 저장되었습니다.",
    });
  };

  const handleResetDatabase = () => {
    if (confirm("정말 데이터베이스를 초기화하시겠습니까? 모든 데이터가 삭제됩니다.")) {
      resetMockDB();
      toast({
        title: "데이터베이스 초기화 완료",
        description: "모든 데이터가 초기 상태로 되돌아갔습니다. 다시 로그인해주세요.",
      });
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            설정
          </h1>
          <p className="text-muted-foreground">
            애플리케이션 설정 및 환경 설정을 관리하세요
          </p>
        </div>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              알림 설정
            </CardTitle>
            <CardDescription>
              알림을 받을 방법과 종류를 설정하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">푸시 알림</p>
                <p className="text-sm text-muted-foreground">
                  브라우저 알림을 받습니다
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">이메일 알림</p>
                <p className="text-sm text-muted-foreground">
                  중요한 업데이트를 이메일로 받습니다
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              테마 설정
            </CardTitle>
            <CardDescription>
              애플리케이션 테마 및 표시 설정
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">다크 모드</p>
                <p className="text-sm text-muted-foreground">
                  화면을 어둡게 표시합니다 (준비 중)
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              언어 설정
            </CardTitle>
            <CardDescription>
              사용할 언어를 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="language">언어</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="언어 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ko">한국어</SelectItem>
                  <SelectItem value="en">English (준비 중)</SelectItem>
                  <SelectItem value="ja">日本語 (준비 중)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Developer Settings */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              개발자 설정
            </CardTitle>
            <CardDescription>
              위험: 이 작업은 되돌릴 수 없습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
              <div>
                <p className="font-medium">데이터베이스 초기화</p>
                <p className="text-sm text-muted-foreground">
                  모든 데이터를 삭제하고 초기 상태로 되돌립니다
                </p>
              </div>
              <Button variant="destructive" onClick={handleResetDatabase}>
                초기화
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button onClick={handleSaveSettings}>저장</Button>
        </div>
      </div>
    </MainLayout>
  );
}
