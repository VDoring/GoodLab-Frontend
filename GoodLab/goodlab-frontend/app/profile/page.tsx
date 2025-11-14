"use client";

import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Calendar, Shield, Lock, Image as ImageIcon } from "lucide-react";
import { useAuthStore } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { useRequireAuth } from "@/hooks";

export default function ProfilePage() {
  const { isAuthenticated, user } = useRequireAuth();
  const { toast } = useToast();
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const changePassword = useAuthStore((state) => state.changePassword);

  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");

  // Password change state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Image upload state
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.avatar_url || "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Sync name with user
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return "슈퍼관리자";
      case "admin":
        return "교수";
      case "team_leader":
        return "팀장";
      default:
        return "일반 사용자";
    }
  };

  // Handle profile save
  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "오류",
        description: "이름을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    const result = await updateProfile({ name: name.trim() });

    if (result.success) {
      toast({
        title: "프로필 업데이트 완료",
        description: "프로필 정보가 성공적으로 업데이트되었습니다.",
      });
      setIsEditing(false);
    } else {
      toast({
        title: "오류",
        description: result.error || "프로필 업데이트에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "오류",
        description: "새 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "오류",
        description: "비밀번호는 최소 6자 이상이어야 합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);

    const result = await changePassword(currentPassword, newPassword);

    setIsChangingPassword(false);

    if (result.success) {
      toast({
        title: "비밀번호 변경 완료",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      });
      setIsPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast({
        title: "오류",
        description: result.error || "비밀번호 변경에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!imageUrl.trim()) {
      toast({
        title: "오류",
        description: "이미지 URL을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingImage(true);

    const result = await updateProfile({ avatar_url: imageUrl.trim() });

    setIsUploadingImage(false);

    if (result.success) {
      toast({
        title: "프로필 이미지 업데이트 완료",
        description: "프로필 이미지가 성공적으로 변경되었습니다.",
      });
      setIsImageDialogOpen(false);
    } else {
      toast({
        title: "오류",
        description: result.error || "이미지 업로드에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  // Generate random avatar URL
  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setImageUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
    setSelectedFile(null);
  };

  // Handle file upload (convert to Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "오류",
        description: "이미지 파일만 업로드 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "오류",
        description: "파일 크기는 2MB 이하여야 합니다.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageUrl(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">프로필</h1>
          <p className="text-muted-foreground">
            내 프로필 정보를 확인하고 수정하세요
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar_url} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription className="text-base">
                    {user.email}
                  </CardDescription>
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "취소" : "편집"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  이름
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력하세요"
                  />
                ) : (
                  <p className="text-lg font-medium">{user.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  이메일
                </Label>
                <p className="text-lg font-medium text-muted-foreground">
                  {user.email}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  역할
                </Label>
                <p className="text-lg font-medium text-muted-foreground">
                  {getRoleLabel(user.role)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  가입일
                </Label>
                <p className="text-lg font-medium text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name);
                  }}
                >
                  취소
                </Button>
                <Button onClick={handleSave}>저장</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>계정 정보</CardTitle>
            <CardDescription>
              계정 설정 및 보안 관련 정보
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Password Change */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">비밀번호 변경</p>
                <p className="text-sm text-muted-foreground">
                  비밀번호를 정기적으로 변경하세요
                </p>
              </div>
              <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Lock className="w-4 h-4 mr-2" />
                    변경
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>비밀번호 변경</DialogTitle>
                    <DialogDescription>
                      새로운 비밀번호를 입력하세요 (최소 6자)
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="current-password">현재 비밀번호</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="현재 비밀번호"
                      />
                    </div>

                    <div>
                      <Label htmlFor="new-password">새 비밀번호</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="새 비밀번호 (최소 6자)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="새 비밀번호 확인"
                      />
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsPasswordDialogOpen(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? "변경 중..." : "비밀번호 변경"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Profile Image */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">프로필 이미지</p>
                <p className="text-sm text-muted-foreground">
                  프로필 사진을 업로드하세요
                </p>
              </div>
              <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    변경
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>프로필 이미지 변경</DialogTitle>
                    <DialogDescription>
                      이미지 URL을 입력하거나 랜덤 아바타를 생성하세요
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 mt-4">
                    <div className="flex justify-center">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={imageUrl} alt="Preview" />
                        <AvatarFallback className="text-4xl">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* File Upload */}
                    <div>
                      <Label htmlFor="file-upload">파일 선택</Label>
                      <Input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG, GIF (최대 2MB)
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          또는
                        </span>
                      </div>
                    </div>

                    {/* URL Input */}
                    <div>
                      <Label htmlFor="image-url">이미지 URL</Label>
                      <Input
                        id="image-url"
                        type="url"
                        value={imageUrl.startsWith('data:') ? '' : imageUrl}
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          setSelectedFile(null);
                        }}
                        placeholder="https://example.com/image.jpg"
                        disabled={!!selectedFile}
                      />
                    </div>

                    <Button
                      variant="outline"
                      onClick={generateRandomAvatar}
                      className="w-full"
                    >
                      랜덤 아바타 생성
                    </Button>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsImageDialogOpen(false);
                        setImageUrl(user.avatar_url || "");
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleImageUpload}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? "업로드 중..." : "이미지 변경"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
