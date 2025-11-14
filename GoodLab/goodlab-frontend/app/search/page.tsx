"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/hooks";
import { useRoomStore, useTeamStore, useDocumentStore } from "@/store";
import { userDB } from "@/lib/mock-db";
import {
  Search,
  Folders,
  Users,
  FileText,
  User as UserIcon,
  ArrowRight,
} from "lucide-react";
import type { User } from "@/types";

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { isAuthenticated, user } = useRequireAuth();
  const { rooms, getUserRooms } = useRoomStore();
  const { teams, getUserTeams } = useTeamStore();
  const { documents, fetchDocuments } = useDocumentStore();

  const [searchQuery, setSearchQuery] = useState(query);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (user) {
      getUserRooms(user.id);
      getUserTeams(user.id);
      fetchDocuments();

      // 관리자면 사용자도 검색 가능
      if (user.role === 'super_admin' || user.role === 'admin') {
        const allUsers = userDB.getAll();
        setUsers(allUsers);
      }
    }
  }, [user, getUserRooms, getUserTeams, fetchDocuments]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // 검색 로직
  const searchLower = query.toLowerCase();

  const filteredRooms = rooms.filter(
    (room) =>
      room.title.toLowerCase().includes(searchLower) ||
      room.description?.toLowerCase().includes(searchLower)
  );

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchLower)
  );

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchLower)
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower)
  );

  const totalResults =
    filteredRooms.length +
    filteredTeams.length +
    filteredDocuments.length +
    filteredUsers.length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Search Bar */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">검색</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="방, 팀, 문서 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">검색</Button>
          </form>
        </div>

        {/* Results */}
        {query && (
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground">
                "<strong>{query}</strong>" 검색 결과: {totalResults}개
              </p>
            </div>

            {totalResults === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">
                    검색 결과가 없습니다
                  </p>
                  <p className="text-sm text-muted-foreground">
                    다른 키워드로 검색해보세요
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Rooms */}
                {filteredRooms.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Folders className="h-5 w-5" />
                        방 ({filteredRooms.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {filteredRooms.map((room) => (
                        <Link
                          key={room.id}
                          href={
                            user.role === 'admin' || user.role === 'super_admin'
                              ? `/professor/rooms/${room.id}`
                              : `/dashboard`
                          }
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <div>
                            <p className="font-medium">{room.title}</p>
                            {room.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {room.description}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Teams */}
                {filteredTeams.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        팀 ({filteredTeams.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {filteredTeams.map((team) => (
                        <Link
                          key={team.id}
                          href={`/team/${team.id}`}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <div>
                            <p className="font-medium">{team.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {team.github_url ? 'GitHub 연동됨' : '연동 필요'}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Documents */}
                {filteredDocuments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        문서 ({filteredDocuments.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {filteredDocuments.map((doc) => (
                        <Link
                          key={doc.id}
                          href={`/documents/${doc.id}`}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <div>
                            <p className="font-medium">{doc.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(doc.created_at).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Users (관리자만) */}
                {filteredUsers.length > 0 && (user.role === 'super_admin' || user.role === 'admin') && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5" />
                        사용자 ({filteredUsers.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {u.role === 'super_admin'
                              ? '슈퍼관리자'
                              : u.role === 'admin'
                              ? '교수'
                              : u.role === 'team_leader'
                              ? '팀장'
                              : '학생'}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {!query && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                검색어를 입력하세요
              </p>
              <p className="text-sm text-muted-foreground">
                방, 팀, 문서를 검색할 수 있습니다
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
