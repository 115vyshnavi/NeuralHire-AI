'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import { Crown, Shield, Lightbulb, Heart, RefreshCw, Users, Zap, Sparkles } from 'lucide-react'
import GlassCard from '@/components/shared/GlassCard'
import MagneticButton from '@/components/shared/MagneticButton'
import { useUserStore } from '@/lib/user-store'

const iconMap: Record<string, React.ElementType> = {
  leadership: Crown,
  confidence: Shield,
  creativity: Lightbulb,
  emotionalIntelligence: Heart,
  adaptability: RefreshCw,
  collaboration: Users,
  pressureHandling: Zap,
}

const labelMap: Record<string, string> = {
  leadership: 'Leadership',
  confidence: 'Confidence',
  creativity: 'Creativity',
  emotionalIntelligence: 'Emotional\nIntelligence',
  adaptability: 'Adaptability',
  collaboration: 'Collaboration',
  pressureHandling: 'Pressure\nHandling',
}

function getBarColor(score: number): string {
  const ratio = score / 100
  const r = Math.round(0 + ratio * 139)
  const g = Math.round(245 - ratio * 186)
  const b = Math.round(255 - ratio * 9)
  return `linear-gradient(90deg, #00f5ff, rgb(${r}, ${g}, ${b}))`
}

function renderCustomLabel({ x, y, payload }: { x: number; y: number; payload: { value: string } }) {
  return (
    <text x={x} y={y} textAnchor="middle" fill="#c0c0c8" fontSize={11} fontWeight={500}>
      {payload.value.split('\n').map((line: string, i: number) => (
        <tspan key={i} x={x} dy={i === 0 ? '0' : '14'}>{line}</tspan>
      ))}
    </text>
  )
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'rgba(10, 10, 26, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 245, 255, 0.25)',
          borderRadius: '12px',
          padding: '10px 16px',
          boxShadow: '0 0 20px rgba(0, 245, 255, 0.15)',
        }}
      >
        <p style={{ color: '#c0c0c8', fontSize: '12px', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: '#00f5ff', fontSize: '18px', fontWeight: 'bold' }}>{payload[0].value}</p>
      </div>
    )
  }
  return null
}

