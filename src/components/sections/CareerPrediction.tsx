'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import GlassCard from '@/components/shared/GlassCard';
import { TrendingUp, Zap, Target, Brain, Rocket } from 'lucide-react';

// ─── Circular Progress for Match % ───────────────────────────────────────────
function CircularProgress({
  value,
  size = 80,
  strokeWidth = 5,
  color = '#00f5ff',
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 40, damping: 20 });
  const dashOffset = useTransform(springVal, (v) => circumference * (1 - v / 100));
  const [offset, setOffset] = useState(circumference);
  const [displayVal, setDisplayVal] = useState(0);
  const displayTransform = useTransform(springVal, (v) => Math.round(v));

  useEffect(() => {
    const unsubOffset = dashOffset.on('change', (v) => setOffset(v));
    const unsubDisplay = displayTransform.on('change', (v) => setDisplayVal(v));
    return () => {
      unsubOffset();
      unsubDisplay();
    };
  }, [dashOffset, displayTransform]);

  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  const colorRgb = hexToRgb(color);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 ${size * 0.25}px ${color}20` }}
      />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`rgba(${colorRgb}, 0.12)`}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold tabular-nums" style={{ color }}>
          {displayVal}%
        </span>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 245, 255';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const careerPredictions = [
  {
    title: 'Chief Technology Officer',
    match: 94,
    description: 'Exceptional technical leadership combined with strategic vision',
    glowColor: '#00f5ff',
    tags: ['Technical Leadership', 'Strategic Vision', 'Innovation', 'Architecture'],
    growth: '+34%',
  },
  {
    title: 'Product Strategy Lead',
    match: 89,
    description: 'Strong innovation mindset with cross-functional collaboration skills',
    glowColor: '#8b5cf6',
    tags: ['Innovation', 'Cross-functional', 'Strategy', 'Product Sense'],
    growth: '+28%',
  },
  {
    title: 'Startup Founder',
    match: 87,
    description: 'High risk tolerance with creative problem-solving and resilience',
    glowColor: '#06b6d4',
    glowColor2: '#8b5cf6',
    tags: ['Risk Tolerance', 'Problem Solving', 'Resilience', 'Creativity'],
    growth: '+41%',
  },
];

const leadershipData = [
  { subject: 'Vision', value: 90 },
  { subject: 'Decision Making', value: 85 },
  { subject: 'Team Building', value: 82 },
  { subject: 'Communication', value: 92 },
  { subject: 'Strategic Thinking', value: 88 },
];

const managementData = [
  { name: 'Technical Mgmt', value: 88 },
  { name: 'People Mgmt', value: 78 },
  { name: 'Project Mgmt', value: 85 },
  { name: 'Innovation Mgmt', value: 91 },
];

const growthInsights = [
  {
    title: 'Technical Communication: Exceptional',
    description: 'Ability to translate complex concepts clearly',
    icon: Zap,
    color: '#00f5ff',
  },
  {
    title: 'Startup DNA: Strong',
    description: 'Natural entrepreneurial instincts with calculated risk-taking',
    icon: Rocket,
    color: '#8b5cf6',
  },
  {
    title: 'Management Track: Ready in 18-24 months',
    description: 'Current trajectory shows management readiness',
    icon: TrendingUp,
    color: '#06b6d4',
  },
  {
    title: 'Innovation Quotient: Top 5%',
    description: 'Creative problem-solving in the highest percentile',
    icon: Brain,
    color: '#00f5ff',
  },
];

// ─── Custom Tooltip for BarChart ──────────────────────────────────────────────
function CustomBarTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs font-medium"
      style={{
        background: 'rgba(10, 10, 30, 0.9)',
        border: '1px solid rgba(0, 245, 255, 0.2)',
        color: '#e0e0e0',
        backdropFilter: 'blur(10px)',
      }}
    >
      {payload[0].value}%
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CareerPrediction() {
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
            AI Career Prediction
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Neural-powered career trajectory forecasting and role compatibility analysis
          </p>
        </motion.div>

        {/* Career Prediction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {careerPredictions.map((career, index) => (
            <motion.div
              key={career.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <GlassCard
                glowColor={career.glowColor}
                className="h-full"
              >
                <div className="p-6">
                  {/* Match Percentage */}
                  <div className="flex items-center justify-between mb-4">
                    <CircularProgress value={career.match} size={72} color={career.glowColor} />
                    <div className="flex items-center gap-1.5 text-sm" style={{ color: '#22c55e' }}>
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">{career.growth}</span>
                    </div>
                  </div>

                  {/* Career Title */}
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{
                      background: career.glowColor2
                        ? `linear-gradient(135deg, ${career.glowColor}, ${career.glowColor2})`
                        : `linear-gradient(135deg, ${career.glowColor}, ${career.glowColor}cc)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {career.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {career.description}
                  </p>

                  {/* Strength Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {career.tags.map((tag) => {
                      const rgb = hexToRgb(career.glowColor);
                      return (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: `rgba(${rgb}, 0.1)`,
                            border: `1px solid rgba(${rgb}, 0.25)`,
                            color: career.glowColor,
                            boxShadow: `0 0 8px rgba(${rgb}, 0.15)`,
                          }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>

                  {/* Growth Potential Indicator */}
                  <div
                    className="flex items-center gap-2 pt-3"
                    style={{ borderTop: `1px solid rgba(${hexToRgb(career.glowColor)}, 0.1)` }}
                  >
                    <Target className="w-4 h-4" style={{ color: career.glowColor }} />
                    <span className="text-xs text-gray-500">Growth Potential</span>
                    <div className="ml-auto flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-sm font-semibold text-green-400">{career.growth}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Leadership & Management Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Leadership Suitability */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard glowColor="#00f5ff">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-200">Leadership Suitability</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold" style={{ color: '#00f5ff' }}>88</span>
                    <span className="text-sm text-gray-500">/100</span>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={leadershipData}>
                      <PolarGrid stroke="rgba(0, 245, 255, 0.1)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: '#6b7280', fontSize: 9 }}
                        axisLine={false}
                      />
                      <Radar
                        name="Leadership"
                        dataKey="value"
                        stroke="#00f5ff"
                        fill="#00f5ff"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Management Compatibility */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard glowColor="#8b5cf6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-200">Management Compatibility</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold" style={{ color: '#8b5cf6' }}>82</span>
                    <span className="text-sm text-gray-500">/100</span>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={managementData}
                      layout="vertical"
                      margin={{ left: 20, right: 20, top: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.08)" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={100}
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Bar
                        dataKey="value"
                        radius={[0, 6, 6, 0]}
                        fill="url(#barGradientViolet)"
                        barSize={18}
                      />
                      <defs>
                        <linearGradient id="barGradientViolet" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Growth Intelligence */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-gray-300 mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5" style={{ color: '#00f5ff' }} />
            Growth Intelligence
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {growthInsights.map((insight, index) => {
              const IconComp = insight.icon;
              const rgb = hexToRgb(insight.color);
              return (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <GlassCard glowColor={insight.color} tiltEnabled={false}>
                    <div className="p-5">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                        style={{
                          background: `rgba(${rgb}, 0.1)`,
                          border: `1px solid rgba(${rgb}, 0.2)`,
                        }}
                      >
                        <IconComp className="w-5 h-5" style={{ color: insight.color }} />
                      </div>
                      <h4
                        className="text-sm font-bold mb-1.5"
                        style={{ color: insight.color }}
                      >
                        {insight.title}
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
