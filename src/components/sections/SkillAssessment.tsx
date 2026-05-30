'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, MessageSquare, Users, Sparkles, CheckCircle2,
  Circle, ArrowRight, Loader2, Target, Zap, Award, BarChart3
} from 'lucide-react'
import GlassCard from '@/components/shared/GlassCard'
import MagneticButton from '@/components/shared/MagneticButton'
import { useUserStore } from '@/lib/user-store'

// ─── Question Pools ─────────────────────────────────────────────

interface MCQ {
  id: string
  question: string
  options: string[]
  correctIndex: number
  category: 'logical' | 'problem-solving' | 'numerical'
}

interface ScenarioQ {
  id: string
  question: string
  options: string[]
  category: 'communication' | 'behavioral'
}

const aptitudePool: MCQ[] = [
  {
    id: 'a1', category: 'logical',
    question: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
    options: ['Yes', 'No', 'Cannot determine', 'Only some Bloops are Lazzies'],
    correctIndex: 0,
  },
  {
    id: 'a2', category: 'logical',
    question: 'What comes next in the series: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '36'],
    correctIndex: 1,
  },
  {
    id: 'a3', category: 'numerical',
    question: 'A product costs $80 after a 20% discount. What was the original price?',
    options: ['$96', '$100', '$120', '$90'],
    correctIndex: 1,
  },
  {
    id: 'a4', category: 'problem-solving',
    question: 'A farmer has 17 sheep. All but 9 run away. How many sheep does the farmer have left?',
    options: ['8', '9', '17', '0'],
    correctIndex: 1,
  },
  {
    id: 'a5', category: 'logical',
    question: 'Which word does NOT belong: Apple, Banana, Carrot, Grape, Mango?',
    options: ['Apple', 'Banana', 'Carrot', 'Mango'],
    correctIndex: 2,
  },
  {
    id: 'a6', category: 'numerical',
    question: 'If 5 machines take 5 minutes to make 5 widgets, how long would 100 machines take to make 100 widgets?',
    options: ['100 minutes', '5 minutes', '20 minutes', '1 minute'],
    correctIndex: 1,
  },
  {
    id: 'a7', category: 'problem-solving',
    question: 'You have a 3-gallon and a 5-gallon jug. How do you measure exactly 4 gallons?',
    options: [
      'Fill 5, pour into 3, leaving 2. Empty 3, pour 2 into 3. Fill 5, pour 1 into 3. 4 remains.',
      'Fill both and add them together, then divide by 2',
      'It is impossible with these jugs',
      'Fill 3 twice and pour into 5',
    ],
    correctIndex: 0,
  },
  {
    id: 'a8', category: 'logical',
    question: 'In a race, you overtake the 2nd place person. What position are you in?',
    options: ['1st', '2nd', '3rd', 'Cannot determine'],
    correctIndex: 1,
  },
  {
    id: 'a9', category: 'numerical',
    question: 'A shirt costs $97 after a 3% tax. What is the price before tax (approx)?',
    options: ['$94.17', '$93.00', '$94.50', '$100.00'],
    correctIndex: 0,
  },
  {
    id: 'a10', category: 'problem-solving',
    question: 'A bat and ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
    options: ['$0.10', '$0.05', '$0.15', '$0.20'],
    correctIndex: 1,
  },
  {
    id: 'a11', category: 'logical',
    question: 'If it takes 8 workers 4 hours to build a wall, how long would 4 workers take?',
    options: ['2 hours', '4 hours', '8 hours', '16 hours'],
    correctIndex: 2,
  },
  {
    id: 'a12', category: 'numerical',
    question: 'What is 15% of 200?',
    options: ['25', '30', '35', '20'],
    correctIndex: 1,
  },
  {
    id: 'a13', category: 'problem-solving',
    question: 'You need to cross a river with a wolf, a goat, and cabbage. The boat holds only you and one item. The wolf eats the goat, the goat eats the cabbage if left alone. What do you take first?',
    options: ['Wolf', 'Goat', 'Cabbage', 'It is impossible'],
    correctIndex: 1,
  },
  {
    id: 'a14', category: 'logical',
    question: 'Statement: All cats are animals. Some animals are pets. Conclusion: Some cats are pets. Is this logically valid?',
    options: ['Yes, definitely valid', 'No, not necessarily valid', 'Only if all pets are animals', 'It is a contradiction'],
    correctIndex: 1,
  },
  {
    id: 'a15', category: 'numerical',
    question: 'If a train travels 60 km/h for 2.5 hours, how far does it go?',
    options: ['120 km', '150 km', '125 km', '180 km'],
    correctIndex: 1,
  },
]

