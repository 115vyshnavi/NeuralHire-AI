'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Video, Play, FileVideo, Mic, Sparkles, Brain, Heart, Target, TrendingUp } from 'lucide-react';
import AnimatedScore from '@/components/shared/AnimatedScore';
import GlassCard from '@/components/shared/GlassCard';

const categoryScores = [
  { name: 'Speech Clarity', score: 94, icon: Mic },
  { name: 'Confidence', score: 88, icon: Target },
  { name: 'Communication', score: 91, icon: Sparkles },
  { name: 'Enthusiasm', score: 85, icon: Heart },
  { name: 'Leadership', score: 79, icon: TrendingUp },
  { name: 'Eye Contact', score: 90, icon: Brain },
  { name: 'Emotional Consistency', score: 86, icon: Heart },
  { name: 'Adaptability', score: 82, icon: Sparkles },
];

const personalityInsights = [
  {
    title: 'Natural Communicator',
    description: 'Demonstrates exceptional verbal clarity and structured thinking',
    icon: Mic,
  },
  {
    title: 'Confident Leader',
    description: 'Shows strong leadership indicators with decisive communication patterns',
    icon: Target,
  },
  {
    title: 'Emotionally Balanced',
    description: 'Maintains emotional consistency with high adaptability under pressure',
    icon: Heart,
  },
  {
    title: 'Growth Mindset',
    description: 'Exhibits curiosity and openness to learning and development',
    icon: TrendingUp,
  },
];

function getBarGradient(score: number): string {
  const ratio = score / 100;
  const r = Math.round(0 + ratio * 139);
  const g = Math.round(245 - ratio * 186);
  const b = Math.round(255 - ratio * 9);
  return `linear-gradient(90deg, #00f5ff, rgb(${r}, ${g}, ${b}))`;
}

