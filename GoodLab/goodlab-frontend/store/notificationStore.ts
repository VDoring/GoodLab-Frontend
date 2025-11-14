import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: (userId: string) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: (userId: string) => void;
}

// Mock notifications 생성 함수
const generateMockNotifications = (userId: string): Notification[] => {
  const now = new Date();
  const mockNotifications: Notification[] = [
    {
      id: 'notif-1',
      user_id: userId,
      type: 'analysis_complete',
      title: '분석 완료',
      message: '팀 A의 GitHub/Notion 분석이 완료되었습니다.',
      link: '/team/team-1/analysis',
      read: false,
      created_at: new Date(now.getTime() - 1000 * 60 * 10).toISOString(), // 10분 전
    },
    {
      id: 'notif-2',
      user_id: userId,
      type: 'team_invite',
      title: '팀 초대',
      message: '팀 B에 초대되었습니다.',
      link: '/team/team-2',
      read: false,
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
    },
    {
      id: 'notif-3',
      user_id: userId,
      type: 'document_mention',
      title: '문서 언급',
      message: '김철수님이 "프로젝트 기획서" 문서에서 당신을 언급했습니다.',
      link: '/documents/doc-1',
      read: true,
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(), // 5시간 전
    },
    {
      id: 'notif-4',
      user_id: userId,
      type: 'team_leader_assigned',
      title: '팀장 지정',
      message: '팀 A의 팀장으로 지정되었습니다.',
      link: '/team/team-1',
      read: true,
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전
    },
    {
      id: 'notif-5',
      user_id: userId,
      type: 'system',
      title: '시스템 공지',
      message: 'GoodLab 플랫폼에 새로운 기능이 추가되었습니다.',
      link: '/dashboard',
      read: true,
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2일 전
    },
  ];

  return mockNotifications;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      fetchNotifications: (userId: string) => {
        // LocalStorage에서 알림 가져오기
        const storageKey = `goodlab_notifications_${userId}`;
        const stored = localStorage.getItem(storageKey);

        let notifications: Notification[];
        if (stored) {
          notifications = JSON.parse(stored);
        } else {
          // Mock 데이터 생성
          notifications = generateMockNotifications(userId);
          localStorage.setItem(storageKey, JSON.stringify(notifications));
        }

        // 최신순으로 정렬
        notifications.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        const unreadCount = notifications.filter(n => !n.read).length;

        set({ notifications, unreadCount });
      },

      markAsRead: (notificationId: string) => {
        const { notifications } = get();
        const userId = notifications.find(n => n.id === notificationId)?.user_id;

        if (!userId) return;

        const updatedNotifications = notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        );

        const unreadCount = updatedNotifications.filter(n => !n.read).length;

        // LocalStorage 업데이트
        const storageKey = `goodlab_notifications_${userId}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));

        set({ notifications: updatedNotifications, unreadCount });
      },

      markAllAsRead: (userId: string) => {
        const { notifications } = get();

        const updatedNotifications = notifications.map(n => ({ ...n, read: true }));

        // LocalStorage 업데이트
        const storageKey = `goodlab_notifications_${userId}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));

        set({ notifications: updatedNotifications, unreadCount: 0 });
      },

      addNotification: (notification) => {
        const { notifications } = get();
        const userId = notification.user_id;

        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}`,
          created_at: new Date().toISOString(),
        };

        const updatedNotifications = [newNotification, ...notifications];
        const unreadCount = updatedNotifications.filter(n => !n.read).length;

        // LocalStorage 업데이트
        const storageKey = `goodlab_notifications_${userId}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));

        set({ notifications: updatedNotifications, unreadCount });
      },

      deleteNotification: (notificationId: string) => {
        const { notifications } = get();
        const userId = notifications.find(n => n.id === notificationId)?.user_id;

        if (!userId) return;

        const updatedNotifications = notifications.filter(n => n.id !== notificationId);
        const unreadCount = updatedNotifications.filter(n => !n.read).length;

        // LocalStorage 업데이트
        const storageKey = `goodlab_notifications_${userId}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));

        set({ notifications: updatedNotifications, unreadCount });
      },

      clearAll: (userId: string) => {
        // LocalStorage 클리어
        const storageKey = `goodlab_notifications_${userId}`;
        localStorage.removeItem(storageKey);

        set({ notifications: [], unreadCount: 0 });
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);
