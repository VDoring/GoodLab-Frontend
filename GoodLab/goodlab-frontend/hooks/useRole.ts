"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import type { UserRole } from "@/types";

// 권한 체크 훅
export function useRole(requiredRole?: UserRole | UserRole[]) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;

    // 권한 계층 구조: super_admin > admin > team_leader > user
    const roleHierarchy: Record<UserRole, number> = {
      super_admin: 4,
      admin: 3,
      team_leader: 2,
      user: 1,
    };

    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[role];

    return userLevel >= requiredLevel;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some((role) => user?.role === role);
  };

  const checkRole = requiredRole
    ? Array.isArray(requiredRole)
      ? hasAnyRole(requiredRole)
      : hasRole(requiredRole)
    : true;

  return {
    user,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    checkRole,
  };
}

// 권한이 없으면 리다이렉트하는 훅
export function useRequireRole(
  requiredRole: UserRole | UserRole[],
  redirectTo = "/403"
) {
  const router = useRouter();
  const { isAuthenticated, checkRole } = useRole(requiredRole);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else if (!checkRole) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, checkRole, router, redirectTo]);

  return { isAuthenticated, hasPermission: checkRole };
}

// 슈퍼관리자 권한 체크
export function useRequireSuperAdmin() {
  return useRequireRole("super_admin");
}

// 교수(관리자) 권한 체크
export function useRequireAdmin() {
  return useRequireRole(["super_admin", "admin"]);
}

// 팀장 권한 체크
export function useRequireTeamLeader() {
  return useRequireRole(["super_admin", "admin", "team_leader"]);
}
