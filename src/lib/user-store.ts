import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  name: string
  email: string
  role: string
  location: string
  bio: string
  skills: string[]
  experience: string
  avatarUrl: string | null
  isComplete: boolean
}

export interface AnalysisResults {
  overallScore: number | null
  speechClarity: number | null
  confidence: number | null
  communication: number | null
  enthusiasm: number | null
  leadership: number | null
  eyeContact: number | null
  emotionalConsistency: number | null
  adaptability: number | null
  personalityDimensions: {
    leadership: number
    confidence: number
    creativity: number
    emotionalIntelligence: number
    adaptability: number
    collaboration: number
    pressureHandling: number
  } | null
  careerPredictions: Array<{
    title: string
    match: number
    description: string
    strengths: string[]
  }> | null
  personalityInsights: Array<{
    title: string
    description: string
    score: number
  }> | null
  personalitySummary: string | null
  communicationStyle: string | null
  primaryTrait: string | null
  videoUploaded: boolean
  interviewCompleted: boolean
  interviewMessages: Array<{ role: 'ai' | 'user'; text: string }>
}

interface UserState {
  profile: UserProfile
  analysis: AnalysisResults
  currentSection: string
  setProfile: (profile: Partial<UserProfile>) => void
  setAnalysis: (analysis: Partial<AnalysisResults>) => void
  setCurrentSection: (section: string) => void
  resetAnalysis: () => void
  hasProfile: () => boolean
  hasAnalysis: () => boolean
}

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  role: '',
  location: '',
  bio: '',
  skills: [],
  experience: '',
  avatarUrl: null,
  isComplete: false,
}

const defaultAnalysis: AnalysisResults = {
  overallScore: null,
  speechClarity: null,
  confidence: null,
  communication: null,
  enthusiasm: null,
  leadership: null,
  eyeContact: null,
  emotionalConsistency: null,
  adaptability: null,
  personalityDimensions: null,
  careerPredictions: null,
  personalityInsights: null,
  personalitySummary: null,
  communicationStyle: null,
  primaryTrait: null,
  videoUploaded: false,
  interviewCompleted: false,
  interviewMessages: [],
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      analysis: defaultAnalysis,
      currentSection: 'home',
      setProfile: (profile) => set((state) => ({ profile: { ...state.profile, ...profile } })),
      setAnalysis: (analysis) => set((state) => ({ analysis: { ...state.analysis, ...analysis } })),
      setCurrentSection: (section) => set({ currentSection: section }),
      resetAnalysis: () => set({ analysis: defaultAnalysis }),
      hasProfile: () => get().profile.isComplete,
      hasAnalysis: () => get().analysis.overallScore !== null,
    }),
    {
      name: 'neuralhire-ai-storage',
      partialize: (state) => ({
        profile: state.profile,
        analysis: state.analysis,
      }),
    }
  )
)
