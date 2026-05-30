'use client'

import React, { useState, useMemo } from 'react'
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
import { TrendingUp, Heart, Zap, RotateCcw, Activity, Sparkles, BarChart3, Brain, AlertTriangle, ShieldCheck } from 'lucide-react'
import GlassCard from '@/components/shared/GlassCard'
import MagneticButton from '@/components/shared/MagneticButton'
import { useUserStore } from '@/lib/user-store'

interface TimelineEntry {
  phase: string
  confidence: number
  engagement: number
  stress: number
  nervousness: number
}

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

  const labels: Record<string, string> = {
    confidence: 'Confidence',
    engagement: 'Engagement',
    stress: 'Stress Level',
    nervousness: 'Nervousness',
  }

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
            {labels[entry.dataKey] || entry.dataKey}:
          </span>
          <span className="text-[11px] font-bold" style={{ color: entry.color }}>{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

function CustomLegend({ payload }: { payload?: Array<{ value: string; color: string }> }) {
  if (!payload) return null
  const labels: Record<string, string> = {
    confidence: 'Confidence',
    engagement: 'Engagement',
    stress: 'Stress Level',
    nervousness: 'Nervousness',
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <div className="w-3 h-1 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{labels[entry.value] || entry.value}</span>
        </div>
      ))}
    </div>
  )
}

function computeBehaviorSummary(data: TimelineEntry[]): string {
  if (data.length === 0) return ''

  const confidences = data.map(d => d.confidence)
  const engagements = data.map(d => d.engagement)
  const stress = data.map(d => d.stress)
  const nervousness = data.map(d => d.nervousness)

  const firstConf = confidences[0]
  const lastConf = confidences[confidences.length - 1]
  const firstNerv = nervousness[0]
  const lastNerv = nervousness[nervousness.length - 1]
  const avgEngagement = engagements.reduce((a, b) => a + b, 0) / engagements.length
  const maxStress = Math.max(...stress)
  const avgConf = confidences.reduce((a, b) => a + b, 0) / confidences.length

  const parts: string[] = []

  // Confidence trajectory
  if (firstConf < 50 && lastConf > 65) {
    parts.push('Started nervous but gained confidence as the interview progressed')
  } else if (firstConf > 65 && lastConf < 50) {
    parts.push('Began with strong confidence but showed signs of fading as questions became more challenging')
  } else if (firstConf > 60 && lastConf > 60) {
    parts.push('Maintained consistent confidence throughout the interview')
  } else if (firstConf < 45 && lastConf < 45) {
    parts.push('Struggled with confidence from start to finish')
  } else {
    parts.push('Showed a moderate confidence level with some fluctuation')
  }

  // Nervousness pattern
  if (firstNerv > 50 && lastNerv < 35) {
    parts.push('nervousness decreased significantly over time, suggesting growing comfort')
  } else if (firstNerv < 30 && lastNerv > 50) {
    parts.push('nervousness increased over time, possibly due to more challenging questions')
  } else if (firstNerv > 45 && lastNerv > 45) {
    parts.push('nervousness remained elevated throughout, which may indicate interview anxiety')
  } else if (firstNerv < 30 && lastNerv < 30) {
    parts.push('remained composed and calm throughout')
  }

  // Engagement
  if (avgEngagement > 70) {
    parts.push('Maintained high engagement throughout')
  } else if (avgEngagement < 40) {
    parts.push('Engagement was notably low, suggesting possible disinterest or discomfort')
  }

  // Stress spike
  if (maxStress > 60) {
    const spikeIdx = stress.indexOf(maxStress)
    parts.push(`experienced a stress peak during the ${data[spikeIdx]?.phase || 'mid-interview'} phase`)
  }

  return parts.join('. ') + '.'
}

