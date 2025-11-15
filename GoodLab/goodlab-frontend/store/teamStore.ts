import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Team, TeamMember, User } from '@/types';
import { teamDB, teamMemberDB, userDB, initializeMockDB } from '@/lib/mock-db';

interface TeamState {
  currentTeam: Team | null;
  teams: Team[];
  isLoading: boolean;
  error: string | null;

  // 팀 목록 불러오기
  fetchTeams: () => void;

  // 방의 팀 목록 불러오기
  fetchTeamsByRoom: (roomId: string) => void;

  // 특정 팀 불러오기
  fetchTeam: (id: string) => Team | null;

  // 팀 생성
  createTeam: (data: {
    room_id: string;
    name: string;
    leader_id?: string | null;
  }) => Team;

  // 팀 수정
  updateTeam: (id: string, data: Partial<Team>) => boolean;

  // 팀 삭제
  deleteTeam: (id: string) => boolean;

  // 현재 팀 설정
  setCurrentTeam: (team: Team | null) => void;

  // 팀 멤버 추가
  addMemberToTeam: (teamId: string, userId: string, role?: 'team_leader' | 'member') => void;

  // 팀 멤버 제거
  removeMemberFromTeam: (teamId: string, userId: string) => void;

  // 팀원 목록 가져오기
  getTeamMembers: (teamId: string) => User[];

  // 팀장 변경 (null이면 팀장 해제)
  changeTeamLeader: (teamId: string, newLeaderId: string | null) => void;

  // 사용자의 팀 목록 가져오기
  getUserTeams: (userId: string) => Team[];
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      currentTeam: null,
      teams: [],
      isLoading: false,
      error: null,

      fetchTeams: () => {
        initializeMockDB();
        const teams = teamDB.getAll();
        set({ teams, error: null });
      },

      fetchTeamsByRoom: (roomId: string) => {
        initializeMockDB();
        const teams = teamDB.getByRoomId(roomId);
        set({ teams, error: null });
      },

      fetchTeam: (id: string) => {
        initializeMockDB();
        const team = teamDB.getById(id);
        if (team) {
          set({ currentTeam: team });
        }
        return team;
      },

      createTeam: (data) => {
        initializeMockDB();
        // undefined를 null로 변환
        const teamData = {
          room_id: data.room_id,
          name: data.name,
          leader_id: data.leader_id ?? null,
        };
        const newTeam = teamDB.create(teamData);

        // 팀장이 지정된 경우 팀 멤버로 추가
        if (data.leader_id) {
          teamMemberDB.add(newTeam.id, data.leader_id, 'team_leader');
        }

        set((state) => ({
          teams: [...state.teams, newTeam],
          error: null,
        }));

        return newTeam;
      },

      updateTeam: (id, data) => {
        initializeMockDB();
        const updated = teamDB.update(id, data);
        if (!updated) {
          set({ error: '팀을 찾을 수 없습니다.' });
          return false;
        }

        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === id ? updated : team
          ),
          currentTeam: state.currentTeam?.id === id ? updated : state.currentTeam,
          error: null,
        }));

        return true;
      },

      deleteTeam: (id) => {
        initializeMockDB();
        const success = teamDB.delete(id);
        if (!success) {
          set({ error: '팀을 찾을 수 없습니다.' });
          return false;
        }

        set((state) => ({
          teams: state.teams.filter((team) => team.id !== id),
          currentTeam: state.currentTeam?.id === id ? null : state.currentTeam,
          error: null,
        }));

        return true;
      },

      setCurrentTeam: (team) => set({ currentTeam: team }),

      addMemberToTeam: (teamId: string, userId: string, role = 'member') => {
        initializeMockDB();
        teamMemberDB.add(teamId, userId, role);
      },

      removeMemberFromTeam: (teamId: string, userId: string) => {
        initializeMockDB();

        // 팀 정보 가져오기
        const team = teamDB.getById(teamId);

        // 만약 제거하려는 사람이 팀장이면 leader_id를 null로 업데이트
        if (team && team.leader_id === userId) {
          teamDB.update(teamId, { leader_id: null });
        }

        // 팀 멤버에서 제거
        teamMemberDB.remove(teamId, userId);

        // 스토어 업데이트
        const updatedTeam = teamDB.getById(teamId);
        if (updatedTeam) {
          set((state) => ({
            teams: state.teams.map((t) =>
              t.id === teamId ? updatedTeam : t
            ),
            currentTeam: state.currentTeam?.id === teamId ? updatedTeam : state.currentTeam,
          }));
        }
      },

      getTeamMembers: (teamId: string) => {
        initializeMockDB();
        const members = teamMemberDB.getByTeamId(teamId);
        const users = members
          .map((m) => userDB.getById(m.user_id))
          .filter((user): user is User => user !== null);
        return users;
      },

      changeTeamLeader: (teamId: string, newLeaderId: string | null) => {
        initializeMockDB();

        // 모든 팀원을 일반 멤버로 변경
        const members = teamMemberDB.getByTeamId(teamId);
        members.forEach((member) => {
          teamMemberDB.updateRole(teamId, member.user_id, 'member');
        });

        // 새 팀장이 있으면 team_leader로 변경
        if (newLeaderId) {
          // 팀장이 팀 멤버인지 확인
          const isMember = members.some(m => m.user_id === newLeaderId);
          if (!isMember) {
            // 팀 멤버가 아니면 먼저 추가
            teamMemberDB.add(teamId, newLeaderId, 'team_leader');
          } else {
            // 이미 멤버면 role만 업데이트
            teamMemberDB.updateRole(teamId, newLeaderId, 'team_leader');
          }
        }

        // 팀의 leader_id 업데이트
        teamDB.update(teamId, { leader_id: newLeaderId });

        // 스토어 업데이트
        const updated = teamDB.getById(teamId);
        if (updated) {
          set((state) => ({
            teams: state.teams.map((team) =>
              team.id === teamId ? updated : team
            ),
            currentTeam: state.currentTeam?.id === teamId ? updated : state.currentTeam,
          }));
        }
      },

      getUserTeams: (userId: string) => {
        initializeMockDB();
        const teamMembers = teamMemberDB.getByUserId(userId);
        const userTeams = teamMembers
          .map((tm) => teamDB.getById(tm.team_id))
          .filter((team): team is Team => team !== null);

        // State를 덮어쓰지 않고 단순히 필터링된 결과만 반환
        return userTeams;
      },
    }),
    {
      name: 'team-storage',
      partialize: (state) => ({
        currentTeam: state.currentTeam,
      }),
    }
  )
);
