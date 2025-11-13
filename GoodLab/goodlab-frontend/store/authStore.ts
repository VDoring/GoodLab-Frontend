import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { userDB, passwordDB, initializeMockDB } from '@/lib/mock-db';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: { name?: string; avatar_url?: string }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Mock DB 초기화
        initializeMockDB();

        // 이메일로 유저 찾기
        const user = userDB.getByEmail(email);
        if (!user) {
          return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
        }

        // 비밀번호 검증
        const isValid = passwordDB.verify(email, password);
        if (!isValid) {
          return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
        }

        // 로그인 성공
        set({ user, isAuthenticated: true });
        return { success: true };
      },

      register: async (email: string, password: string, name: string) => {
        // Mock DB 초기화
        initializeMockDB();

        // 이메일 중복 체크
        const existingUser = userDB.getByEmail(email);
        if (existingUser) {
          return { success: false, error: '이미 사용 중인 이메일입니다.' };
        }

        // 새 유저 생성
        const newUser = userDB.create({
          email,
          name,
          role: 'user',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        });

        // 비밀번호 저장
        passwordDB.set(email, password);

        // 자동 로그인
        set({ user: newUser, isAuthenticated: true });
        return { success: true };
      },

      updateProfile: async (data: { name?: string; avatar_url?: string }) => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) {
          return { success: false, error: '로그인이 필요합니다.' };
        }

        // 유저 정보 업데이트
        const updatedUser = userDB.update(currentUser.id, data);
        if (!updatedUser) {
          return { success: false, error: '프로필 업데이트에 실패했습니다.' };
        }

        // 상태 업데이트
        set({ user: updatedUser });
        return { success: true };
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) {
          return { success: false, error: '로그인이 필요합니다.' };
        }

        // 현재 비밀번호 확인
        const isValid = passwordDB.verify(currentUser.email, currentPassword);
        if (!isValid) {
          return { success: false, error: '현재 비밀번호가 올바르지 않습니다.' };
        }

        // 새 비밀번호 검증
        if (newPassword.length < 6) {
          return { success: false, error: '비밀번호는 최소 6자 이상이어야 합니다.' };
        }

        // 비밀번호 업데이트
        passwordDB.set(currentUser.email, newPassword);
        return { success: true };
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