export default function VideoAnalyzer() {
  const [uploadState, setUploadState] = useState<'idle' | 'uploaded' | 'analyzing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);

  const handleUploadClick = () => {
    setUploadState('uploaded');
  };

  const handleAnalyze = () => {
    setUploadState('analyzing');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadState('complete'), 300);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(180deg, #0a0a1a, #16213e, #0a0a1a)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
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
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Upload a video resume and let our neural engine decode human potential
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* LEFT SIDE - Upload Zone (60%) */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              {uploadState === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="relative rounded-2xl cursor-pointer overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.03), rgba(255, 255, 255, 0.02), rgba(139, 92, 246, 0.02))',
                      backdropFilter: 'blur(20px)',
                      border: '2px dashed rgba(0, 245, 255, 0.3)',
                      minHeight: '380px',
                    }}
                    whileHover={{
                      scale: 1.01,
                      borderColor: 'rgba(0, 245, 255, 0.7)',
                      boxShadow: '0 0 40px rgba(0, 245, 255, 0.15), inset 0 0 40px rgba(0, 245, 255, 0.03)',
                    }}
                    onClick={handleUploadClick}
                  >
                    {/* Animated border glow */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        border: '2px dashed rgba(0, 245, 255, 0.15)',
                      }}
                      animate={{
                        borderColor: [
                          'rgba(0, 245, 255, 0.15)',
                          'rgba(0, 245, 255, 0.4)',
                          'rgba(0, 245, 255, 0.15)',
                        ],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <div className="flex flex-col items-center justify-center p-10 gap-5" style={{ minHeight: '380px' }}>
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
                        <p className="text-white text-lg font-medium mb-2">
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
                  transition={{ duration: 0.4 }}
                >
                  <GlassCard className="p-6">
                    <div className="rounded-xl overflow-hidden mb-5" style={{ background: 'rgba(0, 0, 0, 0.4)', minHeight: '220px' }}>
                      <div className="flex flex-col items-center justify-center p-8 gap-4" style={{ minHeight: '220px' }}>
                        {/* Simulated video player */}
                        <div className="relative">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
                            style={{
                              background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(139, 92, 246, 0.2))',
                              border: '2px solid rgba(0, 245, 255, 0.4)',
                              boxShadow: '0 0 20px rgba(0, 245, 255, 0.2)',
                            }}
                          >
                            <Play className="w-7 h-7 text-white ml-1" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-white text-sm font-medium">candidate_video_resume.mp4</p>
                          <p className="text-gray-500 text-xs mt-1">24.3 MB • 2:34 duration</p>
                        </div>
                        {/* Progress bar for video */}
                        <div className="w-full max-w-xs h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                          <div className="h-full w-0 rounded-full" style={{ background: 'linear-gradient(90deg, #00f5ff, #8b5cf6)' }} />
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
                        Analyze with Neural Engine
                      </span>
                    </motion.button>
                  </GlassCard>
                </motion.div>
              )}

              {(uploadState === 'analyzing' || uploadState === 'complete') && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <GlassCard className="p-6">
                    <div className="rounded-xl overflow-hidden mb-5" style={{ background: 'rgba(0, 0, 0, 0.4)', minHeight: '180px' }}>
                      <div className="flex flex-col items-center justify-center p-6 gap-3" style={{ minHeight: '180px' }}>
                        <div className="relative">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(139, 92, 246, 0.2))',
                              border: '2px solid rgba(0, 245, 255, 0.4)',
                              boxShadow: '0 0 20px rgba(0, 245, 255, 0.2)',
                            }}
                          >
                            <Play className="w-7 h-7 text-white ml-1" />
                          </div>
                        </div>
                        <p className="text-white text-sm font-medium">candidate_video_resume.mp4</p>
                      </div>
                    </div>

                    {/* Analysis Progress */}
                    {uploadState === 'analyzing' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                      >
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
                            style={{
                              background: 'linear-gradient(90deg, #00f5ff, #8b5cf6)',
                              boxShadow: '0 0 12px rgba(0, 245, 255, 0.5)',
                              width: `${progress}%`,
                            }}
                            transition={{ duration: 0.1 }}
                          />
                        </div>
                        <div className="flex gap-2 mt-3">
                          {['Audio Analysis', 'Visual Cues', 'Emotional Mapping', 'Neural Scoring'].map((step, i) => (
                            <motion.div
                              key={step}
                              className="px-3 py-1.5 rounded-lg text-xs"
                              style={{
                                background: progress > i * 25 ? 'rgba(0, 245, 255, 0.15)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${progress > i * 25 ? 'rgba(0, 245, 255, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                                color: progress > i * 25 ? '#00f5ff' : 'rgba(255,255,255,0.3)',
                              }}
                              animate={progress > i * 25 ? { scale: [1, 1.05, 1] } : {}}
                              transition={{ duration: 0.3 }}
                            >
                              {step}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {uploadState === 'complete' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: '#00f5ff', boxShadow: '0 0 8px rgba(0, 245, 255, 0.5)' }} />
                          <p className="text-sm font-medium" style={{ color: '#00f5ff' }}>
                            Analysis Complete
                          </p>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              background: 'linear-gradient(90deg, #00f5ff, #8b5cf6)',
                              width: '100%',
                              boxShadow: '0 0 12px rgba(0, 245, 255, 0.5)',
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Neural engine processed 8 cognitive and behavioral dimensions
                        </p>
                      </motion.div>
                    )}
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT SIDE - AI Intelligence Report (40%) */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Overall Score */}
            <GlassCard className="p-6">
              <div className="text-center mb-2">
                <h3
                  className="text-sm font-semibold tracking-wider uppercase mb-5"
                  style={{ color: 'rgba(0, 245, 255, 0.7)' }}
                >
                  AI Intelligence Report
                </h3>
                {uploadState === 'complete' ? (
                  <AnimatedScore value={92} label="Overall Score" size="lg" color="#00f5ff" />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <div
                      className="w-[130px] h-[130px] rounded-full flex items-center justify-center"
                      style={{
                        border: '2px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                      }}
                    >
                      <span className="text-3xl text-gray-600">--</span>
                    </div>
                    <span className="text-xs text-gray-600 uppercase tracking-wider">Awaiting Analysis</span>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Category Scores */}
            <GlassCard className="p-6">
              <h4 className="text-xs font-semibold tracking-wider uppercase mb-4" style={{ color: 'rgba(139, 92, 246, 0.7)' }}>
                Category Breakdown
              </h4>
              <div className="space-y-3">
                {categoryScores.map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={uploadState === 'complete' ? { opacity: 1, x: 0 } : { opacity: 0.4, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: uploadState === 'complete' ? i * 0.08 : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <cat.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: uploadState === 'complete' ? '#00f5ff' : '#444' }} />
                    <span className="text-xs text-gray-400 w-32 flex-shrink-0 truncate">{cat.name}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: getBarGradient(cat.score) }}
                        initial={{ width: 0 }}
                        animate={uploadState === 'complete' ? { width: `${cat.score}%` } : { width: '0%' }}
                        transition={{
                          duration: 0.8,
                          delay: uploadState === 'complete' ? i * 0.08 + 0.3 : 0,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-medium w-8 text-right tabular-nums"
                      style={{ color: uploadState === 'complete' ? '#00f5ff' : '#555' }}
                    >
                      {uploadState === 'complete' ? cat.score : '--'}
                    </span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Personality Insights */}
            <GlassCard className="p-6" glowColor="#8b5cf6">
              <h4 className="text-xs font-semibold tracking-wider uppercase mb-4" style={{ color: 'rgba(139, 92, 246, 0.7)' }}>
                Personality Insights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {personalityInsights.map((insight, i) => (
                  <motion.div
                    key={insight.title}
                    className="relative rounded-xl p-3"
                    style={{
                      background: 'rgba(139, 92, 246, 0.05)',
                      border: '1px solid rgba(139, 92, 246, 0.12)',
                    }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={uploadState === 'complete' ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: uploadState === 'complete' ? i * 0.1 + 0.8 : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {/* Animated border accent */}
                    <motion.div
                      className="absolute top-0 left-0 h-full w-0.5 rounded-full"
                      style={{ background: 'linear-gradient(180deg, #8b5cf6, #00f5ff)' }}
                      animate={uploadState === 'complete' ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.2 }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                    <div className="flex items-start gap-2.5">
                      <div
                        className="p-1.5 rounded-lg flex-shrink-0"
                        style={{
                          background: 'rgba(139, 92, 246, 0.1)',
                          border: '1px solid rgba(139, 92, 246, 0.15)',
                        }}
                      >
                        <insight.icon className="w-3.5 h-3.5" style={{ color: '#8b5cf6' }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{insight.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* CSS Keyframes */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          50% { background-position: 200% center; }
          100% { background-position: 0% center; }
        }
      `}</style>
    </section>
  );
}
