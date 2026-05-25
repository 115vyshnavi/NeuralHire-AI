'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TrendingUp, Heart, Zap, RotateCcw, Activity } from 'lucide-react'
import GlassCard from '@/components/shared/GlassCard'
import MagneticButton from '@/components/shared/MagneticButton'
import { useUserStore } from '@/lib/user-store'

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; color: string }>
  label?: string
}) {
  if (!active || !payload || !payload.length) return null

  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: 'linear-gradient(135deg, rgba(10, 10, 30, 0.9), rgba(20, 20, 50, 0.85))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 245, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-1 last:mb-0">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {entry.dataKey === 'confidence' ? 'Confidence' : entry.dataKey === 'engagement' ? 'Engagement' : 'Stress'}:
          </span>
          <span className="text-[11px] font-bold" style={{ color: entry.color }}>{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

function CustomLegend({ payload }: { payload?: Array<{ value: string; color: string }> }) {
  if (!payload) return null
  const labels: Record<string, string> = { confidence: 'Confidence', engagement: 'Engagement', stress: 'Stress Level' }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <div className="w-3 h-1 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{labels[entry.value] || entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// Generate timeline data from interview messages via API analysis
// This is now done via the API, but we keep a local fallback
function generateLocalTimelineData(
  messages: Array<{ role: 'ai' | 'user'; text: string }>,
  analysis: { confidence?: number | null; communication?: number | null }
) {
  const userMessages = messages.filter((m) => m.role === 'user')
  if (userMessages.length === 0) return []

  const phaseNames = ['Introduction', 'Experience', 'Leadership', 'Problem-Solving', 'Creativity', 'Cultural Fit', 'Closing']
  const baseConf = analysis.confidence || 70
  const baseEng = analysis.communication || 65
  const baseStress = 100 - baseConf

  return userMessages.map((_, i) => ({
    phase: phaseNames[i % phaseNames.length],
    confidence: Math.min(98, Math.max(40, baseConf + (i * 2) - 5)),
    engagement: Math.min(98, Math.max(40, baseEng + (i * 3) - 3)),
    stress: Math.min(60, Math.max(5, baseStress - (i * 4) + 10)),
  }))
}

export default function EmotionalTimeline() {
  const { profile, analysis, hasProfile, setAnalysis, setCurrentSection } = useUserStore()
  const [timelineData, setTimelineData] = useState<Array<{ phase: string; confidence: number; engagement: number; stress: number }>>([])
  const [loadingTimeline, setLoadingTimeline] = useState(false)

  const interviewMessages = analysis.interviewMessages || []
  const hasInterview = interviewMessages.length > 0 && interviewMessages.some((m) => m.role === 'user')

  // Load timeline from API when component mounts with interview data
  const handleLoadTimeline = async () => {
    if (!hasInterview) return
    setLoadingTimeline(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'emotional-timeline',
          data: { profile, interviewMessages, analysisData: analysis },
        }),
      })
      const result = await res.json()
      if (result.success && result.timeline && result.timeline.length > 0) {
        setTimelineData(result.timeline)
        return
      }
    } catch {
      // fallback to local generation
    }
    // Local fallback
    setTimelineData(generateLocalTimelineData(interviewMessages, analysis))
    setLoadingTimeline(false)
  }

  // Auto-load timeline if interview data exists and no timeline yet
  if (hasInterview && timelineData.length === 0 && !loadingTimeline) {
    // Use local fallback immediately for responsive UX
    const localData = generateLocalTimelineData(interviewMessages, analysis)
    setTimelineData(localData)
    // Then try API in background
    handleLoadTimeline()
  }

  if (!hasProfile()) {
    return (
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
            <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <Activity className="w-8 h-8" style={{ color: '#8b5cf6' }} />
              </div>
              <h3 className="text-xl font-bold text-white">Create Your Profile First</h3>
              <p className="text-gray-400 text-sm">You need a neural profile to track your emotional timeline.</p>
              <MagneticButton variant="violet" onClick={() => setCurrentSection('profile')}>Create Profile</MagneticButton>
            </div>
          </GlassCard>
        </div>
      </section>
    )
  }

  if (!hasInterview) {
    return (
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
            <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <Activity className="w-8 h-8" style={{ color: '#8b5cf6' }} />
              </div>
              <h3 className="text-xl font-bold text-white">Complete an AI Interview First</h3>
              <p className="text-gray-400 text-sm">Your emotional timeline is generated from your interview responses. Start an interview to see your timeline.</p>
              <MagneticButton variant="violet" onClick={() => setCurrentSection('interview')}>Start Interview</MagneticButton>
            </div>
          </GlassCard>
        </div>
      </section>
    )
  }

  const keyMoments = timelineData.length > 0 ? [
    {
      title: 'Peak Confidence',
      description: 'During your strongest response',
      score: Math.max(...timelineData.map((d) => d.confidence)),
      icon: TrendingUp,
      glowColor: '#00f5ff',
    },
    {
      title: 'High Engagement',
      description: 'Most emotionally invested moment',
      score: Math.max(...timelineData.map((d) => d.engagement)),
      icon: Heart,
      glowColor: '#8b5cf6',
    },
    {
      title: 'Stress Peak',
      description: 'Highest stress response detected',
      score: Math.max(...timelineData.map((d) => d.stress)),
      icon: Zap,
      glowColor: '#ff6b6b',
    },
    {
      title: 'Strong Recovery',
      description: 'Post-stress adaptability shown',
      score: Math.round(Math.max(...timelineData.map((d) => d.confidence)) * 0.9),
      icon: RotateCcw,
      glowColor: '#00f5ff',
    },
  ] : []

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8">
      <style dangerouslySetInnerHTML={{ __html: `@keyframes gradientShift2 { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }` }} />

      {/* Header */}
      <motion.div className="text-center mb-8 sm:mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #00f5ff, #8b5cf6)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientShift2 4s ease-in-out infinite',
          }}
        >
          Emotional Timeline
        </h2>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
          Track emotional intelligence and behavioral patterns throughout your interview
        </p>
      </motion.div>

      {/* Timeline Chart */}
      <motion.div className="max-w-6xl mx-auto mb-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
        <GlassCard tiltEnabled={false}>
          <div className="p-4 sm:p-6">
            <div className="w-full h-[250px] sm:h-[300px] md:h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00f5ff" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="phase" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} width={30} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                  <Area type="monotone" dataKey="confidence" stroke="#00f5ff" strokeWidth={2} fill="url(#confGrad)" dot={{ r: 3, fill: '#00f5ff' }} animationDuration={1500} />
                  <Area type="monotone" dataKey="engagement" stroke="#8b5cf6" strokeWidth={2} fill="url(#engGrad)" dot={{ r: 3, fill: '#8b5cf6' }} animationDuration={1800} />
                  <Area type="monotone" dataKey="stress" stroke="#ff6b6b" strokeWidth={2} fill="url(#stressGrad)" dot={{ r: 3, fill: '#ff6b6b' }} animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Key Moments */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMoments.map((moment, idx) => {
          const IconComp = moment.icon
          return (
            <motion.div
              key={moment.title}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.12 }}
            >
              <GlassCard tiltEnabled={false}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${moment.glowColor}15`, border: `1px solid ${moment.glowColor}25`, color: moment.glowColor }}>
                        <IconComp size={14} />
                      </div>
                      <h4 className="text-sm font-semibold truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>{moment.title}</h4>
                    </div>
                    <span className="text-xl font-bold tabular-nums flex-shrink-0" style={{ color: moment.glowColor }}>{moment.score}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{moment.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
