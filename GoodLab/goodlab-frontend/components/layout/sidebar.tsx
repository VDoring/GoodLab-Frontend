"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderOpen,
  Users,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Shield,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore, useRoomStore, useTeamStore } from "@/store";
import { roomMemberDB, teamMemberDB } from "@/lib/mock-db";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [roomsExpanded, setRoomsExpanded] = useState(true);
  const [teamsExpanded, setTeamsExpanded] = useState(true);

  const user = useAuthStore((state) => state.user);
  const allRooms = useRoomStore((state) => state.rooms);
  const allTeams = useTeamStore((state) => state.teams);
  const fetchRooms = useRoomStore((state) => state.fetchRooms);
  const fetchTeams = useTeamStore((state) => state.fetchTeams);

  useEffect(() => {
    if (user) {
      fetchRooms();
      fetchTeams();
    }
  }, [user, fetchRooms, fetchTeams]);

  // 사용자가 속한 방만 필터링
  const userRoomIds = user ? roomMemberDB.getByUserId(user.id).map((rm) => rm.room_id) : [];
  const rooms = allRooms.filter((room) => userRoomIds.includes(room.id));

  // 사용자가 속한 팀만 필터링
  const userTeamIds = user ? teamMemberDB.getByUserId(user.id).map((tm) => tm.team_id) : [];
  const teams = allTeams.filter((team) => userTeamIds.includes(team.id));

  const navItems = [
    { href: "/dashboard", label: "대시보드", icon: Home },
    { href: "/documents", label: "문서", icon: FileText },
    { href: "/settings", label: "설정", icon: Settings },
  ];

  // 권한별 메뉴 추가
  const adminItems = user && (user.role === 'super_admin' || user.role === 'admin') ? [
    { href: "/professor/rooms", label: "방 관리", icon: BookOpen },
  ] : [];

  const superAdminItems = user && user.role === 'super_admin' ? [
    { href: "/admin/super", label: "슈퍼관리자", icon: Shield },
  ] : [];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={onClose}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              {adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={onClose}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              {superAdminItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={onClose}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Rooms Section */}
            <div className="pt-4">
              <button
                onClick={() => setRoomsExpanded(!roomsExpanded)}
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                <div className="flex items-center">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  내 방
                </div>
                {roomsExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {roomsExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <Link
                        key={room.id}
                        href={`/professor/rooms/${room.id}`}
                        onClick={onClose}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm font-normal"
                        >
                          <span className="truncate">{room.title}</span>
                        </Button>
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      참여 중인 방이 없습니다
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Teams Section */}
            <div className="pt-2">
              <button
                onClick={() => setTeamsExpanded(!teamsExpanded)}
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  내 팀
                </div>
                {teamsExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {teamsExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {teams.length > 0 ? (
                    teams.map((team) => (
                      <Link
                        key={team.id}
                        href={`/team/${team.id}`}
                        onClick={onClose}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm font-normal"
                        >
                          {team.name}
                        </Button>
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      참여 중인 팀이 없습니다
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