export default function PersonalityRadar() {
  const { analysis, hasAnalysis, hasProfile, setAnalysis, setCurrentSection } = useUserStore()
  const [loadingRadar, setLoadingRadar] = useState(false)

  // If no profile, show guidance
  if (!hasProfile()) {
    return (
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
            <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <Crown className="w-8 h-8" style={{ color: '#8b5cf6' }} />
              </div>
              <h3 className="text-xl font-bold text-white">Create Your Profile First</h3>
              <p className="text-gray-400 text-sm">You need a neural profile before viewing personality analysis.</p>
              <MagneticButton variant="violet" onClick={() => setCurrentSection('profile')}>Create Profile</MagneticButton>
            </div>
          </GlassCard>
        </div>
      </section>
    )
  }

  // If no analysis, show guidance
  if (!hasAnalysis()) {
    return (
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
            <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <Sparkles className="w-8 h-8" style={{ color: '#8b5cf6' }} />
              </div>
              <h3 className="text-xl font-bold text-white">Complete Video Analysis First</h3>
              <p className="text-gray-400 text-sm">Upload and analyze a video resume to see your personality radar.</p>
              <MagneticButton variant="violet" onClick={() => setCurrentSection('analyze')}>Go to Video Analyzer</MagneticButton>
            </div>
          </GlassCard>
        </div>
      </section>
    )
  }

  const dims = analysis.personalityDimensions
  const radarData = dims
    ? Object.entries(dims).map(([key, value]) => ({
        dimension: labelMap[key] || key,
        value,
      }))
    : []

  const metricCards = dims
    ? Object.entries(dims).map(([key, value]) => ({
        name: labelMap[key]?.replace('\n', ' ') || key,
        score: value,
        icon: iconMap[key] || Zap,
      }))
    : []

  const handleLoadRadar = async () => {
    setLoadingRadar(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'personality-radar',
          data: { profile: useUserStore.getState().profile, analysisData: analysis },
        }),
      })
      const result = await res.json()
      if (result.success && result.radar?.personalityDimensions) {
        setAnalysis({ personalityDimensions: result.radar.personalityDimensions })
      }
    } catch {
      // fallback already in place
    }
    setLoadingRadar(false)
  }

  // If no personality dimensions yet, offer to generate
  if (!dims) {
    return (
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
            <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <Sparkles className="w-8 h-8" style={{ color: '#8b5cf6' }} />
              </div>
              <h3 className="text-xl font-bold text-white">Generate Your Personality Radar</h3>
              <p className="text-gray-400 text-sm">Your video analysis is complete. Generate your personality dimensions now.</p>
              <MagneticButton variant="violet" onClick={handleLoadRadar} disabled={loadingRadar}>
                {loadingRadar ? 'Generating...' : 'Generate Radar'}
              </MagneticButton>
            </div>
          </GlassCard>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-8 sm:mb-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #00f5ff, #8b5cf6)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShiftRadar 4s ease infinite',
            }}
          >
            AI Personality Radar
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">Multi-dimensional neural personality mapping</p>
        </motion.div>

        {/* Radar + Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-8">
          {/* Radar Chart */}
          <motion.div
            className="lg:col-span-3 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard tiltEnabled={false} className="p-4 sm:p-6 w-full">
              <div className="w-full h-[300px] sm:h-[360px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="rgba(0, 245, 255, 0.12)" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="dimension" tick={renderCustomLabel} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Personality"
                      dataKey="value"
                      stroke="#00f5ff"
                      fill="#00f5ff"
                      fillOpacity={0.15}
                      strokeWidth={2}
                      style={{ filter: 'drop-shadow(0 0 8px rgba(0, 245, 255, 0.4))' }}
                      animationBegin={0}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Metric Detail Cards */}
          <motion.div
            className="lg:col-span-2 space-y-3 max-h-[500px] lg:max-h-[520px] overflow-y-auto pr-1"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0, 245, 255, 0.2) transparent' }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {metricCards.map((metric, i) => {
              const IconComp = metric.icon
              const color = metric.score >= 80 ? '#00f5ff' : '#8b5cf6'
              return (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <GlassCard glowColor={color} tiltEnabled={false}>
                    <div className="p-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                        >
                          <IconComp className="w-4 h-4" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-white truncate">{metric.name}</p>
                            <span className="text-sm font-bold tabular-nums flex-shrink-0" style={{ color }}>{metric.score}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: getBarColor(metric.score) }}
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.score}%` }}
                              transition={{ duration: 0.8, delay: i * 0.08 + 0.3 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Personality Summary */}
        {analysis.personalitySummary && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(139, 92, 246, 0.15))', border: '1px solid rgba(0, 245, 255, 0.2)' }}>
                    <Zap className="w-5 h-5" style={{ color: '#00f5ff' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Personality Summary</h3>
                    <p className="text-xs" style={{ color: 'rgba(0, 245, 255, 0.6)' }}>AI-Generated Neural Assessment</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base break-words">{analysis.personalitySummary}</p>
                {analysis.primaryTrait && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {[analysis.primaryTrait, analysis.communicationStyle || 'Collaborative'].filter(Boolean).map((tag, i) => (
                      <motion.span
                        key={tag}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{
                          background: i % 2 === 0 ? 'rgba(0, 245, 255, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                          border: `1px solid ${i % 2 === 0 ? 'rgba(0, 245, 255, 0.2)' : 'rgba(139, 92, 246, 0.2)'}`,
                          color: i % 2 === 0 ? '#00f5ff' : '#8b5cf6',
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>

      <style jsx global>{`
        @keyframes gradientShiftRadar {
          0% { background-position: 0% center; }
          50% { background-position: 200% center; }
          100% { background-position: 0% center; }
        }
      `}</style>
    </section>
  )
}
