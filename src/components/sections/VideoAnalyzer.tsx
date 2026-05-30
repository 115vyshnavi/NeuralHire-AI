'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Video, Play, FileVideo, Sparkles, Mic, Target, Heart,
  TrendingUp, Brain, UserPlus, AlertTriangle, RefreshCw, CheckCircle2,
  XCircle, Eye, Shield
} from 'lucide-react'
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

type UploadState = 'idle' | 'uploaded' | 'extracting' | 'validating' | 'analyzing' | 'rejected' | 'complete' | 'error'

// Extract frames from video using canvas
function extractVideoFrames(videoFile: File, numFrames: number = 3): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true

    const url = URL.createObjectURL(videoFile)
    video.src = url

    const frames: string[] = []
    let currentTime = 0

    video.onloadedmetadata = () => {
      const duration = video.duration

      if (!duration || duration < 1) {
        URL.revokeObjectURL(url)
        reject(new Error('Video is too short or corrupted. Please upload a video at least 1 second long.'))
        return
      }

      // Sample frames evenly across the video
      const interval = Math.min(duration / (numFrames + 1), 5) // Max 5s between frames
      currentTime = Math.min(interval, duration * 0.1) // Start at 10% or interval

      const captureFrame = () => {
        if (frames.length >= numFrames || currentTime >= duration) {
          URL.revokeObjectURL(url)
          if (frames.length === 0) {
            reject(new Error('Could not extract any frames from the video.'))
          } else {
            resolve(frames)
          }
          return
        }

        video.currentTime = currentTime
      }

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas')
          // Use a reasonable resolution for API
          const maxDim = 512
          const scale = Math.min(maxDim / video.videoWidth, maxDim / video.videoHeight, 1)
          canvas.width = Math.floor(video.videoWidth * scale)
          canvas.height = Math.floor(video.videoHeight * scale)

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            URL.revokeObjectURL(url)
            reject(new Error('Canvas not supported'))
            return
          }

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
          frames.push(dataUrl)

          currentTime += interval
          captureFrame()
        } catch {
          URL.revokeObjectURL(url)
          reject(new Error('Failed to capture video frame'))
        }
      }

      video.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load video. Please try a different format.'))
      }

      captureFrame()
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load video. Please make sure it\'s a valid video file.'))
    }
  })
}

