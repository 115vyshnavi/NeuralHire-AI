'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Target, Sparkles, CheckCircle2, Circle, ArrowRight, User, Video, MessageCircle, BarChart3, Zap } from 'lucide-react'
import GlassCard from '@/components/shared/GlassCard'
import MagneticButton from '@/components/shared/MagneticButton'
import AnimatedScore from '@/components/shared/AnimatedScore'
import { useUserStore } from '@/lib/user-store'

export default function CommandCenter() {
  const { profile, analysis, hasProfile, hasAnalysis, setCurrentSection, resetAnalysis, setProfile } = useUserStore()
  const [showResetConfirm, setShowResetConfirm] = React.useState(false)

  if (!hasProfile()) {
    return (
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
            <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0, 245, 255, 0.08)', border: '1px solid rgba(0, 245, 255, 0.2)' }}>
                <Brain className="w-8 h-8" style={{ color: '#00f5ff' }} />
              </div>
              <h3 className="text-xl font-bold text-white">Create Your Profile First</h3>
              <p className="text-gray-400 text-sm">Your Command Center requires a neural profile. Create one to get started.</p>
              <MagneticButton variant="cyan" onClick={() => setCurrentSection('profile')}>Create Profile</MagneticButton>
            </div>
          </GlassCard>
        </div>
      </section>
    )
  }

  const steps = [
    {
      id: 'profile',
      label: 'Create Profile',
      section: 'profile',
      completed: hasProfile(),
      icon: User,
      description: 'Set up your neural profile with your information',
    },
    {
      id: 'video',
      label: 'Video Analysis',
      section: 'analyze',
      completed: analysis.videoUploaded,
      icon: Video,
      description: 'Upload and analyze your video resume',
    },
    {
      id: 'interview',
      label: 'AI Interview',
      section: 'interview',
      completed: analysis.interviewCompleted,
      icon: MessageCircle,
      description: 'Complete an AI-powered interview session',
    },
  ]

  const completedSteps = steps.filter((s) => s.completed).length
  const progressPercent = Math.round((completedSteps / steps.length) * 100)

  // Score metrics to display
  const scoreMetrics = [
    { label: 'Overall Score', value: analysis.overallScore, color: '#00f5ff', icon: Target },
    { label: 'Confidence', value: analysis.confidence, color: '#8b5cf6', icon: Zap },
    { label: 'Communication', value: analysis.communication, color: '#06b6d4', icon: MessageCircle },
    { label: 'Leadership', value: analysis.leadership, color: '#00f5ff', icon: Brain },
  ].filter((m) => m.value !== null)

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
            Your Command Center
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Your personal AI intelligence dashboard and progress tracker
          </p>
        </motion.div>

        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 sm:mb-8">
          <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
            <div className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(139, 92, 246, 0.1))', border: '1px solid rgba(0, 245, 255, 0.2)' }}
                >
                  <Sparkles className="w-7 h-7" style={{ color: '#00f5ff' }} />
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white">Welcome, {profile.name}!</h3>
                  <p className="text-gray-400 text-sm mt-1 break-words">
                    {hasAnalysis()
                      ? 'Your neural analysis is in progress. Continue exploring your results.'
                      : 'Get started by uploading a video resume for AI analysis.'}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Analysis Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-6 sm:mb-8">
          <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-200 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                  Your Analysis Progress
                </h3>
                <span className="text-sm font-bold" style={{ color: '#8b5cf6' }}>{progressPercent}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full overflow-hidden mb-6" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #8b5cf6, #00f5ff)', boxShadow: '0 0 12px rgba(139, 92, 246, 0.4)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1 }}
                />
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {steps.map((step, i) => {
                  const IconComp = step.icon
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="relative"
                    >
                      <div
                        className="rounded-xl p-4"
                        style={{
                          background: step.completed ? 'rgba(0, 245, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                          border: `1px solid ${step.completed ? 'rgba(0, 245, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)'}`,
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          {step.completed ? (
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#00f5ff' }} />
                          ) : (
                            <Circle className="w-5 h-5 flex-shrink-0" style={{ color: 'rgba(255, 255, 255, 0.2)' }} />
                          )}
                          <span className="text-sm font-medium text-white truncate">{step.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 break-words">{step.description}</p>
                        {!step.completed && (
                          <button
                            onClick={() => setCurrentSection(step.section)}
                            className="flex items-center gap-1.5 text-xs font-medium"
                            style={{ color: '#00f5ff' }}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                            Start <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Score Metrics */}
        {scoreMetrics.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" style={{ color: '#00f5ff' }} />
              Your Scores
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {scoreMetrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <GlassCard glowColor={metric.color} tiltEnabled={false}>
                    <div className="p-4 sm:p-5 flex flex-col items-center">
                      <AnimatedScore value={metric.value!} label={metric.label} size="sm" color={metric.color} />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next Steps if no analysis */}
        {!hasAnalysis() && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-6 sm:mt-8">
            <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
              <div className="p-5 sm:p-8 text-center">
                <h3 className="text-lg font-bold text-white mb-2">Ready to Begin Your Analysis?</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                  Upload your video resume to start the AI-powered analysis. Our AI will validate that it's a genuine video resume before analyzing.
                </p>
                <MagneticButton variant="cyan" size="lg" onClick={() => setCurrentSection('analyze')}>
                  <Video className="w-5 h-5" />
                  Start Video Analysis
                </MagneticButton>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Reset Data Section */}
        {hasProfile() && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-6">
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Reset All Data</p>
                  <p className="text-xs text-gray-600">Clear profile and analysis to start fresh</p>
                </div>
                {!showResetConfirm ? (
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ background: 'rgba(255, 107, 107, 0.08)', border: '1px solid rgba(255, 107, 107, 0.15)', color: '#ff6b6b' }}
                    onClick={() => setShowResetConfirm(true)}
                  >
                    Reset
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: 'rgba(255, 107, 107, 0.15)', border: '1px solid rgba(255, 107, 107, 0.3)', color: '#ff6b6b' }}
                      onClick={() => {
                        resetAnalysis()
                        setProfile({ name: '', email: '', role: '', location: '', bio: '', skills: [], experience: '', avatarUrl: null, isComplete: false })
                        setCurrentSection('home')
                        setShowResetConfirm(false)
                      }}
                    >
                      Confirm Reset
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onClick={() => setShowResetConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
