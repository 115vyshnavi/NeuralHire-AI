'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Play } from 'lucide-react'
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

const initialQuestions = [
  "Welcome to your NeuralHire AI interview. I'll be asking you a series of questions to understand your potential beyond what's on your resume. Tell me about a time when you had to lead a team through a challenging situation. How did you handle the pressure?",
]

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

  const startInterview = useCallback(() => {
    const firstMsg = { role: 'ai' as const, text: initialQuestions[0] }
    setMessages([firstMsg])
    setInterviewStarted(true)
    setAnalysis({ interviewMessages: [firstMsg] })
  }, [setAnalysis])

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
        const { confidence, communication, hesitation, nextQuestion } = result.interview
        setLiveConfidence(confidence)
        setLiveCommunication(communication)
        setLiveHesitation(hesitation)

        const aiMsg = { role: 'ai' as const, text: nextQuestion || "That's an interesting perspective. Can you tell me more?" }
        const updatedMessages = [...newMessages, aiMsg]
        setMessages(updatedMessages)
        setAnalysis({
          interviewMessages: updatedMessages,
          interviewCompleted: false,
          confidence: confidence,
          communication: communication,
        })
      } else {
        const aiResponses = [
          "That's a compelling example. How did that experience shape your approach to similar challenges?",
          'Interesting perspective. Can you walk me through your decision-making process in that moment?',
          'Your self-awareness is evident. How would you apply these insights in a new team environment?',
        ]
        const aiMsg = { role: 'ai' as const, text: aiResponses[Math.floor(Math.random() * aiResponses.length)] }
        const updatedMessages = [...newMessages, aiMsg]
        setMessages(updatedMessages)
        setAnalysis({ interviewMessages: updatedMessages })
      }
    } catch {
      const aiMsg = { role: 'ai' as const, text: "Thank you for your response. Tell me about a time you had to adapt to a significant change at work." }
      const updatedMessages = [...newMessages, aiMsg]
      setMessages(updatedMessages)
      setAnalysis({ interviewMessages: updatedMessages })
    }

    setIsTyping(false)
  }, [inputValue, isTyping, messages, profile, setAnalysis])

  // If no profile, show guidance - AFTER all hooks
  if (!hasProfile()) {
    return <NoProfileScreen />
  }

  // Start screen
  if (!interviewStarted) {
    return (
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
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
                The AI interviewer will ask you behavioral and situational questions. Your responses will be analyzed in real-time for confidence, communication style, and personality indicators.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {['Behavioral Analysis', 'Real-time Scoring', 'Adaptive Questions'].map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <MagneticButton variant="cyan" size="lg" onClick={startInterview}>
                <Sparkles className="w-5 h-5" />
                Start Interview
              </MagneticButton>
            </div>
          </GlassCard>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `@keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }` }} />
      </section>
    )
  }

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
                <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>NeuralHire AI</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e', animation: 'pulseOnline 2s ease-in-out infinite', boxShadow: '0 0 6px rgba(34, 197, 94, 0.5)' }} />
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(34, 197, 94, 0.8)' }}>Online</span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="px-4 py-4 space-y-3 max-h-[350px] sm:max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0, 245, 255, 0.15) transparent' }}>
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
              <div>
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
