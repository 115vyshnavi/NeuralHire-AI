'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Briefcase, MapPin, FileText, Tags, Clock, Sparkles, Edit3, Check, Lock, LogIn, UserPlus, Globe, Eye, EyeOff, AlertCircle } from 'lucide-react'
import GlassCard from '@/components/shared/GlassCard'
import MagneticButton from '@/components/shared/MagneticButton'
import HexagonalAvatar from '@/components/shared/HexagonalAvatar'
import { useUserStore } from '@/lib/user-store'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

const experienceOptions = ['0-2', '3-5', '6-10', '10+']

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'HI' },
  { code: 'te', label: 'TE' },
]

function SkillTag({ skill, onRemove }: { skill: string; onRemove: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
      style={{
        background: 'rgba(0, 245, 255, 0.08)',
        border: '1px solid rgba(0, 245, 255, 0.2)',
        color: '#00f5ff',
      }}
      onClick={onRemove}
    >
      {skill}
      <span className="opacity-50 hover:opacity-100">×</span>
    </motion.span>
  )
}

// Language selector component
function LanguageSelector() {
  const { language, setLanguage } = useUserStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex items-center justify-center gap-2 mb-6"
    >
      <Globe className="w-4 h-4 text-gray-400" />
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
          style={{
            background:
              language === lang.code
                ? 'rgba(0, 245, 255, 0.12)'
                : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${
              language === lang.code
                ? 'rgba(0, 245, 255, 0.35)'
                : 'rgba(255, 255, 255, 0.08)'
            }`,
            color: language === lang.code ? '#00f5ff' : 'rgba(255, 255, 255, 0.4)',
            boxShadow:
              language === lang.code
                ? '0 0 10px rgba(0, 245, 255, 0.15)'
                : 'none',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {lang.label}
        </motion.button>
      ))}
    </motion.div>
  )
}

export default function CreateProfile() {
  const {
    profile,
    setProfile,
    setCurrentSection,
    isLoggedIn,
    authMode,
    setAuthMode,
    register,
    login,
    language,
    setLanguage,
  } = useUserStore()

  const [isEditing, setIsEditing] = useState(!profile.isComplete)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    role: profile.role,
    location: profile.location,
    bio: profile.bio,
    skillsInput: profile.skills.join(', '),
    experience: profile.experience,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleAuthSubmit = async () => {
    setAuthError('')
    const newErrors: Record<string, string> = {}
    if (!authEmail.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) newErrors.email = 'Invalid email format'
    if (!authPassword.trim()) newErrors.password = 'Password is required'
    else if (authPassword.length < 4) newErrors.password = 'Password must be at least 4 characters'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setAuthLoading(true)

    // Small delay for visual feedback
    await new Promise((r) => setTimeout(r, 400))

    if (authMode === 'signup') {
      const result = register(authEmail.trim(), authPassword)
      if (!result.success) {
        setAuthError(result.error || 'Registration failed')
      }
    } else {
      const result = login(authEmail.trim(), authPassword)
      if (!result.success) {
        setAuthError(result.error || 'Login failed')
      }
    }

    setAuthLoading(false)
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const skills = formData.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    setProfile({
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role.trim(),
      location: formData.location.trim(),
      bio: formData.bio.trim(),
      skills,
      experience: formData.experience,
      isComplete: true,
    })
    setIsEditing(false)
    setCurrentSection('analyze')
  }

  const inputStyle = (hasError: boolean) => ({
    background: 'rgba(0, 245, 255, 0.03)',
    border: `1px solid ${hasError ? 'rgba(255, 107, 107, 0.4)' : 'rgba(0, 245, 255, 0.12)'}`,
    borderRadius: '12px',
    padding: '10px 14px 10px 40px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  })

  const textareaStyle = (hasError: boolean) => ({
    ...inputStyle(hasError),
    padding: '10px 14px',
    minHeight: '80px',
    resize: 'vertical' as const,
  })

  const authInputStyle = (hasError: boolean) => ({
    background: 'rgba(0, 245, 255, 0.03)',
    border: `1px solid ${hasError ? 'rgba(255, 107, 107, 0.4)' : 'rgba(0, 245, 255, 0.12)'}`,
    borderRadius: '12px',
    padding: '12px 14px 12px 44px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  })

  // ──────────────────────────────────────────────
  // CASE 1: Not logged in → Show Auth form
  // ──────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Language selector */}
          <LanguageSelector />

          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.12), rgba(139, 92, 246, 0.12))',
                border: '1px solid rgba(0, 245, 255, 0.2)',
                boxShadow: '0 0 30px rgba(0, 245, 255, 0.1), 0 0 60px rgba(139, 92, 246, 0.08)',
              }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0, 245, 255, 0.08), 0 0 40px rgba(139, 92, 246, 0.05)',
                  '0 0 35px rgba(0, 245, 255, 0.18), 0 0 70px rgba(139, 92, 246, 0.12)',
                  '0 0 20px rgba(0, 245, 255, 0.08), 0 0 40px rgba(139, 92, 246, 0.05)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {authMode === 'login' ? (
                <LogIn className="w-7 h-7" style={{ color: '#00f5ff' }} />
              ) : (
                <UserPlus className="w-7 h-7" style={{ color: '#8b5cf6' }} />
              )}
            </motion.div>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-2"
              style={{
                background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {authMode === 'login' ? 'Welcome Back' : 'Join NeuralHire'}
            </h2>
            <p className="text-sm text-gray-400">
              {authMode === 'login'
                ? 'Sign in to continue your AI analysis'
                : 'Create an account to get started'}
            </p>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <GlassCard
              glowColor={authMode === 'login' ? '#00f5ff' : '#8b5cf6'}
              tiltEnabled={false}
            >
              <div className="p-6 sm:p-8">
                {/* Mode toggle tabs */}
                <div
                  className="flex rounded-xl p-1 mb-6"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <motion.button
                    onClick={() => {
                      setAuthMode('login')
                      setAuthError('')
                      setErrors({})
                    }}
                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                    style={{
                      background:
                        authMode === 'login'
                          ? 'rgba(0, 245, 255, 0.1)'
                          : 'transparent',
                      border: authMode === 'login'
                        ? '1px solid rgba(0, 245, 255, 0.25)'
                        : '1px solid transparent',
                      color: authMode === 'login' ? '#00f5ff' : 'rgba(255, 255, 255, 0.4)',
                      boxShadow: authMode === 'login'
                        ? '0 0 12px rgba(0, 245, 255, 0.1)'
                        : 'none',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Login
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setAuthMode('signup')
                      setAuthError('')
                      setErrors({})
                    }}
                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                    style={{
                      background:
                        authMode === 'signup'
                          ? 'rgba(139, 92, 246, 0.1)'
                          : 'transparent',
                      border: authMode === 'signup'
                        ? '1px solid rgba(139, 92, 246, 0.25)'
                        : '1px solid transparent',
                      color: authMode === 'signup' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.4)',
                      boxShadow: authMode === 'signup'
                        ? '0 0 12px rgba(139, 92, 246, 0.1)'
                        : 'none',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Sign Up
                  </motion.button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={authMode}
                    initial={{ opacity: 0, x: authMode === 'login' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: authMode === 'login' ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Error message */}
                    <AnimatePresence>
                      {authError && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -8, height: 0 }}
                          className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
                          style={{
                            background: 'rgba(255, 107, 107, 0.08)',
                            border: '1px solid rgba(255, 107, 107, 0.25)',
                            color: '#ff6b6b',
                          }}
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {authError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Email field */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => {
                            setAuthEmail(e.target.value)
                            if (errors.email) setErrors((p) => { const n = { ...p }; delete n.email; return n })
                          }}
                          placeholder="your@email.com"
                          style={authInputStyle(!!errors.email)}
                          onFocus={(e) => (e.target.style.borderColor = 'rgba(0, 245, 255, 0.4)')}
                          onBlur={(e) => (e.target.style.borderColor = errors.email ? 'rgba(255, 107, 107, 0.4)' : 'rgba(0, 245, 255, 0.12)')}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAuthSubmit() }}
                        />
                      </div>
                      {errors.email && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.email}</p>}
                    </div>

                    {/* Password field */}
                    <div className="mb-6">
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={authPassword}
                          onChange={(e) => {
                            setAuthPassword(e.target.value)
                            if (errors.password) setErrors((p) => { const n = { ...p }; delete n.password; return n })
                          }}
                          placeholder={authMode === 'signup' ? 'Choose a password' : 'Enter your password'}
                          style={{
                            ...authInputStyle(!!errors.password),
                            paddingRight: '44px',
                          }}
                          onFocus={(e) => (e.target.style.borderColor = 'rgba(0, 245, 255, 0.4)')}
                          onBlur={(e) => (e.target.style.borderColor = errors.password ? 'rgba(255, 107, 107, 0.4)' : 'rgba(0, 245, 255, 0.12)')}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAuthSubmit() }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.password}</p>}
                    </div>

                    {/* Submit button */}
                    <MagneticButton
                      variant={authMode === 'login' ? 'cyan' : 'violet'}
                      size="lg"
                      onClick={handleAuthSubmit}
                    >
                      {authLoading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <>
                          {authMode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                          {authMode === 'login' ? 'Sign In' : 'Create Account'}
                        </>
                      )}
                    </MagneticButton>
                  </motion.div>
                </AnimatePresence>

                {/* Toggle link */}
                <motion.p className="text-center text-sm text-gray-500 mt-6">
                  {authMode === 'login' ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <button
                        onClick={() => {
                          setAuthMode('signup')
                          setAuthError('')
                          setErrors({})
                        }}
                        className="font-medium transition-colors hover:underline"
                        style={{ color: '#8b5cf6' }}
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => {
                          setAuthMode('login')
                          setAuthError('')
                          setErrors({})
                        }}
                        className="font-medium transition-colors hover:underline"
                        style={{ color: '#00f5ff' }}
                      >
                        Login
                      </button>
                    </>
                  )}
                </motion.p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Decorative floating elements */}
          <motion.div
            className="absolute -top-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(0, 245, 255, 0.06), transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06), transparent 70%)',
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </section>
    )
  }

  // ──────────────────────────────────────────────
  // CASE 3: Logged in AND profile complete → Show profile view
  // ──────────────────────────────────────────────
  if (profile.isComplete && !isEditing) {
    return (
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Language selector */}
          <LanguageSelector />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <HexagonalAvatar size={100} glowColor="#00f5ff" alt={profile.name} />
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h3
                      className="text-2xl sm:text-3xl font-bold mb-1 truncate"
                      style={{
                        background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {profile.name}
                    </h3>
                    {profile.role && (
                      <p className="text-gray-400 text-sm sm:text-base mb-2 truncate">{profile.role}</p>
                    )}
                    {profile.location && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 justify-center sm:justify-start">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{profile.location}</span>
                      </div>
                    )}
                    {profile.bio && (
                      <p className="text-gray-400 text-sm mt-3 leading-relaxed break-words">{profile.bio}</p>
                    )}
                    {profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {profile.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium"
                            style={{
                              background: 'rgba(0, 245, 255, 0.08)',
                              border: '1px solid rgba(0, 245, 255, 0.2)',
                              color: '#00f5ff',
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-center sm:justify-start mt-6 gap-3">
                  <MagneticButton variant="cyan" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </MagneticButton>
                  <MagneticButton variant="ghost" size="sm" onClick={() => setCurrentSection('analyze')}>
                    <Sparkles className="w-4 h-4" />
                    Go to Analysis
                  </MagneticButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    )
  }

  // ──────────────────────────────────────────────
  // CASE 2: Logged in but profile NOT complete → Show profile creation form
  // ──────────────────────────────────────────────
  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Language selector */}
        <LanguageSelector />

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create Your Neural Profile
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-lg mx-auto">
            Begin your AI-powered human intelligence analysis
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
            <div className="p-5 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <motion.div variants={itemVariants} className="relative">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      style={inputStyle(!!errors.name)}
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(0, 245, 255, 0.4)')}
                      onBlur={(e) => (e.target.style.borderColor = errors.name ? 'rgba(255, 107, 107, 0.4)' : 'rgba(0, 245, 255, 0.12)')}
                    />
                  </div>
                  {errors.name && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.name}</p>}
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants} className="relative">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="your@email.com"
                      style={inputStyle(!!errors.email)}
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(0, 245, 255, 0.4)')}
                      onBlur={(e) => (e.target.style.borderColor = errors.email ? 'rgba(255, 107, 107, 0.4)' : 'rgba(0, 245, 255, 0.12)')}
                    />
                  </div>
                  {errors.email && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.email}</p>}
                </motion.div>

                {/* Current Role */}
                <motion.div variants={itemVariants} className="relative">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Current Role / Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      placeholder="e.g. Senior Developer"
                      style={inputStyle(false)}
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(0, 245, 255, 0.4)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(0, 245, 255, 0.12)')}
                    />
                  </div>
                </motion.div>

                {/* Location */}
                <motion.div variants={itemVariants} className="relative">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      style={inputStyle(false)}
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(0, 245, 255, 0.4)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(0, 245, 255, 0.12)')}
                    />
                  </div>
                </motion.div>

                {/* Bio - full width */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Short Bio</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      style={{ ...textareaStyle(false), paddingLeft: '14px' }}
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(0, 245, 255, 0.4)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(0, 245, 255, 0.12)')}
                      rows={3}
                    />
                  </div>
                </motion.div>

                {/* Skills - full width */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Tags className="w-3.5 h-3.5" />
                      Skills (comma-separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.skillsInput}
                    onChange={(e) => handleChange('skillsInput', e.target.value)}
                    placeholder="e.g. React, Python, Leadership, Data Analysis"
                    style={{
                      ...inputStyle(false),
                      paddingLeft: '14px',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(0, 245, 255, 0.4)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(0, 245, 255, 0.12)')}
                  />
                  {formData.skillsInput && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skillsInput
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((skill, i) => (
                          <SkillTag
                            key={`${skill}-${i}`}
                            skill={skill}
                            onRemove={() => {
                              const skills = formData.skillsInput
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean)
                              skills.splice(i, 1)
                              handleChange('skillsInput', skills.join(', '))
                            }}
                          />
                        ))}
                    </div>
                  )}
                </motion.div>

                {/* Experience */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Years of Experience
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {experienceOptions.map((opt) => (
                      <motion.button
                        key={opt}
                        onClick={() => handleChange('experience', opt)}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background:
                            formData.experience === opt
                              ? 'rgba(0, 245, 255, 0.12)'
                              : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${
                            formData.experience === opt
                              ? 'rgba(0, 245, 255, 0.3)'
                              : 'rgba(255, 255, 255, 0.08)'
                          }`,
                          color: formData.experience === opt ? '#00f5ff' : 'rgba(255, 255, 255, 0.5)',
                          boxShadow:
                            formData.experience === opt
                              ? '0 0 12px rgba(0, 245, 255, 0.15)'
                              : 'none',
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {opt === '10+' ? '10+ years' : `${opt} years`}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Submit */}
              <motion.div variants={itemVariants} className="mt-8">
                <MagneticButton variant="cyan" size="lg" onClick={handleSubmit}>
                  <Check className="w-5 h-5" />
                  Initialize Neural Profile
                </MagneticButton>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
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
