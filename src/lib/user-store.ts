import { create } from 'zustand'

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

export interface SessionRecord {
  id: string
  date: string
  profileName: string
  profileRole: string
  overallScore: number | null
  profile: UserProfile
  analysis: AnalysisResults
}

// Stored user shape in localStorage
export interface StoredUser {
  email: string
  password: string
  profile: UserProfile
  analysis: AnalysisResults
}

interface UserState {
  profile: UserProfile
  analysis: AnalysisResults
  currentSection: string
  sessions: SessionRecord[]
  isLoggedIn: boolean
  authMode: 'login' | 'signup'
  language: string
  setProfile: (profile: Partial<UserProfile>) => void
  setAnalysis: (analysis: Partial<AnalysisResults>) => void
  setCurrentSection: (section: string) => void
  resetAnalysis: () => void
  hasProfile: () => boolean
  hasAnalysis: () => boolean
  resetSession: () => void
  saveCurrentSession: () => void
  loadSession: (id: string) => void
  deleteSession: (id: string) => void
  setAuthMode: (mode: 'login' | 'signup') => void
  register: (email: string, password: string) => { success: boolean; error?: string }
  login: (email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
  checkEmailExists: (email: string) => boolean
  setLanguage: (language: string) => void
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

// --- localStorage helpers for registered users ---

function loadRegisteredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem('neuralhire-users')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveRegisteredUsers(users: StoredUser[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('neuralhire-users', JSON.stringify(users))
  } catch {
    // localStorage might be full
  }
}

// --- localStorage helpers for session history ---

function loadSessions(): SessionRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem('neuralhire-sessions')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveSessions(sessions: SessionRecord[]) {
  if (typeof window === 'undefined') return
  try {
    // Keep only last 20 sessions
    const trimmed = sessions.slice(-20)
    localStorage.setItem('neuralhire-sessions', JSON.stringify(trimmed))
  } catch {
    // localStorage might be full
  }
}

export const useUserStore = create<UserState>()(
  (set, get) => ({
    profile: defaultProfile,
    analysis: defaultAnalysis,
    currentSection: 'home',
    sessions: loadSessions(),
    isLoggedIn: false,
    authMode: 'login',
    language: 'en',

    setProfile: (profile) => set((state) => ({ profile: { ...state.profile, ...profile } })),
    setAnalysis: (analysis) => set((state) => ({ analysis: { ...state.analysis, ...analysis } })),
    setCurrentSection: (section) => set({ currentSection: section }),
    resetAnalysis: () => set({ analysis: defaultAnalysis }),

    hasProfile: () => get().profile.isComplete,
    hasAnalysis: () => get().analysis.overallScore !== null,

    // Save current session to history before resetting
    saveCurrentSession: () => {
      const { profile, analysis, sessions } = get()
      if (!profile.isComplete) return // Don't save empty sessions

      const record: SessionRecord = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        date: new Date().toISOString(),
        profileName: profile.name || 'Unknown',
        profileRole: profile.role || 'Not specified',
        overallScore: analysis.overallScore,
        profile: { ...profile },
        analysis: { ...analysis },
      }

      const updated = [...sessions, record]
      saveSessions(updated)
      set({ sessions: updated })
    },

    // Reset everything for a new user — fresh start
    resetSession: () => {
      const { profile, analysis } = get()
      // Auto-save current session to history if it has data
      if (profile.isComplete) {
        const record: SessionRecord = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          date: new Date().toISOString(),
          profileName: profile.name || 'Unknown',
          profileRole: profile.role || 'Not specified',
          overallScore: analysis.overallScore,
          profile: { ...profile },
          analysis: { ...analysis },
        }
        const updated = [...get().sessions, record]
        saveSessions(updated)
        set({ sessions: updated })
      }

      // Reset to clean state
      set({
        profile: defaultProfile,
        analysis: defaultAnalysis,
        currentSection: 'home',
      })
    },

    // Load a past session from history
    loadSession: (id: string) => {
      const session = get().sessions.find(s => s.id === id)
      if (session) {
        set({
          profile: session.profile,
          analysis: session.analysis,
          currentSection: 'digital-profile',
        })
      }
    },

    // Delete a session from history
    deleteSession: (id: string) => {
      const updated = get().sessions.filter(s => s.id !== id)
      saveSessions(updated)
      set({ sessions: updated })
    },

    // --- Authentication methods ---

    setAuthMode: (mode) => set({ authMode: mode }),

    // Check if an email is already registered
    checkEmailExists: (email: string) => {
      const users = loadRegisteredUsers()
      return users.some(u => u.email.toLowerCase() === email.toLowerCase())
    },

    // Register a new user
    register: (email: string, password: string) => {
      const users = loadRegisteredUsers()
      const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase())

      if (exists) {
        return { success: false, error: 'Account already exists. Please login.' }
      }

      // Create new stored user with default profile and analysis
      const newUser: StoredUser = {
        email,
        password,
        profile: { ...defaultProfile, email },
        analysis: { ...defaultAnalysis },
      }

      users.push(newUser)
      saveRegisteredUsers(users)

      // Log the user in immediately after registration
      set({
        isLoggedIn: true,
        authMode: 'login',
        profile: { ...defaultProfile, email },
        analysis: { ...defaultAnalysis },
        currentSection: 'home',
      })

      return { success: true }
    },

    // Login an existing user
    login: (email: string, password: string) => {
      const users = loadRegisteredUsers()
      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      )

      if (!user) {
        return { success: false, error: 'Invalid email or password.' }
      }

      // Load the user's saved profile and analysis into state
      set({
        isLoggedIn: true,
        authMode: 'login',
        profile: { ...user.profile },
        analysis: { ...user.analysis },
        currentSection: 'home',
      })

      return { success: true }
    },

    // Logout: save current session data to the registered user, then clear state
    logout: () => {
      const { profile, analysis } = get()

      // Save current profile & analysis back to the registered user in localStorage
      if (profile.email) {
        const users = loadRegisteredUsers()
        const idx = users.findIndex(
          u => u.email.toLowerCase() === profile.email.toLowerCase()
        )
        if (idx !== -1) {
          users[idx] = {
            ...users[idx],
            profile: { ...profile },
            analysis: { ...analysis },
          }
          saveRegisteredUsers(users)
        }
      }

      // Also save to session history if the session has data
      if (profile.isComplete) {
        const record: SessionRecord = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          date: new Date().toISOString(),
          profileName: profile.name || 'Unknown',
          profileRole: profile.role || 'Not specified',
          overallScore: analysis.overallScore,
          profile: { ...profile },
          analysis: { ...analysis },
        }
        const updated = [...get().sessions, record]
        saveSessions(updated)
        set({ sessions: updated })
      }

      // Clear state — app starts fresh on next visit
      set({
        isLoggedIn: false,
        authMode: 'login',
        profile: defaultProfile,
        analysis: defaultAnalysis,
        currentSection: 'home',
      })
    },

    // Set language preference
    setLanguage: (language: string) => set({ language }),
  })
)
