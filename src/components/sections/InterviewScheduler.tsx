'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, Video, Monitor, Users, CheckCircle2,
  Plus, Trash2, ArrowRight, Zap, Sparkles, Briefcase, X
} from 'lucide-react'
import GlassCard from '@/components/shared/GlassCard'
import MagneticButton from '@/components/shared/MagneticButton'
import { useUserStore } from '@/lib/user-store'

// ─── Types ──────────────────────────────────────────────────────

interface ScheduledInterview {
  id: string
  date: string
  timeSlot: string
  interviewType: string
  duration: string
  confirmedAt: string
}

type SchedulerPhase = 'select' | 'confirm' | 'list'

// ─── Constants ──────────────────────────────────────────────────

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', range: '9:00 AM – 12:00 PM', icon: '🌅', color: '#f59e0b' },
  { id: 'afternoon', label: 'Afternoon', range: '1:00 PM – 5:00 PM', icon: '☀️', color: '#06b6d4' },
  { id: 'evening', label: 'Evening', range: '5:00 PM – 8:00 PM', icon: '🌙', color: '#8b5cf6' },
]

const INTERVIEW_TYPES = [
  { id: 'ai-video', label: 'AI Video Interview', description: 'AI-powered video analysis', icon: Video, color: '#00f5ff' },
  { id: 'technical', label: 'Technical Round', description: 'Domain-specific technical assessment', icon: Monitor, color: '#8b5cf6' },
  { id: 'hr', label: 'HR Round', description: 'Culture fit & behavioral assessment', icon: Users, color: '#06b6d4' },
]

const DURATIONS = [
  { id: '30', label: '30 min', sublabel: 'Quick screening' },
  { id: '45', label: '45 min', sublabel: 'Standard session' },
  { id: '60', label: '60 min', sublabel: 'Deep dive' },
]

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// ─── Helper ─────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function formatDate(year: number, month: number, day: number): string {
  return `${MONTHS[month]} ${day}, ${year}`
}

// ─── Component ──────────────────────────────────────────────────

