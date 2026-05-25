'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Heart, Zap, RotateCcw } from 'lucide-react';

const TIMELINE_DATA = [
  { phase: 'Introduction', confidence: 72, engagement: 65, stress: 30 },
  { phase: 'Experience', confidence: 78, engagement: 70, stress: 45 },
  { phase: 'Leadership', confidence: 85, engagement: 82, stress: 25 },
  { phase: 'Problem-Solving', confidence: 80, engagement: 75, stress: 55 },
  { phase: 'Creativity', confidence: 88, engagement: 90, stress: 20 },
  { phase: 'Cultural Fit', confidence: 82, engagement: 85, stress: 35 },
  { phase: 'Closing', confidence: 90, engagement: 88, stress: 15 },
];

interface KeyMoment {
  id: number;
  title: string;
  description: string;
  score: number;
  glowColor: string;
  glowColorRgb: string;
  icon: React.ReactNode;
}

const KEY_MOMENTS: KeyMoment[] = [
  {
    id: 1,
    title: 'Peak Confidence',
    description: 'During creativity discussion at 4:32',
    score: 92,
    glowColor: '#00f5ff',
    glowColorRgb: '0, 245, 255',
    icon: <TrendingUp size={16} />,
  },
  {
    id: 2,
    title: 'High Engagement',
    description: 'Leadership narrative at 2:15',
    score: 88,
    glowColor: '#8b5cf6',
    glowColorRgb: '139, 92, 246',
    icon: <Heart size={16} />,
  },
  {
    id: 3,
    title: 'Stress Response',
    description: 'Problem-solving challenge at 3:45',
    score: 45,
    glowColor: '#ff6b6b',
    glowColorRgb: '255, 107, 107',
    icon: <Zap size={16} />,
  },
  {
    id: 4,
    title: 'Strong Recovery',
    description: 'Post-stress adaptability at 4:10',
    score: 85,
    glowColor: '#00f5ff',
    glowColorRgb: '0, 245, 255',
    icon: <RotateCcw size={16} />,
  },
];

