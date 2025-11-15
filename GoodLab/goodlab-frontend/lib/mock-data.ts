import type { User, Room, Team, TeamMember, RoomMember, AnalysisResult, GitHubAnalysis, NotionAnalysis, Document, DocumentPermission } from '@/types';

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
  {
    id: 'user-7',
    email: 'student4@goodlab.com',
    name: '윤학생',
    role: 'user',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student4',
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'user-8',
    email: 'student5@goodlab.com',
    name: '송학생',
    role: 'user',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student5',
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'user-9',
    email: 'student6@goodlab.com',
    name: '임학생',
    role: 'user',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student6',
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'user-10',
    email: 'professor2@goodlab.com',
    name: '박교수',
    role: 'admin',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=professor2',
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
  {
    id: 'room-3',
    title: '웹 프로그래밍 실습',
    description: '2026년 1학기 웹 프로그래밍 실습',
    created_by: 'user-10',
    start_date: '2026-03-01',
    end_date: '2026-06-30',
    invite_code: 'WEBPROG2026',
    created_at: '2024-02-05T00:00:00Z',
    updated_at: '2024-02-05T00:00:00Z',
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
    github_url: 'https://github.com/team-c/seproject',
    notion_url: 'https://notion.so/team-c',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'team-4',
    room_id: 'room-3',
    name: '웹팀 1',
    leader_id: 'user-7',
    github_url: 'https://github.com/webteam1/project',
    notion_url: 'https://notion.so/webteam1',
    created_at: '2024-02-05T00:00:00Z',
    updated_at: '2024-02-05T00:00:00Z',
  },
  {
    id: 'team-5',
    room_id: 'room-3',
    name: '웹팀 2',
    leader_id: 'user-8',
    github_url: undefined,
    notion_url: undefined,
    created_at: '2024-02-05T00:00:00Z',
    updated_at: '2024-02-05T00:00:00Z',
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
  {
    id: 'tm-7',
    team_id: 'team-4',
    user_id: 'user-7',
    role: 'team_leader',
    joined_at: '2024-02-05T00:00:00Z',
  },
  {
    id: 'tm-8',
    team_id: 'team-4',
    user_id: 'user-8',
    role: 'member',
    joined_at: '2024-02-05T00:00:00Z',
  },
  {
    id: 'tm-9',
    team_id: 'team-4',
    user_id: 'user-9',
    role: 'member',
    joined_at: '2024-02-05T00:00:00Z',
  },
  {
    id: 'tm-10',
    team_id: 'team-5',
    user_id: 'user-8',
    role: 'team_leader',
    joined_at: '2024-02-05T00:00:00Z',
  },
  {
    id: 'tm-11',
    team_id: 'team-5',
    user_id: 'user-9',
    role: 'member',
    joined_at: '2024-02-05T00:00:00Z',
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
  {
    id: 'rm-8',
    room_id: 'room-3',
    user_id: 'user-10',
    joined_at: '2024-02-05T00:00:00Z',
  },
  {
    id: 'rm-9',
    room_id: 'room-3',
    user_id: 'user-7',
    joined_at: '2024-02-05T00:00:00Z',
  },
  {
    id: 'rm-10',
    room_id: 'room-3',
    user_id: 'user-8',
    joined_at: '2024-02-05T00:00:00Z',
  },
  {
    id: 'rm-11',
    room_id: 'room-3',
    user_id: 'user-9',
    joined_at: '2024-02-05T00:00:00Z',
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
  'student4@goodlab.com': 'password123',
  'student5@goodlab.com': 'password123',
  'student6@goodlab.com': 'password123',
  'professor2@goodlab.com': 'password123',
};

// 더미 문서 데이터
export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    room_id: 'room-1',
    team_id: undefined, // 방 전체 문서
    title: '캡스톤 프로젝트 가이드라인',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: '캡스톤 프로젝트 가이드라인' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '2026년 1학기 캡스톤 디자인 프로젝트를 환영합니다.' }]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '프로젝트 목표' }]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '실무 중심의 프로젝트 경험' }]
              }]
            },
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '팀 협업 능력 향상' }]
              }]
            },
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '문제 해결 능력 배양' }]
              }]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '평가 기준' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '프로젝트는 다음 기준으로 평가됩니다:' }
          ]
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '기술적 완성도 (40%)' }]
              }]
            },
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '팀워크 및 협업 (30%)' }]
              }]
            },
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '문서화 및 발표 (30%)' }]
              }]
            }
          ]
        }
      ]
    },
    created_by: 'user-2',
    created_at: '2024-02-05T09:00:00Z',
    updated_at: '2024-02-05T09:00:00Z',
    last_edited_by: 'user-2',
  },
  {
    id: 'doc-2',
    room_id: 'room-1',
    team_id: 'team-1', // 팀 A 문서
    title: '팀 A - 프로젝트 기획서',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'AI 기반 학습 플랫폼' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '프로젝트명: ', marks: [{ type: 'bold' }] },
            { type: 'text', text: 'SmartLearn AI' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '팀원' }]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '박팀장 (팀장) - 백엔드 개발' }]
              }]
            },
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '최학생 - 프론트엔드 개발' }]
              }]
            },
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '정학생 - AI 모델 개발' }]
              }]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '프로젝트 개요' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'AI 기반 개인화 학습 플랫폼으로, 학생들의 학습 패턴을 분석하여 최적의 학습 경로를 제안합니다.' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '기술 스택' }]
        },
        {
          type: 'codeBlock',
          attrs: { language: 'json' },
          content: [{
            type: 'text',
            text: '{\n  "frontend": "React + TypeScript",\n  "backend": "Node.js + Express",\n  "ai": "Python + TensorFlow",\n  "database": "PostgreSQL"\n}'
          }]
        }
      ]
    },
    created_by: 'user-3',
    created_at: '2024-02-10T14:30:00Z',
    updated_at: '2024-03-01T16:45:00Z',
    last_edited_by: 'user-4',
  },
  {
    id: 'doc-3',
    room_id: 'room-1',
    team_id: 'team-1',
    title: '팀 A - 주간 회의록 (Week 3)',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: '주간 회의록 - Week 3' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '날짜: ', marks: [{ type: 'bold' }] },
            { type: 'text', text: '2024년 3월 15일' }
          ]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '참석자: ', marks: [{ type: 'bold' }] },
            { type: 'text', text: '박팀장, 최학생, 정학생' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '논의 사항' }]
        },
        {
          type: 'taskList',
          content: [
            {
              type: 'taskItem',
              attrs: { checked: true },
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '백엔드 API 설계 완료' }]
              }]
            },
            {
              type: 'taskItem',
              attrs: { checked: true },
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '프론트엔드 UI 프로토타입 완성' }]
              }]
            },
            {
              type: 'taskItem',
              attrs: { checked: false },
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: 'AI 모델 훈련 진행 중 (70%)' }]
              }]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '다음 주 목표' }]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: 'AI 모델 통합 완료' }]
              }]
            },
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '테스트 코드 작성' }]
              }]
            }
          ]
        }
      ]
    },
    created_by: 'user-3',
    created_at: '2024-03-15T15:00:00Z',
    updated_at: '2024-03-15T15:00:00Z',
    last_edited_by: 'user-3',
  },
  {
    id: 'doc-4',
    room_id: 'room-1',
    team_id: 'team-2',
    title: '팀 B - 프로젝트 제안서',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: '스마트 캠퍼스 시스템' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'IoT 기반 캠퍼스 통합 관리 시스템을 개발합니다.' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '주요 기능' }]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '스마트 출결 관리' }]
              }]
            },
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '강의실 환경 모니터링' }]
              }]
            },
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '에너지 절감 시스템' }]
              }]
            }
          ]
        }
      ]
    },
    created_by: 'user-4',
    created_at: '2024-02-12T10:00:00Z',
    updated_at: '2024-02-12T10:00:00Z',
    last_edited_by: 'user-4',
  },
  {
    id: 'doc-5',
    room_id: 'room-2',
    team_id: undefined, // 방 전체 문서
    title: '소프트웨어 공학 프로젝트 요구사항',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: '프로젝트 요구사항 명세서' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '소프트웨어 공학 수업의 프로젝트 요구사항입니다.' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '필수 요구사항' }]
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: 'UML 다이어그램 작성' }]
              }]
            },
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '테스트 케이스 작성' }]
              }]
            },
            {
              type: 'listItem',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: '형상 관리 (Git)' }]
              }]
            }
          ]
        }
      ]
    },
    created_by: 'user-2',
    created_at: '2024-02-08T11:00:00Z',
    updated_at: '2024-02-08T11:00:00Z',
    last_edited_by: 'user-2',
  },
];

// 더미 문서 권한 데이터
export const MOCK_DOCUMENT_PERMISSIONS: DocumentPermission[] = [
  {
    id: 'perm-1',
    document_id: 'doc-2',
    user_id: 'user-4',
    permission: 'write',
  },
  {
    id: 'perm-2',
    document_id: 'doc-2',
    user_id: 'user-5',
    permission: 'write',
  },
  {
    id: 'perm-3',
    document_id: 'doc-3',
    user_id: 'user-4',
    permission: 'read',
  },
  {
    id: 'perm-4',
    document_id: 'doc-1',
    user_id: 'user-3',
    permission: 'read',
  },
  {
    id: 'perm-5',
    document_id: 'doc-1',
    user_id: 'user-4',
    permission: 'read',
  },
];
