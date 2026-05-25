'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: number;
  role: 'ai' | 'user';
  text: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    role: 'ai',
    text: "Welcome to your NeuralHire AI interview. I'll be asking you a series of questions to understand your potential beyond what's on your resume. Ready to begin?",
  },
  { id: 2, role: 'user', text: "Yes, I'm ready." },
  {
    id: 3,
    role: 'ai',
    text: 'Tell me about a time when you had to lead a team through a challenging situation. How did you handle the pressure?',
  },
  {
    id: 4,
    role: 'user',
    text: 'In my previous role, our team faced a critical deadline with a key client...',
  },
  {
    id: 5,
    role: 'ai',
    text: 'I notice strong leadership indicators in your response. Can you elaborate on how you managed team dynamics during that period?',
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: '#00f5ff' }}
          animate={{
            y: [0, -6, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function LiveWaveform() {
  return (
    <div className="w-full h-20 relative overflow-hidden">
      <svg
        viewBox="0 0 400 80"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#00f5ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00f5ff" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="waveViolet" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {/* Wave 1 - Cyan, low frequency */}
        <motion.path
          d="M0,40 Q50,20 100,40 T200,40 T300,40 T400,40"
          fill="none"
          stroke="url(#waveCyan)"
          strokeWidth="2"
          animate={{
            d: [
              'M0,40 Q50,20 100,40 T200,40 T300,40 T400,40',
              'M0,40 Q50,55 100,40 T200,40 T300,40 T400,40',
              'M0,40 Q50,25 100,40 T200,40 T300,40 T400,40',
              'M0,40 Q50,20 100,40 T200,40 T300,40 T400,40',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Wave 2 - Violet, medium frequency */}
        <motion.path
          d="M0,40 Q25,30 50,40 T100,40 T150,40 T200,40 T250,40 T300,40 T350,40 T400,40"
          fill="none"
          stroke="url(#waveViolet)"
          strokeWidth="1.5"
          animate={{
            d: [
              'M0,40 Q25,30 50,40 T100,40 T150,40 T200,40 T250,40 T300,40 T350,40 T400,40',
              'M0,40 Q25,50 50,40 T100,40 T150,40 T200,40 T250,40 T300,40 T350,40 T400,40',
              'M0,40 Q25,28 50,40 T100,40 T150,40 T200,40 T250,40 T300,40 T350,40 T400,40',
              'M0,40 Q25,30 50,40 T100,40 T150,40 T200,40 T250,40 T300,40 T350,40 T400,40',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
        {/* Wave 3 - Cyan thin, high frequency */}
        <motion.path
          d="M0,40 Q12,35 25,40 T50,40 T75,40 T100,40 T125,40 T150,40 T175,40 T200,40 T225,40 T250,40 T275,40 T300,40 T325,40 T350,40 T375,40 T400,40"
          fill="none"
          stroke="#00f5ff"
          strokeWidth="0.8"
          strokeOpacity="0.3"
          animate={{
            d: [
              'M0,40 Q12,35 25,40 T50,40 T75,40 T100,40 T125,40 T150,40 T175,40 T200,40 T225,40 T250,40 T275,40 T300,40 T325,40 T350,40 T375,40 T400,40',
              'M0,40 Q12,45 25,40 T50,40 T75,40 T100,40 T125,40 T150,40 T175,40 T200,40 T225,40 T250,40 T275,40 T300,40 T325,40 T350,40 T375,40 T400,40',
              'M0,40 Q12,33 25,40 T50,40 T75,40 T100,40 T125,40 T150,40 T175,40 T200,40 T225,40 T250,40 T275,40 T300,40 T325,40 T350,40 T375,40 T400,40',
              'M0,40 Q12,35 25,40 T50,40 T75,40 T100,40 T125,40 T150,40 T175,40 T200,40 T225,40 T250,40 T275,40 T300,40 T325,40 T350,40 T375,40 T400,40',
            ],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        {/* Center line */}
        <line
          x1="0"
          y1="40"
          x2="400"
          y2="40"
          stroke="#00f5ff"
          strokeWidth="0.3"
          strokeOpacity="0.15"
        />
      </svg>
      {/* Pulse overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0, 245, 255, 0.08) 0%, transparent 70%)',
        }}
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

function NeuralPulseEffects() {
  return (
    <div className="flex items-center justify-center gap-3 py-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: 4 + i * 0.8,
            height: 4 + i * 0.8,
            backgroundColor: i % 2 === 0 ? '#00f5ff' : '#8b5cf6',
          }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.3, 0.9, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.18,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function ConfidenceMeter({ value }: { value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: 'rgba(0, 245, 255, 0.7)' }}>
          Confidence
        </span>
        <span className="text-xs font-bold tabular-nums" style={{ color: '#00f5ff' }}>
          {value}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'rgba(0, 245, 255, 0.08)', border: '1px solid rgba(0, 245, 255, 0.1)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #00f5ff, #00d4e0)',
            boxShadow: '0 0 10px rgba(0, 245, 255, 0.4)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export default function AIInterview() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [confidence, setConfidence] = useState(82);
  const [communicationScore, setCommunicationScore] = useState(87);
  const [hesitation, setHesitation] = useState(12);

  // Simulated fluctuation for live analysis values
  useEffect(() => {
    const interval = setInterval(() => {
      setConfidence((prev) => {
        const delta = Math.random() * 6 - 3;
        return Math.min(98, Math.max(60, Math.round(prev + delta)));
      });
      setCommunicationScore((prev) => {
        const delta = Math.random() * 4 - 2;
        return Math.min(96, Math.max(65, Math.round(prev + delta)));
      });
      setHesitation((prev) => {
        const delta = Math.random() * 4 - 2;
        return Math.min(35, Math.max(5, Math.round(prev + delta)));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: messages.length + 1,
      role: 'user',
      text: inputValue.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "That's a compelling example. Your ability to navigate ambiguity is notable. Let's explore your conflict resolution approach.",
        'Interesting perspective. How did that experience shape your approach to similar challenges?',
        'I can see strong analytical thinking in your response. Tell me more about the outcome and what you learned.',
        'Your self-awareness is evident. How would you apply these insights in a new team environment?',
        'That demonstrates resilience. Can you walk me through your decision-making process in that moment?',
      ];
      const aiMsg: ChatMessage = {
        id: messages.length + 2,
        role: 'ai',
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1800);
  }, [inputValue, isTyping, messages.length]);

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3"
          style={{
            background: 'linear-gradient(135deg, #00f5ff, #8b5cf6, #00f5ff)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientShift 4s ease-in-out infinite',
          }}
        >
          Real-Time AI Interview
        </h2>
        <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Experience the future of interviews with our adaptive AI interviewer
        </p>
      </motion.div>

      {/* Keyframe styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulseOnline {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `,
        }}
      />

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-55-45 gap-6">
        {/* LEFT SIDE - AI Interviewer Panel (55%) */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(0, 245, 255, 0.03), rgba(255, 255, 255, 0.01), rgba(139, 92, 246, 0.02))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 245, 255, 0.1)',
              boxShadow:
                '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
          >
            {/* AI Avatar/Indicator Bar */}
            <div
              className="flex items-center gap-3 px-5 py-3"
              style={{
                borderBottom: '1px solid rgba(0, 245, 255, 0.08)',
              }}
            >
              {/* Pulsing AI avatar */}
              <div className="relative">
                <motion.div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(139, 92, 246, 0.1))',
                    border: '1px solid rgba(0, 245, 255, 0.2)',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(0, 245, 255, 0.2)',
                      '0 0 20px rgba(0, 245, 255, 0.4)',
                      '0 0 10px rgba(0, 245, 255, 0.2)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Bot size={18} style={{ color: '#00f5ff' }} />
                </motion.div>
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  NeuralHire AI
                </span>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: '#22c55e',
                      animation: 'pulseOnline 2s ease-in-out infinite',
                      boxShadow: '0 0 6px rgba(34, 197, 94, 0.5)',
                    }}
                  />
                  <span className="text-[10px] font-medium" style={{ color: 'rgba(34, 197, 94, 0.8)' }}>
                    Online
                  </span>
                </div>
              </div>
              <div
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: 'rgba(0, 245, 255, 0.08)',
                  color: 'rgba(0, 245, 255, 0.6)',
                  border: '1px solid rgba(0, 245, 255, 0.1)',
                }}
              >
                Interview Active
              </div>
            </div>

            {/* Chat Area */}
            <div
              className="px-4 py-4 space-y-3 max-h-[420px] overflow-y-auto"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0, 245, 255, 0.15) transparent',
              }}
            >
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'ai' ? 'rounded-tl-sm' : 'rounded-tr-sm'
                      }`}
                      style={
                        msg.role === 'ai'
                          ? {
                              background:
                                'linear-gradient(135deg, rgba(0, 245, 255, 0.05), rgba(0, 245, 255, 0.02))',
                              border: '1px solid rgba(0, 245, 255, 0.1)',
                              borderLeft: '3px solid rgba(0, 245, 255, 0.5)',
                              color: 'rgba(255,255,255,0.8)',
                            }
                          : {
                              background:
                                'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(139, 92, 246, 0.03))',
                              border: '1px solid rgba(139, 92, 246, 0.12)',
                              borderRight: '3px solid rgba(139, 92, 246, 0.5)',
                              color: 'rgba(255,255,255,0.85)',
                            }
                      }
                    >
                      <div className="flex items-start gap-2">
                        {msg.role === 'ai' && (
                          <Bot
                            size={14}
                            className="mt-0.5 shrink-0"
                            style={{ color: '#00f5ff', opacity: 0.7 }}
                          />
                        )}
                        <span>{msg.text}</span>
                        {msg.role === 'user' && (
                          <User
                            size={14}
                            className="mt-0.5 shrink-0"
                            style={{ color: '#8b5cf6', opacity: 0.7 }}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div
                    className="rounded-2xl rounded-tl-sm px-3 py-2"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(0, 245, 255, 0.05), rgba(0, 245, 255, 0.02))',
                      border: '1px solid rgba(0, 245, 255, 0.1)',
                      borderLeft: '3px solid rgba(0, 245, 255, 0.5)',
                    }}
                  >
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div
              className="px-4 py-3"
              style={{ borderTop: '1px solid rgba(0, 245, 255, 0.08)' }}
            >
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{
                  background: 'rgba(0, 245, 255, 0.03)',
                  border: '1px solid rgba(0, 245, 255, 0.1)',
                  boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your response..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/25"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                  disabled={isTyping}
                />
                <motion.button
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                  whileHover={{
                    boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
                  }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Mic size={14} style={{ color: '#8b5cf6' }} />
                </motion.button>
                <motion.button
                  onClick={handleSend}
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: inputValue.trim()
                      ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(0, 245, 255, 0.08))'
                      : 'rgba(0, 245, 255, 0.05)',
                    border: '1px solid rgba(0, 245, 255, 0.15)',
                    boxShadow: inputValue.trim() ? '0 0 12px rgba(0, 245, 255, 0.15)' : 'none',
                  }}
                  whileHover={{
                    boxShadow: '0 0 20px rgba(0, 245, 255, 0.35)',
                  }}
                  whileTap={{ scale: 0.92 }}
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send size={14} style={{ color: '#00f5ff' }} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE - Live Analysis Panel (45%) */}
        <motion.div
          className="lg:col-span-1 space-y-4"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Live Neural Analysis Header */}
          <div
            className="rounded-2xl p-5"
            style={{
              background:
                'linear-gradient(135deg, rgba(0, 245, 255, 0.03), rgba(139, 92, 246, 0.02))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 245, 255, 0.1)',
              boxShadow:
                '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: '#00f5ff' }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <h3
                className="text-sm font-semibold tracking-wide uppercase"
                style={{ color: 'rgba(0, 245, 255, 0.8)' }}
              >
                Live Neural Analysis
              </h3>
            </div>

            {/* Confidence Meter */}
            <div className="mb-4">
              <ConfidenceMeter value={confidence} />
            </div>

            {/* Communication Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: 'rgba(139, 92, 246, 0.7)' }}>
                  Communication Score
                </span>
                <motion.span
                  className="text-lg font-bold tabular-nums"
                  style={{ color: '#8b5cf6' }}
                  key={communicationScore}
                  initial={{ scale: 1.2, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {communicationScore}
                </motion.span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.1)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
                    boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${communicationScore}%` }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            {/* Hesitation Detection */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: 'rgba(255, 107, 107, 0.7)' }}>
                  Hesitation Detection
                </span>
                <motion.span
                  className="text-lg font-bold tabular-nums"
                  style={{ color: hesitation > 25 ? '#ff6b6b' : '#fbbf24' }}
                  key={hesitation}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {hesitation}%
                </motion.span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{
                  backgroundColor: 'rgba(255, 107, 107, 0.06)',
                  border: '1px solid rgba(255, 107, 107, 0.1)',
                }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      hesitation > 25
                        ? 'linear-gradient(90deg, #ff6b6b, #ef4444)'
                        : 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                    boxShadow:
                      hesitation > 25
                        ? '0 0 10px rgba(255, 107, 107, 0.4)'
                        : '0 0 10px rgba(251, 191, 36, 0.3)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${hesitation}%` }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div>
              <span className="text-xs font-medium block mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Sentiment Analysis
              </span>
              <div className="flex flex-wrap gap-2">
                {['Positive', 'Analytical', 'Engaged'].map((label, i) => (
                  <motion.span
                    key={label}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background:
                        i === 0
                          ? 'rgba(34, 197, 94, 0.1)'
                          : i === 1
                            ? 'rgba(0, 245, 255, 0.08)'
                            : 'rgba(139, 92, 246, 0.1)',
                      color:
                        i === 0
                          ? 'rgba(34, 197, 94, 0.8)'
                          : i === 1
                            ? 'rgba(0, 245, 255, 0.7)'
                            : 'rgba(139, 92, 246, 0.8)',
                      border:
                        i === 0
                          ? '1px solid rgba(34, 197, 94, 0.2)'
                          : i === 1
                            ? '1px solid rgba(0, 245, 255, 0.15)'
                            : '1px solid rgba(139, 92, 246, 0.2)',
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                  >
                    {label}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Live Waveform */}
          <div
            className="rounded-2xl p-4"
            style={{
              background:
                'linear-gradient(135deg, rgba(0, 245, 255, 0.02), rgba(255, 255, 255, 0.01))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 245, 255, 0.08)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'rgba(0, 245, 255, 0.5)' }}>
                Audio Neural Feed
              </span>
              <motion.div
                className="flex items-center gap-1"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[10px] font-medium" style={{ color: 'rgba(239, 68, 68, 0.7)' }}>
                  LIVE
                </span>
              </motion.div>
            </div>
            <LiveWaveform />
          </div>

          {/* Neural Pulse Effects */}
          <div
            className="rounded-2xl p-4"
            style={{
              background:
                'linear-gradient(135deg, rgba(139, 92, 246, 0.03), rgba(0, 245, 255, 0.02))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.1)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <span className="text-[10px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'rgba(139, 92, 246, 0.5)' }}>
              Neural Activity
            </span>
            <NeuralPulseEffects />
          </div>
        </motion.div>
      </div>

      {/* Responsive grid style */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (min-width: 1024px) {
          .lg\\:grid-cols-55-45 {
            grid-template-columns: 55fr 45fr;
          }
        }
      `,
        }}
      />
    </section>
  );
}
