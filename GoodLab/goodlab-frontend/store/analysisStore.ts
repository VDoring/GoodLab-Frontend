import { create } from 'zustand';
import type { AnalysisResult, AnalysisStatus, GitHubAnalysis, NotionAnalysis } from '@/types';
import { analysisDB, initializeMockDB } from '@/lib/mock-db';

interface AnalysisState {
  currentAnalysis: AnalysisResult | null;
  analysisStatus: AnalysisStatus;
  isLoading: boolean;

  // 분석 결과 불러오기
  fetchAnalysisByTeam: (teamId: string) => AnalysisResult | null;

  // 분석 시작
  startAnalysis: (teamId: string) => Promise<AnalysisResult>;

  // 분석 완료
  completeAnalysis: (analysis: AnalysisResult) => void;

  // 분석 실패
  failAnalysis: () => void;

  // 현재 분석 설정
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;

  // 분석 상태 설정
  setAnalysisStatus: (status: AnalysisStatus) => void;
}

// Mock 데이터 생성 함수
const generateMockAnalysis = (teamId: string): Omit<AnalysisResult, 'id' | 'created_at'> => {
  const mockGitHub: GitHubAnalysis[] = [
    {
      user: "김철수",
      commits: Math.floor(Math.random() * 50) + 20,
      prs: Math.floor(Math.random() * 15) + 5,
      code_lines: Math.floor(Math.random() * 2000) + 1000,
      insights: "코드 기여도가 높으며 문서화 작업도 우수합니다.",
    },
    {
      user: "이영희",
      commits: Math.floor(Math.random() * 50) + 15,
      prs: Math.floor(Math.random() * 15) + 3,
      code_lines: Math.floor(Math.random() * 2000) + 800,
      insights: "전반적으로 균형잡힌 기여를 보이고 있습니다.",
    },
    {
      user: "박민수",
      commits: Math.floor(Math.random() * 30) + 10,
      prs: Math.floor(Math.random() * 10) + 2,
      code_lines: Math.floor(Math.random() * 1500) + 500,
      insights: "코드 기여도가 다소 낮습니다. 향후 더 적극적인 참여가 필요합니다.",
    },
  ];

  const mockNotion: NotionAnalysis[] = [
    {
      user: "김철수",
      pages: Math.floor(Math.random() * 10) + 5,
      comments: Math.floor(Math.random() * 30) + 15,
      insights: "문서 작성에 적극적입니다.",
    },
    {
      user: "이영희",
      pages: Math.floor(Math.random() * 15) + 8,
      comments: Math.floor(Math.random() * 40) + 20,
      insights: "Notion 문서 작성과 팀 협업에 뛰어납니다.",
    },
    {
      user: "박민수",
      pages: Math.floor(Math.random() * 8) + 3,
      comments: Math.floor(Math.random() * 25) + 10,
      insights: "문서 작성 참여도를 높이면 좋겠습니다.",
    },
  ];

  return {
    team_id: teamId,
    status: 'completed',
    github_data: mockGitHub,
    notion_data: mockNotion,
    ai_insights: "팀 전체적으로 균형잡힌 협업이 이루어지고 있습니다. 김철수님이 리더십을 발휘하며 팀을 이끌고 있고, 이영희님은 문서화에 강점을 보입니다. 박민수님의 참여도를 높이면 더욱 발전할 것으로 보입니다.",
    analyzed_at: new Date().toISOString(),
  };
};

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  currentAnalysis: null,
  analysisStatus: 'pending',
  isLoading: false,

  fetchAnalysisByTeam: (teamId: string) => {
    initializeMockDB();
    const analyses = analysisDB.getByTeamId(teamId);

    if (analyses.length > 0) {
      const latestAnalysis = analyses[analyses.length - 1];
      set({
        currentAnalysis: latestAnalysis,
        analysisStatus: latestAnalysis.status,
      });
      return latestAnalysis;
    }

    set({ currentAnalysis: null, analysisStatus: 'pending' });
    return null;
  },

  startAnalysis: async (teamId: string) => {
    set({ isLoading: true, analysisStatus: 'analyzing' });

    // 분석 시뮬레이션 (2초 대기)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Mock 분석 데이터 생성
      const mockData = generateMockAnalysis(teamId);

      // DB에 저장
      const newAnalysis = analysisDB.create(mockData);

      set({
        currentAnalysis: newAnalysis,
        analysisStatus: 'completed',
        isLoading: false,
      });

      return newAnalysis;
    } catch (error) {
      set({ analysisStatus: 'failed', isLoading: false });
      throw error;
    }
  },

  completeAnalysis: (analysis) => {
    set({ currentAnalysis: analysis, analysisStatus: 'completed' });
  },

  failAnalysis: () => {
    set({ analysisStatus: 'failed', isLoading: false });
  },

  setCurrentAnalysis: (analysis) => {
    set({ currentAnalysis: analysis });
  },

  setAnalysisStatus: (status) => {
    set({ analysisStatus: status });
  },
}));