// Custom glassmorphism tooltip
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background:
          'linear-gradient(135deg, rgba(10, 10, 30, 0.9), rgba(20, 20, 50, 0.85))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 245, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 245, 255, 0.05)',
      }}
    >
      <p
        className="text-xs font-semibold mb-2"
        style={{ color: 'rgba(255,255,255,0.8)' }}
      >
        {label}
      </p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-1 last:mb-0">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {entry.dataKey === 'confidence'
              ? 'Confidence'
              : entry.dataKey === 'engagement'
                ? 'Emotional Engagement'
                : 'Stress Level'}
            :
          </span>
          <span className="text-[11px] font-bold" style={{ color: entry.color }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// Custom legend
function CustomLegend({
  payload,
}: {
  payload?: Array<{ value: string; color: string }>;
}) {
  if (!payload) return null;

  const labels: Record<string, string> = {
    confidence: 'Confidence',
    engagement: 'Emotional Engagement',
    stress: 'Stress Level',
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <div
            className="w-3 h-1 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {labels[entry.value] || entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function KeyMomentCard({ moment, index }: { moment: KeyMoment; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: 0.3 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative"
    >
      {/* Timeline dot connector */}
      <div className="flex justify-center mb-2">
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: moment.glowColor,
            boxShadow: `0 0 10px ${moment.glowColor}60, 0 0 20px ${moment.glowColor}30`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              `0 0 10px ${moment.glowColor}60, 0 0 20px ${moment.glowColor}30`,
              `0 0 15px ${moment.glowColor}80, 0 0 30px ${moment.glowColor}40`,
              `0 0 10px ${moment.glowColor}60, 0 0 20px ${moment.glowColor}30`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
        />
      </div>

      <div
        className="rounded-xl p-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(${moment.glowColorRgb}, 0.04), rgba(255,255,255,0.01), rgba(${moment.glowColorRgb}, 0.02))`,
          backdropFilter: 'blur(16px)',
          border: `1px solid rgba(${moment.glowColorRgb}, 0.12)`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.25), 0 0 15px rgba(${moment.glowColorRgb}, 0.06)`,
        }}
      >
        {/* Glow accent */}
        <div
          className="absolute top-0 left-0 w-full h-0.5"
          style={{
            background: `linear-gradient(90deg, transparent, ${moment.glowColor}40, transparent)`,
          }}
        />

        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: `rgba(${moment.glowColorRgb}, 0.1)`,
                border: `1px solid rgba(${moment.glowColorRgb}, 0.15)`,
                color: moment.glowColor,
              }}
            >
              {moment.icon}
            </div>
            <h4
              className="text-sm font-semibold"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {moment.title}
            </h4>
          </div>
          <motion.span
            className="text-xl font-bold tabular-nums"
            style={{ color: moment.glowColor }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
          >
            {moment.score}
          </motion.span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {moment.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function EmotionalTimeline() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      {/* Keyframe styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes gradientShift2 {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `,
        }}
      />

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
            background: 'linear-gradient(135deg, #8b5cf6, #00f5ff, #8b5cf6)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientShift2 4s ease-in-out infinite',
          }}
        >
          Emotional Timeline
        </h2>
        <p
          className="text-sm sm:text-base max-w-2xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          Track emotional intelligence and behavioral patterns throughout the
          interview
        </p>
      </motion.div>

      {/* Timeline Chart */}
      <motion.div
        className="max-w-6xl mx-auto mb-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <div
          className="rounded-2xl p-4 sm:p-6"
          style={{
            background:
              'linear-gradient(135deg, rgba(0, 245, 255, 0.03), rgba(255, 255, 255, 0.01), rgba(139, 92, 246, 0.02))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 245, 255, 0.1)',
            boxShadow:
              '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
          }}
        >
          <div className="w-full h-[300px] sm:h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={TIMELINE_DATA}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  {/* Confidence gradient */}
                  <linearGradient
                    id="confidenceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#00f5ff"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#00f5ff"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                  {/* Engagement gradient */}
                  <linearGradient
                    id="engagementGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#8b5cf6"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="#8b5cf6"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                  {/* Stress gradient */}
                  <linearGradient
                    id="stressGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#ff6b6b"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="#ff6b6b"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 6"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="phase"
                  tick={{
                    fill: 'rgba(255,255,255,0.35)',
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{
                    fill: 'rgba(255,255,255,0.3)',
                    fontSize: 10,
                  }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  tickLine={false}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
                <Area
                  type="monotone"
                  dataKey="confidence"
                  stroke="#00f5ff"
                  strokeWidth={2}
                  fill="url(#confidenceGradient)"
                  dot={{
                    r: 3,
                    fill: '#00f5ff',
                    stroke: '#00f5ff',
                    strokeWidth: 1,
                  }}
                  activeDot={{
                    r: 5,
                    fill: '#00f5ff',
                    stroke: 'rgba(0, 245, 255, 0.3)',
                    strokeWidth: 3,
                  }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#engagementGradient)"
                  dot={{
                    r: 3,
                    fill: '#8b5cf6',
                    stroke: '#8b5cf6',
                    strokeWidth: 1,
                  }}
                  activeDot={{
                    r: 5,
                    fill: '#8b5cf6',
                    stroke: 'rgba(139, 92, 246, 0.3)',
                    strokeWidth: 3,
                  }}
                  animationDuration={1800}
                  animationEasing="ease-in-out"
                />
                <Area
                  type="monotone"
                  dataKey="stress"
                  stroke="#ff6b6b"
                  strokeWidth={2}
                  fill="url(#stressGradient)"
                  dot={{
                    r: 3,
                    fill: '#ff6b6b',
                    stroke: '#ff6b6b',
                    strokeWidth: 1,
                  }}
                  activeDot={{
                    r: 5,
                    fill: '#ff6b6b',
                    stroke: 'rgba(255, 107, 107, 0.3)',
                    strokeWidth: 3,
                  }}
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Neural Pulse Indicators */}
      <motion.div
        className="max-w-6xl mx-auto mb-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div
          className="rounded-xl py-3 px-4 flex items-center justify-center gap-2"
          style={{
            background: 'rgba(0, 245, 255, 0.02)',
            border: '1px solid rgba(0, 245, 255, 0.06)',
          }}
        >
          {TIMELINE_DATA.map((phase, i) => {
            const intensity = Math.max(phase.confidence, phase.engagement) / 100;
            const isHigh = intensity > 0.82;
            const color =
              phase.stress > 40
                ? '#ff6b6b'
                : phase.engagement > phase.confidence
                  ? '#8b5cf6'
                  : '#00f5ff';
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <motion.div
                  className="rounded-full"
                  style={{
                    width: isHigh ? 8 : 6,
                    height: isHigh ? 8 : 6,
                    backgroundColor: color,
                    boxShadow: isHigh
                      ? `0 0 8px ${color}60, 0 0 16px ${color}30`
                      : `0 0 4px ${color}40`,
                  }}
                  animate={{
                    scale: isHigh ? [1, 1.5, 1] : [1, 1.15, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: isHigh ? 1.2 : 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
                <span
                  className="text-[8px] font-medium hidden sm:block"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                >
                  {phase.phase.slice(0, 4)}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Key Moments Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KEY_MOMENTS.map((moment, idx) => (
          <KeyMomentCard key={moment.id} moment={moment} index={idx} />
        ))}
      </div>
    </section>
  );
}
