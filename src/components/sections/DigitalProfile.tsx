'use client'

import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import GlassCard from '@/components/shared/GlassCard'
import HexagonalAvatar from '@/components/shared/HexagonalAvatar'
import MagneticButton from '@/components/shared/MagneticButton'
import {
  MapPin,
  Sparkles,
  Brain,
  MessageCircle,
  Heart,
  Briefcase,
  BarChart3,
  UserPlus,
  Clock,
} from 'lucide-react'
import { useUserStore } from '@/lib/user-store'

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 245, 255'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

function ScoreBar({ label, value, color = '#00f5ff' }: { label: string; value: number; color?: string }) {
  const motionVal = useMotionValue(0)
  const springVal = useSpring(motionVal, { stiffness: 40, damping: 20 })
  const widthTransform = useTransform(springVal, (v) => `${v}%`)
  const [width, setWidth] = useState('0%')

  useEffect(() => {
    const unsub = widthTransform.on('change', (v) => setWidth(v))
    return unsub
  }, [widthTransform])

  useEffect(() => {
    motionVal.set(value)
  }, [value, motionVal])

  const rgb = hexToRgb(color)

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400 truncate">{label}</span>
        <span style={{ color }} className="font-semibold tabular-nums ml-2">{value}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `rgba(${rgb}, 0.1)` }}>
        <motion.div
          className="h-full rounded-full"
          style={{ width, background: `linear-gradient(90deg, ${color}99, ${color})`, boxShadow: `0 0 8px ${color}40` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

function SpectrumBar({ leftLabel, rightLabel, value, color = '#00f5ff' }: { leftLabel: string; rightLabel: string; value: number; color?: string }) {
  const rgb = hexToRgb(color)

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">{leftLabel}</span>
        <span className="text-gray-500">{rightLabel}</span>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: `rgba(${rgb}, 0.08)` }}>
        <div className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(90deg, ${color}15, rgba(${rgb}, 0.02), #8b5cf615)` }} />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
          style={{ left: `${value}%`, transform: 'translate(-50%, -50%)', background: `linear-gradient(135deg, ${color}, #8b5cf6)`, boxShadow: `0 0 12px ${color}60`, border: '2px solid rgba(255,255,255,0.2)' }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      </div>
      <div className="text-center">
        <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
      </div>
    </div>
  )
}

export default function DigitalProfile() {
  const { profile, analysis, hasProfile, setCurrentSection } = useUserStore()

  if (!hasProfile()) {
    return (
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
            <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0, 245, 255, 0.08)', border: '1px solid rgba(0, 245, 255, 0.2)' }}>
                <UserPlus className="w-8 h-8" style={{ color: '#00f5ff' }} />
              </div>
              <h3 className="text-xl font-bold text-white">Create Your Profile First</h3>
              <p className="text-gray-400 text-sm">You need a neural profile before viewing your digital profile.</p>
              <MagneticButton variant="cyan" onClick={() => setCurrentSection('profile')}>Create Profile</MagneticButton>
            </div>
          </GlassCard>
        </div>
      </section>
    )
  }

  const hasAnalysis = analysis.overallScore !== null

  // Build intelligence panels from actual analysis data
  const intelligencePanels = []

  if (analysis.personalitySummary || analysis.primaryTrait) {
    intelligencePanels.push({
      title: 'Personality Summary',
      primaryTrait: analysis.primaryTrait || 'Analyzing...',
      description: analysis.personalitySummary || 'Complete a video analysis to generate your personality summary.',
      tags: analysis.skills?.slice(0, 4) || ['Pending Analysis'],
      icon: Brain,
      color: '#00f5ff',
      type: 'tags' as const,
    })
  }

  if (analysis.communicationStyle || analysis.communication !== null) {
    intelligencePanels.push({
      title: 'Communication Style',
      primaryTrait: analysis.communicationStyle || 'Analyzing...',
      description: hasAnalysis
        ? 'Your communication patterns reveal structured articulation and responsive adaptability.'
        : 'Complete a video analysis to assess communication style.',
      scores: [
        { label: 'Clarity', value: analysis.speechClarity || 0 },
        { label: 'Persuasion', value: analysis.confidence || 0 },
        { label: 'Listening', value: analysis.communication || 0 },
        { label: 'Adaptability', value: analysis.adaptability || 0 },
      ],
      icon: MessageCircle,
      color: '#8b5cf6',
      type: 'scores' as const,
    })
  }

  intelligencePanels.push({
    title: 'Emotional Intelligence Profile',
    primaryTrait: hasAnalysis ? 'Empathic Professional' : 'Awaiting Analysis',
    description: hasAnalysis
      ? 'Demonstrates self-awareness and interpersonal sensitivity based on your analysis results.'
      : 'Complete a video analysis to assess emotional intelligence.',
    metrics: hasAnalysis
      ? [
          { label: 'Self-Awareness', value: analysis.emotionalConsistency || 0 },
          { label: 'Empathy', value: analysis.enthusiasm || 0 },
          { label: 'Social Skills', value: analysis.communication || 0 },
          { label: 'Self-Regulation', value: analysis.adaptability || 0 },
        ]
      : [
          { label: 'Self-Awareness', value: 0 },
          { label: 'Empathy', value: 0 },
          { label: 'Social Skills', value: 0 },
          { label: 'Self-Regulation', value: 0 },
        ],
    icon: Heart,
    color: '#06b6d4',
    type: 'metrics' as const,
  })

  intelligencePanels.push({
    title: 'Work Behavior Analysis',
    primaryTrait: hasAnalysis ? 'Growth-Oriented Achiever' : 'Awaiting Analysis',
    description: hasAnalysis
      ? 'Balances independent drive with collaborative instincts based on your profile.'
      : 'Complete a video analysis to assess work behavior.',
    tags: profile.skills.length > 0 ? profile.skills.slice(0, 4) : ['Pending Analysis'],
    icon: Briefcase,
    color: '#00f5ff',
    type: 'tags' as const,
  })

  const spectrums = [
    { leftLabel: 'Independent', rightLabel: 'Collaborative', value: hasAnalysis ? 72 : 50, color: '#00f5ff' },
    { leftLabel: 'Analytical', rightLabel: 'Creative', value: hasAnalysis ? 65 : 50, color: '#8b5cf6' },
    { leftLabel: 'Reserved', rightLabel: 'Expressive', value: hasAnalysis ? 78 : 50, color: '#06b6d4' },
  ]

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
            Digital Human Profile
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">AI-Generated Human Intelligence Snapshot</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
            <div className="p-5 sm:p-6 md:p-8">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8" style={{ borderBottom: '1px solid rgba(0, 245, 255, 0.08)' }}>
                <div className="shrink-0">
                  <HexagonalAvatar size={110} glowColor="#00f5ff" alt={profile.name} />
                </div>

                <div className="flex-1 min-w-0 text-center md:text-left">
                  <h3
                    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 truncate"
                    style={{ background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    {profile.name}
                  </h3>
                  {profile.role && <p className="text-gray-400 text-base sm:text-lg mb-2 truncate">{profile.role}</p>}

                  {/* AI Score Badge */}
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                    {hasAnalysis && analysis.overallScore !== null ? (
                      <div
                        className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{ background: 'rgba(0, 245, 255, 0.08)', border: '1px solid rgba(0, 245, 255, 0.25)', boxShadow: '0 0 20px rgba(0, 245, 255, 0.15)' }}
                      >
                        <Sparkles className="w-4 h-4" style={{ color: '#00f5ff' }} />
                        <span className="text-xl font-bold" style={{ color: '#00f5ff' }}>{analysis.overallScore}</span>
                        <span className="text-xs text-gray-400">/100</span>
                      </div>
                    ) : (
                      <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                      >
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Awaiting Analysis</span>
                      </div>
                    )}
                  </div>

                  {/* Location + Tags */}
                  <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                    {profile.location && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{profile.location}</span>
                      </div>
                    )}
                    {hasAnalysis && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22c55e' }}>
                        Analyzed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Intelligence Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
                {intelligencePanels.map((panel, index) => {
                  const IconComp = panel.icon
                  const rgb = hexToRgb(panel.color)
                  return (
                    <motion.div
                      key={panel.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div
                        className="p-4 sm:p-5 rounded-xl"
                        style={{ background: `linear-gradient(135deg, rgba(${rgb}, 0.04), rgba(255,255,255,0.01))`, border: `1px solid rgba(${rgb}, 0.1)` }}
                      >
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `rgba(${rgb}, 0.1)`, border: `1px solid rgba(${rgb}, 0.2)` }}>
                            <IconComp className="w-4 h-4" style={{ color: panel.color }} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-gray-300 truncate">{panel.title}</h4>
                            <span className="text-xs font-bold truncate block" style={{ color: panel.color }}>{panel.primaryTrait}</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 leading-relaxed mb-3 break-words">{panel.description}</p>

                        {panel.type === 'tags' && panel.tags && (
                          <div className="flex flex-wrap gap-2">
                            {panel.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: `rgba(${rgb}, 0.08)`, border: `1px solid rgba(${rgb}, 0.2)`, color: panel.color }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {panel.type === 'scores' && panel.scores && (
                          <div className="space-y-2.5">
                            {panel.scores.map((s) => (
                              <ScoreBar key={s.label} label={s.label} value={s.value} color={panel.color} />
                            ))}
                          </div>
                        )}

                        {panel.type === 'metrics' && panel.metrics && (
                          <div className="space-y-2.5">
                            {panel.metrics.map((m) => (
                              <div key={m.label} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-400">{m.label}</span>
                                  <span className="text-sm font-bold tabular-nums" style={{ color: panel.color }}>{m.value || '--'}</span>
                                </div>
                                <div className="h-1 rounded-full" style={{ background: `rgba(${rgb}, 0.1)` }}>
                                  <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: `linear-gradient(90deg, ${panel.color}88, ${panel.color})`, boxShadow: `0 0 6px ${panel.color}30` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Collaboration Style */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="p-4 sm:p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.03), rgba(139, 92, 246, 0.03))', border: '1px solid rgba(0, 245, 255, 0.08)' }}>
                  <div className="flex items-center gap-2 mb-5">
                    <BarChart3 className="w-5 h-5" style={{ color: '#00f5ff' }} />
                    <h4 className="text-sm font-semibold text-gray-300">Collaboration Style</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                    {spectrums.map((s) => (
                      <SpectrumBar key={s.leftLabel} leftLabel={s.leftLabel} rightLabel={s.rightLabel} value={s.value} color={s.color} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
