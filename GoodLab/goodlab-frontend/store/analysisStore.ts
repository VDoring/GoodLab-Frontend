import { create } from 'zustand';
import type { AnalysisResult, AnalysisStatus } from '@/types';

interface AnalysisState {
  currentAnalysis: AnalysisResult | null;
  analysisStatus: AnalysisStatus;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
  setAnalysisStatus: (status: AnalysisStatus) => void;
  startAnalysis: () => void;
  completeAnalysis: (analysis: AnalysisResult) => void;
  failAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentAnalysis: null,
  analysisStatus: 'pending',
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  setAnalysisStatus: (status) => set({ analysisStatus: status }),
  startAnalysis: () => set({ analysisStatus: 'analyzing' }),
  completeAnalysis: (analysis) =>
    set({ currentAnalysis: analysis, analysisStatus: 'completed' }),
  failAnalysis: () => set({ analysisStatus: 'failed' }),
}));
