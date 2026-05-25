'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Zap, Target, Brain, Rocket, Sparkles } from 'lucide-react'
import GlassCard from '@/components/shared/GlassCard'
import MagneticButton from '@/components/shared/MagneticButton'
import { useUserStore } from '@/lib/user-store'

const defaultGrowthInsights = [
  { title: 'Communication: Strong Foundation', description: 'Ability to articulate ideas clearly', icon: Zap, color: '#00f5ff' },
  { title: 'Adaptability: Growth-Oriented', description: 'Flexible approach to changing environments', icon: Rocket, color: '#8b5cf6' },
  { title: 'Technical Aptitude: Notable', description: 'Strong analytical and problem-solving skills', icon: Brain, color: '#06b6d4' },
  { title: 'Leadership: Emerging', description: 'Natural tendency to guide and mentor others', icon: TrendingUp, color: '#00f5ff' },
]

function getGrowthFromMatch(match: number): string {
  if (match >= 90) return '+35%'
  if (match >= 80) return '+25%'
  if (match >= 70) return '+18%'
  return '+12%'
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 245, 255'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

const careerColors = ['#00f5ff', '#8b5cf6', '#06b6d4']

export default function CareerPrediction() {
  const { analysis, hasProfile, hasAnalysis, setAnalysis, setCurrentSection } = useUserStore()
  const [loading, setLoading] = useState(false)

  if (!hasProfile()) {
    return (
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
            <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <Target className="w-8 h-8" style={{ color: '#8b5cf6' }} />
              </div>
              <h3 className="text-xl font-bold text-white">Create Your Profile First</h3>
              <p className="text-gray-400 text-sm">You need a neural profile before viewing career predictions.</p>
              <MagneticButton variant="violet" onClick={() => setCurrentSection('profile')}>Create Profile</MagneticButton>
            </div>
          </GlassCard>
        </div>
      </section>
    )
  }

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
              <p className="text-gray-400 text-sm">Career predictions require a completed video analysis. Upload and analyze your video resume first.</p>
              <MagneticButton variant="violet" onClick={() => setCurrentSection('analyze')}>Go to Video Analyzer</MagneticButton>
            </div>
          </GlassCard>
        </div>
      </section>
    )
  }

  const predictions = analysis.careerPredictions || []
  const growthInsights = predictions.length > 0 ? defaultGrowthInsights : []

  const handleLoadPredictions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'career-prediction',
          data: { profile: useUserStore.getState().profile, analysisData: analysis },
        }),
      })
      const result = await res.json()
      if (result.success && result.predictions?.careerPredictions) {
        setAnalysis({ careerPredictions: result.predictions.careerPredictions })
      }
    } catch {
      // fallback handled by empty state
    }
    setLoading(false)
  }

  // If no predictions yet, offer to generate
  if (predictions.length === 0) {
    return (
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
            <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <Sparkles className="w-8 h-8" style={{ color: '#8b5cf6' }} />
              </div>
              <h3 className="text-xl font-bold text-white">Generate Career Predictions</h3>
              <p className="text-gray-400 text-sm">Your analysis is complete. Generate AI-powered career trajectory predictions based on your profile and analysis results.</p>
              <MagneticButton variant="violet" onClick={handleLoadPredictions} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Predictions'}
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
              background: 'linear-gradient(135deg, #00f5ff, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI Career Prediction
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Neural-powered career trajectory forecasting and role compatibility analysis
          </p>
        </motion.div>

        {/* Career Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {predictions.map((career, index) => {
            const glowColor = careerColors[index % careerColors.length]
            const rgb = hexToRgb(glowColor)
            const growth = getGrowthFromMatch(career.match)

            return (
              <motion.div
                key={career.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <GlassCard glowColor={glowColor} className="h-full">
                  <div className="p-5 sm:p-6">
                    {/* Match */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="relative" style={{ width: 72, height: 72 }}>
                        <svg width={72} height={72} viewBox="0 0 72 72" className="transform -rotate-90">
                          <circle cx={36} cy={36} r={30} fill="none" stroke={`rgba(${rgb}, 0.12)`} strokeWidth={5} />
                          <motion.circle
                            cx={36} cy={36} r={30} fill="none" stroke={glowColor} strokeWidth={5} strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 30}
                            initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - career.match / 100) }}
                            transition={{ duration: 1.5, ease: 'easeOut', delay: index * 0.2 }}
                            style={{ filter: `drop-shadow(0 0 4px ${glowColor}80)` }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold tabular-nums" style={{ color: glowColor }}>{career.match}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm" style={{ color: '#22c55e' }}>
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold">{growth}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold mb-2 truncate" style={{ color: glowColor }}>
                      {career.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed break-words">{career.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {career.strengths.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ background: `rgba(${rgb}, 0.1)`, border: `1px solid rgba(${rgb}, 0.25)`, color: glowColor }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Growth indicator */}
                    <div className="flex items-center gap-2 pt-3" style={{ borderTop: `1px solid rgba(${rgb}, 0.1)` }}>
                      <Target className="w-4 h-4" style={{ color: glowColor }} />
                      <span className="text-xs text-gray-500">Growth Potential</span>
                      <div className="ml-auto flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-sm font-semibold text-green-400">{growth}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        {/* Growth Insights */}
        {growthInsights.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-4 sm:mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5" style={{ color: '#00f5ff' }} />
              Growth Intelligence
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {growthInsights.map((insight, index) => {
                const IconComp = insight.icon
                const rgb = hexToRgb(insight.color)
                return (
                  <motion.div key={insight.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                    <GlassCard glowColor={insight.color} tiltEnabled={false}>
                      <div className="p-5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                          style={{ background: `rgba(${rgb}, 0.1)`, border: `1px solid rgba(${rgb}, 0.2)` }}
                        >
                          <IconComp className="w-5 h-5" style={{ color: insight.color }} />
                        </div>
                        <h4 className="text-sm font-bold mb-1.5 truncate" style={{ color: insight.color }}>{insight.title}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed break-words">{insight.description}</p>
                      </div>
                    </GlassCard>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
