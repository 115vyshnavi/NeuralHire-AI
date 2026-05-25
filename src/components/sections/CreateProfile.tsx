'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Briefcase, MapPin, FileText, Tags, Clock, Sparkles, Edit3, Check } from 'lucide-react'
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

export default function CreateProfile() {
  const { profile, setProfile, setCurrentSection } = useUserStore()
  const [isEditing, setIsEditing] = useState(!profile.isComplete)
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
    fontSize: '14px',
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

  // Show existing profile view if profile exists and not editing
  if (profile.isComplete && !isEditing) {
    return (
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
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

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
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
