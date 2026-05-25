'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Video, Play, FileVideo, Sparkles, Mic, Target, Heart, TrendingUp, Brain, UserPlus } from 'lucide-react'
import AnimatedScore from '@/components/shared/AnimatedScore'
import GlassCard from '@/components/shared/GlassCard'
import MagneticButton from '@/components/shared/MagneticButton'
import { useUserStore } from '@/lib/user-store'

function getBarGradient(score: number): string {
  const ratio = score / 100
  const r = Math.round(0 + ratio * 139)
  const g = Math.round(245 - ratio * 186)
  const b = Math.round(255 - ratio * 9)
  return `linear-gradient(90deg, #00f5ff, rgb(${r}, ${g}, ${b}))`
}

interface CategoryScore {
  key: string
  name: string
  icon: React.ElementType
  scoreKey: string
}

const categoryMap: CategoryScore[] = [
  { key: 'speechClarity', name: 'Speech Clarity', icon: Mic, scoreKey: 'speechClarity' },
  { key: 'confidence', name: 'Confidence', icon: Target, scoreKey: 'confidence' },
  { key: 'communication', name: 'Communication', icon: Sparkles, scoreKey: 'communication' },
  { key: 'enthusiasm', name: 'Enthusiasm', icon: Heart, scoreKey: 'enthusiasm' },
  { key: 'leadership', name: 'Leadership', icon: TrendingUp, scoreKey: 'leadership' },
  { key: 'eyeContact', name: 'Eye Contact', icon: Brain, scoreKey: 'eyeContact' },
  { key: 'emotionalConsistency', name: 'Emotional Consistency', icon: Heart, scoreKey: 'emotionalConsistency' },
  { key: 'adaptability', name: 'Adaptability', icon: Sparkles, scoreKey: 'adaptability' },
]

