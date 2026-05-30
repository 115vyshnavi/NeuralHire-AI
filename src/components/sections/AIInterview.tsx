'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Play, Loader2, Target } from 'lucide-react'
import GlassCard from '@/components/shared/GlassCard'
import MagneticButton from '@/components/shared/MagneticButton'
import { useUserStore } from '@/lib/user-store'

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: '#00f5ff' }}
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function LiveWaveform() {
  return (
    <div className="w-full h-20 relative overflow-hidden">
      <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#00f5ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00f5ff" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="waveViolet" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <motion.path d="M0,40 Q50,20 100,40 T200,40 T300,40 T400,40" fill="none" stroke="url(#waveCyan)" strokeWidth="2"
          animate={{ d: ['M0,40 Q50,20 100,40 T200,40 T300,40 T400,40', 'M0,40 Q50,55 100,40 T200,40 T300,40 T400,40', 'M0,40 Q50,25 100,40 T200,40 T300,40 T400,40', 'M0,40 Q50,20 100,40 T200,40 T300,40 T400,40'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path d="M0,40 Q25,30 50,40 T100,40 T150,40 T200,40 T250,40 T300,40 T350,40 T400,40" fill="none" stroke="url(#waveViolet)" strokeWidth="1.5"
          animate={{ d: ['M0,40 Q25,30 50,40 T100,40 T150,40 T200,40 T250,40 T300,40 T350,40 T400,40', 'M0,40 Q25,50 50,40 T100,40 T150,40 T200,40 T250,40 T300,40 T350,40 T400,40', 'M0,40 Q25,28 50,40 T100,40 T150,40 T200,40 T250,40 T300,40 T350,40 T400,40', 'M0,40 Q25,30 50,40 T100,40 T150,40 T200,40 T250,40 T300,40 T350,40 T400,40'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </svg>
    </div>
  )
}

function GeneratingOverlay({ profile }: { profile: { name?: string; skills?: string[]; role?: string } }) {
  const skills = profile.skills || []
  const role = profile.role || ''

  return (
    <div className="relative py-8 px-4 sm:px-6 lg:px-8">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes pulseRing { 0% { transform: scale(0.8); opacity: 0.6; } 50% { transform: scale(1.2); opacity: 0.2; } 100% { transform: scale(0.8); opacity: 0.6; } }
        @keyframes scanLine { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
      ` }} />
      <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
          style={{
            background: 'linear-gradient(135deg, #00f5ff, #8b5cf6, #00f5ff)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientShift 4s ease-in-out infinite',
          }}
        >
          Real-Time AI Interview
        </h2>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
          <div className="p-8 sm:p-12 text-center">
            {/* Animated AI brain */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(0, 245, 255, 0.2)', animation: 'pulseRing 2s ease-in-out infinite' }} />
              <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(139, 92, 246, 0.2)', animation: 'pulseRing 2s ease-in-out infinite 0.5s' }} />
              <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(0, 245, 255, 0.15)', animation: 'pulseRing 2s ease-in-out infinite 1s' }} />
              {/* Core */}
              <div className="w-24 h-24 rounded-full flex items-center justify-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.12), rgba(139, 92, 246, 0.08))',
                  border: '2px solid rgba(0, 245, 255, 0.25)',
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-8 h-8" style={{ color: '#00f5ff' }} />
                </motion.div>
                {/* Scan line */}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(transparent 40%, rgba(0, 245, 255, 0.08) 50%, transparent 60%)',
                  animation: 'scanLine 2s linear infinite',
                }} />
              </div>
            </div>

            {/* Generating text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">Generating Personalized Questions...</h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto mb-4 leading-relaxed">
                Our AI is analyzing your profile to craft interview questions tailored to your expertise
              </p>
            </motion.div>

            {/* Profile analysis steps */}
            <div className="max-w-xs mx-auto space-y-2 mb-4">
              {[
                { label: 'Scanning skills', detail: skills.length > 0 ? skills.slice(0, 3).join(', ') : 'Analyzing...', done: true },
                { label: 'Detecting domain', detail: role || 'Professional', done: true },
                { label: 'Crafting questions', detail: 'Personalizing...', done: false },
              ].map((step, idx) => (
                <motion.div
                  key={step.label}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg"
                  style={{ background: 'rgba(0, 245, 255, 0.03)', border: '1px solid rgba(0, 245, 255, 0.06)' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.3 }}
                >
                  {step.done ? (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" style={{ color: '#00f5ff' }} />
                  )}
                  <div className="text-left min-w-0 flex-1">
                    <span className="text-xs font-medium block" style={{ color: 'rgba(255,255,255,0.7)' }}>{step.label}</span>
                    <span className="text-[10px] block truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{step.detail}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Loading dots */}
            <div className="flex items-center justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-1 w-1 rounded-full"
                  style={{ backgroundColor: '#8b5cf6' }}
                  animate={{ y: [0, -4, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

function NoProfileScreen() {
  const { setCurrentSection } = useUserStore()
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center">
        <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
          <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <Bot className="w-8 h-8" style={{ color: '#8b5cf6' }} />
            </div>
            <h3 className="text-xl font-bold text-white">Create Your Profile First</h3>
            <p className="text-gray-400 text-sm">You need a neural profile before starting an AI interview.</p>
            <MagneticButton variant="violet" onClick={() => setCurrentSection('profile')}>Create Profile</MagneticButton>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

export default function AIInterview() {
  const { profile, analysis, setAnalysis, hasProfile, setCurrentSection } = useUserStore()
  const [interviewStarted, setInterviewStarted] = useState(analysis.interviewMessages.length > 0)
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>(
    analysis.interviewMessages.length > 0 ? analysis.interviewMessages : []
  )
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [liveConfidence, setLiveConfidence] = useState(0)
  const [liveCommunication, setLiveCommunication] = useState(0)
  const [liveHesitation, setLiveHesitation] = useState(0)
  const [liveNervousness, setLiveNervousness] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [detectedDomain, setDetectedDomain] = useState<string | null>(null)
  const [domainEmoji, setDomainEmoji] = useState<string>('🎯')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const startInterview = useCallback(async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'interview-start',
          data: { profile },
        }),
      })
      const result = await res.json()

      if (result.success && result.interviewStart) {
        const { openingQuestion, detectedDomain: domain, domainEmoji: emoji } = result.interviewStart
        const firstMsg = { role: 'ai' as const, text: openingQuestion }
        setMessages([firstMsg])
        setInterviewStarted(true)
        setDetectedDomain(domain)
        setDomainEmoji(emoji || '🎯')
        setAnalysis({ interviewMessages: [firstMsg] })
      } else {
        // Fallback: use a profile-aware generic question
        const skills = profile.skills || []
        const role = profile.role || ''
        let fallbackQuestion = `Welcome to your NeuralHire AI interview, ${profile.name || 'candidate'}. I'll be asking you a series of questions to understand your potential beyond what's on your resume.`
        if (skills.some(s => /react|vue|angular|frontend|fullstack/i.test(s))) {
          fallbackQuestion += ` Given your frontend expertise, tell me about your approach to designing scalable component architectures. How do you decide between composition and inheritance when building a UI library?`
        } else if (skills.some(s => /machine learning|ml|ai|data science|deep learning/i.test(s))) {
          fallbackQuestion += ` With your data science background, walk me through how you would approach deploying an ML model from experimentation to production. What are the key pitfalls you'd watch for?`
        } else if (/manager|director|lead|head|vp|chief/i.test(role)) {
          fallbackQuestion += ` Given your leadership experience, tell me about a time when you had to navigate competing priorities from different stakeholders. How did you make the final call?`
        } else {
          fallbackQuestion += ` Tell me about a challenging project you've worked on recently. What made it challenging and how did you overcome those obstacles?`
        }
        const firstMsg = { role: 'ai' as const, text: fallbackQuestion }
        setMessages([firstMsg])
        setInterviewStarted(true)
        setDetectedDomain(null)
        setAnalysis({ interviewMessages: [firstMsg] })
      }
    } catch {
      // Fallback on network error
      const fallbackQuestion = `Welcome to your NeuralHire AI interview, ${profile.name || 'candidate'}. I'll be asking you a series of questions tailored to your background. To start, tell me about a project you're particularly proud of and what made it meaningful to you.`
      const firstMsg = { role: 'ai' as const, text: fallbackQuestion }
      setMessages([firstMsg])
      setInterviewStarted(true)
      setDetectedDomain(null)
      setAnalysis({ interviewMessages: [firstMsg] })
    }
    setIsGenerating(false)
  }, [profile, setAnalysis])

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return

    const userMsg = { role: 'user' as const, text: inputValue.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInputValue('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'interview-analysis',
          data: { profile, messages: newMessages, currentAnswer: inputValue.trim() },
        }),
      })
      const result = await res.json()

      if (result.success && result.interview) {
        const { confidence, communication, hesitation, nervousness, nextQuestion, detectedDomain: domain } = result.interview
        setLiveConfidence(confidence)
        setLiveCommunication(communication)
        setLiveHesitation(hesitation)
        setLiveNervousness(nervousness || 0)
        if (domain && !detectedDomain) {
          setDetectedDomain(domain)
        }

        const aiMsg = { role: 'ai' as const, text: nextQuestion || "That's an interesting perspective. Can you elaborate on that?" }
        const updatedMessages = [...newMessages, aiMsg]
        setMessages(updatedMessages)
        setAnalysis({
          interviewMessages: updatedMessages,
          interviewCompleted: false,
          confidence: confidence,
          communication: communication,
        })
      } else {
        const aiMsg = { role: 'ai' as const, text: result.error || "I'm having trouble processing your response right now. Could you please try answering that again?" }
        const updatedMessages = [...newMessages, aiMsg]
        setMessages(updatedMessages)
        setAnalysis({ interviewMessages: updatedMessages })
      }
    } catch {
      const aiMsg = { role: 'ai' as const, text: "I'm experiencing a connection issue. Please try sending your response again." }
      const updatedMessages = [...newMessages, aiMsg]
      setMessages(updatedMessages)
      setAnalysis({ interviewMessages: updatedMessages })
    }

    setIsTyping(false)
  }, [inputValue, isTyping, messages, profile, setAnalysis, detectedDomain])

  // If no profile, show guidance - AFTER all hooks
  if (!hasProfile()) {
    return <NoProfileScreen />
  }

  // Generating personalized questions
  if (isGenerating) {
    return <GeneratingOverlay profile={profile} />
  }

  // Start screen
  if (!interviewStarted) {
    return (
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <style dangerouslySetInnerHTML={{ __html: `@keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }` }} />
        <div className="max-w-3xl mx-auto">
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
              style={{
                background: 'linear-gradient(135deg, #00f5ff, #8b5cf6, #00f5ff)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientShift 4s ease-in-out infinite',
              }}
            >
              Real-Time AI Interview
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
              Experience the future of interviews with our adaptive AI interviewer
            </p>
          </motion.div>

          <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
            <div className="p-8 sm:p-12 text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(139, 92, 246, 0.1))',
                  border: '2px solid rgba(0, 245, 255, 0.2)',
                }}
              >
                <Play className="w-8 h-8 ml-1" style={{ color: '#00f5ff' }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ready to Begin?</h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                The AI interviewer will analyze your profile and craft personalized questions based on your expertise. Your responses will be analyzed in real-time for confidence, communication style, nervousness, and personality indicators.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {['Profile-Aware Questions', 'Domain Detection', 'Real-time Scoring', 'Nervousness Tracking'].map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }}
                  >
                    {item}
                  </span>
                ))}
              </div>
              {profile.skills && profile.skills.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'rgba(0, 245, 255, 0.4)' }}>Your detected skills</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {profile.skills.slice(0, 5).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded text-[10px] font-medium"
                        style={{ background: 'rgba(0, 245, 255, 0.06)', border: '1px solid rgba(0, 245, 255, 0.12)', color: 'rgba(0, 245, 255, 0.7)' }}
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 5 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        +{profile.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              <MagneticButton variant="cyan" size="lg" onClick={startInterview}>
                <Sparkles className="w-5 h-5" />
                Start Interview
              </MagneticButton>
            </div>
          </GlassCard>
        </div>
      </section>
    )
  }

  // Nervousness color helper
  const getNervousnessColor = (value: number) => {
    if (value >= 60) return { bar: 'linear-gradient(90deg, #ef4444, #dc2626)', text: '#ef4444', bg: 'rgba(239, 68, 68, 0.06)', border: 'rgba(239, 68, 68, 0.1)', label: 'High' }
    if (value >= 35) return { bar: 'linear-gradient(90deg, #f59e0b, #d97706)', text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.06)', border: 'rgba(245, 158, 11, 0.1)', label: 'Moderate' }
    return { bar: 'linear-gradient(90deg, #22c55e, #16a34a)', text: '#22c55e', bg: 'rgba(34, 197, 94, 0.06)', border: 'rgba(34, 197, 94, 0.1)', label: 'Low' }
  }
  const nervousnessStyle = getNervousnessColor(liveNervousness)

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8">
      <style dangerouslySetInnerHTML={{ __html: `@keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } } @keyframes pulseOnline { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }` }} />

      {/* Header */}
      <motion.div className="text-center mb-6 sm:mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AI Interview In Progress
        </h2>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* LEFT - Chat */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.03), rgba(255, 255, 255, 0.01), rgba(139, 92, 246, 0.02))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 245, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(0, 245, 255, 0.08)' }}>
              <div className="relative">
                <motion.div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(139, 92, 246, 0.1))', border: '1px solid rgba(0, 245, 255, 0.2)' }}
                  animate={{ boxShadow: ['0 0 10px rgba(0, 245, 255, 0.2)', '0 0 20px rgba(0, 245, 255, 0.4)', '0 0 10px rgba(0, 245, 255, 0.2)'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Bot size={16} style={{ color: '#00f5ff' }} />
                </motion.div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>NeuralHire AI</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e', animation: 'pulseOnline 2s ease-in-out infinite', boxShadow: '0 0 6px rgba(34, 197, 94, 0.5)' }} />
                    <span className="text-[10px] font-medium" style={{ color: 'rgba(34, 197, 94, 0.8)' }}>Online</span>
                  </div>
                </div>
                {/* Domain Detected Badge */}
                {detectedDomain && (
                  <motion.div
                    className="flex items-center gap-1 mt-0.5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Target size={10} style={{ color: '#f59e0b' }} />
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)', color: 'rgba(245, 158, 11, 0.85)' }}
                    >
                      {domainEmoji} {detectedDomain}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="px-4 py-4 space-y-3 max-h-[50vh] sm:max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0, 245, 255, 0.15) transparent' }}>
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'ai' ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}
                      style={
                        msg.role === 'ai'
                          ? { background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.05), rgba(0, 245, 255, 0.02))', border: '1px solid rgba(0, 245, 255, 0.1)', borderLeft: '3px solid rgba(0, 245, 255, 0.5)', color: 'rgba(255,255,255,0.8)' }
                          : { background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(139, 92, 246, 0.03))', border: '1px solid rgba(139, 92, 246, 0.12)', borderRight: '3px solid rgba(139, 92, 246, 0.5)', color: 'rgba(255,255,255,0.85)' }
                      }
                    >
                      <div className="flex items-start gap-2">
                        {msg.role === 'ai' && <Bot size={14} className="mt-0.5 shrink-0" style={{ color: '#00f5ff', opacity: 0.7 }} />}
                        <span className="break-words">{msg.text}</span>
                        {msg.role === 'user' && <User size={14} className="mt-0.5 shrink-0" style={{ color: '#8b5cf6', opacity: 0.7 }} />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm px-3 py-2" style={{ background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.05), rgba(0, 245, 255, 0.02))', border: '1px solid rgba(0, 245, 255, 0.1)', borderLeft: '3px solid rgba(0, 245, 255, 0.5)' }}>
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(0, 245, 255, 0.08)' }}>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(0, 245, 255, 0.03)', border: '1px solid rgba(0, 245, 255, 0.1)' }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your response..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/25 min-w-0"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                  disabled={isTyping}
                />
                <motion.button
                  onClick={handleSend}
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: inputValue.trim() ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(0, 245, 255, 0.08))' : 'rgba(0, 245, 255, 0.05)',
                    border: '1px solid rgba(0, 245, 255, 0.15)',
                  }}
                  whileHover={{ boxShadow: '0 0 20px rgba(0, 245, 255, 0.35)' }}
                  whileTap={{ scale: 0.92 }}
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send size={14} style={{ color: '#00f5ff' }} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT - Live Analysis */}
        <motion.div className="space-y-4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          {/* Live Neural Analysis */}
          <GlassCard tiltEnabled={false}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-5">
                <motion.div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#00f5ff' }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <h3 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'rgba(0, 245, 255, 0.8)' }}>Live Neural Analysis</h3>
              </div>

              {/* Confidence */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium" style={{ color: 'rgba(0, 245, 255, 0.7)' }}>Confidence</span>
                  <span className="text-xs font-bold tabular-nums" style={{ color: '#00f5ff' }}>{liveConfidence}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0, 245, 255, 0.08)', border: '1px solid rgba(0, 245, 255, 0.1)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #00f5ff, #00d4e0)', boxShadow: '0 0 10px rgba(0, 245, 255, 0.4)' }}
                    initial={{ width: 0 }} animate={{ width: `${liveConfidence}%` }} transition={{ duration: 1.5 }}
                  />
                </div>
              </div>

              {/* Communication */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium" style={{ color: 'rgba(139, 92, 246, 0.7)' }}>Communication</span>
                  <motion.span className="text-sm font-bold tabular-nums" style={{ color: '#8b5cf6' }}
                    key={liveCommunication} initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}
                  >{liveCommunication}</motion.span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)', boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)' }}
                    initial={{ width: 0 }} animate={{ width: `${liveCommunication}%` }} transition={{ duration: 1 }}
                  />
                </div>
              </div>

              {/* Hesitation */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium" style={{ color: 'rgba(255, 107, 107, 0.7)' }}>Hesitation</span>
                  <span className="text-sm font-bold tabular-nums" style={{ color: liveHesitation > 25 ? '#ff6b6b' : '#fbbf24' }}>{liveHesitation}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 107, 107, 0.06)', border: '1px solid rgba(255, 107, 107, 0.1)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: liveHesitation > 25 ? 'linear-gradient(90deg, #ff6b6b, #ef4444)' : 'linear-gradient(90deg, #fbbf24, #f59e0b)' }}
                    initial={{ width: 0 }} animate={{ width: `${liveHesitation}%` }} transition={{ duration: 1 }}
                  />
                </div>
              </div>

              {/* Nervousness */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium" style={{ color: `${nervousnessStyle.text}aa` }}>Nervousness</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: nervousnessStyle.bg, border: `1px solid ${nervousnessStyle.border}`, color: nervousnessStyle.text }}
                    >
                      {nervousnessStyle.label}
                    </span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: nervousnessStyle.text }}>{liveNervousness}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: nervousnessStyle.bg, border: `1px solid ${nervousnessStyle.border}` }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: nervousnessStyle.bar, boxShadow: `0 0 10px ${nervousnessStyle.text}40` }}
                    initial={{ width: 0 }} animate={{ width: `${liveNervousness}%` }} transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Live Waveform */}
          <GlassCard tiltEnabled={false}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'rgba(0, 245, 255, 0.5)' }}>Audio Neural Feed</span>
                <motion.div className="flex items-center gap-1" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(239, 68, 68, 0.7)' }}>LIVE</span>
                </motion.div>
              </div>
              <LiveWaveform />
            </div>
          </GlassCard>

          {/* Interview Progress */}
          <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
            <div className="p-4">
              <span className="text-[10px] font-medium uppercase tracking-wider block mb-2" style={{ color: 'rgba(139, 92, 246, 0.5)' }}>Interview Progress</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>{messages.filter((m) => m.role === 'user').length}</span>
                <span className="text-xs text-gray-500">responses given</span>
              </div>
              {messages.filter((m) => m.role === 'user').length >= 3 && (
                <MagneticButton variant="violet" size="sm" className="mt-3" onClick={() => {
                  setAnalysis({ interviewCompleted: true })
                  setCurrentSection('timeline')
                }}>
                  Finish Interview & View Timeline
                </MagneticButton>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
