# 팀 프로젝트 협업 관리 플랫폼 PRD

## 1. 프로젝트 개요 (Executive Summary)

**프로젝트명**: GoodLab (가칭)
**핵심 가치 제안**: "교수와 학생이 함께 사용하는 팀 프로젝트 관리 및 분석 플랫폼"
**목표 런칭**: MVP 2026년 3월

### 비전 (Vision)
교육 현장에서 팀 프로젝트를 효율적으로 관리하고, GitHub/Notion 데이터를 분석하여 객관적인 팀원 기여도를 확인할 수 있는 플랫폼을 제공합니다.

## 2. 문제 정의 및 해결 방안

### 현재 문제점
- **팀 관리 어려움**: 교수가 여러 팀을 동시에 관리하기 어려움
- **초대 절차 복잡**: 이메일 초대보다 QR/링크로 간단하게 참여하고 싶음
- **기여도 파악 어려움**: GitHub/Notion 활동을 일일이 확인해야 함
- **문서 작성 분산**: 별도의 도구 없이 팀 내에서 문서를 작성하고 싶음
- **팀원 관리 불편**: 팀장 권한 부여, 팀원 방출 등의 기능이 없음

### 해결 방안
- 4단계 권한 시스템 (슈퍼관리자/교수/팀장/일반사용자)
- QR 코드 및 링크 공유로 간편한 팀 참여
- n8n 기반 GitHub/Notion 자동 분석 및 기여도 확인
- Slack 스타일의 직관적인 UI
- 내장 문서 작성 기능 (Notion 스타일)

## 3. 대상 사용자 (Target Users)

### 3.1 Primary Users
- **교수/강사**: 팀 프로젝트 과제를 진행하는 대학 교수
- **학생**: 팀 프로젝트에 참여하는 대학생

### 3.2 Secondary Users
- **시스템 관리자**: 교내 시스템을 총괄 관리하는 슈퍼관리자
- **팀장**: 팀 내에서 리더 역할을 하는 학생

## 4. 권한 시스템 (Permission System)

### 4.1 4단계 권한 구조

```
┌─────────────────────────────────────────────────┐
│           슈퍼관리자 (Super Admin)               │
│  - 전체 시스템 관리                              │
│  - 교수에게 관리자 권한 부여/회수                 │
└─────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│  관리자 (교수)    │    │  관리자 (교수)    │
│  - 방 생성/관리   │    │  - 방 생성/관리   │
│  - 팀 생성/관리   │    │  - 팀 생성/관리   │
│  - 팀장 권한 부여 │    │  - 팀장 권한 부여 │
│  - 팀원 방출     │    │  - 팀원 방출     │
└──────────────────┘    └──────────────────┘
        │                       │
        ├───────────┬───────────┤
        ▼           ▼           ▼
   ┌────────┐  ┌────────┐  ┌────────┐
   │  팀장   │  │  유저   │  │  유저   │
   └────────┘  └────────┘  └────────┘
```

### 4.2 권한별 기능

#### 슈퍼관리자 (Super Admin)
- ✅ 일반 유저에게 교수(관리자) 권한 부여
- ✅ 교수 권한 회수
- ✅ 전체 시스템 사용자 조회
- ✅ 전체 방/팀 현황 조회

#### 관리자 (교수)
- ✅ 방(Room) 생성/수정/삭제
- ✅ 방 QR 코드 생성 및 다운로드
- ✅ 방 초대 링크 생성
- ✅ 팀(Team) 생성/수정/삭제 (방 안에 여러 개)
- ✅ 팀장 권한 부여/회수
- ✅ 팀원 방출
- ✅ GitHub/Notion 분석 실행
- ✅ 분석 결과 조회
- ✅ 문서 작성 및 공유

#### 팀장 (Team Leader)
- ✅ GitHub/Notion 주소 등록/수정
- ✅ 팀 문서 작성 및 편집
- ✅ 팀원 초대 (QR/링크)
- ✅ 분석 결과 조회
- ⚠️ 팀원 방출 불가 (교수만 가능)

#### 일반 유저 (User)
- ✅ QR/링크로 방/팀 참여
- ✅ 본인이 속한 방/팀 조회
- ✅ GitHub/Notion 주소 등록 (팀 공동 작업)
- ✅ 문서 조회 및 편집 (권한에 따라)
- ✅ 분석 결과 조회 (본인 데이터)

