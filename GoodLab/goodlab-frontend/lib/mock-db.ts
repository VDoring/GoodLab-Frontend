"use client";

import type { User, Room, Team, TeamMember, RoomMember, AnalysisResult, Document, DocumentPermission } from '@/types';
import {
  MOCK_USERS,
  MOCK_ROOMS,
  MOCK_TEAMS,
  MOCK_TEAM_MEMBERS,
  MOCK_ROOM_MEMBERS,
  MOCK_PASSWORDS,
  MOCK_ANALYSIS_RESULT,
  MOCK_DOCUMENTS,
  MOCK_DOCUMENT_PERMISSIONS,
} from './mock-data';

// LocalStorage 키
const KEYS = {
  USERS: 'goodlab_users',
  ROOMS: 'goodlab_rooms',
  TEAMS: 'goodlab_teams',
  TEAM_MEMBERS: 'goodlab_team_members',
  ROOM_MEMBERS: 'goodlab_room_members',
  PASSWORDS: 'goodlab_passwords',
  ANALYSIS_RESULTS: 'goodlab_analysis_results',
  DOCUMENTS: 'goodlab_documents',
  DOCUMENT_PERMISSIONS: 'goodlab_document_permissions',
  INITIALIZED: 'goodlab_initialized',
};

// 초기화 함수
export function initializeMockDB() {
  if (typeof window === 'undefined') return;

  const isInitialized = localStorage.getItem(KEYS.INITIALIZED);
  if (isInitialized) return;

  localStorage.setItem(KEYS.USERS, JSON.stringify(MOCK_USERS));
  localStorage.setItem(KEYS.ROOMS, JSON.stringify(MOCK_ROOMS));
  localStorage.setItem(KEYS.TEAMS, JSON.stringify(MOCK_TEAMS));
  localStorage.setItem(KEYS.TEAM_MEMBERS, JSON.stringify(MOCK_TEAM_MEMBERS));
  localStorage.setItem(KEYS.ROOM_MEMBERS, JSON.stringify(MOCK_ROOM_MEMBERS));
  localStorage.setItem(KEYS.PASSWORDS, JSON.stringify(MOCK_PASSWORDS));
  localStorage.setItem(KEYS.ANALYSIS_RESULTS, JSON.stringify([MOCK_ANALYSIS_RESULT]));
  localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(MOCK_DOCUMENTS));
  localStorage.setItem(KEYS.DOCUMENT_PERMISSIONS, JSON.stringify(MOCK_DOCUMENT_PERMISSIONS));
  localStorage.setItem(KEYS.INITIALIZED, 'true');

  console.log('✅ Mock DB initialized');
}

// 데이터베이스 리셋
export function resetMockDB() {
  if (typeof window === 'undefined') return;

  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  initializeMockDB();
  console.log('🔄 Mock DB reset');
}

// ========== User CRUD ==========
export const userDB = {
  getAll: (): User[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): User | null => {
    const users = userDB.getAll();
    return users.find((u) => u.id === id) || null;
  },

  getByEmail: (email: string): User | null => {
    const users = userDB.getAll();
    return users.find((u) => u.email === email) || null;
  },

  create: (user: Omit<User, 'id' | 'created_at'>): User => {
    const users = userDB.getAll();
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  update: (id: string, data: Partial<User>): User | null => {
    const users = userDB.getAll();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...data };
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return users[index];
  },

  delete: (id: string): boolean => {
    const users = userDB.getAll();
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length === users.length) return false;

    localStorage.setItem(KEYS.USERS, JSON.stringify(filtered));
    return true;
  },
};

// ========== Password Management ==========
export const passwordDB = {
  get: (email: string): string | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(KEYS.PASSWORDS);
    const passwords = data ? JSON.parse(data) : {};
    return passwords[email] || null;
  },

  set: (email: string, password: string): void => {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem(KEYS.PASSWORDS);
    const passwords = data ? JSON.parse(data) : {};
    passwords[email] = password;
    localStorage.setItem(KEYS.PASSWORDS, JSON.stringify(passwords));
  },

  verify: (email: string, password: string): boolean => {
    const stored = passwordDB.get(email);
    return stored === password;
  },
};