export default function InterviewScheduler() {
  const { hasProfile, setCurrentSection } = useUserStore()

  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null)
  const [phase, setPhase] = useState<SchedulerPhase>('select')
  const [scheduledInterviews, setScheduledInterviews] = useState<ScheduledInterview[]>([])
  const [showConfirmAnimation, setShowConfirmAnimation] = useState(false)

  const daysInMonth = useMemo(() => getDaysInMonth(selectedYear, selectedMonth), [selectedYear, selectedMonth])
  const firstDay = useMemo(() => getFirstDayOfMonth(selectedYear, selectedMonth), [selectedYear, selectedMonth])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isDatePast = (day: number) => {
    const d = new Date(selectedYear, selectedMonth, day)
    return d < today
  }

  const isFormComplete = selectedDay !== null && selectedTimeSlot !== null && selectedType !== null && selectedDuration !== null

  // No profile guard
  if (!hasProfile()) {
    return (
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
            <div className="p-8 sm:p-12 flex flex-col items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)' }}
              >
                <Calendar className="w-8 h-8" style={{ color: '#8b5cf6' }} />
              </div>
              <h3 className="text-xl font-bold text-white">Create Profile First</h3>
              <p className="text-gray-400 text-sm">You need a neural profile before scheduling interviews.</p>
              <MagneticButton variant="violet" onClick={() => setCurrentSection('profile')}>
                Create Profile
              </MagneticButton>
            </div>
          </GlassCard>
        </div>
      </section>
    )
  }

  const handleConfirm = () => {
    if (!isFormComplete) return

    const interview: ScheduledInterview = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date: formatDate(selectedYear, selectedMonth, selectedDay!),
      timeSlot: TIME_SLOTS.find(t => t.id === selectedTimeSlot)?.label || '',
      interviewType: INTERVIEW_TYPES.find(t => t.id === selectedType)?.label || '',
      duration: DURATIONS.find(d => d.id === selectedDuration)?.label || '',
      confirmedAt: new Date().toISOString(),
    }

    setShowConfirmAnimation(true)
    setTimeout(() => {
      setScheduledInterviews(prev => [...prev, interview])
      setShowConfirmAnimation(false)
      setPhase('list')
      // Reset form
      setSelectedDay(null)
      setSelectedTimeSlot(null)
      setSelectedType(null)
      setSelectedDuration(null)
    }, 1500)
  }

  const handleDelete = (id: string) => {
    setScheduledInterviews(prev => prev.filter(i => i.id !== id))
  }

  // ─── Calendar Grid ───────────────────────────────────────────

  const renderCalendar = () => {
    const dayCells = []
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      dayCells.push(<div key={`empty-${i}`} className="w-full aspect-square" />)
    }
    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const isPast = isDatePast(day)
      const isSelected = selectedDay === day
      const isToday =
        selectedYear === today.getFullYear() &&
        selectedMonth === today.getMonth() &&
        day === today.getDate()

      dayCells.push(
        <motion.button
          key={day}
          disabled={isPast}
          onClick={() => !isPast && setSelectedDay(day)}
          className="relative w-full aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200 min-h-[40px]"
          style={{
            background: isSelected
              ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(139, 92, 246, 0.15))'
              : isToday
                ? 'rgba(0, 245, 255, 0.06)'
                : 'rgba(255, 255, 255, 0.02)',
            border: `1px solid ${
              isSelected
                ? 'rgba(0, 245, 255, 0.5)'
                : isToday
                  ? 'rgba(0, 245, 255, 0.2)'
                  : 'rgba(255, 255, 255, 0.06)'
            }`,
            color: isPast
              ? 'rgba(255,255,255,0.15)'
              : isSelected
                ? '#00f5ff'
                : isToday
                  ? '#00f5ff'
                  : '#c0c0c8',
            boxShadow: isSelected ? '0 0 16px rgba(0, 245, 255, 0.25)' : 'none',
            cursor: isPast ? 'not-allowed' : 'pointer',
          }}
          whileHover={!isPast ? { scale: 1.08 } : {}}
          whileTap={!isPast ? { scale: 0.95 } : {}}
        >
          {day}
          {isToday && !isSelected && (
            <div
              className="absolute bottom-1 w-1 h-1 rounded-full"
              style={{ background: '#00f5ff', boxShadow: '0 0 6px rgba(0, 245, 255, 0.5)' }}
            />
          )}
        </motion.button>
      )
    }
    return dayCells
  }

  // ─── Selection Phase ─────────────────────────────────────────

  const renderSelectPhase = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="p-2.5 rounded-xl"
                style={{ background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.12), rgba(139, 92, 246, 0.08))', border: '1px solid rgba(0, 245, 255, 0.2)' }}
              >
                <Calendar className="w-5 h-5" style={{ color: '#00f5ff' }} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Select Date</h3>
                <p className="text-xs text-gray-400">Choose your interview date</p>
              </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  if (selectedMonth === 0) {
                    setSelectedMonth(11)
                    setSelectedYear(y => y - 1)
                  } else {
                    setSelectedMonth(m => m - 1)
                  }
                  setSelectedDay(null)
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                ←
              </button>
              <span className="text-sm font-semibold text-white">
                {MONTHS[selectedMonth]} {selectedYear}
              </span>
              <button
                onClick={() => {
                  if (selectedMonth === 11) {
                    setSelectedMonth(0)
                    setSelectedYear(y => y + 1)
                  } else {
                    setSelectedMonth(m => m + 1)
                  }
                  setSelectedDay(null)
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                →
              </button>
            </div>

            {/* Day of week headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-center text-[10px] font-medium text-gray-500 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Options Panel */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="space-y-4">
          {/* Time Slot */}
          <GlassCard glowColor="#06b6d4" tiltEnabled={false}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4" style={{ color: '#06b6d4' }} />
                <span className="text-sm font-semibold text-white">Time Slot</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map(slot => {
                  const isSelected = selectedTimeSlot === slot.id
                  return (
                    <motion.button
                      key={slot.id}
                      onClick={() => setSelectedTimeSlot(slot.id)}
                      className="p-3 rounded-xl text-center transition-all duration-200"
                      style={{
                        background: isSelected ? `${slot.color}15` : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isSelected ? `${slot.color}40` : 'rgba(255,255,255,0.06)'}`,
                        boxShadow: isSelected ? `0 0 12px ${slot.color}20` : 'none',
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="text-lg mb-1">{slot.icon}</div>
                      <div className="text-xs font-medium" style={{ color: isSelected ? slot.color : '#c0c0c8' }}>
                        {slot.label}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{slot.range}</div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </GlassCard>

          {/* Interview Type */}
          <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                <span className="text-sm font-semibold text-white">Interview Type</span>
              </div>
              <div className="space-y-2">
                {INTERVIEW_TYPES.map(it => {
                  const IconComp = it.icon
                  const isSelected = selectedType === it.id
                  return (
                    <motion.button
                      key={it.id}
                      onClick={() => setSelectedType(it.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200"
                      style={{
                        background: isSelected ? `${it.color}10` : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isSelected ? `${it.color}35` : 'rgba(255,255,255,0.06)'}`,
                        boxShadow: isSelected ? `0 0 12px ${it.color}15` : 'none',
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ background: `${it.color}12`, border: `1px solid ${it.color}25` }}
                      >
                        <IconComp className="w-4 h-4" style={{ color: it.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium" style={{ color: isSelected ? it.color : '#e2e8f0' }}>
                          {it.label}
                        </div>
                        <div className="text-xs text-gray-500">{it.description}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: it.color }} />}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </GlassCard>

          {/* Duration */}
          <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4" style={{ color: '#00f5ff' }} />
                <span className="text-sm font-semibold text-white">Duration</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {DURATIONS.map(dur => {
                  const isSelected = selectedDuration === dur.id
                  return (
                    <motion.button
                      key={dur.id}
                      onClick={() => setSelectedDuration(dur.id)}
                      className="p-3 rounded-xl text-center transition-all duration-200"
                      style={{
                        background: isSelected ? 'rgba(0, 245, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isSelected ? 'rgba(0, 245, 255, 0.35)' : 'rgba(255,255,255,0.06)'}`,
                        boxShadow: isSelected ? '0 0 12px rgba(0, 245, 255, 0.15)' : 'none',
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="text-sm font-bold" style={{ color: isSelected ? '#00f5ff' : '#c0c0c8' }}>
                        {dur.label}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{dur.sublabel}</div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </GlassCard>

          {/* Schedule Button */}
          <MagneticButton
            variant="cyan"
            size="lg"
            onClick={() => isFormComplete && setPhase('confirm')}
            disabled={!isFormComplete}
            className="w-full"
          >
            <Sparkles className="w-4 h-4" />
            Review & Confirm
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </motion.div>
    </div>
  )

  // ─── Confirm Phase ────────────────────────────────────────────

  const renderConfirmPhase = () => {
    const typeInfo = INTERVIEW_TYPES.find(t => t.id === selectedType)
    const slotInfo = TIME_SLOTS.find(t => t.id === selectedTimeSlot)
    const durInfo = DURATIONS.find(d => d.id === selectedDuration)

    return (
      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {showConfirmAnimation ? (
            <motion.div
              key="animation"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(139, 92, 246, 0.2))',
                  border: '2px solid rgba(0, 245, 255, 0.4)',
                  boxShadow: '0 0 40px rgba(0, 245, 255, 0.3)',
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
                >
                  <CheckCircle2 className="w-12 h-12" style={{ color: '#00f5ff' }} />
                </motion.div>
              </motion.div>
              <motion.h3
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Interview Scheduled!
              </motion.h3>
              <motion.p
                className="text-gray-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Your interview has been confirmed
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
                <div className="p-6 sm:p-8">
                  <div className="text-center mb-6">
                    <div
                      className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.12), rgba(139, 92, 246, 0.08))',
                        border: '1px solid rgba(0, 245, 255, 0.2)',
                      }}
                    >
                      <Calendar className="w-7 h-7" style={{ color: '#00f5ff' }} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Confirm Your Interview</h3>
                    <p className="text-xs text-gray-400 mt-1">Review the details below</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {/* Date */}
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(0, 245, 255, 0.04)', border: '1px solid rgba(0, 245, 255, 0.1)' }}>
                      <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: '#00f5ff' }} />
                      <span className="text-sm text-gray-400">Date:</span>
                      <span className="text-sm font-medium text-white">
                        {selectedDay ? formatDate(selectedYear, selectedMonth, selectedDay) : '—'}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(6, 182, 212, 0.04)', border: '1px solid rgba(6, 182, 212, 0.1)' }}>
                      <Clock className="w-4 h-4 flex-shrink-0" style={{ color: '#06b6d4' }} />
                      <span className="text-sm text-gray-400">Time:</span>
                      <span className="text-sm font-medium text-white">
                        {slotInfo ? `${slotInfo.label} (${slotInfo.range})` : '—'}
                      </span>
                    </div>

                    {/* Type */}
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(139, 92, 246, 0.04)', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                      <Briefcase className="w-4 h-4 flex-shrink-0" style={{ color: '#8b5cf6' }} />
                      <span className="text-sm text-gray-400">Type:</span>
                      <span className="text-sm font-medium text-white">{typeInfo?.label || '—'}</span>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(0, 245, 255, 0.04)', border: '1px solid rgba(0, 245, 255, 0.1)' }}>
                      <Zap className="w-4 h-4 flex-shrink-0" style={{ color: '#00f5ff' }} />
                      <span className="text-sm text-gray-400">Duration:</span>
                      <span className="text-sm font-medium text-white">{durInfo?.label || '—'}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MagneticButton variant="ghost" onClick={() => setPhase('select')} className="flex-1">
                      <X className="w-4 h-4" /> Back
                    </MagneticButton>
                    <MagneticButton variant="cyan" onClick={handleConfirm} className="flex-1">
                      <CheckCircle2 className="w-4 h-4" /> Confirm Schedule
                    </MagneticButton>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ─── List Phase ───────────────────────────────────────────────

  const renderListPhase = () => (
    <div className="max-w-3xl mx-auto">
      {/* Scheduled Interviews */}
      {scheduledInterviews.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: '#00f5ff' }} />
            Scheduled Interviews
          </h3>
          <div className="space-y-3">
            {scheduledInterviews.map((interview, i) => (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className="p-2.5 rounded-xl flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(139, 92, 246, 0.08))',
                            border: '1px solid rgba(0, 245, 255, 0.2)',
                          }}
                        >
                          <Video className="w-4 h-4" style={{ color: '#00f5ff' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{interview.interviewType}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{interview.date} · {interview.timeSlot}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{interview.duration}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(interview.id)}
                        className="p-1.5 rounded-lg flex-shrink-0 transition-colors hover:bg-red-500/10"
                        style={{ border: '1px solid rgba(255, 107, 107, 0.15)' }}
                        title="Cancel interview"
                      >
                        <Trash2 className="w-3.5 h-3.5" style={{ color: '#ff6b6b' }} />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {scheduledInterviews.length === 0 && (
        <div className="text-center py-12">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(0, 245, 255, 0.06)', border: '1px solid rgba(0, 245, 255, 0.15)' }}
          >
            <Calendar className="w-8 h-8" style={{ color: '#00f5ff', opacity: 0.5 }} />
          </div>
          <p className="text-gray-400 text-sm">No interviews scheduled yet</p>
          <p className="text-gray-500 text-xs mt-1">Click the button below to schedule one</p>
        </div>
      )}

      {/* Schedule New Button */}
      <div className="text-center mt-6">
        <MagneticButton variant="cyan" size="lg" onClick={() => setPhase('select')}>
          <Plus className="w-4 h-4" />
          Schedule New Interview
        </MagneticButton>
      </div>
    </div>
  )

  // ─── Main Render ─────────────────────────────────────────────

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-6 sm:mb-10"
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
              animation: 'gradientShiftScheduler 4s ease infinite',
            }}
          >
            Interview Scheduler
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Schedule your AI-powered interview sessions at your convenience
          </p>
        </motion.div>

        {/* Phase tabs */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setPhase('select')}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: phase === 'select' ? 'rgba(0, 245, 255, 0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${phase === 'select' ? 'rgba(0, 245, 255, 0.3)' : 'rgba(255,255,255,0.06)'}`,
              color: phase === 'select' ? '#00f5ff' : '#9ca3af',
              boxShadow: phase === 'select' ? '0 0 12px rgba(0, 245, 255, 0.15)' : 'none',
            }}
          >
            <Plus className="w-3.5 h-3.5 inline mr-1.5" />
            Schedule
          </button>
          <button
            onClick={() => setPhase('list')}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: phase === 'list' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${phase === 'list' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.06)'}`,
              color: phase === 'list' ? '#8b5cf6' : '#9ca3af',
              boxShadow: phase === 'list' ? '0 0 12px rgba(139, 92, 246, 0.15)' : 'none',
            }}
          >
            <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
            My Interviews ({scheduledInterviews.length})
          </button>
        </div>

        {/* Phase Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {phase === 'select' && renderSelectPhase()}
            {phase === 'confirm' && renderConfirmPhase()}
            {phase === 'list' && renderListPhase()}
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes gradientShiftScheduler {
          0% { background-position: 0% center; }
          50% { background-position: 200% center; }
          100% { background-position: 0% center; }
        }
      `}</style>
    </section>
  )
}