export default function EmotionalTimeline() {
  const { profile, analysis, hasProfile, setAnalysis, setCurrentSection } = useUserStore()
  const [timelineData, setTimelineData] = useState<TimelineEntry[]>([])
  const [loadingTimeline, setLoadingTimeline] = useState(false)
  const [timelineError, setTimelineError] = useState('')

  const interviewMessages = analysis.interviewMessages || []
  const hasInterview = interviewMessages.length > 0 && interviewMessages.some((m) => m.role === 'user')

  const handleLoadTimeline = async () => {
    if (!hasInterview) return
    setLoadingTimeline(true)
    setTimelineError('')
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
        // Ensure each entry has nervousness
        const validated = (result.timeline as Array<Record<string, unknown>>).map((entry) => ({
          phase: entry.phase || 'Unknown',
          confidence: typeof entry.confidence === 'number' ? entry.confidence : 50,
          engagement: typeof entry.engagement === 'number' ? entry.engagement : 50,
          stress: typeof entry.stress === 'number' ? entry.stress : 30,
          nervousness: typeof entry.nervousness === 'number' ? entry.nervousness : Math.min(85, Math.max(5, (typeof entry.stress === 'number' ? entry.stress : 30) + 5)),
        }))
        setTimelineData(validated)
        return
      }
      setTimelineError(result.error || 'Failed to generate timeline.')
    } catch {
      setTimelineError('Network error. Please try again.')
    }
    setLoadingTimeline(false)
  }

  // Computed analytics
  const analytics = useMemo(() => {
    if (timelineData.length === 0) return null

    const confidences = timelineData.map(d => d.confidence)
    const engagements = timelineData.map(d => d.engagement)
    const stress = timelineData.map(d => d.stress)
    const nervousness = timelineData.map(d => d.nervousness)

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length
    const variance = (arr: number[]) => {
      const mean = avg(arr)
      return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length
    }

    const avgConfidence = Math.round(avg(confidences) * 10) / 10
    const avgEngagement = Math.round(avg(engagements) * 10) / 10
    const avgStress = Math.round(avg(stress) * 10) / 10
    const avgNervousness = Math.round(avg(nervousness) * 10) / 10

    const confidenceVariance = Math.round(variance(confidences) * 10) / 10
    const confidenceFluctuation: 'stable' | 'moderate' | 'volatile' = confidenceVariance < 80 ? 'stable' : confidenceVariance < 200 ? 'moderate' : 'volatile'

    const stressManagementRatio = avgStress > 0 ? Math.round((avgConfidence / avgStress) * 100) / 100 : 99

    // Emotional consistency: low variance across all metrics = high consistency
    const totalVariance = variance(confidences) + variance(engagements) + variance(stress) + variance(nervousness)
    const emotionalConsistency = Math.max(0, Math.min(100, Math.round(100 - totalVariance / 8)))

    const behaviorSummary = computeBehaviorSummary(timelineData)

    return {
      avgConfidence,
      avgEngagement,
      avgStress,
      avgNervousness,
      confidenceVariance,
      confidenceFluctuation,
      stressManagementRatio,
      emotionalConsistency,
      behaviorSummary,
    }
  }, [timelineData])

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

  // If no timeline data yet, offer to generate
  if (timelineData.length === 0) {
    return (
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
            <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <Sparkles className="w-8 h-8" style={{ color: '#8b5cf6' }} />
              </div>
              <h3 className="text-xl font-bold text-white">Generate Emotional Timeline</h3>
              <p className="text-gray-400 text-sm">Your interview is complete. Generate your emotional intelligence timeline based on your responses.</p>
              {timelineError && (
                <p className="text-xs text-red-400">{timelineError}</p>
              )}
              <MagneticButton variant="violet" onClick={handleLoadTimeline} disabled={loadingTimeline}>
                {loadingTimeline ? 'Generating...' : 'Generate Timeline'}
              </MagneticButton>
            </div>
          </GlassCard>
        </div>
      </section>
    )
  }

  const keyMoments = [
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
  ]

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
                    <linearGradient id="nervGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
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
                  <Area type="monotone" dataKey="nervousness" stroke="#f59e0b" strokeWidth={2} fill="url(#nervGrad)" dot={{ r: 3, fill: '#f59e0b' }} animationDuration={2200} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Key Moments */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

      {/* Confidence Fluctuation Analysis */}
      {analytics && (
        <motion.div
          className="max-w-6xl mx-auto mb-6"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <GlassCard tiltEnabled={false}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0, 245, 255, 0.08)', border: '1px solid rgba(0, 245, 255, 0.15)' }}>
                  <BarChart3 size={14} style={{ color: '#00f5ff' }} />
                </div>
                <h3 className="text-sm font-semibold" style={{ color: 'rgba(0, 245, 255, 0.85)' }}>Confidence Fluctuation Analysis</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Variance score */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 245, 255, 0.03)', border: '1px solid rgba(0, 245, 255, 0.08)' }}>
                  <span className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: 'rgba(0, 245, 255, 0.4)' }}>Variance Score</span>
                  <span className="text-2xl font-bold tabular-nums" style={{ color: '#00f5ff' }}>{analytics.confidenceVariance}</span>
                </div>
                {/* Fluctuation level */}
                <div className="rounded-xl p-4" style={{ background: analytics.confidenceFluctuation === 'volatile' ? 'rgba(239, 68, 68, 0.04)' : analytics.confidenceFluctuation === 'moderate' ? 'rgba(245, 158, 11, 0.04)' : 'rgba(34, 197, 94, 0.04)', border: `1px solid ${analytics.confidenceFluctuation === 'volatile' ? 'rgba(239, 68, 68, 0.12)' : analytics.confidenceFluctuation === 'moderate' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(34, 197, 94, 0.12)'}` }}>
                  <span className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: analytics.confidenceFluctuation === 'volatile' ? 'rgba(239, 68, 68, 0.5)' : analytics.confidenceFluctuation === 'moderate' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(34, 197, 94, 0.5)' }}>Fluctuation Level</span>
                  <div className="flex items-center gap-2">
                    {analytics.confidenceFluctuation === 'volatile' ? (
                      <AlertTriangle size={16} style={{ color: '#ef4444' }} />
                    ) : analytics.confidenceFluctuation === 'moderate' ? (
                      <Zap size={16} style={{ color: '#f59e0b' }} />
                    ) : (
                      <ShieldCheck size={16} style={{ color: '#22c55e' }} />
                    )}
                    <span className="text-lg font-bold" style={{ color: analytics.confidenceFluctuation === 'volatile' ? '#ef4444' : analytics.confidenceFluctuation === 'moderate' ? '#f59e0b' : '#22c55e' }}>
                      {analytics.confidenceFluctuation === 'volatile' ? 'Volatile confidence' : analytics.confidenceFluctuation === 'moderate' ? 'Moderate fluctuation' : 'Stable confidence'}
                    </span>
                  </div>
                </div>
                {/* Interpretation */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(139, 92, 246, 0.03)', border: '1px solid rgba(139, 92, 246, 0.08)' }}>
                  <span className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: 'rgba(139, 92, 246, 0.4)' }}>Interpretation</span>
                  <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {analytics.confidenceFluctuation === 'volatile'
                      ? 'Confidence swings significantly between topics. This suggests sensitivity to question difficulty or domain familiarity.'
                      : analytics.confidenceFluctuation === 'moderate'
                        ? 'Some variation in confidence levels across different topics. This is typical and shows authentic engagement.'
                        : 'Confidence remained remarkably stable throughout. This indicates strong self-assurance regardless of topic.'}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Communication Intelligence Metrics */}
      {analytics && (
        <motion.div
          className="max-w-6xl mx-auto mb-6"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          <GlassCard tiltEnabled={false}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
                  <Brain size={14} style={{ color: '#8b5cf6' }} />
                </div>
                <h3 className="text-sm font-semibold" style={{ color: 'rgba(139, 92, 246, 0.85)' }}>Communication Intelligence Metrics</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Average Confidence */}
                <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0, 245, 255, 0.03)', border: '1px solid rgba(0, 245, 255, 0.08)' }}>
                  <span className="text-[10px] uppercase tracking-wider block mb-2" style={{ color: 'rgba(0, 245, 255, 0.4)' }}>Avg Confidence</span>
                  <span className="text-2xl font-bold tabular-nums" style={{ color: '#00f5ff' }}>{analytics.avgConfidence}</span>
                  <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(0, 245, 255, 0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${analytics.avgConfidence}%`, background: 'linear-gradient(90deg, #00f5ff, #00d4e0)' }} />
                  </div>
                </div>
                {/* Average Engagement */}
                <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(139, 92, 246, 0.03)', border: '1px solid rgba(139, 92, 246, 0.08)' }}>
                  <span className="text-[10px] uppercase tracking-wider block mb-2" style={{ color: 'rgba(139, 92, 246, 0.4)' }}>Avg Engagement</span>
                  <span className="text-2xl font-bold tabular-nums" style={{ color: '#8b5cf6' }}>{analytics.avgEngagement}</span>
                  <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(139, 92, 246, 0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${analytics.avgEngagement}%`, background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)' }} />
                  </div>
                </div>
                {/* Stress Management Ratio */}
                <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34, 197, 94, 0.03)', border: '1px solid rgba(34, 197, 94, 0.08)' }}>
                  <span className="text-[10px] uppercase tracking-wider block mb-2" style={{ color: 'rgba(34, 197, 94, 0.4)' }}>Stress Mgmt Ratio</span>
                  <span className="text-2xl font-bold tabular-nums" style={{ color: analytics.stressManagementRatio >= 1.5 ? '#22c55e' : analytics.stressManagementRatio >= 1 ? '#f59e0b' : '#ef4444' }}>
                    {analytics.stressManagementRatio}x
                  </span>
                  <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(34, 197, 94, 0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, analytics.stressManagementRatio * 33)}%`, background: analytics.stressManagementRatio >= 1.5 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : analytics.stressManagementRatio >= 1 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #ef4444, #dc2626)' }} />
                  </div>
                </div>
                {/* Emotional Consistency Index */}
                <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(245, 158, 11, 0.03)', border: '1px solid rgba(245, 158, 11, 0.08)' }}>
                  <span className="text-[10px] uppercase tracking-wider block mb-2" style={{ color: 'rgba(245, 158, 11, 0.4)' }}>Emotional Consistency</span>
                  <span className="text-2xl font-bold tabular-nums" style={{ color: analytics.emotionalConsistency >= 70 ? '#22c55e' : analytics.emotionalConsistency >= 40 ? '#f59e0b' : '#ef4444' }}>
                    {analytics.emotionalConsistency}%
                  </span>
                  <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(245, 158, 11, 0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${analytics.emotionalConsistency}%`, background: analytics.emotionalConsistency >= 70 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : analytics.emotionalConsistency >= 40 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #ef4444, #dc2626)' }} />
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Behavior-Aware Summary */}
      {analytics && (
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
                  <Sparkles size={14} style={{ color: '#8b5cf6' }} />
                </div>
                <h3 className="text-sm font-semibold" style={{ color: 'rgba(139, 92, 246, 0.85)' }}>Behavior-Aware Summary</h3>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(139, 92, 246, 0.03)', border: '1px solid rgba(139, 92, 246, 0.08)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {analytics.behaviorSummary}
                </p>
              </div>
              {/* Quick stat pills */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium" style={{ background: 'rgba(0, 245, 255, 0.06)', border: '1px solid rgba(0, 245, 255, 0.1)', color: 'rgba(0, 245, 255, 0.7)' }}>
                  Confidence: {analytics.avgConfidence}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium" style={{ background: 'rgba(139, 92, 246, 0.06)', border: '1px solid rgba(139, 92, 246, 0.1)', color: 'rgba(139, 92, 246, 0.7)' }}>
                  Engagement: {analytics.avgEngagement}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium" style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.1)', color: 'rgba(245, 158, 11, 0.7)' }}>
                  Nervousness: {analytics.avgNervousness}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium" style={{
                  background: analytics.confidenceFluctuation === 'volatile' ? 'rgba(239, 68, 68, 0.06)' : analytics.confidenceFluctuation === 'moderate' ? 'rgba(245, 158, 11, 0.06)' : 'rgba(34, 197, 94, 0.06)',
                  border: `1px solid ${analytics.confidenceFluctuation === 'volatile' ? 'rgba(239, 68, 68, 0.1)' : analytics.confidenceFluctuation === 'moderate' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)'}`,
                  color: analytics.confidenceFluctuation === 'volatile' ? 'rgba(239, 68, 68, 0.7)' : analytics.confidenceFluctuation === 'moderate' ? 'rgba(245, 158, 11, 0.7)' : 'rgba(34, 197, 94, 0.7)',
                }}>
                  {analytics.confidenceFluctuation === 'volatile' ? 'Volatile' : analytics.confidenceFluctuation === 'moderate' ? 'Moderate' : 'Stable'}
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </section>
  )
}