## 5. 핵심 기능 명세 (Key Features)

### 5.1 인증 시스템

#### Feature 1: Supabase 인증
- **회원가입**: 이메일/비밀번호
- **로그인**: Supabase Auth
- **소셜 로그인**: Google OAuth (선택)
- **비밀번호 재설정**: 이메일 인증
- **프로필 관리**: 이름, 아바타 수정

### 5.2 슈퍼관리자 페이지

#### Feature 2: 권한 관리 대시보드
```
┌─────────────────────────────────────────┐
│  슈퍼관리자 대시보드                      │
├─────────────────────────────────────────┤
│  사용자 목록                              │
│  ┌─────────────────────────────────────┐│
│  │ 이름     │ 이메일    │ 권한   │ 액션 ││
│  │ 홍길동   │ hong@...  │ 교수   │ 회수 ││
│  │ 김철수   │ kim@...   │ 유저   │ 부여 ││
│  └─────────────────────────────────────┘│
│                                          │
│  [교수 권한 부여] [교수 권한 회수]        │
└─────────────────────────────────────────┘
```

**주요 기능**:
- 전체 사용자 리스트 조회 (검색, 필터링)
- 교수 권한 부여 (role: admin)
- 교수 권한 회수 (role: user)
- 권한 변경 이력 로그

### 5.3 관리자(교수) 페이지

#### Feature 3: 방(Room) 관리

**방 생성**:
```
┌─────────────────────────────────────────┐
│  방 생성                                  │
├─────────────────────────────────────────┤
│  방 제목: [________________]              │
│  설명:   [_______________________________]│
│  기간:   [2026-03-01] ~ [2026-06-30]      │
│                                          │
│  [생성하기] [취소]                        │
└─────────────────────────────────────────┘
```

**방 목록**:
```
┌─────────────────────────────────────────┐
│  내 방 목록                               │
├─────────────────────────────────────────┤
│  📁 캡스톤 디자인 (2026-1학기)            │
│     팀: 5개 | 참여자: 25명                │
│     [QR 다운로드] [링크 복사] [관리]      │
│                                          │
│  📁 소프트웨어 공학 프로젝트               │
│     팀: 8개 | 참여자: 40명                │
│     [QR 다운로드] [링크 복사] [관리]      │
└─────────────────────────────────────────┘
```

**QR 코드 생성**:
- QR 코드 이미지 생성 (PNG 다운로드)
- 초대 링크 복사 (클릭 한 번에 복사)
- QR 스캔 → 자동 로그인 후 방 참여

#### Feature 4: 팀(Team) 관리

**팀 생성** (방 안에 여러 개):
```
┌─────────────────────────────────────────┐
│  방: 캡스톤 디자인                        │
├─────────────────────────────────────────┤
│  팀 목록:                                 │
│                                          │
│  🏃 팀 A (팀장: 김철수)                   │
│     멤버: 김철수, 이영희, 박민수 (3명)     │
│     [팀장 변경] [멤버 관리] [삭제]        │
│                                          │
│  🏃 팀 B (팀장: 없음)                     │
│     멤버: 최지훈, 정수민 (2명)             │
│     [팀장 지정] [멤버 관리] [삭제]        │
│                                          │
│  [+ 새 팀 만들기]                         │
└─────────────────────────────────────────┘
```

**팀장 권한 부여/회수**:
- 팀 멤버 목록에서 선택
- "팀장 지정" 버튼 클릭 → role: team_leader
- "팀장 해제" 버튼 클릭 → role: user

**팀원 방출**:
- 팀 멤버 목록에서 선택
- "팀에서 제거" 버튼 클릭
- 확인 모달 → 방출 완료

#### Feature 5: GitHub/Notion 연동

**주소 등록**:
```
┌─────────────────────────────────────────┐
│  팀 A - 연동 설정                         │
├─────────────────────────────────────────┤
│  GitHub Repository:                      │
│  [https://github.com/team-a/project]     │
│  [등록]                                   │
│                                          │
│  Notion Workspace:                       │
│  [https://notion.so/team-a/workspace]    │
│  [등록]                                   │
│                                          │
│  상태: ✅ 연동 완료                        │
└─────────────────────────────────────────┘
```

