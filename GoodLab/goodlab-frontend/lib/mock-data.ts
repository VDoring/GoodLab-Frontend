import type { User, Room, Team, TeamMember, RoomMember, AnalysisResult, GitHubAnalysis, NotionAnalysis } from '@/types';

// 더미 유저 데이터
export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'admin@goodlab.com',
    name: '김교수',
    role: 'super_admin',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    email: 'professor@goodlab.com',
    name: '이교수',
    role: 'admin',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=professor',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-3',
    email: 'leader@goodlab.com',
    name: '박팀장',
    role: 'team_leader',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leader',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-4',
    email: 'student1@goodlab.com',
    name: '최학생',
    role: 'user',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-5',
    email: 'student2@goodlab.com',
    name: '정학생',
    role: 'user',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-6',
    email: 'student3@goodlab.com',
    name: '강학생',
    role: 'user',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student3',
    created_at: '2024-01-01T00:00:00Z',
  },
];

// 더미 방 데이터
export const MOCK_ROOMS: Room[] = [
  {
    id: 'room-1',
    title: '캡스톤 디자인 (2026-1학기)',
    description: '2026년 1학기 캡스톤 디자인 프로젝트',
    created_by: 'user-2',
    start_date: '2026-03-01',
    end_date: '2026-06-30',
    invite_code: 'CAPSTONE2026',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'room-2',
    title: '소프트웨어 공학 프로젝트',
    description: '소프트웨어 공학 팀 프로젝트',
    created_by: 'user-2',
    start_date: '2026-03-01',
    end_date: '2026-06-30',
    invite_code: 'SEPROJECT2026',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
];

// 더미 팀 데이터
export const MOCK_TEAMS: Team[] = [
  {
    id: 'team-1',
    room_id: 'room-1',
    name: '팀 A',
    leader_id: 'user-3',
    github_url: 'https://github.com/team-a/project',
    notion_url: 'https://notion.so/team-a',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'team-2',
    room_id: 'room-1',
    name: '팀 B',
    leader_id: 'user-4',
    github_url: 'https://github.com/team-b/project',
    notion_url: 'https://notion.so/team-b',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'team-3',
    room_id: 'room-2',
    name: '팀 C',
    leader_id: 'user-5',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
];

// 더미 팀 멤버 데이터
export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    team_id: 'team-1',
    user_id: 'user-3',
    role: 'team_leader',
    joined_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'tm-2',
    team_id: 'team-1',
    user_id: 'user-4',
    role: 'member',
    joined_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'tm-3',
    team_id: 'team-1',
    user_id: 'user-5',
    role: 'member',
    joined_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'tm-4',
    team_id: 'team-2',
    user_id: 'user-4',
    role: 'team_leader',
    joined_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'tm-5',
    team_id: 'team-2',
    user_id: 'user-6',
    role: 'member',
    joined_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'tm-6',
    team_id: 'team-3',
    user_id: 'user-5',
    role: 'team_leader',
    joined_at: '2024-02-01T00:00:00Z',
  },
];

// 더미 방 멤버 데이터
export const MOCK_ROOM_MEMBERS: RoomMember[] = [
  {
    id: 'rm-1',
    room_id: 'room-1',
    user_id: 'user-2',
    joined_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'rm-2',
    room_id: 'room-1',
    user_id: 'user-3',
    joined_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'rm-3',
    room_id: 'room-1',
    user_id: 'user-4',
    joined_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'rm-4',
    room_id: 'room-1',
    user_id: 'user-5',
    joined_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'rm-5',
    room_id: 'room-2',
    user_id: 'user-2',
    joined_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'rm-6',
    room_id: 'room-2',
    user_id: 'user-5',
    joined_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'rm-7',
    room_id: 'room-2',
    user_id: 'user-6',
    joined_at: '2024-02-01T00:00:00Z',
  },
];

// 더미 분석 결과 데이터
export const MOCK_GITHUB_ANALYSIS: GitHubAnalysis[] = [
  {
    user: '박팀장',
    commits: 45,
    prs: 12,
    code_lines: 3200,
    insights: '가장 활발한 기여자, 코드 품질 우수',
  },
  {
    user: '최학생',
    commits: 32,
    prs: 8,
    code_lines: 2100,
    insights: '꾸준한 커밋 패턴, 문서화 작업 기여',
  },
  {
    user: '정학생',
    commits: 28,
    prs: 6,
    code_lines: 1800,
    insights: '버그 수정에 집중, 테스트 코드 작성',
  },
];

export const MOCK_NOTION_ANALYSIS: NotionAnalysis[] = [
  {
    user: '박팀장',
    pages: 15,
    comments: 48,
    insights: '회의록 작성 및 문서 정리 주도',
  },
  {
    user: '최학생',
    pages: 12,
    comments: 35,
    insights: '요구사항 명세서 작성',
  },
  {
    user: '정학생',
    pages: 8,
    comments: 22,
    insights: '디자인 문서 및 API 명세 작성',
  },
];

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  id: 'analysis-1',
  team_id: 'team-1',
  status: 'completed',
  github_data: MOCK_GITHUB_ANALYSIS,
  notion_data: MOCK_NOTION_ANALYSIS,
  ai_insights: `
## 팀 협업 종합 평가

### 전체 요약
팀 A는 전반적으로 균형 잡힌 협업을 보여주고 있습니다. GitHub 활동과 Notion 문서화가 활발하게 이루어지고 있습니다.

### 강점
- 박팀장의 리더십 하에 체계적인 프로젝트 관리
- 모든 팀원이 골고루 기여하는 균형잡힌 팀워크
- 문서화와 코드 품질 모두 우수

### 개선 권장사항
- 코드 리뷰 활성화 필요
- 정기적인 회의록 작성 권장
- 테스트 커버리지 향상 필요

### 팀원별 평가
**박팀장**: 팀을 잘 이끌고 있으며, 기술적 리더십이 돋보임
**최학생**: 꾸준한 기여도와 문서화 능력이 우수
**정학생**: 버그 수정과 테스트에 강점을 보임
  `,
  analyzed_at: '2024-03-15T10:30:00Z',
  created_at: '2024-03-15T10:00:00Z',
};

// 비밀번호는 모두 "password123"
export const MOCK_PASSWORDS: Record<string, string> = {
  'admin@goodlab.com': 'password123',
  'professor@goodlab.com': 'password123',
  'leader@goodlab.com': 'password123',
  'student1@goodlab.com': 'password123',
  'student2@goodlab.com': 'password123',
  'student3@goodlab.com': 'password123',
};
