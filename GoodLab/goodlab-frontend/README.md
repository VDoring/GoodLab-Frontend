# GoodLab Frontend

> **팀 프로젝트 협업 관리 플랫폼** - 교수와 학생이 함께 사용하는 프로젝트 관리 및 분석 시스템

## 프로젝트 개요

GoodLab은 대학 교육 현장에서 팀 프로젝트를 효율적으로 관리하고, GitHub 데이터를 분석하여 객관적인 팀원 기여도를 확인할 수 있는 플랫폼입니다.

### 핵심 기능

- 4단계 권한 시스템 (슈퍼관리자/교수/팀장/학생)
- QR 코드 및 링크를 통한 간편한 팀 참여
- GitHub 활동 자동 분석 (시뮬레이션)
- Notion 스타일 문서 작성 (Tiptap 에디터)
- Recharts 기반 데이터 시각화
- Slack 스타일 직관적인 UI

## 기술 스택

### Frontend
- **Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 3.4.18
- **UI Library**: shadcn/ui (Radix UI 기반)
- **State Management**: Zustand 5.0.8
- **Form**: React Hook Form 7.66.0 + Zod 4.1.12
- **Charts**: Recharts 3.4.1
- **Editor**: Tiptap 3.10.7
- **QR Code**: qrcode.react 4.2.0

### Backend (Mock)
- LocalStorage 기반 Mock Database
- 실제 백엔드 연동 준비 완료

## 시작하기

### 1. 프로젝트 클론 및 의존성 설치

```bash
cd goodlab-frontend
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 프로덕션 빌드

```bash
npm run build
npm start
```

## 테스트 계정

모든 계정의 비밀번호는 `password123`입니다.

### 권한별 계정

| 권한 | 이메일 | 비밀번호 | 역할 |
|------|--------|---------|------|
| 슈퍼관리자 | admin@goodlab.com | password123 | 전체 시스템 관리 |
| 교수 | professor@goodlab.com | password123 | 방/팀 관리 |
| 교수 | professor2@goodlab.com | password123 | 방/팀 관리 |
| 팀장 | leader@goodlab.com | password123 | 팀 관리 |
| 학생 | student1@goodlab.com | password123 | 팀 참여 |
| 학생 | student2@goodlab.com | password123 | 팀 참여 |
| 학생 | student3@goodlab.com | password123 | 팀 참여 |
| 학생 | student4@goodlab.com | password123 | 팀 참여 |
| 학생 | student5@goodlab.com | password123 | 팀 참여 |
| 학생 | student6@goodlab.com | password123 | 팀 참여 |

## 주요 기능 소개

### 1. 권한 시스템 (4단계)

```
슈퍼관리자
    ├── 교수 권한 부여/회수
    ├── 전체 사용자 조회
    └── 시스템 관리

교수/관리자
    ├── 방(Room) 생성/관리
    ├── 팀(Team) 생성/관리
    ├── QR 코드 생성
    ├── 팀장 지정
    ├── 팀원 방출
    └── 분석 실행

팀장
    ├── GitHub 연동 설정
    ├── 팀 문서 작성
    ├── 팀원 초대
    └── 분석 결과 조회

일반 유저 (학생)
    ├── QR/링크로 참여
    ├── 문서 조회/편집
    └── 본인 분석 결과 조회
