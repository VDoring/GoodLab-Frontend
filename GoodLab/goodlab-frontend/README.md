# GoodLab Frontend

> **팀 프로젝트 협업 관리 플랫폼** - 교수와 학생이 함께 사용하는 프로젝트 관리 및 분석 시스템

## 프로젝트 개요

GoodLab은 대학 교육 현장에서 팀 프로젝트를 효율적으로 관리하고, GitHub 데이터를 분석하여 객관적인 팀원 기여도를 확인할 수 있는 플랫폼입니다.

### 핵심 기능

- **4단계 권한 시스템**: 슈퍼관리자/교수/팀장/학생
- **간편한 참여 방식**: QR 코드 및 링크를 통한 원클릭 팀 참여
- **GitHub 분석**: GitHub 활동 자동 분석 및 시각화
- **고급 문서 작성**:
  - Notion 스타일 Tiptap 에디터
  - 이미지 업로드 (클릭/드래그앤드롭, 10MB 제한)
  - 중첩 문서 (페이지 in 페이지)
- **팀별 공지사항**: 각 팀의 독립적인 공지사항 관리
- **데이터 시각화**: Recharts 기반 차트 및 그래프
- **직관적인 UI**: Slack 스타일 레이아웃

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
  - Extension: Image, Table, Code Block, Task List
- **Image Processing**: browser-image-compression 2.0.2
- **QR Code**: qrcode.react 4.2.0
- **PDF Export**: jsPDF 3.0.3

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
    ├── 공지사항 관리
    └── 분석 실행

팀장
    ├── GitHub 연동 설정
    ├── 팀 문서 작성
    ├── 팀원 초대
    ├── 공지사항 작성
    └── 분석 결과 조회

일반 유저 (학생)
    ├── QR/링크로 참여
    ├── 문서 조회/편집
    ├── 공지사항 확인
    └── 본인 분석 결과 조회
```

### 2. 방(Room) 및 팀(Team) 관리

- **방 생성**: 교수가 학기별/과목별 프로젝트 방 생성
- **QR 코드**: 자동 생성 및 PNG 다운로드 가능
- **초대 링크**: 클립보드 복사 기능
- **팀 생성**: 방 안에 여러 팀 생성 가능
- **팀원 관리**: 팀장 지정 (최상단 표시), 멤버 추가/제거
- **권한 기반 접근**: 모든 사용자가 자신이 참여한 방에 접근 가능

### 3. GitHub 연동 및 분석

- **연동 설정**: 팀원 누구나 GitHub URL 등록 가능
- **분석 시뮬레이션**: 비동기 처리로 실제 분석 시뮬레이션
- **분석 결과**:
  - GitHub: 커밋 수, Pull Request, 코드 라인
  - AI 인사이트 (Mock)
- **시각화**:
  - Bar Chart (팀원별 기여도)
  - Pie Chart (전체 기여도 비율)
  - Area Chart (시간에 따른 활동 추이)
- **PDF 다운로드**: 분석 리포트 PDF 생성

### 4. 고급 문서 작성 (Tiptap 에디터)

#### 기본 기능
- **Notion 스타일**: 블록 기반 에디터
- **지원 블록**:
  - 텍스트 (H1, H2, H3, Paragraph)
  - 리스트 (순서, 비순서, 체크리스트)
  - 코드 블록 (Syntax Highlighting)
  - 이미지, 표, 구분선

#### 이미지 업로드 기능
- **2가지 업로드 방식**:
  1. 이미지 버튼 클릭하여 파일 선택
  2. 드래그 앤 드롭으로 직접 업로드
- **제약사항**:
  - 단일 이미지 크기 제한: 10MB
  - 총 용량 제한 없음 (여러 장 업로드 가능)
  - 자동 이미지 압축 (browser-image-compression)
- **Base64 인코딩**: 이미지를 문서와 함께 저장

#### 중첩 문서 (페이지 in 페이지)
- **Notion 스타일**: 문서 속에 다른 문서를 삽입 가능
- **링크 방식**: 삽입된 문서 클릭 시 해당 문서로 이동
- **계층 구조**: 무제한 깊이의 문서 계층 지원

#### 문서 구조
```
📁 캡스톤 디자인
  📄 프로젝트 기획서 (교수 작성)
  📁 팀 A
    📄 주간 회의록 (팀장 작성)
    📄 개발 일지 (팀원 공동 작성)
      📄 1주차 개발 일지 (중첩 문서)
      📄 2주차 개발 일지 (중첩 문서)
    📄 발표 자료 (팀원 공동 작성)
