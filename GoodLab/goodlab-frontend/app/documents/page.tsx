"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore, useRoomStore, useTeamStore, useDocumentStore } from '@/store';
import { FileText, Plus, Trash2, FolderOpen, Users } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useAuth';
import type { Document, Room, Team } from '@/types';

export default function DocumentsPage() {
  useRequireAuth();
  const router = useRouter();
  const { user } = useAuthStore();
  const { getUserRooms, fetchRooms } = useRoomStore();
  const { teams, fetchTeams } = useTeamStore();
  const { documents, fetchDocuments, createDocument, deleteDocument, getUserDocuments } = useDocumentStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('__no_team__');

  const [userDocuments, setUserDocuments] = useState<Document[]>([]);
  const [userRooms, setUserRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (user) {
      fetchRooms();
      fetchTeams();
      fetchDocuments();
    }
  }, [user, fetchRooms, fetchTeams, fetchDocuments]);

  useEffect(() => {
    if (user) {
      const rooms = getUserRooms(user.id);
      setUserRooms(rooms);

      const roomIds = rooms.map((r) => r.id);
      const userTeamIds = teams.filter((t) => roomIds.includes(t.room_id)).map((t) => t.id);
      const docs = getUserDocuments(user.id, roomIds, userTeamIds);
      setUserDocuments(docs);
    }
  }, [user, documents, teams, getUserRooms, getUserDocuments]);

  const handleCreateDocument = () => {
    if (!user || !newDocTitle || !selectedRoomId) return;

    const newDoc = createDocument({
      room_id: selectedRoomId,
      team_id: selectedTeamId === '__no_team__' ? undefined : selectedTeamId,
      title: newDocTitle,
      created_by: user.id,
    });

    setIsCreateDialogOpen(false);
    setNewDocTitle('');
    setSelectedRoomId('');
    setSelectedTeamId('__no_team__');

    router.push(`/documents/${newDoc.id}`);
  };

  const handleDeleteDocument = (docId: string) => {
    if (confirm('이 문서를 삭제하시겠습니까?')) {
      deleteDocument(docId);
    }
  };

  const roomTeamsMap = teams.reduce((acc: Record<string, Team[]>, team) => {
    if (!acc[team.room_id]) {
      acc[team.room_id] = [];
    }
    acc[team.room_id].push(team);
    return acc;
  }, {});

  // Group documents by room and team
  const groupedDocuments = userDocuments.reduce(
    (acc, doc) => {
      const key = doc.team_id ? `team-${doc.team_id}` : `room-${doc.room_id}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(doc);
      return acc;
    },
    {} as Record<string, Document[]>
  );

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">문서</h1>
            <p className="text-gray-600 mt-1">팀 프로젝트 문서를 관리하세요</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                새 문서 만들기
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 문서 만들기</DialogTitle>
                <DialogDescription>프로젝트 문서를 작성하세요.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">문서 제목</Label>
                  <Input
                    id="title"
                    placeholder="예: 프로젝트 기획서"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="room">방 선택</Label>
                  <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                    <SelectTrigger>
                      <SelectValue placeholder="방을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRoomId && (
                  <div>
                    <Label htmlFor="team">팀 선택 (선택사항)</Label>
                    <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                      <SelectTrigger>
                        <SelectValue placeholder="팀을 선택하세요 (방 전체 문서는 선택하지 마세요)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__no_team__">방 전체 문서</SelectItem>
                        {roomTeamsMap[selectedRoomId]?.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  onClick={handleCreateDocument}
                  disabled={!newDocTitle || !selectedRoomId}
                  className="w-full"
                >
                  문서 만들기
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Documents List */}
        {userRooms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">참여 중인 방이 없습니다</h3>
              <p className="text-gray-500 text-center">
                먼저 방에 참여하거나 새 방을 만들어주세요.
              </p>
            </CardContent>
          </Card>
        ) : userDocuments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">문서가 없습니다</h3>
              <p className="text-gray-500 text-center mb-4">
                새 문서를 만들어 팀과 협업을 시작하세요.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                첫 문서 만들기
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {userRooms.map((room) => {
              const roomDocs = groupedDocuments[`room-${room.id}`] || [];
              const roomTeams = roomTeamsMap[room.id] || [];
              const teamDocs = roomTeams.flatMap(
                (team) => groupedDocuments[`team-${team.id}`] || []
              );

              if (roomDocs.length === 0 && teamDocs.length === 0) return null;

              return (
                <div key={room.id} className="space-y-3">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <FolderOpen className="w-5 h-5" />
                    {room.title}
                  </div>

                  {/* Room-level documents */}
                  {roomDocs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-6">
                      {roomDocs.map((doc) => (
                        <Card
                          key={doc.id}
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => router.push(`/documents/${doc.id}`)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-2 flex-1">
                                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-base truncate">{doc.title}</CardTitle>
                                  <CardDescription className="text-xs mt-1">
                                    방 전체 문서
                                  </CardDescription>
                                </div>
                              </div>
                              {user && doc.created_by === user.id && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDocument(doc.id);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-gray-500">
                              {new Date(doc.updated_at).toLocaleDateString('ko-KR')}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Team documents */}
                  {roomTeams.map((team) => {
                    const docs = groupedDocuments[`team-${team.id}`] || [];
                    if (docs.length === 0) return null;

                    return (
                      <div key={team.id} className="pl-6 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Users className="w-4 h-4" />
                          {team.name}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-6">
                          {docs.map((doc) => (
                            <Card
                              key={doc.id}
                              className="cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => router.push(`/documents/${doc.id}`)}
                            >
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-2 flex-1">
                                    <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                      <CardTitle className="text-base truncate">{doc.title}</CardTitle>
                                      <CardDescription className="text-xs mt-1">
                                        팀 문서
                                      </CardDescription>
                                    </div>
                                  </div>
                                  {user && doc.created_by === user.id && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteDocument(doc.id);
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-xs text-gray-500">
                                  {new Date(doc.updated_at).toLocaleDateString('ko-KR')}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
