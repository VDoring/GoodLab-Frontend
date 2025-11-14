"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireAuth } from "@/hooks";
import { useNotificationStore } from "@/store/notificationStore";
import {
  Bell,
  Check,
  Trash2,
  FileText,
  Users,
  BarChart3,
  AtSign,
  Crown,
  UserMinus,
  Info,
  CheckCheck,
} from "lucide-react";
import type { NotificationType } from "@/types";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'team_invite':
    case 'room_invite':
      return <Users className="h-5 w-5 text-blue-600" />;
    case 'analysis_complete':
      return <BarChart3 className="h-5 w-5 text-green-600" />;
    case 'document_mention':
      return <AtSign className="h-5 w-5 text-purple-600" />;
    case 'team_leader_assigned':
      return <Crown className="h-5 w-5 text-yellow-600" />;
    case 'member_removed':
      return <UserMinus className="h-5 w-5 text-red-600" />;
    case 'system':
      return <Info className="h-5 w-5 text-gray-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-600" />;
  }
};

const getTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}일 전`;
  if (diffHours > 0) return `${diffHours}시간 전`;
  if (diffMins > 0) return `${diffMins}분 전`;
  return '방금 전';
};

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useRequireAuth();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user, fetchNotifications]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleNotificationClick = (notificationId: string, link?: string) => {
    markAsRead(notificationId);
    if (link) {
      router.push(link);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(user.id);
  };

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">알림</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount}개의 읽지 않은 알림이 있습니다` : '모든 알림을 확인했습니다'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              모두 읽음으로 표시
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                알림이 없습니다
              </p>
              <p className="text-sm text-muted-foreground">
                새로운 알림이 있으면 여기에 표시됩니다
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Unread Notifications */}
            {unreadNotifications.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">읽지 않음</h2>
                {unreadNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className="cursor-pointer hover:bg-accent transition-colors bg-blue-50/50 border-blue-200"
                    onClick={() => handleNotificationClick(notification.id, notification.link)}
                  >
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm leading-none">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {getTimeAgo(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => handleDelete(e, notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Read Notifications */}
            {readNotifications.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">읽음</h2>
                {readNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleNotificationClick(notification.id, notification.link)}
                  >
                    <CardContent className="flex items-start gap-4 p-4 opacity-60">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm leading-none">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {getTimeAgo(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => handleDelete(e, notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
