'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '@/components/shared/Navbar'
import NeuralBackground from '@/components/neural/NeuralBackground'
import ParticleField from '@/components/neural/ParticleField'
import LandingPage from '@/components/sections/LandingPage'
import VideoAnalyzer from '@/components/sections/VideoAnalyzer'
import PersonalityRadar from '@/components/sections/PersonalityRadar'
import AIInterview from '@/components/sections/AIInterview'
import EmotionalTimeline from '@/components/sections/EmotionalTimeline'
import CareerPrediction from '@/components/sections/CareerPrediction'
import CommandCenter from '@/components/sections/CommandCenter'
import DigitalProfile from '@/components/sections/DigitalProfile'

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'analyze', label: 'Analyze' },
  { id: 'personality', label: 'Personality' },
  { id: 'interview', label: 'Interview' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'predictions', label: 'Predictions' },
  { id: 'command', label: 'Command Center' },
  { id: 'profile', label: 'Profile' },
]

export default function Home() {
  const [activeSection, setActiveSection] = useState('home')

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    document.body.style.overflowX = 'hidden'
    return () => {
      document.body.style.overflowX = ''
    }
  }, [])

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <LandingPage onNavigate={handleNavigate} />
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
      case 'profile':
        return <DigitalProfile />
      default:
        return <LandingPage onNavigate={handleNavigate} />
    }
  }

  return (
    <NeuralBackground>
      <ParticleField className="fixed inset-0 pointer-events-none" />
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
      <main className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
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