**특징**:
- 팀원 누구나 주소 등록 가능 (교수, 팀장, 일반 유저)
- 여러 명이 동시에 등록 시 최신 값으로 업데이트
- 연동 상태 실시간 표시

#### Feature 6: 분석 버튼

**분석 실행 플로우**:
```
[분석 시작] 버튼 클릭
    ↓
[상태: 분석 중...] (로딩 애니메이션)
    ↓
n8n Webhook 호출 (GitHub/Notion 링크 전달)
    ↓
GitHub API: 커밋, PR, 이슈 데이터 수집
Notion API: 페이지, 댓글 데이터 수집
    ↓
AI 분석 (Claude/GPT)
    ↓
결과를 DB에 저장 (analysis_results 테이블)
    ↓
[상태: 분석 완료] → [확인] 버튼 활성화
```

**UI 상태 변화**:
```
초기 상태: [분석 시작] 버튼
   ↓
분석 중:  [⏳ 분석 중... (예상 시간: 2분)] (버튼 비활성화)
   ↓
완료:     [✅ 분석 완료] [확인하기] 버튼
```

#### Feature 7: 확인 버튼

**분석 결과 페이지**:
```
┌─────────────────────────────────────────┐
│  팀 A - 분석 결과                         │
├─────────────────────────────────────────┤
│  📊 GitHub 분석                           │
│  ┌─────────────────────────────────────┐│
│  │ 팀원     │ 커밋 수 │ PR │ 코드 라인 ││
│  │ 김철수   │ 45     │ 12 │ +2,340   ││
│  │ 이영희   │ 38     │ 10 │ +1,890   ││
│  │ 박민수   │ 22     │  5 │ +780     ││
│  └─────────────────────────────────────┘│
│                                          │
│  📝 Notion 분석                           │
│  ┌─────────────────────────────────────┐│
│  │ 팀원     │ 페이지 작성 │ 댓글 │     ││
│  │ 김철수   │ 8         │ 24  │      ││
│  │ 이영희   │ 12        │ 35  │      ││
│  │ 박민수   │ 6         │ 18  │      ││
│  └─────────────────────────────────────┘│
│                                          │
│  🤖 AI 종합 평가                          │
│  - 김철수: 코드 기여도 높음, 문서화 우수  │
│  - 이영희: 전반적으로 균형잡힌 기여       │
│  - 박민수: 코드 기여도 향상 필요          │
│                                          │
│  [PDF 다운로드] [다시 분석]               │
└─────────────────────────────────────────┘
```

**기능**:
- DB에 저장된 최신 분석 결과 조회
- 차트 및 그래프 시각화 (Recharts)
- PDF 리포트 다운로드
- 재분석 버튼 (새로운 데이터 수집)

### 5.4 유저 페이지

#### Feature 8: Slack 스타일 UI

**레이아웃**:
```
┌────────────┬────────────────────────────────┐
│            │  캡스톤 디자인 (2026-1학기)      │
│  사이드바   ├────────────────────────────────┤
│            │                                │
│ 📁 내 방    │  [메인 채널]                    │
│  캡스톤     │                                │
│  소공       │  📌 공지사항                    │
│            │  - 중간발표 일정 안내            │
│ 🏃 내 팀    │                                │
│  팀 A      │  💬 최근 활동                    │
│  팀 B      │  - 김철수님이 문서를 작성했습니다 │
│            │  - 이영희님이 PR을 올렸습니다    │
│ 📄 문서     │                                │
│  회의록     │  📊 우리 팀 통계                 │
│  기획서     │  - GitHub: 커밋 127개           │
│            │  - Notion: 페이지 26개          │
│            │                                │
│            │  [분석 요청하기]                 │
└────────────┴────────────────────────────────┘
```

**사이드바 구성**:
- **내 방**: 참여 중인 모든 방 목록
- **내 팀**: 참여 중인 팀 목록
- **문서**: 팀 공유 문서 (Notion 스타일)
- **설정**: 프로필, 알림 설정

**메인 영역**:
- 선택한 방/팀의 대시보드
- 최근 활동 타임라인
- 팀 통계 (GitHub/Notion)
- 빠른 액션 버튼

