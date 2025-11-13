// User Types
export type UserRole = 'super_admin' | 'admin' | 'team_leader' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

// Room Types
export interface Room {
  id: string;
  title: string;
  description?: string;
  created_by: string;
  start_date?: string;
  end_date?: string;
  invite_code: string;
  created_at: string;
  updated_at: string;
}

export interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
}

// Team Types
export interface Team {
  id: string;
  room_id: string;
  name: string;
  leader_id?: string;
  github_url?: string;
  notion_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'team_leader' | 'member';
  joined_at: string;
}

// Analysis Types
export type AnalysisStatus = 'pending' | 'analyzing' | 'completed' | 'failed';

export interface GitHubAnalysis {
  user: string;
  commits: number;
  prs: number;
  code_lines: number;
  insights: string;
}

export interface NotionAnalysis {
  user: string;
  pages: number;
  comments: number;
  insights: string;
}

export interface AnalysisResult {
  id: string;
  team_id: string;
  status: AnalysisStatus;
  github_data?: GitHubAnalysis[];
  notion_data?: NotionAnalysis[];
  ai_insights?: string;
  pdf_url?: string;
  analyzed_at?: string;
  created_at: string;
}

// Document Types
export type DocumentPermissionLevel = 'read' | 'write' | 'admin';

export interface TiptapContent {
  type: string;
  content?: TiptapContent[];
  attrs?: Record<string, any>;
  text?: string;
  marks?: Array<{
    type: string;
    attrs?: Record<string, any>;
  }>;
}

export interface Document {
  id: string;
  room_id: string;
  team_id?: string; // NULL이면 방 전체 문서
  title: string;
  content: TiptapContent; // Tiptap JSON format
  created_by: string;
  created_at: string;
  updated_at: string;
  last_edited_by?: string; // 마지막 편집자
}

export interface DocumentPermission {
  id: string;
  document_id: string;
  user_id: string;
  permission: DocumentPermissionLevel;
}

// Document with relations (populated data)
export interface DocumentWithRelations extends Document {
  creator?: User;
  room?: Room;
  team?: Team;
  permissions?: DocumentPermission[];
}