```

### 2. 방(Room) 및 팀(Team) 관리

- **방 생성**: 교수가 학기별/과목별 프로젝트 방 생성
- **QR 코드**: 자동 생성 및 다운로드 가능
- **초대 링크**: 클립보드 복사 기능
- **팀 생성**: 방 안에 여러 팀 생성 가능
- **팀원 관리**: 팀장 지정, 멤버 추가/제거

### 3. GitHub 연동 및 분석

- **연동 설정**: 팀원 누구나 GitHub URL 등록 가능
- **분석 시뮬레이션**: 2초 비동기 처리로 실제 분석 시뮬레이션
- **분석 결과**:
  - GitHub: 커밋 수, Pull Request, 코드 라인
  - AI 인사이트 (Mock)
- **시각화**:
  - Bar Chart (팀원별 기여도)
  - Pie Chart (전체 기여도 비율)
  - Area Chart (시간에 따른 활동 추이)
- **PDF 다운로드**: Markdown 형식으로 분석 리포트 다운로드

### 4. 문서 작성 (Tiptap 에디터)

- **Notion 스타일**: 블록 기반 에디터
- **지원 블록**:
  - 텍스트 (H1, H2, H3, Paragraph)
  - 리스트 (순서, 비순서, 체크리스트)
  - 코드 블록 (Syntax Highlighting)
  - 이미지, 표, 구분선
- **문서 구조**:
  - 방 전체 문서
  - 팀별 문서
- **권한 관리**: Read/Write/Admin

### 5. 대시보드

- **통계 카드**:
  - 참여 중인 방 수
  - 소속된 팀 수
  - 작성한 문서 수
  - 완료된 분석 수
- **최근 활동**: 문서 작성, 분석 완료 등
- **팀 통계**: GitHub 커밋, PR 수

## 프로젝트 구조

```
goodlab-frontend/
├── app/                          # Next.js App Router 페이지
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 홈페이지 (랜딩)
│   ├── auth/                    # 인증 페이지
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/               # 대시보드
│   ├── documents/               # 문서 관리
│   │   └── [id]/               # 문서 상세/편집
│   ├── invite/[code]/          # 초대 링크
│   ├── profile/                # 프로필
│   ├── settings/               # 설정
│   ├── admin/super/            # 슈퍼관리자 페이지
│   ├── professor/rooms/        # 교수 - 방 관리
│   │   └── [id]/              # 방 상세
│   ├── team/[id]/              # 팀 관리
│   │   └── analysis/           # 팀 분석
│   ├── 403/                    # 권한 없음
│   └── not-found.tsx           # 404
├── components/
│   ├── features/               # 기능 컴포넌트
│   │   ├── qr-code-dialog.tsx # QR 코드
│   │   └── tiptap-editor.tsx  # 에디터
│   ├── layout/                 # 레이아웃 컴포넌트
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── main-layout.tsx
│   └── ui/                     # shadcn/ui 컴포넌트
├── store/                       # Zustand 상태 관리
│   ├── authStore.ts
│   ├── roomStore.ts
│   ├── teamStore.ts
│   ├── documentStore.ts
│   └── analysisStore.ts
├── hooks/                       # 커스텀 훅
│   ├── useAuth.ts
│   ├── useRole.ts
│   └── use-toast.ts
├── lib/                         # 유틸리티 및 Mock DB
│   ├── mock-db.ts              # LocalStorage 기반 DB
│   ├── mock-data.ts            # 초기 더미 데이터
│   └── utils.ts
└── types/                       # TypeScript 타입
    └── index.ts
```

## 주요 페이지

| 경로 | 설명 | 권한 |
|------|------|------|
| `/` | 랜딩 페이지 | Public |
| `/auth/login` | 로그인 | Public |
| `/auth/signup` | 회원가입 | Public |
| `/dashboard` | 대시보드 | Authenticated |
| `/profile` | 프로필 관리 | Authenticated |
| `/settings` | 설정 | Authenticated |
| `/documents` | 문서 목록 | Authenticated |
| `/documents/[id]` | 문서 편집 | Authenticated + Permission |
| `/admin/super` | 슈퍼관리자 | Super Admin Only |
| `/professor/rooms` | 방 관리 | Admin (교수) |
| `/professor/rooms/[id]` | 방 상세 | Admin (교수) |
| `/team/[id]` | 팀 상세 | Team Member |
| `/team/[id]/analysis` | 팀 분석 | Team Member |
| `/invite/[code]` | 초대 수락 | Public |

## 데이터 관리

### LocalStorage 기반 Mock Database

프론트엔드 시연을 위해 LocalStorage를 사용한 완전한 CRUD 지원:

- `goodlab_users` - 사용자
- `goodlab_passwords` - 비밀번호 (이메일:비밀번호 매핑)
- `goodlab_rooms` - 방
- `goodlab_room_members` - 방 멤버
- `goodlab_teams` - 팀
- `goodlab_team_members` - 팀 멤버
- `goodlab_documents` - 문서
- `goodlab_document_permissions` - 문서 권한
- `goodlab_analysis_results` - 분석 결과

### 백엔드 연동 준비

`lib/mock-db.ts`의 함수들을 실제 API 호출로 교체하면 바로 프로덕션 환경에 사용 가능합니다.

```typescript
// 현재 (Mock)
export const roomDB = {
  create: (data) => { /* LocalStorage */ },
  getAll: () => { /* LocalStorage */ },
  // ...
}

