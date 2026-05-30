'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Brain, RotateCcw, History, LogOut } from 'lucide-react'
import { useUserStore } from '@/lib/user-store'

interface NavbarProps {
  activeSection: string
  onNavigate: (section: string) => void
}

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'profile', label: 'Profile' },
  { id: 'analyze', label: 'Analyze' },
  { id: 'personality', label: 'Personality' },
  { id: 'interview', label: 'Interview' },
  { id: 'skills', label: 'Skills' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'predictions', label: 'Predictions' },
  { id: 'command', label: 'Command' },
  { id: 'digital-profile', label: 'My Profile' },
]

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { hasProfile, resetSession } = useUserStore()

  const handleNavigate = (id: string) => {
    onNavigate(id)
    setMobileMenuOpen(false)
  }

  const handleReset = () => {
    if (window.confirm('Start a new session? Your current data will be saved to history.')) {
      resetSession()
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(8, 10, 20, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 245, 255, 0.08), 0 1px 0 rgba(0, 245, 255, 0.1)',
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #00f5ff, #8b5cf6, transparent)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleNavigate('home')}
              whileHover={{ scale: 1.02 }}
            >
              <Brain className="w-7 h-7 text-cyan-400" />
              <span
                className="text-xl font-bold tracking-wider transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 8px rgba(0, 245, 255, 0.5))',
                }}
              >
                NeuralHire AI
              </span>
            </motion.div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.id}
                  label={link.label}
                  isActive={activeSection === link.id}
                  onClick={() => handleNavigate(link.id)}
                />
              ))}
            </div>

            {/* Right side: History + New Session */}
            <div className="flex items-center gap-2">
              {/* History Button */}
              <motion.button
                className="p-2 rounded-lg transition-colors duration-200"
                onClick={() => handleNavigate('history')}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                title="Session History"
                style={{
                  background: activeSection === 'history' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.06)',
                  border: `1px solid ${activeSection === 'history' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.12)'}`,
                }}
              >
                <History className="w-4 h-4" style={{ color: '#8b5cf6' }} />
              </motion.button>

              {/* New Session Button */}
              {hasProfile() && (
                <motion.button
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                  onClick={handleReset}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  title="New Session"
                  style={{
                    background: 'rgba(255, 107, 107, 0.08)',
                    border: '1px solid rgba(255, 107, 107, 0.2)',
                    color: '#ff6b6b',
                  }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">New Session</span>
                </motion.button>
              )}

              {/* Mobile menu button */}
              <motion.button
                className="lg:hidden relative p-2 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ background: 'rgba(0, 245, 255, 0.08)', border: '1px solid rgba(0, 245, 255, 0.15)' }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-cyan-400" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-20 left-4 right-4 z-50 rounded-2xl p-4"
              style={{
                background: 'rgba(8, 10, 20, 0.85)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(0, 245, 255, 0.15)',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 245, 255, 0.08)',
              }}
            >
              <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavigate(link.id)}
                    className={`relative px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                      activeSection === link.id ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                    }`}
                    style={{ background: activeSection === link.id ? 'rgba(0, 245, 255, 0.1)' : 'transparent' }}
                  >
                    {link.label}
                    {activeSection === link.id && (
                      <motion.div
                        layoutId="mobile-active-indicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-cyan-400"
                        style={{ boxShadow: '0 0 10px rgba(0, 245, 255, 0.5)' }}
                      />
                    )}
                  </motion.button>
                ))}

                {/* History in mobile menu */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  onClick={() => handleNavigate('history')}
                  className={`relative px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                    activeSection === 'history' ? 'text-violet-400' : 'text-gray-400 hover:text-white'
                  }`}
                  style={{ background: activeSection === 'history' ? 'rgba(139, 92, 246, 0.1)' : 'transparent' }}
                >
                  <span className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    History
                  </span>
                </motion.button>

                {/* Reset in mobile menu */}
                {hasProfile() && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + 1) * 0.05 }}
                    onClick={handleReset}
                    className="relative px-4 py-3 rounded-xl text-left text-sm font-medium text-red-400 hover:text-red-300 transition-all duration-200"
                    style={{ background: 'rgba(255, 107, 107, 0.05)' }}
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      New Session
                    </span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

interface NavLinkProps {
  label: string
  isActive: boolean
  onClick: () => void
}

function NavLink({ label, isActive, onClick }: NavLinkProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-2.5 py-2 text-xs font-medium transition-colors duration-200 rounded-lg ${
        isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
      }`}
      whileHover={{ y: -1 }}
      whileTap={{ y: 0 }}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="nav-active-underline"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-3/4 rounded-full"
          style={{ background: 'linear-gradient(90deg, #00f5ff, #8b5cf6)', boxShadow: '0 0 8px rgba(0, 245, 255, 0.5)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      {!isActive && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-cyan-400"
          initial={{ width: 0, opacity: 0 }}
          whileHover={{ width: '60%', opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ boxShadow: '0 0 6px rgba(0, 245, 255, 0.4)' }}
        />
      )}
    </motion.button>
  )
}