export default function VideoAnalyzer() {
  const { profile, analysis, setAnalysis, hasProfile, setCurrentSection } = useUserStore()
  const [uploadState, setUploadState] = useState<UploadState>(
    analysis.videoUploaded ? 'complete' : 'idle'
  )
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [detectedContent, setDetectedContent] = useState('')
  const [extractedFrame, setExtractedFrame] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setVideoPreviewUrl(previewUrl)
      setUploadState('uploaded')
      setErrorMessage('')
      setDetectedContent('')
      setExtractedFrame(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setVideoPreviewUrl(previewUrl)
      setUploadState('uploaded')
      setErrorMessage('')
    }
  }, [])

  const handleReset = useCallback(() => {
    setSelectedFile(null)
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl)
    setVideoPreviewUrl(null)
    setUploadState('idle')
    setErrorMessage('')
    setDetectedContent('')
    setExtractedFrame(null)
    setProgress(0)
    setProgressLabel('')
  }, [videoPreviewUrl])

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return

    setUploadState('extracting')
    setProgress(10)
    setProgressLabel('Extracting video frames...')

    try {
      // Step 1: Extract frames from the video
      const frames = await extractVideoFrames(selectedFile, 3)

      if (frames.length === 0) {
        setErrorMessage('Could not extract frames from the video. The file may be corrupted or too short.')
        setUploadState('error')
        return
      }

      // Show first extracted frame as preview
      setExtractedFrame(frames[0])

      setUploadState('validating')
      setProgress(30)
      setProgressLabel('AI is validating video content...')

      // Step 2: Send frames to the validation + analysis API
      const res = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frames,
          profile: {
            name: profile.name,
            role: profile.role,
            skills: profile.skills,
            experience: profile.experience,
            bio: profile.bio,
          },
        }),
      })

      const result = await res.json()

      if (!result.success) {
        setProgress(100)

        if (result.errorType === 'INVALID_VIDEO') {
          setUploadState('rejected')
          setDetectedContent(result.detectedContent || 'Unknown content')
          setErrorMessage(result.error || 'This video does not appear to be a video resume.')
        } else {
          setUploadState('error')
          setErrorMessage(result.error || 'Analysis failed. Please try again.')
        }
        return
      }

      // Step 3: Analysis successful
      setUploadState('analyzing')
      setProgress(70)
      setProgressLabel('Generating intelligence report...')

      // Simulate final processing time for visual effect
      await new Promise((r) => setTimeout(r, 1500))
      setProgress(90)

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

      setProgress(100)
      setProgressLabel('Analysis complete!')

      setTimeout(() => setUploadState('complete'), 800)
    } catch (error) {
      console.error('Video analysis error:', error)
      setUploadState('error')
      setErrorMessage('Something went wrong while analyzing the video. Please try again.')
    }
  }, [selectedFile, profile, setAnalysis])

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

  const categoryScores = categoryMap
    .map((cat) => ({
      ...cat,
      score: (analysis as Record<string, unknown>)[cat.scoreKey] as number | null,
    }))
    .filter((cat) => cat.score !== null)

  const insights = analysis.personalityInsights || []

  // Progress steps for the analyzing state
  const progressSteps = [
    { label: 'Frame Extraction', threshold: 15 },
    { label: 'Video Validation', threshold: 35 },
    { label: 'AI Analysis', threshold: 70 },
    { label: 'Neural Scoring', threshold: 90 },
  ]

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
            Upload your video resume — our AI will verify it&apos;s a genuine presentation and provide an honest analysis
          </p>
        </motion.div>

        {/* Important notice */}
        <motion.div
          className="max-w-3xl mx-auto mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{
              background: 'rgba(0, 245, 255, 0.04)',
              border: '1px solid rgba(0, 245, 255, 0.12)',
            }}
          >
            <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#00f5ff' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: '#00f5ff' }}>AI-Validated Analysis</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Our AI will first verify your video is a genuine resume or professional presentation. Random videos, songs, or non-personal content will be rejected. Only real video resumes get analyzed.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {/* LEFT - Upload Zone / Video Player */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {/* IDLE - Upload Area */}
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
                      minHeight: '220px',
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
                    <div className="flex flex-col items-center justify-center p-6 sm:p-10 gap-5" style={{ minHeight: '220px' }}>
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
                          Supports MP4, MOV, WEBM — Max 500MB
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Video className="w-4 h-4 text-gray-500" />
                        <FileVideo className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-600">Video must show you presenting professionally</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* UPLOADED - Show preview with analyze button */}
              {uploadState === 'uploaded' && (
                <motion.div
                  key="uploaded"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassCard tiltEnabled={false}>
                    <div className="p-5 sm:p-6">
                      {/* Video Player */}
                      {videoPreviewUrl && (
                        <div className="rounded-xl overflow-hidden mb-5" style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
                          <video
                            ref={videoRef}
                            src={videoPreviewUrl}
                            controls
                            className="w-full max-h-[280px] object-contain"
                            style={{ display: 'block' }}
                          >
                            Your browser does not support video playback.
                          </video>
                        </div>
                      )}

                      {/* File Info */}
                      <div className="flex items-center gap-3 mb-5">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(0, 245, 255, 0.1)', border: '1px solid rgba(0, 245, 255, 0.2)' }}
                        >
                          <FileVideo className="w-5 h-5" style={{ color: '#00f5ff' }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-sm font-medium truncate">{selectedFile?.name || 'video_resume.mp4'}</p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB — ${selectedFile.type}` : 'Video uploaded'}
                          </p>
                        </div>
                      </div>

                      {/* Analyze Button */}
                      <motion.button
                        className="w-full py-3.5 rounded-xl font-semibold text-white cursor-pointer flex items-center justify-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                          boxShadow: '0 0 30px rgba(0, 245, 255, 0.3)',
                        }}
                        whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0, 245, 255, 0.5)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAnalyze}
                      >
                        <Eye className="w-5 h-5" />
                        Validate & Analyze Video
                      </motion.button>

                      <div className="flex items-center justify-center gap-4 mt-3">
                        <button
                          className="text-xs text-gray-500 underline hover:text-gray-300 transition-colors"
                          onClick={handleReset}
                        >
                          Choose different file
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* EXTRACTING / VALIDATING / ANALYZING - Progress */}
              {(uploadState === 'extracting' || uploadState === 'validating' || uploadState === 'analyzing') && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassCard tiltEnabled={false}>
                    <div className="p-5 sm:p-6">
                      {/* Video thumbnail or frame */}
                      <div className="rounded-xl overflow-hidden mb-5" style={{ background: 'rgba(0, 0, 0, 0.4)', minHeight: '140px' }}>
                        {extractedFrame ? (
                          <img
                            src={extractedFrame}
                            alt="Extracted frame"
                            className="w-full max-h-[180px] object-contain"
                          />
                        ) : videoPreviewUrl ? (
                          <video
                            src={videoPreviewUrl}
                            className="w-full max-h-[180px] object-contain"
                            muted
                          />
                        ) : (
                          <div className="flex items-center justify-center p-6" style={{ minHeight: '140px' }}>
                            <FileVideo className="w-10 h-10 text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Processing indicator */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {uploadState === 'validating' && (
                              <Shield className="w-4 h-4" style={{ color: '#00f5ff' }} />
                            )}
                            <motion.p
                              className="text-sm font-medium"
                              style={{ color: '#00f5ff' }}
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              {uploadState === 'extracting' && 'Extracting Frames...'}
                              {uploadState === 'validating' && 'AI Validating Video Content...'}
                              {uploadState === 'analyzing' && 'Generating Intelligence Report...'}
                            </motion.p>
                          </div>
                          <span className="text-sm text-gray-400 tabular-nums">{progress}%</span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: uploadState === 'validating'
                                ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                                : 'linear-gradient(90deg, #00f5ff, #8b5cf6)',
                              boxShadow: '0 0 12px rgba(0, 245, 255, 0.5)',
                            }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>

                        {/* Step indicators */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {progressSteps.map((step, i) => (
                            <div
                              key={step.label}
                              className="px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5"
                              style={{
                                background: progress >= step.threshold ? 'rgba(0, 245, 255, 0.12)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${progress >= step.threshold ? 'rgba(0, 245, 255, 0.25)' : 'rgba(255,255,255,0.06)'}`,
                                color: progress >= step.threshold ? '#00f5ff' : 'rgba(255,255,255,0.25)',
                              }}
                            >
                              {progress >= step.threshold ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <div className="w-3 h-3 rounded-full border border-current" />
                              )}
                              {step.label}
                            </div>
                          ))}
                        </div>

                        {/* Validation notice */}
                        {uploadState === 'validating' && (
                          <div
                            className="flex items-center gap-2 px-3 py-2 rounded-lg mt-2"
                            style={{ background: 'rgba(251, 191, 36, 0.06)', border: '1px solid rgba(251, 191, 36, 0.15)' }}
                          >
                            <Shield className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs text-amber-400/80">Verifying this is a genuine video resume...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* REJECTED - Video is not a resume */}
              {uploadState === 'rejected' && (
                <motion.div
                  key="rejected"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassCard tiltEnabled={false}>
                    <div className="p-5 sm:p-6">
                      {/* Error display */}
                      <div
                        className="rounded-xl p-5 mb-5"
                        style={{
                          background: 'rgba(255, 107, 107, 0.06)',
                          border: '1px solid rgba(255, 107, 107, 0.2)',
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <XCircle className="w-6 h-6 flex-shrink-0 text-red-400 mt-0.5" />
                          <div>
                            <h4 className="text-base font-semibold text-red-400 mb-1">Video Rejected</h4>
                            <p className="text-sm text-gray-300 leading-relaxed break-words">{errorMessage}</p>
                          </div>
                        </div>
                      </div>

                      {/* Detected content info */}
                      {detectedContent && (
                        <div
                          className="rounded-lg p-3 mb-5"
                          style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                        >
                          <p className="text-xs text-gray-500">AI detected: <span className="text-gray-300">{detectedContent}</span></p>
                        </div>
                      )}

                      {/* Tips */}
                      <div
                        className="rounded-xl p-4 mb-5"
                        style={{
                          background: 'rgba(0, 245, 255, 0.04)',
                          border: '1px solid rgba(0, 245, 255, 0.12)',
                        }}
                      >
                        <h5 className="text-sm font-medium mb-2" style={{ color: '#00f5ff' }}>Tips for a valid video resume:</h5>
                        <ul className="space-y-1.5">
                          {[
                            'Record yourself speaking directly to the camera',
                            'Introduce yourself and talk about your professional experience',
                            'Ensure good lighting and clear audio',
                            'Keep the video between 30 seconds and 5 minutes',
                            'Avoid uploading music videos, gameplay, or random content',
                          ].map((tip) => (
                            <li key={tip} className="text-xs text-gray-400 flex items-start gap-2">
                              <span style={{ color: '#00f5ff' }}>•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <motion.button
                        className="w-full py-3 rounded-xl font-semibold text-white cursor-pointer flex items-center justify-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                          boxShadow: '0 0 20px rgba(0, 245, 255, 0.2)',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReset}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Upload a Real Video Resume
                      </motion.button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* ERROR - Something went wrong */}
              {uploadState === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassCard tiltEnabled={false}>
                    <div className="p-5 sm:p-6">
                      <div
                        className="rounded-xl p-5 mb-5"
                        style={{
                          background: 'rgba(255, 107, 107, 0.06)',
                          border: '1px solid rgba(255, 107, 107, 0.15)',
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-6 h-6 flex-shrink-0 text-amber-400 mt-0.5" />
                          <div>
                            <h4 className="text-base font-semibold text-amber-400 mb-1">Analysis Error</h4>
                            <p className="text-sm text-gray-300 leading-relaxed break-words">{errorMessage}</p>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        className="w-full py-3 rounded-xl font-semibold text-white cursor-pointer flex items-center justify-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReset}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                      </motion.button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* COMPLETE - Show results */}
              {uploadState === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassCard tiltEnabled={false}>
                    <div className="p-5 sm:p-6">
                      {/* Video replay */}
                      {videoPreviewUrl && (
                        <div className="rounded-xl overflow-hidden mb-4" style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
                          <video
                            src={videoPreviewUrl}
                            controls
                            className="w-full max-h-[220px] object-contain"
                          />
                        </div>
                      )}

                      {/* Success indicator */}
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5" style={{ color: '#22c55e' }} />
                        <p className="text-sm font-medium" style={{ color: '#22c55e' }}>Video Validated & Analyzed</p>
                      </div>

                      <div className="w-full h-2 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #22c55e, #00f5ff)', width: '100%', boxShadow: '0 0 12px rgba(34, 197, 94, 0.4)' }} />
                      </div>

                      <p className="text-xs text-gray-400 mb-4">
                        AI confirmed this is a genuine video resume and analyzed {categoryScores.length} dimensions
                      </p>

                      {/* Strengths & Improvements */}
                      {analysis.personalitySummary && (
                        <div
                          className="rounded-xl p-4 mb-3"
                          style={{ background: 'rgba(0, 245, 255, 0.04)', border: '1px solid rgba(0, 245, 255, 0.1)' }}
                        >
                          <p className="text-xs text-gray-300 leading-relaxed break-words">{analysis.personalitySummary}</p>
                        </div>
                      )}

                      <button
                        className="w-full text-center text-xs text-gray-500 mt-1 underline hover:text-gray-300 transition-colors"
                        onClick={handleReset}
                      >
                        Analyze a different video
                      </button>
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
                    <span className="text-xs text-gray-600 uppercase tracking-wider">Upload a video to start</span>
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
                        <span className="text-[10px] sm:text-xs text-gray-400 w-16 sm:w-28 lg:w-32 flex-shrink-0 truncate">{cat.name}</span>
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