// ========== Room CRUD ==========
export const roomDB = {
  getAll: (): Room[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.ROOMS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Room | null => {
    const rooms = roomDB.getAll();
    return rooms.find((r) => r.id === id) || null;
  },

  getByInviteCode: (code: string): Room | null => {
    const rooms = roomDB.getAll();
    return rooms.find((r) => r.invite_code === code) || null;
  },

  create: (room: Omit<Room, 'id' | 'created_at' | 'updated_at' | 'invite_code'>): Room => {
    const rooms = roomDB.getAll();
    const inviteCode = `ROOM${Date.now().toString(36).toUpperCase()}`;
    const newRoom: Room = {
      ...room,
      id: `room-${Date.now()}`,
      invite_code: inviteCode,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    rooms.push(newRoom);
    localStorage.setItem(KEYS.ROOMS, JSON.stringify(rooms));
    return newRoom;
  },

  update: (id: string, data: Partial<Room>): Room | null => {
    const rooms = roomDB.getAll();
    const index = rooms.findIndex((r) => r.id === id);
    if (index === -1) return null;

    rooms[index] = {
      ...rooms[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(KEYS.ROOMS, JSON.stringify(rooms));
    return rooms[index];
  },

  delete: (id: string): boolean => {
    const rooms = roomDB.getAll();
    const filtered = rooms.filter((r) => r.id !== id);
    if (filtered.length === rooms.length) return false;

    localStorage.setItem(KEYS.ROOMS, JSON.stringify(filtered));
    return true;
  },
};

// ========== Room Member CRUD ==========
export const roomMemberDB = {
  getAll: (): RoomMember[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.ROOM_MEMBERS);
    return data ? JSON.parse(data) : [];
  },

  getByRoomId: (roomId: string): RoomMember[] => {
    return roomMemberDB.getAll().filter((rm) => rm.room_id === roomId);
  },

  getByUserId: (userId: string): RoomMember[] => {
    return roomMemberDB.getAll().filter((rm) => rm.user_id === userId);
  },

  add: (roomId: string, userId: string): RoomMember => {
    const members = roomMemberDB.getAll();
    const newMember: RoomMember = {
      id: `rm-${Date.now()}`,
      room_id: roomId,
      user_id: userId,
      joined_at: new Date().toISOString(),
    };
    members.push(newMember);
    localStorage.setItem(KEYS.ROOM_MEMBERS, JSON.stringify(members));
    return newMember;
  },

  remove: (roomId: string, userId: string): boolean => {
    const members = roomMemberDB.getAll();
    const filtered = members.filter(
      (m) => !(m.room_id === roomId && m.user_id === userId)
    );
    if (filtered.length === members.length) return false;

    localStorage.setItem(KEYS.ROOM_MEMBERS, JSON.stringify(filtered));
    return true;
  },
};

// ========== Team CRUD ==========
export const teamDB = {
  getAll: (): Team[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.TEAMS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Team | null => {
    const teams = teamDB.getAll();
    return teams.find((t) => t.id === id) || null;
  },

  getByRoomId: (roomId: string): Team[] => {
    return teamDB.getAll().filter((t) => t.room_id === roomId);
  },

  create: (team: Omit<Team, 'id' | 'created_at' | 'updated_at'>): Team => {
    const teams = teamDB.getAll();
    const newTeam: Team = {
      ...team,
      id: `team-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    teams.push(newTeam);
    localStorage.setItem(KEYS.TEAMS, JSON.stringify(teams));
    return newTeam;
  },

  update: (id: string, data: Partial<Team>): Team | null => {
    const teams = teamDB.getAll();
    const index = teams.findIndex((t) => t.id === id);
    if (index === -1) return null;

    teams[index] = {
      ...teams[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(KEYS.TEAMS, JSON.stringify(teams));
    return teams[index];
  },

  delete: (id: string): boolean => {
    const teams = teamDB.getAll();
    const filtered = teams.filter((t) => t.id !== id);
    if (filtered.length === teams.length) return false;

    localStorage.setItem(KEYS.TEAMS, JSON.stringify(filtered));
    return true;
  },
};

// ========== Team Member CRUD ==========
export const teamMemberDB = {
  getAll: (): TeamMember[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.TEAM_MEMBERS);
    return data ? JSON.parse(data) : [];
  },

  getByTeamId: (teamId: string): TeamMember[] => {
    return teamMemberDB.getAll().filter((tm) => tm.team_id === teamId);
  },

  getByUserId: (userId: string): TeamMember[] => {
    return teamMemberDB.getAll().filter((tm) => tm.user_id === userId);
  },

  add: (teamId: string, userId: string, role: 'team_leader' | 'member' = 'member'): TeamMember => {
    const members = teamMemberDB.getAll();
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      team_id: teamId,
      user_id: userId,
      role,
      joined_at: new Date().toISOString(),
    };
    members.push(newMember);
    localStorage.setItem(KEYS.TEAM_MEMBERS, JSON.stringify(members));
    return newMember;
  },

  updateRole: (teamId: string, userId: string, role: 'team_leader' | 'member'): boolean => {
    const members = teamMemberDB.getAll();
    const member = members.find((m) => m.team_id === teamId && m.user_id === userId);
    if (!member) return false;

    member.role = role;
    localStorage.setItem(KEYS.TEAM_MEMBERS, JSON.stringify(members));
    return true;
  },

  remove: (teamId: string, userId: string): boolean => {
    const members = teamMemberDB.getAll();
    const filtered = members.filter(
      (m) => !(m.team_id === teamId && m.user_id === userId)
    );
    if (filtered.length === members.length) return false;

    localStorage.setItem(KEYS.TEAM_MEMBERS, JSON.stringify(filtered));
    return true;
  },
};

// ========== Analysis CRUD ==========
export const analysisDB = {
  getAll: (): AnalysisResult[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.ANALYSIS_RESULTS);
    return data ? JSON.parse(data) : [];
  },

  getByTeamId: (teamId: string): AnalysisResult[] => {
    return analysisDB.getAll().filter((a) => a.team_id === teamId);
  },

  create: (analysis: Omit<AnalysisResult, 'id' | 'created_at'>): AnalysisResult => {
    const results = analysisDB.getAll();
    const newAnalysis: AnalysisResult = {
      ...analysis,
      id: `analysis-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    results.push(newAnalysis);
    localStorage.setItem(KEYS.ANALYSIS_RESULTS, JSON.stringify(results));
    return newAnalysis;
  },

  update: (id: string, data: Partial<AnalysisResult>): AnalysisResult | null => {
    const results = analysisDB.getAll();
    const index = results.findIndex((a) => a.id === id);
    if (index === -1) return null;

    results[index] = { ...results[index], ...data };
    localStorage.setItem(KEYS.ANALYSIS_RESULTS, JSON.stringify(results));
    return results[index];
  },
};