export default function VideoAnalyzer() {
  const { profile, analysis, setAnalysis, hasProfile, setCurrentSection } = useUserStore()
  const [uploadState, setUploadState] = useState<'idle' | 'uploaded' | 'analyzing' | 'complete'>(
    analysis.videoUploaded ? 'complete' : 'idle'
  )
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // If no profile, show guidance
  if (!hasProfile()) {
    return (
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
            <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(0, 245, 255, 0.08)',
                  border: '1px solid rgba(0, 245, 255, 0.2)',
                }}
              >
                <UserPlus className="w-8 h-8" style={{ color: '#00f5ff' }} />
              </div>
              <h3 className="text-xl font-bold text-white">Create Your Profile First</h3>
              <p className="text-gray-400 text-sm max-w-sm">
                You need to create your neural profile before we can analyze your video resume.
              </p>
              <MagneticButton variant="cyan" onClick={() => setCurrentSection('profile')}>
                Create Profile
              </MagneticButton>
            </div>
          </GlassCard>
        </div>
      </section>
    )
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadState('uploaded')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file)
      setUploadState('uploaded')
    }
  }

  const handleAnalyze = async () => {
    setUploadState('analyzing')
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 3
      })
    }, 80)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'video-analysis',
          data: { profile: { name: profile.name, role: profile.role, skills: profile.skills, experience: profile.experience, bio: profile.bio } },
        }),
      })
      const result = await res.json()

      clearInterval(interval)
      setProgress(100)

      if (result.success && result.analysis) {
        const a = result.analysis
        setAnalysis({
          overallScore: a.overallScore,
          speechClarity: a.speechClarity,
          confidence: a.confidence,
          communication: a.communication,
          enthusiasm: a.enthusiasm,
          leadership: a.leadership,
          eyeContact: a.eyeContact,
          emotionalConsistency: a.emotionalConsistency,
          adaptability: a.adaptability,
          personalityInsights: a.personalityInsights,
          personalitySummary: a.personalitySummary,
          communicationStyle: a.communicationStyle,
          primaryTrait: a.primaryTrait,
          videoUploaded: true,
        })
      }

      setTimeout(() => setUploadState('complete'), 500)
    } catch {
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => setUploadState('complete'), 500)
    }
  }

  const categoryScores = categoryMap
    .map((cat) => ({
      ...cat,
      score: (analysis as Record<string, unknown>)[cat.scoreKey] as number | null,
    }))
    .filter((cat) => cat.score !== null)

  const insights = analysis.personalityInsights || []

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #00f5ff, #8b5cf6, #00f5ff)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 4s ease infinite',
            }}
          >
            AI Video Resume Analyzer
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Upload a video resume and let our neural engine decode human potential
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {/* LEFT - Upload Zone */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {uploadState === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <motion.div
                    className="relative rounded-2xl cursor-pointer overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.03), rgba(255, 255, 255, 0.02), rgba(139, 92, 246, 0.02))',
                      backdropFilter: 'blur(20px)',
                      border: '2px dashed rgba(0, 245, 255, 0.3)',
                      minHeight: '300px',
                    }}
                    whileHover={{
                      borderColor: 'rgba(0, 245, 255, 0.7)',
                      boxShadow: '0 0 40px rgba(0, 245, 255, 0.15)',
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ border: '2px dashed rgba(0, 245, 255, 0.15)' }}
                      animate={{ borderColor: ['rgba(0, 245, 255, 0.15)', 'rgba(0, 245, 255, 0.4)', 'rgba(0, 245, 255, 0.15)'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div className="flex flex-col items-center justify-center p-8 sm:p-10 gap-5" style={{ minHeight: '300px' }}>
                      <motion.div
                        className="p-5 rounded-2xl"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(139, 92, 246, 0.1))',
                          border: '1px solid rgba(0, 245, 255, 0.15)',
                        }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <Upload className="w-10 h-10" style={{ color: '#00f5ff' }} />
                      </motion.div>
                      <div className="text-center">
                        <p className="text-white text-base sm:text-lg font-medium mb-2">
                          Drop your video resume here or click to upload
                        </p>
                        <p className="text-gray-500 text-sm">
                          Supports MP4, MOV, WEBM up to 500MB
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Video className="w-4 h-4 text-gray-500" />
                        <FileVideo className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-600">Video formats accepted</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {uploadState === 'uploaded' && (
                <motion.div
                  key="uploaded"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassCard tiltEnabled={false}>
                    <div className="p-5 sm:p-6">
                      <div className="rounded-xl overflow-hidden mb-5" style={{ background: 'rgba(0, 0, 0, 0.4)', minHeight: '180px' }}>
                        <div className="flex flex-col items-center justify-center p-6 gap-4" style={{ minHeight: '180px' }}>
                          <div className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
                            style={{
                              background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(139, 92, 246, 0.2))',
                              border: '2px solid rgba(0, 245, 255, 0.4)',
                              boxShadow: '0 0 20px rgba(0, 245, 255, 0.2)',
                            }}
                          >
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                          <div className="text-center">
                            <p className="text-white text-sm font-medium truncate max-w-[250px]">{selectedFile?.name || 'video_resume.mp4'}</p>
                            <p className="text-gray-500 text-xs mt-1">{selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : 'Video uploaded'}</p>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        className="w-full py-3 rounded-xl font-semibold text-white cursor-pointer"
                        style={{
                          background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                          boxShadow: '0 0 30px rgba(0, 245, 255, 0.3)',
                        }}
                        whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0, 245, 255, 0.5)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAnalyze}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Start Analysis
                        </span>
                      </motion.button>

                      <p className="text-center text-xs text-gray-600 mt-3">
                        Click to start or select a different file
                      </p>
                      <button
                        className="w-full text-center text-xs text-gray-500 mt-1 underline"
                        onClick={() => {
                          setSelectedFile(null)
                          setUploadState('idle')
                        }}
                      >
                        Choose a different file
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {(uploadState === 'analyzing' || uploadState === 'complete') && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassCard tiltEnabled={false}>
                    <div className="p-5 sm:p-6">
                      <div className="rounded-xl overflow-hidden mb-5" style={{ background: 'rgba(0, 0, 0, 0.4)', minHeight: '140px' }}>
                        <div className="flex flex-col items-center justify-center p-6 gap-3" style={{ minHeight: '140px' }}>
                          <div className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(139, 92, 246, 0.2))',
                              border: '2px solid rgba(0, 245, 255, 0.4)',
                            }}
                          >
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                          <p className="text-white text-sm font-medium truncate max-w-[250px]">{selectedFile?.name || 'video_resume.mp4'}</p>
                        </div>
                      </div>

                      {uploadState === 'analyzing' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <motion.p
                              className="text-sm font-medium"
                              style={{ color: '#00f5ff' }}
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              Neural Engine Processing...
                            </motion.p>
                            <span className="text-sm text-gray-400">{progress}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: 'linear-gradient(90deg, #00f5ff, #8b5cf6)', boxShadow: '0 0 12px rgba(0, 245, 255, 0.5)', width: `${progress}%` }}
                              transition={{ duration: 0.1 }}
                            />
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {['Audio Analysis', 'Visual Cues', 'Emotional Mapping', 'Neural Scoring'].map((step, i) => (
                              <motion.div
                                key={step}
                                className="px-2.5 py-1 rounded-lg text-xs"
                                style={{
                                  background: progress > i * 25 ? 'rgba(0, 245, 255, 0.15)' : 'rgba(255,255,255,0.05)',
                                  border: `1px solid ${progress > i * 25 ? 'rgba(0, 245, 255, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                                  color: progress > i * 25 ? '#00f5ff' : 'rgba(255,255,255,0.3)',
                                }}
                              >
                                {step}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {uploadState === 'complete' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: '#00f5ff', boxShadow: '0 0 8px rgba(0, 245, 255, 0.5)' }} />
                            <p className="text-sm font-medium" style={{ color: '#00f5ff' }}>Analysis Complete</p>
                          </div>
                          <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #00f5ff, #8b5cf6)', width: '100%', boxShadow: '0 0 12px rgba(0, 245, 255, 0.5)' }} />
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Neural engine processed {categoryScores.length} cognitive and behavioral dimensions
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT - AI Intelligence Report */}
          <motion.div
            className="lg:col-span-2 space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Overall Score */}
            <GlassCard tiltEnabled={false}>
              <div className="p-5 sm:p-6 text-center">
                <h3 className="text-xs font-semibold tracking-wider uppercase mb-5" style={{ color: 'rgba(0, 245, 255, 0.7)' }}>
                  AI Intelligence Report
                </h3>
                {analysis.overallScore !== null ? (
                  <AnimatedScore value={analysis.overallScore} label="Overall Score" size="lg" color="#00f5ff" />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <div
                      className="w-[130px] h-[130px] rounded-full flex items-center justify-center"
                      style={{ border: '2px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                    >
                      <span className="text-3xl text-gray-600">--</span>
                    </div>
                    <span className="text-xs text-gray-600 uppercase tracking-wider">Awaiting Analysis</span>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Category Scores */}
            <GlassCard tiltEnabled={false}>
              <div className="p-5 sm:p-6">
                <h4 className="text-xs font-semibold tracking-wider uppercase mb-4" style={{ color: 'rgba(139, 92, 246, 0.7)' }}>
                  Category Breakdown
                </h4>
                {categoryScores.length > 0 ? (
                  <div className="space-y-3">
                    {categoryScores.map((cat, i) => (
                      <motion.div
                        key={cat.key}
                        className="flex items-center gap-2 sm:gap-3 min-w-0"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                      >
                        <cat.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#00f5ff' }} />
                        <span className="text-xs text-gray-400 w-24 sm:w-32 flex-shrink-0 truncate">{cat.name}</span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden min-w-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: getBarGradient(cat.score!) }}
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.score}%` }}
                            transition={{ duration: 0.8, delay: i * 0.08 + 0.3 }}
                          />
                        </div>
                        <span className="text-xs font-medium w-8 text-right tabular-nums flex-shrink-0" style={{ color: '#00f5ff' }}>
                          {cat.score}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-gray-600">Upload and analyze a video to see scores</p>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Personality Insights */}
            {insights.length > 0 && (
              <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
                <div className="p-5 sm:p-6">
                  <h4 className="text-xs font-semibold tracking-wider uppercase mb-4" style={{ color: 'rgba(139, 92, 246, 0.7)' }}>
                    Personality Insights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    {insights.map((insight, i) => (
                      <motion.div
                        key={insight.title}
                        className="relative rounded-xl p-3 overflow-hidden"
                        style={{
                          background: 'rgba(139, 92, 246, 0.05)',
                          border: '1px solid rgba(139, 92, 246, 0.12)',
                        }}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 + 0.8 }}
                      >
                        <motion.div
                          className="absolute top-0 left-0 h-full w-0.5 rounded-full"
                          style={{ background: 'linear-gradient(180deg, #8b5cf6, #00f5ff)' }}
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        />
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div
                            className="p-1.5 rounded-lg flex-shrink-0"
                            style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.15)' }}
                          >
                            <Sparkles className="w-3.5 h-3.5" style={{ color: '#8b5cf6' }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{insight.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed break-words">{insight.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          50% { background-position: 200% center; }
          100% { background-position: 0% center; }
        }
      `}</style>
    </section>
  )
}
