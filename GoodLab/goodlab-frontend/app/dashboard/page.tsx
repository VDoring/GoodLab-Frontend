"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireAuth } from "@/hooks";
import { useRoomStore, useTeamStore, useDocumentStore, useAnalysisStore } from "@/store";
import { Folders, Users, FileText, LineChart, Clock } from "lucide-react";
import type { AnalysisResult, Room, Team } from "@/types";

interface Activity {
  id: string;
  message: string;
  time: string;
}

export default function DashboardPage() {
  const { isAuthenticated, user } = useRequireAuth();
  const [activities, setActivities] = useState<Activity[]>([]);

  // Get data from stores
  const { getUserRooms } = useRoomStore();
  const { getUserTeams } = useTeamStore();
  const { documents, fetchDocuments } = useDocumentStore();

  // User-specific data
  const [rooms, setRooms] = useState<Room[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  // For analysis, we'll fetch per team
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);

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

  useEffect(() => {
    if (user) {
      // Fetch user-specific data
      const userRooms = getUserRooms(user.id);
      const userTeams = getUserTeams(user.id);
      setRooms(userRooms);
      setTeams(userTeams);
      fetchDocuments();

      // Fetch analysis results for all teams
      if (typeof window !== 'undefined') {
        const analysisDB = localStorage.getItem('goodlab_analysis_results');
        if (analysisDB) {
          const allAnalyses = JSON.parse(analysisDB);
          setAnalysisResults(allAnalyses);
        }
      }
    }
  }, [user, getUserRooms, getUserTeams, fetchDocuments]);

  // Generate activities when data changes
  useEffect(() => {
    if (!user) return;

    const recentActivities: Activity[] = [];

    // Add document activities
    const recentDocs = documents
      .filter(doc => doc.created_by === user.id)
      .slice(0, 2);
    recentDocs.forEach(doc => {
      const timeAgo = getTimeAgo(doc.created_at);
      recentActivities.push({
        id: doc.id,
        message: `"${doc.title}" 문서를 작성했습니다`,
        time: timeAgo,
      });
    });

    // Add analysis activities
    const completedAnalyses = analysisResults
      .filter(a => a.status === 'completed')
      .slice(0, 2);
    completedAnalyses.forEach(analysis => {
      const team = teams.find(t => t.id === analysis.team_id);
      if (team && analysis.analyzed_at) {
        const timeAgo = getTimeAgo(analysis.analyzed_at);
        recentActivities.push({
          id: analysis.id,
          message: `${team.name} 팀 분석이 완료되었습니다`,
          time: timeAgo,
        });
      }
    });

    // Add room join activities
    rooms.slice(0, 1).forEach(room => {
      recentActivities.push({
        id: room.id,
        message: `"${room.title}" 방에 참여했습니다`,
        time: getTimeAgo(room.created_at),
      });
    });

    setActivities(recentActivities.slice(0, 5));
  }, [user, documents, analysisResults, rooms, teams]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Calculate statistics
  const userRooms = rooms.length;
  const userTeams = teams.length;
  // Count documents user created
  const userDocuments = documents.filter(doc => doc.created_by === user.id).length;
  const completedAnalyses = analysisResults.filter(a => a.status === 'completed').length;

  // Calculate team statistics from completed analyses
  const totalCommits = analysisResults
    .filter(a => a.status === 'completed' && a.github_data)
    .reduce((sum, a) => {
      if (a.github_data && Array.isArray(a.github_data)) {
        return sum + a.github_data.reduce((acc, member) => acc + (member.commits || 0), 0);
      }
      return sum;
    }, 0);

  const totalPRs = analysisResults
    .filter(a => a.status === 'completed' && a.github_data)
    .reduce((sum, a) => {
      if (a.github_data && Array.isArray(a.github_data)) {
        return sum + a.github_data.reduce((acc, member) => acc + (member.prs || 0), 0);
      }
      return sum;
    }, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
          <p className="text-muted-foreground">
            팀 프로젝트 현황을 한눈에 확인하세요
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 방</CardTitle>
              <Folders className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userRooms}</div>
              <p className="text-xs text-muted-foreground">
                참여 중인 방
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">내 팀</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userTeams}</div>
              <p className="text-xs text-muted-foreground">
                소속된 팀
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">문서</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userDocuments}</div>
              <p className="text-xs text-muted-foreground">
                작성한 문서
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">분석</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAnalyses}</div>
              <p className="text-xs text-muted-foreground">
                완료된 분석
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>최근 활동</CardTitle>
              <CardDescription>
                팀 프로젝트의 최근 활동 내역
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.message}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    아직 활동 내역이 없습니다
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>팀 통계</CardTitle>
              <CardDescription>
                현재 진행 중인 프로젝트 통계
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">GitHub 커밋</p>
                    <p className="text-sm text-muted-foreground">{totalCommits}개</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Pull Requests</p>
                    <p className="text-sm text-muted-foreground">{totalPRs}개</p>
                  </div>
                </div>
                {completedAnalyses === 0 && (
                  <p className="text-sm text-muted-foreground text-center pt-4">
                    아직 완료된 분석이 없습니다
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
