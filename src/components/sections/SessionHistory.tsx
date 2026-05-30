'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Trash2, Play, User, BarChart3, Clock, AlertCircle } from 'lucide-react'
import GlassCard from '@/components/shared/GlassCard'
import MagneticButton from '@/components/shared/MagneticButton'
import { useUserStore, SessionRecord } from '@/lib/user-store'

export default function SessionHistory() {
  const { sessions, loadSession, deleteSession, setCurrentSection } = useUserStore()

  const handleLoadSession = (session: SessionRecord) => {
    loadSession(session.id)
  }

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Delete this session from history?')) {
      deleteSession(id)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return '#6b7280'
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#00f5ff'
    if (score >= 40) return '#fbbf24'
    return '#ff6b6b'
  }

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <History className="w-8 h-8" style={{ color: '#8b5cf6' }} />
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #00f5ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Session History
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            Your past analysis sessions are saved here. Load any session to review results or start a fresh session anytime.
          </p>
        </motion.div>

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard tiltEnabled={false}>
              <div className="p-8 sm:p-12 text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(139, 92, 246, 0.08)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <AlertCircle className="w-8 h-8" style={{ color: '#8b5cf6' }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No History Yet</h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">
                  When you start a new session, your current analysis gets saved here automatically. Complete a profile and analysis first.
                </p>
                <MagneticButton variant="cyan" onClick={() => setCurrentSection('profile')}>
                  Start First Session
                </MagneticButton>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500">
                {sessions.length} session{sessions.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            <AnimatePresence>
              {sessions.slice().reverse().map((session, i) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <GlassCard tiltEnabled={false}>
                    <div
                      className="p-4 sm:p-5 cursor-pointer hover:border-opacity-30 transition-all duration-300"
                      onClick={() => handleLoadSession(session)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Score Circle */}
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `${getScoreColor(session.overallScore)}10`,
                            border: `1px solid ${getScoreColor(session.overallScore)}30`,
                          }}
                        >
                          <div className="text-center">
                            <span className="text-lg font-bold" style={{ color: getScoreColor(session.overallScore) }}>
                              {session.overallScore ?? '--'}
                            </span>
                            {session.overallScore && (
                              <span className="text-[10px] text-gray-500 block -mt-1">/100</span>
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-white truncate">{session.profileName}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <BarChart3 className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                            <span className="text-xs text-gray-400 truncate">{session.profileRole}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-600 flex-shrink-0" />
                            <span className="text-[11px] text-gray-500">{formatDate(session.date)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <motion.button
                            className="p-2 rounded-lg"
                            onClick={(e) => { e.stopPropagation(); handleLoadSession(session) }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Load session"
                            style={{
                              background: 'rgba(0, 245, 255, 0.1)',
                              border: '1px solid rgba(0, 245, 255, 0.2)',
                            }}
                          >
                            <Play className="w-4 h-4" style={{ color: '#00f5ff' }} />
                          </motion.button>
                          <motion.button
                            className="p-2 rounded-lg"
                            onClick={(e) => handleDeleteSession(session.id, e)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete session"
                            style={{
                              background: 'rgba(255, 107, 107, 0.08)',
                              border: '1px solid rgba(255, 107, 107, 0.15)',
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}