### 5.5 문서 작성 페이지

#### Feature 9: Notion 스타일 에디터

**기능**:
- **블록 기반 에디터**: 제목, 본문, 이미지, 코드, 체크리스트 등
- **실시간 협업**: 여러 명이 동시 편집 (Supabase Realtime)
- **권한 관리**:
  - 교수/팀장: 문서 생성, 수정, 삭제, 공유
  - 일반 유저: 읽기 전용 (권한 부여 시 수정 가능)
- **문서 구조**:
  ```
  📁 캡스톤 디자인
    📄 프로젝트 기획서 (교수 작성)
    📁 팀 A
      📄 주간 회의록 (팀장 작성)
      📄 개발 일지 (팀원 공동 작성)
      📄 발표 자료 (팀원 공동 작성)
  ```

**에디터 UI**:
```
┌─────────────────────────────────────────┐
│  프로젝트 기획서                          │
├─────────────────────────────────────────┤
│                                          │
│  # 프로젝트 개요                          │
│                                          │
│  프로젝트명: AI 기반 학습 플랫폼           │
│                                          │
│  ## 팀원                                  │
│  - 김철수 (팀장)                          │
│  - 이영희 (개발)                          │
│  - 박민수 (디자인)                        │
│                                          │
│  [+ 블록 추가]                            │
│                                          │
│  작성자: 홍길동 교수 | 수정: 2분 전        │
└─────────────────────────────────────────┘
```

**블록 타입**:
- 텍스트 (h1, h2, h3, p)
- 리스트 (순서, 비순서, 체크리스트)
- 코드 블록 (Syntax Highlighting)
- 이미지 (Supabase Storage 업로드)
- 표 (Table)
- 구분선 (Divider)

## 6. 사용자 흐름 (User Flows)

### 6.1 교수 흐름

#### 1) 방 생성 및 초대
```
로그인 → 대시보드 → [방 만들기]
  → 방 정보 입력 (제목, 설명, 기간)
  → [생성]
  → QR 코드 다운로드 / 링크 복사
  → 학생들에게 공유
```

#### 2) 팀 생성 및 관리
```
방 선택 → [팀 만들기]
  → 팀 이름 입력
  → [생성]
  → 팀원 추가 (QR/링크로 참여한 학생 중 선택)
  → 팀장 지정
```

#### 3) 분석 및 확인
```
팀 선택 → [분석 시작]
  → 분석 중... (2-5분 대기)
  → 분석 완료 알림
  → [확인하기]
  → 분석 결과 페이지 조회
  → PDF 다운로드
```

### 6.2 학생 흐름

#### 1) 방/팀 참여
```
QR 스캔 또는 링크 클릭
  → 로그인/회원가입
  → 자동으로 방/팀 참여 완료
  → 대시보드에서 내 팀 확인
```

#### 2) GitHub/Notion 등록
```
팀 선택 → [연동 설정]
  → GitHub 주소 입력
  → Notion 주소 입력
  → [저장]
```

#### 3) 문서 작성
```
사이드바 → [문서] → [+ 새 문서]
  → 제목 입력
  → 블록 추가 (텍스트, 이미지, 코드 등)
  → 자동 저장
  → 팀원과 실시간 협업
```

### 6.3 슈퍼관리자 흐름

```
로그인 → 슈퍼관리자 대시보드
  → 사용자 목록 조회
  → 교수 권한 부여할 사용자 선택
  → [교수 권한 부여] 클릭
  → 확인 모달 → 완료
```

## 7. 기술 스택 (Tech Stack)

### 7.1 Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **UI Library**: React 18+
- **Styling**: Tailwind CSS 3+, shadcn/ui
- **State Management**: Zustand
- **Form**: React Hook Form + Zod
- **Charts**: Recharts (분석 결과 시각화)
- **Editor**: Tiptap (Notion 스타일 에디터)
- **QR Code**: qrcode.react

### 7.2 Backend
- **BaaS**: Supabase
  - PostgreSQL (Database)
  - Supabase Auth (인증)
  - Supabase Storage (파일 저장)
  - Supabase Realtime (실시간 협업)
  - Row Level Security (권한 관리)