const communicationPool: ScenarioQ[] = [
  {
    id: 'c1', category: 'communication',
    question: 'How would you handle a conflict with a teammate who disagrees with your approach?',
    options: [
      'Confront them directly in a team meeting',
      'Avoid the conflict and let it resolve itself',
      'Discuss privately and find common ground',
      'Report the issue to your manager immediately',
    ],
  },
  {
    id: 'c2', category: 'communication',
    question: 'A client is unhappy with your team\'s delivery. What is your first response?',
    options: [
      'Apologize and promise to redo everything',
      'Defend your team\'s work with technical reasoning',
      'Listen actively, acknowledge their concerns, and propose next steps',
      'Escalate to senior management',
    ],
  },
  {
    id: 'c3', category: 'communication',
    question: 'You discover a critical mistake in a project that your colleague submitted. What do you do?',
    options: [
      'Fix it quietly without telling anyone',
      'Publicly point out the mistake in the next team meeting',
      'Privately inform your colleague and offer to help fix it together',
      'Ignore it — it is not your responsibility',
    ],
  },
  {
    id: 'c4', category: 'communication',
    question: 'Your manager assigns you a task you strongly believe is the wrong approach. How do you respond?',
    options: [
      'Do it exactly as asked without question',
      'Refuse to do it and explain why you are right',
      'Share your concerns respectfully and suggest an alternative, but commit if they decide otherwise',
      'Complain to coworkers about the decision',
    ],
  },
  {
    id: 'c5', category: 'communication',
    question: 'During a presentation, someone interrupts you with a hostile question. What is your best move?',
    options: [
      'Ignore the interruption and continue',
      'Get defensive and argue back',
      'Acknowledge the question, answer calmly, and return to your presentation',
      'Stop the presentation and ask them to leave',
    ],
  },
]

const behavioralPool: ScenarioQ[] = [
  {
    id: 'b1', category: 'behavioral',
    question: 'You are overwhelmed with multiple urgent deadlines. How do you prioritize?',
    options: [
      'Work on whatever feels most urgent at the moment',
      'Make a list, assess impact and deadlines, and tackle the highest-priority items first',
      'Ask your manager to decide for you',
      'Try to do everything simultaneously',
    ],
  },
  {
    id: 'b2', category: 'behavioral',
    question: 'You receive negative feedback on a project you worked hard on. What is your reaction?',
    options: [
      'Get upset and dismiss the feedback',
      'Accept it passively without asking questions',
      'Thank them, ask clarifying questions, and use it to improve',
      'Blame external factors for the issues',
    ],
  },
  {
    id: 'b3', category: 'behavioral',
    question: 'A team member is consistently underperforming, affecting your work. What do you do?',
    options: [
      'Do their work for them to meet deadlines',
      'Complain to other team members about them',
      'Have an honest, supportive conversation and offer help, escalating if needed',
      'Ignore it and focus on your own work',
    ],
  },
  {
    id: 'b4', category: 'behavioral',
    question: 'You are assigned to lead a project but some team members resist your leadership. What is your approach?',
    options: [
      'Assert authority and demand compliance',
      'Give up the leadership role',
      'Have one-on-one conversations to understand concerns and build trust through collaboration',
      'Report the resistance to HR',
    ],
  },
  {
    id: 'b5', category: 'behavioral',
    question: 'You made a significant mistake that impacts the team. What do you do?',
    options: [
      'Try to cover it up or minimize it',
      'Wait for someone else to discover it',
      'Own up immediately, explain what happened, and present a plan to fix it',
      'Blame ambiguous circumstances',
    ],
  },
]