```

#### 권한 관리
- **교수/팀장**: 문서 생성, 수정, 삭제, 공유
- **일반 유저**: 읽기 전용 (권한 부여 시 수정 가능)

### 5. 팀별 공지사항

- **독립적 관리**: 각 팀이 개별적으로 공지사항 관리
- **작성 권한**: 교수, 팀장
- **표시 위치**: 팀 대시보드 상단
- **알림 기능**: 새 공지사항 알림 배지

### 6. 대시보드

- **통계 카드**:
  - 참여 중인 방 수
  - 소속된 팀 수
  - 작성한 문서 수
  - 완료된 분석 수
- **최근 활동**: 문서 작성, 분석 완료 등
- **팀 통계**: GitHub 커밋, PR 수
- **공지사항**: 최신 공지사항 미리보기

## 프로젝트 구조

```
goodlab-frontend/
├── app/                          # Next.js App Router 페이지
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 홈페이지 (랜딩)
│   ├── auth/                    # 인증 페이지
│   │   ├── login/               # 로그인
│   │   ├── signup/              # 회원가입
│   │   ├── forgot-password/     # 비밀번호 찾기
│   │   └── reset-password/      # 비밀번호 재설정
│   ├── dashboard/               # 대시보드
│   ├── documents/               # 문서 관리
│   │   └── [id]/               # 문서 상세/편집
│   ├── invite/[code]/          # 초대 링크
│   ├── profile/                # 프로필
│   ├── settings/               # 설정
│   ├── notifications/          # 알림
│   ├── search/                 # 검색
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
│   │   └── tiptap-editor.tsx  # Tiptap 에디터 (이미지, 중첩 문서)
│   ├── layout/                 # 레이아웃 컴포넌트
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── main-layout.tsx
│   └── ui/                     # shadcn/ui 컴포넌트
├── store/                       # Zustand 상태 관리
│   ├── authStore.ts
│   ├── roomStore.ts
│   ├── teamStore.ts
│   ├── documentStore.ts         # 문서 관리 (중첩 문서 지원)
│   ├── analysisStore.ts
│   ├── announcementStore.ts     # 공지사항 관리
│   └── notificationStore.ts     # 알림 관리
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
| `/auth/forgot-password` | 비밀번호 찾기 | Public |
| `/auth/reset-password` | 비밀번호 재설정 | Public |
| `/dashboard` | 대시보드 | Authenticated |
| `/profile` | 프로필 관리 | Authenticated |
| `/settings` | 설정 | Authenticated |
| `/notifications` | 알림 | Authenticated |
| `/search` | 검색 | Authenticated |
| `/documents` | 문서 목록 | Authenticated |
| `/documents/[id]` | 문서 편집 | Authenticated + Permission |
| `/admin/super` | 슈퍼관리자 | Super Admin Only |
| `/professor/rooms` | 방 관리 | Admin (교수) |
| `/professor/rooms/[id]` | 방 상세 | Admin (교수) |
| `/team/[id]` | 팀 상세 | Team Member |
| `/team/[id]/analysis` | 팀 분석 | Team Member |
| `/invite/[code]` | 초대 수락 | Public |
| `/403` | 권한 없음 | Public |

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
- `goodlab_announcements` - 공지사항
- `goodlab_notifications` - 알림

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
5. 팀장 지정 (자동으로 최상단 표시)
6. 공지사항 작성
7. 팀 분석 실행 및 결과 확인
```

### 3. 팀장 플로우

```
1. leader@goodlab.com으로 로그인
2. 소속된 팀 선택
3. GitHub URL 등록
4. 팀 공지사항 작성
5. 팀 문서 작성 (이미지 업로드, 중첩 문서 활용)
6. 분석 결과 확인
```

### 4. 학생 플로우

```
1. student1@goodlab.com으로 로그인
2. QR 스캔 또는 초대 링크로 방 참여
3. 팀 선택 및 참여
4. 공지사항 확인
5. 팀 문서 조회 및 편집
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
import { useAuthStore, useRoomStore, useDocumentStore } from "@/store";

// 상태 읽기
const user = useAuthStore((state) => state.user);
const rooms = useRoomStore((state) => state.rooms);
const documents = useDocumentStore((state) => state.documents);

// 액션 호출
const login = useAuthStore((state) => state.login);
const createRoom = useRoomStore((state) => state.createRoom);
const createDocument = useDocumentStore((state) => state.createDocument);

// 사용 예시
await login(email, password);
const newRoom = createRoom({ title, description, ... });
const newDoc = createDocument({ title, content, parentId, ... });
```

### 문서에 이미지 추가

```typescript
// Tiptap 에디터에서 자동 처리
// 1. 이미지 버튼 클릭 → 파일 선택
// 2. 드래그 앤 드롭 → 자동 업로드
// 3. 10MB 초과 시 자동 압축
// 4. Base64로 인코딩하여 문서와 함께 저장
```

### 중첩 문서 생성

```typescript
import { useDocumentStore } from "@/store";

const createDocument = useDocumentStore((state) => state.createDocument);

// 최상위 문서
const parentDoc = createDocument({
  title: "주간 회의록",
  content: { type: "doc", content: [] },
  roomId: "...",
  teamId: "...",
});

// 중첩 문서
const childDoc = createDocument({
  title: "1주차 개발 일지",
  content: { type: "doc", content: [] },
  roomId: "...",
  teamId: "...",
  parentId: parentDoc.id, // 부모 문서 ID
});
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

### 이미지 업로드 오류

- 10MB 이하의 이미지만 업로드 가능
- 지원 형식: JPG, PNG, GIF, WebP
- 브라우저의 LocalStorage 용량 제한 확인 (일반적으로 5-10MB)

## 주요 변경사항 (v2.0)

### 추가된 기능
1. **이미지 업로드**: 문서에 이미지 삽입 (클릭/드래그앤드롭, 10MB 제한)
2. **중첩 문서**: Notion 스타일 페이지 in 페이지
3. **팀별 공지사항**: 각 팀의 독립적인 공지사항 관리
4. **팀장 최상단 표시**: 팀원 목록에서 팀장 자동 최상단 정렬
5. **권한 기반 접근**: 모든 사용자가 참여한 방에 접근 가능

### 제거된 기능
1. **Notion 연동**: Notion API 연동 기능 완전 제거 (GitHub만 연동)

### 개선사항
1. **문서 저장 안정성**: 이미지 포함 문서도 안정적으로 저장
2. **권한 체계 개선**: 각 권한별 기능 명확히 구분
3. **UI/UX 개선**: 팀원 목록, 공지사항 등 직관적인 UI

## 라이선스

이 프로젝트는 교육 목적으로 작성되었습니다.

## 문의

프로젝트 관련 문의: GoodLab Team

---

**GoodLab v2.0** - 팀 프로젝트 협업의 새로운 기준
