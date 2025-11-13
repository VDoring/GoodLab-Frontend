"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store";

export function useAuth(redirectTo = "/auth/login") {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasRedirected = useRef(false);

  useEffect(() => {
    // 이미 리다이렉트 했거나 현재 인증 페이지에 있으면 스킵
    if (hasRedirected.current || pathname === redirectTo) {
      return;
    }

    if (!isAuthenticated) {
      hasRedirected.current = true;
      router.replace(redirectTo);
    } else {
      hasRedirected.current = false;
    }
  }, [isAuthenticated, router, redirectTo, pathname]);

  return { user, isAuthenticated };
}

export function useRequireAuth() {
  return useAuth("/auth/login");
}