### 7.3 AI/Automation
- **Workflow**: n8n (Self-hosted)
- **AI**: Claude 3.5 Sonnet, GPT-4o
- **Analysis**:
  - GitHub API로 커밋, PR, 이슈 데이터 수집
  - Notion API로 페이지, 댓글 데이터 수집
  - AI로 종합 분석 및 인사이트 생성

### 7.4 Infrastructure
- **Hosting**: Vercel (Frontend)
- **n8n**: AWS Lightsail ($10/month)
- **Monitoring**: Vercel Analytics

## 8. 데이터베이스 스키마 (Database Schema)

### 8.1 Core Tables

```sql
-- 사용자
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user', -- super_admin, admin(교수), team_leader, user
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 방 (Room)
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id),
  start_date DATE,
  end_date DATE,
  invite_code VARCHAR(50) UNIQUE NOT NULL, -- QR/링크용 코드
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 방 멤버
CREATE TABLE room_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- 팀 (Team)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  leader_id UUID REFERENCES users(id), -- 팀장 (NULL 가능)
  github_url TEXT,
  notion_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 팀 멤버
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- team_leader, member
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 분석 결과
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, analyzing, completed, failed
  github_data JSONB, -- GitHub 분석 데이터
  notion_data JSONB, -- Notion 분석 데이터
  ai_insights TEXT, -- AI 종합 평가
  pdf_url TEXT, -- PDF 리포트 URL
  analyzed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 문서
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE, -- NULL이면 방 전체 문서
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL, -- Tiptap JSON 형식
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 문서 권한
CREATE TABLE document_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permission VARCHAR(50) DEFAULT 'read', -- read, write, admin
  UNIQUE(document_id, user_id)
);

-- 인덱스
CREATE INDEX idx_room_members_user ON room_members(user_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_teams_room ON teams(room_id);
CREATE INDEX idx_analysis_team ON analysis_results(team_id);
CREATE INDEX idx_documents_room ON documents(room_id);
CREATE INDEX idx_documents_team ON documents(team_id);
```

### 8.2 Row Level Security (RLS) 예시

```sql
-- 사용자는 자신이 속한 방만 조회 가능
CREATE POLICY "Users can view rooms they are members of"
ON rooms FOR SELECT
USING (
  id IN (
    SELECT room_id FROM room_members WHERE user_id = auth.uid()
  )
);

-- 교수(admin)만 방 생성 가능
CREATE POLICY "Only admins can create rooms"
ON rooms FOR INSERT
WITH CHECK (
  (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin')
);

-- 팀장 또는 교수만 팀 정보 수정 가능
CREATE POLICY "Team leaders and admins can update teams"
ON teams FOR UPDATE
USING (
  leader_id = auth.uid() OR
  (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin')
);
```

## 9. API 명세 (API Endpoints)

### 9.1 Supabase Client (Frontend에서 직접 호출)

```typescript
// 방 생성 (교수만)
const { data, error } = await supabase
  .from('rooms')
  .insert({
    title: '캡스톤 디자인',
    description: '2026-1학기 캡스톤',
    created_by: user.id,
    start_date: '2026-03-01',
    end_date: '2026-06-30',
    invite_code: generateInviteCode()
  })

// 팀 생성
const { data, error } = await supabase
  .from('teams')
  .insert({
    room_id: roomId,
    name: '팀 A',
    leader_id: null
  })

// 팀장 지정
const { data, error } = await supabase
  .from('teams')
  .update({ leader_id: userId })
  .eq('id', teamId)

// 분석 결과 조회
const { data, error } = await supabase
  .from('analysis_results')
  .select('*')
  .eq('team_id', teamId)
  .order('created_at', { ascending: false })
  .limit(1)
```

### 9.2 n8n Webhook Endpoints

```
POST /webhook/analyze
Body:
{
  "team_id": "uuid",
  "github_url": "https://github.com/...",
  "notion_url": "https://notion.so/..."
}

Response:
{
  "status": "started",
  "analysis_id": "uuid",
  "estimated_time": "3 minutes"
}
```

## 10. n8n 워크플로우 (Analysis Workflow)

### 10.1 분석 워크플로우

