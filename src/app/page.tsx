'use client'

import { useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '@/components/shared/Navbar'
import NeuralBackground from '@/components/neural/NeuralBackground'
import ParticleField from '@/components/neural/ParticleField'
import LandingPage from '@/components/sections/LandingPage'
import CreateProfile from '@/components/sections/CreateProfile'
import VideoAnalyzer from '@/components/sections/VideoAnalyzer'
import PersonalityRadar from '@/components/sections/PersonalityRadar'
import AIInterview from '@/components/sections/AIInterview'
import EmotionalTimeline from '@/components/sections/EmotionalTimeline'
import CareerPrediction from '@/components/sections/CareerPrediction'
import CommandCenter from '@/components/sections/CommandCenter'
import DigitalProfile from '@/components/sections/DigitalProfile'
import SessionHistory from '@/components/sections/SessionHistory'
import SkillAssessment from '@/components/sections/SkillAssessment'
import InterviewScheduler from '@/components/sections/InterviewScheduler'
import { useUserStore } from '@/lib/user-store'

export default function Home() {
  const { currentSection, setCurrentSection } = useUserStore()

  const handleNavigate = useCallback((section: string) => {
    setCurrentSection(section)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [setCurrentSection])

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <LandingPage onNavigate={handleNavigate} />
      case 'profile':
        return <CreateProfile />
      case 'analyze':
        return <VideoAnalyzer />
      case 'personality':
        return <PersonalityRadar />
      case 'interview':
        return <AIInterview />
      case 'timeline':
        return <EmotionalTimeline />
      case 'predictions':
        return <CareerPrediction />
      case 'command':
        return <CommandCenter />
      case 'digital-profile':
        return <DigitalProfile />
      case 'history':
        return <SessionHistory />
      case 'skills':
        return <SkillAssessment />
      case 'schedule':
        return <InterviewScheduler />
      default:
        return <LandingPage onNavigate={handleNavigate} />
    }
  }

  return (
    <NeuralBackground>
      <ParticleField className="fixed inset-0 pointer-events-none" />
      <Navbar activeSection={currentSection} onNavigate={handleNavigate} />
      <main className="relative z-10 min-h-screen pt-16 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
    </NeuralBackground>
  )
}
