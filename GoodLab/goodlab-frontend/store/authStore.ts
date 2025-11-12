import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { userDB, passwordDB, initializeMockDB } from '@/lib/mock-db';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
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

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