```
[Webhook Trigger] (Frontend에서 호출)
    ↓
[Get Team Data from Supabase]
    ↓
    ├─ [GitHub API: Get Commits]
    │    ↓
    │  [GitHub API: Get Pull Requests]
    │    ↓
    │  [GitHub API: Get Issues]
    │    ↓
    │  [AI Agent (Claude): 코드 분석]
    │
    ├─ [Notion API: Get Pages]
    │    ↓
    │  [Notion API: Get Comments]
    │    ↓
    │  [AI Agent (GPT-4): 문서 분석]
    │
    ↓
[Merge Results]
    ↓
[AI Agent (GPT-4): 종합 평가 생성]
    ↓
[Generate PDF Report]
    ↓
[Upload to Supabase Storage]
    ↓
[Update Supabase: analysis_results]
    ↓
[Send Notification] (이메일 또는 앱 내 알림)
```

### 10.2 AI 분석 프롬프트 예시

#### GitHub 분석
```
다음 팀의 GitHub 활동을 분석하세요:

팀명: {team_name}
기간: {start_date} ~ {end_date}

데이터:
- 커밋: {commits}
- Pull Requests: {prs}
- Issues: {issues}

각 팀원별로 다음을 평가하세요:
1. 커밋 빈도 및 품질
2. PR 기여도
3. 코드 리뷰 참여도
4. 이슈 해결 기여도

JSON 형식으로 응답:
{
  "members": [
    {
      "name": "김철수",
      "commits": 45,
      "prs": 12,
      "code_quality": "높음",
      "insights": "..."
    }
  ]
}
```

#### Notion 분석
```
다음 팀의 Notion 활동을 분석하세요:

팀명: {team_name}

데이터:
- 페이지: {pages}
- 댓글: {comments}

각 팀원별로 다음을 평가하세요:
1. 문서 작성 기여도
2. 협업 참여도 (댓글, 피드백)
3. 문서 품질

JSON 형식으로 응답.
```

## 11. UI/UX 디자인 가이드

### 11.1 색상 팔레트 (Tailwind 기준)

```css
Primary: blue-600 (교수/관리자 색상)
Secondary: purple-600 (팀장 색상)
Success: green-600 (분석 완료)
Warning: yellow-600 (분석 중)
Error: red-600 (오류)
Neutral: gray-600 (일반)
```

### 11.2 컴포넌트 스타일

**버튼**:
- Primary: `bg-blue-600 hover:bg-blue-700 text-white`
- Secondary: `bg-gray-200 hover:bg-gray-300 text-gray-800`
- Danger: `bg-red-600 hover:bg-red-700 text-white`

**카드**:
- `bg-white border border-gray-200 rounded-lg shadow-sm p-4`

**입력 필드**:
- `border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500`

### 11.3 반응형 디자인

- Mobile (< 640px): 사이드바 숨김, 햄버거 메뉴
- Tablet (640px - 1024px): 축소된 사이드바
- Desktop (> 1024px): 전체 레이아웃

## 12. 개발 로드맵 (Development Roadmap)

### Phase 1: Core MVP (2026년 1월 - 3월, 3개월)

#### 2026년 1월: 기반 구축
**Week 1-2**:
- Next.js 14 프로젝트 셋업
- Supabase 프로젝트 생성 및 설정
- 데이터베이스 스키마 구현
- Tailwind CSS + shadcn/ui 설치

**Week 3-4**:
- Supabase Auth 구현 (회원가입, 로그인)
- RLS 정책 설정
- 기본 레이아웃 (사이드바, 헤더)

#### 2026년 2월: 핵심 기능 개발
**Week 1-2**:
- 슈퍼관리자 페이지 (권한 부여/회수)
- 방(Room) 생성/조회/삭제
- QR 코드 생성 및 다운로드
- 초대 링크 시스템

**Week 3-4**:
- 팀(Team) 생성/조회/삭제
- 팀장 지정/해제
- 팀원 추가/방출
- GitHub/Notion 주소 등록

#### 2026년 3월: 분석 및 마무리
**Week 1-2**:
- n8n 워크플로우 구축
- GitHub API 연동 및 데이터 수집
- Notion API 연동 및 데이터 수집
- AI 분석 엔진 (Claude/GPT)

