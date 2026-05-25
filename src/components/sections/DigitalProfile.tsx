'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import GlassCard from '@/components/shared/GlassCard';
import HexagonalAvatar from '@/components/shared/HexagonalAvatar';
import {
  MapPin,
  Sparkles,
  Award,
  Brain,
  MessageCircle,
  Heart,
  Briefcase,
  BarChart3,
  Users,
  Lightbulb,
} from 'lucide-react';

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 245, 255';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ label, value, color = '#00f5ff' }: { label: string; value: number; color?: string }) {
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 40, damping: 20 });
  const widthTransform = useTransform(springVal, (v) => `${v}%`);
  const [width, setWidth] = useState('0%');

  useEffect(() => {
    const unsub = widthTransform.on('change', (v) => setWidth(v));
    return unsub;
  }, [widthTransform]);

  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  const rgb = hexToRgb(color);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span style={{ color }} className="font-semibold tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `rgba(${rgb}, 0.1)` }}>
        <motion.div
          className="h-full rounded-full"
          style={{
            width,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 8px ${color}40`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

// ─── Metric Item ──────────────────────────────────────────────────────────────
function MetricItem({ label, value, color = '#00f5ff' }: { label: string; value: number; color?: string }) {
  const rgb = hexToRgb(color);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>{value}</span>
      </div>
      <div className="h-1 rounded-full" style={{ background: `rgba(${rgb}, 0.1)` }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 6px ${color}30`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Collaboration Spectrum Bar ───────────────────────────────────────────────
function SpectrumBar({
  leftLabel,
  rightLabel,
  value,
  color = '#00f5ff',
}: {
  leftLabel: string;
  rightLabel: string;
  value: number;
  color?: string;
}) {
  const rgb = hexToRgb(color);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">{leftLabel}</span>
        <span className="text-gray-500">{rightLabel}</span>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: `rgba(${rgb}, 0.08)` }}>
        {/* Gradient track */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}15, rgba(${rgb}, 0.02), #8b5cf615)`,
          }}
        />
        {/* Marker */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
          style={{
            left: `${value}%`,
            transform: 'translate(-50%, -50%)',
            background: `linear-gradient(135deg, ${color}, #8b5cf6)`,
            boxShadow: `0 0 12px ${color}60, 0 0 4px ${color}90`,
            border: '2px solid rgba(255,255,255,0.2)',
          }}
          initial={{ left: '50%', opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          animate={{ left: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <div className="text-center">
        <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const intelligencePanels = [
  {
    title: 'Personality Summary',
    primaryTrait: 'Strategic Visionary',
    description:
      'Combines analytical precision with creative innovation. Natural leader who inspires through clarity and empathy.',
    tags: ['Analytical', 'Creative', 'Empathetic', 'Strategic'],
    icon: Brain,
    color: '#00f5ff',
    type: 'tags' as const,
  },
  {
    title: 'Communication Style',
    primaryTrait: 'Structured Articulate',
    description:
      'Excels at translating complex ideas into clear narratives. Strong active listening with responsive adaptation.',
    icon: MessageCircle,
    color: '#8b5cf6',
    type: 'scores' as const,
    scores: [
      { label: 'Clarity', value: 95 },
      { label: 'Persuasion', value: 88 },
      { label: 'Listening', value: 92 },
      { label: 'Adaptability', value: 86 },
    ],
  },
  {
    title: 'Emotional Intelligence Profile',
    primaryTrait: 'Empathic Leader',
    description:
      'Demonstrates high self-awareness and interpersonal sensitivity. Manages emotional dynamics effectively.',
    icon: Heart,
    color: '#06b6d4',
    type: 'metrics' as const,
    metrics: [
      { label: 'Self-Awareness', value: 92 },
      { label: 'Empathy', value: 94 },
      { label: 'Social Skills', value: 88 },
      { label: 'Self-Regulation', value: 90 },
    ],
  },
  {
    title: 'Work Behavior Analysis',
    primaryTrait: 'Collaborative Achiever',
    description:
      'Balances independent drive with team-oriented collaboration. Thrives in dynamic, high-impact environments.',
    icon: Briefcase,
    color: '#00f5ff',
    type: 'tags' as const,
    tags: ['Self-Starter', 'Team Player', 'Detail-Oriented', 'Results-Driven'],
  },
];

const spectrums = [
  { leftLabel: 'Independent', rightLabel: 'Collaborative', value: 72, color: '#00f5ff' },
  { leftLabel: 'Analytical', rightLabel: 'Creative', value: 65, color: '#8b5cf6' },
  { leftLabel: 'Reserved', rightLabel: 'Expressive', value: 78, color: '#06b6d4' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DigitalProfile() {
  return (
    <section className="relative py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #00f5ff, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Digital Human Profile
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            AI-Generated Human Intelligence Snapshot
          </p>
        </motion.div>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
            <div className="p-6 md:p-8">
              {/* TOP: Profile Header */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-8" style={{ borderBottom: '1px solid rgba(0, 245, 255, 0.08)' }}>
                {/* Hexagonal Avatar */}
                <div className="shrink-0">
                  <HexagonalAvatar size={120} glowColor="#00f5ff" alt="Sarah Chen" />
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3
                    className="text-3xl md:text-4xl font-bold mb-1"
                    style={{
                      background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Sarah Chen
                  </h3>
                  <p className="text-gray-400 text-lg mb-3">Senior Product Manager</p>

                  {/* AI Score Badge */}
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                    <div
                      className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{
                        background: 'rgba(0, 245, 255, 0.08)',
                        border: '1px solid rgba(0, 245, 255, 0.25)',
                        boxShadow: '0 0 20px rgba(0, 245, 255, 0.15), inset 0 0 12px rgba(0, 245, 255, 0.05)',
                      }}
                    >
                      <Sparkles className="w-4 h-4" style={{ color: '#00f5ff' }} />
                      <span className="text-xl font-bold" style={{ color: '#00f5ff' }}>96</span>
                      <span className="text-xs text-gray-400">/100</span>
                    </div>
                  </div>

                  {/* Location + Status */}
                  <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                    <div className="flex items-center gap-1.5 text-sm text-gray-400">
                      <MapPin className="w-3.5 h-3.5" />
                      San Francisco, CA
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#22c55e',
                      }}
                    >
                      Available
                    </span>
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: 'rgba(0, 245, 255, 0.1)',
                        border: '1px solid rgba(0, 245, 255, 0.3)',
                        color: '#00f5ff',
                      }}
                    >
                      Top Candidate
                    </span>
                  </div>
                </div>
              </div>

              {/* MIDDLE: Intelligence Panels (2x2) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {intelligencePanels.map((panel, index) => {
                  const IconComp = panel.icon;
                  const rgb = hexToRgb(panel.color);
                  return (
                    <motion.div
                      key={panel.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div
                        className="p-5 rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, rgba(${rgb}, 0.04), rgba(255,255,255,0.01))`,
                          border: `1px solid rgba(${rgb}, 0.1)`,
                        }}
                      >
                        {/* Panel Header */}
                        <div className="flex items-center gap-2.5 mb-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              background: `rgba(${rgb}, 0.1)`,
                              border: `1px solid rgba(${rgb}, 0.2)`,
                            }}
                          >
                            <IconComp className="w-4 h-4" style={{ color: panel.color }} />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300">{panel.title}</h4>
                            <span className="text-xs font-bold" style={{ color: panel.color }}>
                              {panel.primaryTrait}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-400 leading-relaxed mb-3">{panel.description}</p>

                        {/* Tags or Scores or Metrics */}
                        {panel.type === 'tags' && panel.tags && (
                          <div className="flex flex-wrap gap-2">
                            {panel.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 rounded-full text-xs font-medium"
                                style={{
                                  background: `rgba(${rgb}, 0.08)`,
                                  border: `1px solid rgba(${rgb}, 0.2)`,
                                  color: panel.color,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {panel.type === 'scores' && panel.scores && (
                          <div className="space-y-2.5">
                            {panel.scores.map((s) => (
                              <ScoreBar key={s.label} label={s.label} value={s.value} color={panel.color} />
                            ))}
                          </div>
                        )}

                        {panel.type === 'metrics' && panel.metrics && (
                          <div className="space-y-2.5">
                            {panel.metrics.map((m) => (
                              <MetricItem key={m.label} label={m.label} value={m.value} color={panel.color} />
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* BOTTOM: Collaboration Style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="p-5 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.03), rgba(139, 92, 246, 0.03))',
                    border: '1px solid rgba(0, 245, 255, 0.08)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-5">
                    <BarChart3 className="w-5 h-5" style={{ color: '#00f5ff' }} />
                    <h4 className="text-sm font-semibold text-gray-300">Collaboration Style</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {spectrums.map((s) => (
                      <SpectrumBar
                        key={s.leftLabel}
                        leftLabel={s.leftLabel}
                        rightLabel={s.rightLabel}
                        value={s.value}
                        color={s.color}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