// 백엔드 연동 시
export const roomDB = {
  create: async (data) => await fetch('/api/rooms', { method: 'POST', body: JSON.stringify(data) }),
  getAll: async () => await fetch('/api/rooms'),
  // ...
}
```

## 시연 가이드

### 1. 슈퍼관리자 플로우

```
1. admin@goodlab.com으로 로그인
2. 슈퍼관리자 페이지 접속
3. 일반 유저에게 교수 권한 부여
4. 전체 사용자 및 시스템 현황 조회
```

### 2. 교수 플로우

```
1. professor@goodlab.com으로 로그인
2. 방 만들기
   - 제목: "2026-1학기 캡스톤 디자인"
   - 기간: 2026-03-01 ~ 2026-06-30
3. QR 코드 다운로드 또는 링크 복사
4. 방 안에 팀 생성 (팀 A, 팀 B)
5. 팀장 지정
6. 팀 분석 실행 및 결과 확인
```

### 3. 학생 플로우

```
1. student1@goodlab.com으로 로그인
2. QR 스캔 또는 초대 링크로 방 참여
3. 팀 선택 및 참여
4. GitHub URL 등록
5. 팀 문서 작성
6. 분석 결과 확인
```

## 개발 가이드

### 새로운 페이지 추가

```typescript
// app/new-page/page.tsx
"use client";

import { MainLayout } from "@/components/layout";
import { useRequireAuth } from "@/hooks";

export default function NewPage() {
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      {/* Your content */}
    </MainLayout>
  );
}
```

### 권한 체크

```typescript
import { useRequireAdmin, useRequireSuperAdmin, useRequireTeamLeader } from "@/hooks";

// 교수 권한 필요
const { isAuthorized } = useRequireAdmin();

// 슈퍼관리자 권한 필요
const { isAuthorized } = useRequireSuperAdmin();

// 팀장 이상 권한 필요
const { isAuthorized } = useRequireTeamLeader();
```

### Zustand Store 사용

```typescript
import { useAuthStore, useRoomStore } from "@/store";

// 상태 읽기
const user = useAuthStore((state) => state.user);
const rooms = useRoomStore((state) => state.rooms);

// 액션 호출
const login = useAuthStore((state) => state.login);
const createRoom = useRoomStore((state) => state.createRoom);

// 사용 예시
await login(email, password);
const newRoom = createRoom({ title, description, ... });
```

## 배포

### Vercel 배포 (권장)

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 환경 변수

현재는 LocalStorage Mock DB를 사용하므로 환경 변수가 필요 없습니다.
실제 백엔드 연동 시 필요한 환경 변수:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 문제 해결

### LocalStorage 초기화

브라우저 DevTools → Application → Local Storage → Clear All

### 권한 문제

로그아웃 후 다시 로그인하거나 LocalStorage를 초기화하세요.

### 빌드 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

## 라이선스

이 프로젝트는 교육 목적으로 작성되었습니다.

## 문의

프로젝트 관련 문의: GoodLab Team

---

**GoodLab** - 팀 프로젝트 협업의 새로운 기준