**Week 3-4**:
- 분석 결과 페이지 (차트, 그래프)
- PDF 리포트 생성
- 알림 시스템
- 내부 테스트 및 버그 수정

**마일스톤**: MVP 완성, 파일럿 테스트 준비

### Phase 2: Enhanced Features (2026년 4월 - 6월, 3개월)

#### 2026년 4월: Slack 스타일 UI
- Slack 스타일 레이아웃 구현
- 사이드바 내비게이션
- 활동 타임라인
- 알림 센터

#### 2026년 5월: 문서 작성 기능
- Tiptap 에디터 통합
- 블록 기반 에디터 구현
- 실시간 협업 (Supabase Realtime)
- 문서 권한 관리

#### 2026년 6월: 고도화 및 출시
- 성능 최적화
- 반응형 디자인 개선
- 사용자 피드백 반영
- 베타 출시

**마일스톤**: 정식 출시, 실제 교육 현장 적용

## 13. 성공 지표 (Success Metrics)

### MVP (2026년 3월)
- ✅ 5-10개 학교/기관 파일럿
- ✅ 20-30개 팀 프로젝트 관리
- ✅ 사용자 만족도 70% 이상
- ✅ 분석 완료 시간 5분 이내

### 정식 출시 (2026년 6월)
- ✅ 30-50개 학교/기관 사용
- ✅ 100-200개 팀 프로젝트
- ✅ 월간 활성 사용자 500명 이상
- ✅ 시스템 가동률 99% 이상

## 14. 위험 요소 및 완화 방안

### 14.1 기술적 위험
- **위험**: GitHub/Notion API 변경
- **완화**: API 버전 관리, 폴백 메커니즘

### 14.2 사용성 위험
- **위험**: UI가 복잡해서 사용자가 어려워함
- **완화**: 사용자 가이드, 온보딩 튜토리얼

### 14.3 성능 위험
- **위험**: 대규모 데이터 분석 시 느려짐
- **완화**: 백그라운드 작업, 캐싱, 비동기 처리

## 15. 다음 단계 (Next Steps)

### 즉시 실행 (1-2주)
1. ✅ **PRD 완성** (현재 문서)
2. 🔲 **Next.js 14 프로젝트 셋업**
3. 🔲 **Supabase 프로젝트 생성**
4. 🔲 **데이터베이스 스키마 구현**
5. 🔲 **기본 UI 컴포넌트 구축** (shadcn/ui)

### 단기 (2026년 1월)
1. 🔲 **인증 시스템 구현** (Supabase Auth)
2. 🔲 **슈퍼관리자 페이지**
3. 🔲 **방 생성 및 QR 코드 생성**
4. 🔲 **팀 생성 및 관리**

### 중기 (2026년 2-3월)
1. 🔲 **n8n 워크플로우 구축**
2. 🔲 **GitHub/Notion 분석 엔진**
3. 🔲 **분석 결과 페이지**
4. 🔲 **MVP 테스트 및 피드백**

---

## 부록 (Appendix)

### A. 용어 정의

- **방(Room)**: 교수가 생성하는 최상위 단위 (예: 캡스톤 디자인 2026-1학기)
- **팀(Team)**: 방 안에 생성되는 학생 그룹
- **팀장(Team Leader)**: 팀 내에서 제한적 관리 권한을 가진 학생
- **분석(Analysis)**: GitHub/Notion 데이터를 n8n + AI로 자동 분석하는 프로세스

### B. 참고 자료

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [n8n Documentation](https://docs.n8n.io/)
- [Tiptap Editor](https://tiptap.dev/)
- [qrcode.react](https://github.com/zpao/qrcode.react)

### C. 변경 이력

- **v1.0** (2025-10-30): 초안 작성
- **v1.1** (2025-10-31): 프론트엔드 요구사항 반영
  - 권한별 기능 명세 구체화
  - 분석 버튼 UI 상태 변화 및 플로우 상세 기술
  - GitHub/Notion 연동 주체 명확화 (팀원 누구나)

---

**문서 정보**
- **작성일**: 2025년 10월 31일
- **버전**: 1.1
- **작성자**: Product Team
- **다음 리뷰**: 1주 후

**연락처**
- **Project**: GoodLab
- **GitHub**: (예정)