// ─── Helpers ────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function getBarGradient(score: number): string {
  if (score >= 80) return 'linear-gradient(90deg, #00f5ff, #06b6d4)'
  if (score >= 60) return 'linear-gradient(90deg, #8b5cf6, #a78bfa)'
  if (score >= 40) return 'linear-gradient(90deg, #f59e0b, #fbbf24)'
  return 'linear-gradient(90deg, #ef4444, #f87171)'
}

function getBarGlow(score: number): string {
  if (score >= 80) return '0 0 12px rgba(0, 245, 255, 0.5)'
  if (score >= 60) return '0 0 12px rgba(139, 92, 246, 0.5)'
  if (score >= 40) return '0 0 12px rgba(245, 158, 11, 0.4)'
  return '0 0 12px rgba(239, 68, 68, 0.4)'
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#00f5ff'
  if (score >= 60) return '#8b5cf6'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}

// ─── Component ──────────────────────────────────────────────────

interface SkillScores {
  aptitude: number
  communication: number
  problemSolving: number
  overall: number
}

type Phase = 'aptitude' | 'communication' | 'behavioral' | 'analyzing' | 'results'

export default function SkillAssessment() {
  const { hasProfile, profile, setCurrentSection } = useUserStore()

  // Select questions once using useMemo
  const aptitudeQuestions = useMemo(() => shuffleArray(aptitudePool).slice(0, 5), [])
  const communicationQuestions = useMemo(() => shuffleArray(communicationPool).slice(0, 3), [])
  const behavioralQuestions = useMemo(() => shuffleArray(behavioralPool).slice(0, 3), [])

  const [phase, setPhase] = useState<Phase>('aptitude')
  const [aptitudeAnswers, setAptitudeAnswers] = useState<Record<string, number>>({})
  const [communicationAnswers, setCommunicationAnswers] = useState<Record<string, number>>({})
  const [behavioralAnswers, setBehavioralAnswers] = useState<Record<string, number>>({})
  const [scores, setScores] = useState<SkillScores | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ─── Analyze answers via API ─────────────────────────────────
  const analyzeAnswers = useCallback(async () => {
    setPhase('analyzing')
    setError(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'skill-assessment',
          data: {
            profile,
            aptitudeAnswers: aptitudeQuestions.map(q => ({
              questionId: q.id,
              question: q.question,
              category: q.category,
              selectedOption: aptitudeAnswers[q.id] ?? -1,
              correctIndex: q.correctIndex,
              isCorrect: aptitudeAnswers[q.id] === q.correctIndex,
            })),
            communicationAnswers: communicationQuestions.map(q => ({
              questionId: q.id,
              question: q.question,
              selectedOption: communicationAnswers[q.id] ?? -1,
            })),
            behavioralAnswers: behavioralQuestions.map(q => ({
              questionId: q.id,
              question: q.question,
              selectedOption: behavioralAnswers[q.id] ?? -1,
            })),
          },
        }),
      })
      const result = await res.json()
      if (result.success && result.scores) {
        setScores(result.scores)
        setPhase('results')
      } else {
        setError(result.error || 'Analysis failed. Please try again.')
        setPhase('behavioral')
      }
    } catch {
      setError('Network error. Please try again.')
      setPhase('behavioral')
    }
  }, [aptitudeAnswers, communicationAnswers, behavioralAnswers, aptitudeQuestions, communicationQuestions, behavioralQuestions, profile])

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
                <Brain className="w-8 h-8" style={{ color: '#8b5cf6' }} />
              </div>
              <h3 className="text-xl font-bold text-white">Create Profile First</h3>
              <p className="text-gray-400 text-sm">You need a neural profile before taking the skill assessment.</p>
              <MagneticButton variant="violet" onClick={() => setCurrentSection('profile')}>
                Create Profile
              </MagneticButton>
            </div>
          </GlassCard>
        </div>
      </section>
    )
  }

  // ─── Render helpers ──────────────────────────────────────────

  const phaseIndex = phase === 'aptitude' ? 0 : phase === 'communication' ? 1 : phase === 'behavioral' ? 2 : 3
  const phaseLabels = ['Aptitude', 'Communication', 'Behavioral', 'Results']

  const renderProgressStepper = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {phaseLabels.map((label, i) => {
        const isComplete = i < phaseIndex
        const isCurrent = i === phaseIndex
        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: isComplete
                    ? 'linear-gradient(135deg, #00f5ff, #8b5cf6)'
                    : isCurrent
                      ? 'rgba(0, 245, 255, 0.15)'
                      : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${isComplete ? 'transparent' : isCurrent ? 'rgba(0, 245, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                  color: isComplete ? '#0a0a1a' : isCurrent ? '#00f5ff' : 'rgba(255,255,255,0.3)',
                  boxShadow: isCurrent ? '0 0 16px rgba(0, 245, 255, 0.25)' : 'none',
                }}
                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {isComplete ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </motion.div>
              <span
                className="text-xs font-medium hidden sm:inline"
                style={{ color: isComplete || isCurrent ? '#c0c0c8' : 'rgba(255,255,255,0.2)' }}
              >
                {label}
              </span>
            </div>
            {i < phaseLabels.length - 1 && (
              <div
                className="w-6 sm:w-10 h-px"
                style={{ background: isComplete ? 'linear-gradient(90deg, #00f5ff, #8b5cf6)' : 'rgba(255,255,255,0.08)' }}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )

  const renderMCQCard = (
    q: MCQ | ScenarioQ,
    index: number,
    selected: number | undefined,
    onSelect: (qId: string, optIndex: number) => void,
    showCorrect?: boolean,
    correctIdx?: number,
  ) => (
    <motion.div
      key={q.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <GlassCard glowColor={selected !== undefined ? '#00f5ff' : '#8b5cf6'} tiltEnabled={false}>
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.12), rgba(139, 92, 246, 0.12))',
                border: '1px solid rgba(0, 245, 255, 0.2)',
                color: '#00f5ff',
              }}
            >
              {index + 1}
            </div>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed pt-1">{q.question}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-11">
            {q.options.map((opt, oi) => {
              const isSelected = selected === oi
              const isCorrect = showCorrect && correctIdx === oi
              const isWrong = showCorrect && isSelected && correctIdx !== oi
              return (
                <motion.button
                  key={oi}
                  onClick={() => onSelect(q.id, oi)}
                  className="relative text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200"
                  style={{
                    background: isCorrect
                      ? 'rgba(0, 245, 255, 0.12)'
                      : isWrong
                        ? 'rgba(239, 68, 68, 0.12)'
                        : isSelected
                          ? 'rgba(0, 245, 255, 0.08)'
                          : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${
                      isCorrect
                        ? 'rgba(0, 245, 255, 0.4)'
                        : isWrong
                          ? 'rgba(239, 68, 68, 0.4)'
                          : isSelected
                            ? 'rgba(0, 245, 255, 0.3)'
                            : 'rgba(255, 255, 255, 0.08)'
                    }`,
                    color: isCorrect ? '#00f5ff' : isWrong ? '#ef4444' : isSelected ? '#00f5ff' : '#c0c0c8',
                    boxShadow: isSelected ? '0 0 12px rgba(0, 245, 255, 0.15)' : 'none',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2 font-bold opacity-50">{String.fromCharCode(65 + oi)})</span>
                  {opt}
                  {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 inline ml-2" style={{ color: '#00f5ff' }} />}
                  {isWrong && <Circle className="w-3.5 h-3.5 inline ml-2" style={{ color: '#ef4444' }} />}
                </motion.button>
              )
            })}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )

  const allAptitudeAnswered = aptitudeQuestions.every(q => aptitudeAnswers[q.id] !== undefined)
  const allCommunicationAnswered = communicationQuestions.every(q => communicationAnswers[q.id] !== undefined)
  const allBehavioralAnswered = behavioralQuestions.every(q => behavioralAnswers[q.id] !== undefined)

  // ─── Phase Renderers ─────────────────────────────────────────

  const renderAptitude = () => (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2.5 rounded-xl"
          style={{ background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.12), rgba(139, 92, 246, 0.08))', border: '1px solid rgba(0, 245, 255, 0.2)' }}
        >
          <Brain className="w-5 h-5" style={{ color: '#00f5ff' }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Aptitude Mini Test</h3>
          <p className="text-xs text-gray-400">Logical reasoning, problem-solving & numerical ability</p>
        </div>
      </div>
      {aptitudeQuestions.map((q, i) =>
        renderMCQCard(q, i, aptitudeAnswers[q.id], (qId, oi) =>
          setAptitudeAnswers(prev => ({ ...prev, [qId]: oi }))
        )
      )}
      <div className="flex justify-end pt-2">
        <MagneticButton
          variant="cyan"
          onClick={() => setPhase('communication')}
          disabled={!allAptitudeAnswered}
          size="lg"
        >
          Next: Communication <ArrowRight className="w-4 h-4" />
        </MagneticButton>
      </div>
    </div>
  )

  const renderCommunication = () => (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2.5 rounded-xl"
          style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(139, 92, 246, 0.08))', border: '1px solid rgba(6, 182, 212, 0.2)' }}
        >
          <MessageSquare className="w-5 h-5" style={{ color: '#06b6d4' }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Communication Test</h3>
          <p className="text-xs text-gray-400">Scenario-based communication assessment</p>
        </div>
      </div>
      {communicationQuestions.map((q, i) =>
        renderMCQCard(q, i, communicationAnswers[q.id], (qId, oi) =>
          setCommunicationAnswers(prev => ({ ...prev, [qId]: oi }))
        )
      )}
      <div className="flex justify-between pt-2">
        <MagneticButton variant="ghost" onClick={() => setPhase('aptitude')} size="md">
          Back
        </MagneticButton>
        <MagneticButton
          variant="cyan"
          onClick={() => setPhase('behavioral')}
          disabled={!allCommunicationAnswered}
          size="lg"
        >
          Next: Behavioral <ArrowRight className="w-4 h-4" />
        </MagneticButton>
      </div>
    </div>
  )

  const renderBehavioral = () => (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2.5 rounded-xl"
          style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(0, 245, 255, 0.08))', border: '1px solid rgba(139, 92, 246, 0.2)' }}
        >
          <Users className="w-5 h-5" style={{ color: '#8b5cf6' }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Behavioral Assessment</h3>
          <p className="text-xs text-gray-400">Workplace scenario evaluation</p>
        </div>
      </div>
      {behavioralQuestions.map((q, i) =>
        renderMCQCard(q, i, behavioralAnswers[q.id], (qId, oi) =>
          setBehavioralAnswers(prev => ({ ...prev, [qId]: oi }))
        )
      )}
      <div className="flex justify-between pt-2">
        <MagneticButton variant="ghost" onClick={() => setPhase('communication')} size="md">
          Back
        </MagneticButton>
        <MagneticButton
          variant="violet"
          onClick={analyzeAnswers}
          disabled={!allBehavioralAnswered}
          size="lg"
        >
          <Sparkles className="w-4 h-4" />
          Get AI Evaluation
        </MagneticButton>
      </div>
    </div>
  )

  const renderAnalyzing = () => (
    <div className="max-w-md mx-auto text-center py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(139, 92, 246, 0.1))',
            border: '1px solid rgba(0, 245, 255, 0.2)',
            boxShadow: '0 0 40px rgba(0, 245, 255, 0.15)',
          }}
        >
          <Loader2 className="w-12 h-12 animate-spin" style={{ color: '#00f5ff' }} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">AI Skill Evaluation in Progress</h3>
        <p className="text-sm text-gray-400">Analyzing your responses across multiple dimensions...</p>
        {error && <p className="text-sm text-red-400 mt-4">{error}</p>}
      </motion.div>
    </div>
  )

  const renderResults = () => {
    if (!scores) return null

    const scoreBars = [
      { label: 'Aptitude Score', value: scores.aptitude, icon: Brain, color: getScoreColor(scores.aptitude) },
      { label: 'Communication Score', value: scores.communication, icon: MessageSquare, color: getScoreColor(scores.communication) },
      { label: 'Problem-Solving Score', value: scores.problemSolving, icon: Target, color: getScoreColor(scores.problemSolving) },
      { label: 'Overall Skill Rating', value: scores.overall, icon: Award, color: getScoreColor(scores.overall) },
    ]

    return (
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(139, 92, 246, 0.15))',
              border: '1px solid rgba(0, 245, 255, 0.3)',
              boxShadow: '0 0 40px rgba(0, 245, 255, 0.2)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <Award className="w-10 h-10" style={{ color: '#00f5ff' }} />
          </motion.div>
          <h3
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Skill Assessment Complete
          </h3>
          <p className="text-sm text-gray-400">Your AI-powered skill evaluation results</p>
        </motion.div>

        {/* Overall score ring */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <motion.circle
                cx="60" cy="60" r="52" fill="none"
                stroke={getScoreColor(scores.overall)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - scores.overall / 100) }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                style={{ filter: `drop-shadow(0 0 8px ${getScoreColor(scores.overall)}80)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-3xl font-bold"
                style={{ color: getScoreColor(scores.overall) }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {scores.overall}
              </motion.span>
              <span className="text-xs text-gray-500">Overall</span>
            </div>
          </div>
        </motion.div>

        {/* Score bars */}
        <div className="space-y-4">
          {scoreBars.map((item, i) => {
            const IconComp = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
              >
                <GlassCard glowColor={item.color} tiltEnabled={false}>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
                      >
                        <IconComp className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <span className="text-sm font-medium text-white flex-1">{item.label}</span>
                      <motion.span
                        className="text-xl font-bold tabular-nums"
                        style={{ color: item.color }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.12 }}
                      >
                        {item.value}
                      </motion.span>
                    </div>
                    <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: getBarGradient(item.value),
                          boxShadow: getBarGlow(item.value),
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1.2, delay: 0.6 + i * 0.12, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        {/* Retake */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <MagneticButton
            variant="ghost"
            onClick={() => {
              setPhase('aptitude')
              setAptitudeAnswers({})
              setCommunicationAnswers({})
              setBehavioralAnswers({})
              setScores(null)
            }}
          >
            <BarChart3 className="w-4 h-4" /> Retake Assessment
          </MagneticButton>
        </motion.div>
      </div>
    )
  }

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
              animation: 'gradientShiftSkill 4s ease infinite',
            }}
          >
            AI Skill Assessment
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Evaluate your aptitude, communication, and behavioral skills with AI-powered analysis
          </p>
        </motion.div>

        {/* Progress Stepper */}
        {phase !== 'analyzing' && phase !== 'results' && renderProgressStepper()}

        {/* Phase Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {phase === 'aptitude' && renderAptitude()}
            {phase === 'communication' && renderCommunication()}
            {phase === 'behavioral' && renderBehavioral()}
            {phase === 'analyzing' && renderAnalyzing()}
            {phase === 'results' && renderResults()}
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes gradientShiftSkill {
          0% { background-position: 0% center; }
          50% { background-position: 200% center; }
          100% { background-position: 0% center; }
        }
      `}</style>
    </section>
  )
}
