'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import GlassCard from '@/components/shared/GlassCard';
import {
  Users,
  Brain,
  Target,
  Star,
  TrendingUp,
  MessageCircle,
  ArrowUpRight,
  Bot,
} from 'lucide-react';

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({
  value,
  suffix = '',
  decimals = 0,
  color = '#00f5ff',
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  color?: string;
}) {
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 40, damping: 20 });
  const displayTransform = useTransform(springVal, (v) => v.toFixed(decimals));
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const unsub = displayTransform.on('change', (v) => setDisplay(v));
    return unsub;
  }, [displayTransform]);

  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  return (
    <span className="text-3xl md:text-4xl font-bold tabular-nums" style={{ color }}>
      {display}
      {suffix}
    </span>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 245, 255';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const metricCards = [
  {
    label: 'Total Candidates',
    value: 1247,
    suffix: '',
    decimals: 0,
    change: '+12%',
    icon: Users,
    color: '#00f5ff',
  },
  {
    label: 'AI Analysis Complete',
    value: 1183,
    suffix: '',
    decimals: 0,
    change: '+8%',
    icon: Brain,
    color: '#8b5cf6',
  },
  {
    label: 'Avg Match Score',
    value: 84.2,
    suffix: '%',
    decimals: 1,
    change: '+3.2%',
    icon: Target,
    color: '#00f5ff',
  },
  {
    label: 'Shortlisted',
    value: 156,
    suffix: '',
    decimals: 0,
    change: '',
    icon: Star,
    color: '#8b5cf6',
  },
];

const candidates = [
  { rank: 1, name: 'Sarah Chen', initials: 'SC', score: 96, personality: 94, communication: 98, status: 'Top Pick', color: '#00f5ff' },
  { rank: 2, name: 'Marcus Johnson', initials: 'MJ', score: 93, personality: 91, communication: 95, status: 'Top Pick', color: '#00f5ff' },
  { rank: 3, name: 'Elena Rodriguez', initials: 'ER', score: 91, personality: 89, communication: 92, status: 'Shortlisted', color: '#8b5cf6' },
  { rank: 4, name: 'James Park', initials: 'JP', score: 88, personality: 86, communication: 90, status: 'Shortlisted', color: '#8b5cf6' },
  { rank: 5, name: 'Aisha Patel', initials: 'AP', score: 85, personality: 83, communication: 87, status: 'Under Review', color: '#94a3b8' },
  { rank: 6, name: 'David Kim', initials: 'DK', score: 82, personality: 80, communication: 84, status: 'Under Review', color: '#94a3b8' },
];

const pieData = [
  { name: '90-100', value: 42, color: '#00f5ff' },
  { name: '80-89', value: 68, color: '#8b5cf6' },
  { name: '70-79', value: 53, color: '#06b6d4' },
  { name: '60-69', value: 22, color: '#94a3b8' },
];

const communicationData = [
  { name: 'S. Chen', value: 98 },
  { name: 'M. Johnson', value: 95 },
  { name: 'E. Rodriguez', value: 92 },
  { name: 'J. Park', value: 90 },
  { name: 'A. Patel', value: 87 },
  { name: 'D. Kim', value: 84 },
];

const aiMessages = [
  "Based on neural analysis, Sarah Chen shows the highest leadership potential. Her emotional intelligence score of 94 combined with communication score of 98 makes her ideal for senior roles.",
  "Marcus Johnson demonstrates exceptional adaptability. Consider him for roles requiring cross-functional collaboration.",
  "Elena Rodriguez's creativity score of 92 suggests strong potential for innovation-focused positions.",
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, color }: { status: string; color: string }) {
  const rgb = hexToRgb(color);
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: `rgba(${rgb}, 0.12)`,
        border: `1px solid rgba(${rgb}, 0.3)`,
        color,
      }}
    >
      {status}
    </span>
  );
}

// ─── Custom Pie Tooltip ───────────────────────────────────────────────────────
function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs"
      style={{
        background: 'rgba(10, 10, 30, 0.9)',
        border: `1px solid ${payload[0].payload.color}33`,
        color: '#e0e0e0',
        backdropFilter: 'blur(10px)',
      }}
    >
      Score {payload[0].name}: <span style={{ color: payload[0].payload.color }}>{payload[0].value}</span> candidates
    </div>
  );
}

// ─── Custom Bar Tooltip ───────────────────────────────────────────────────────
function CustomCommTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) {
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
      Score: {payload[0].value}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CommandCenter() {
  const [typingIndex, setTypingIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTypingIndex((prev) => (prev + 1) % (aiMessages.length + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
            Recruiter Command Center
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Mission control for AI-powered hiring decisions
          </p>
        </motion.div>

        {/* Top Row: Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metricCards.map((metric, index) => {
            const IconComp = metric.icon;
            const rgb = hexToRgb(metric.color);
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <GlassCard glowColor={metric.color} tiltEnabled={false}>
                  <div className="p-4 md:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{
                          background: `rgba(${rgb}, 0.1)`,
                          border: `1px solid rgba(${rgb}, 0.2)`,
                        }}
                      >
                        <IconComp className="w-4.5 h-4.5" style={{ color: metric.color }} />
                      </div>
                      {metric.change && (
                        <div className="flex items-center gap-1 text-xs font-semibold text-green-400">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          {metric.change}
                        </div>
                      )}
                    </div>
                    <AnimatedCounter
                      value={metric.value}
                      suffix={metric.suffix}
                      decimals={metric.decimals}
                      color={metric.color}
                    />
                    <p className="text-xs text-gray-500 mt-1.5 font-medium">{metric.label}</p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Second Row: Candidate Rankings + AI Intelligence Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Candidate Rankings Table */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: '#00f5ff' }} />
                  Candidate Rankings
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase tracking-wider">
                        <th className="text-left pb-3 pl-2">Rank</th>
                        <th className="text-left pb-3">Candidate</th>
                        <th className="text-center pb-3">AI Score</th>
                        <th className="text-center pb-3 hidden sm:table-cell">Personality</th>
                        <th className="text-center pb-3 hidden sm:table-cell">Communication</th>
                        <th className="text-right pb-3 pr-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((c, i) => {
                        const rgb = hexToRgb(c.color);
                        return (
                          <motion.tr
                            key={c.name}
                            className="group cursor-pointer"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.06 }}
                            style={{
                              borderBottom: `1px solid rgba(${rgb}, 0.06)`,
                            }}
                            whileHover={{
                              backgroundColor: `rgba(${rgb}, 0.04)`,
                            }}
                          >
                            <td className="py-3 pl-2">
                              <span
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{
                                  background: `rgba(${rgb}, 0.1)`,
                                  color: c.color,
                                }}
                              >
                                {c.rank}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                  style={{
                                    background: `rgba(${rgb}, 0.12)`,
                                    border: `1px solid rgba(${rgb}, 0.25)`,
                                    color: c.color,
                                  }}
                                >
                                  {c.initials}
                                </div>
                                <span className="text-gray-200 font-medium">{c.name}</span>
                              </div>
                            </td>
                            <td className="py-3 text-center">
                              <span className="font-bold" style={{ color: c.color }}>{c.score}</span>
                            </td>
                            <td className="py-3 text-center hidden sm:table-cell text-gray-400">{c.personality}</td>
                            <td className="py-3 text-center hidden sm:table-cell text-gray-400">{c.communication}</td>
                            <td className="py-3 text-right pr-2">
                              <StatusBadge status={c.status} color={c.color} />
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Intelligence Pie Chart */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                  Score Distribution
                </h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {pieData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: entry.color,
                          boxShadow: `0 0 6px ${entry.color}50`,
                        }}
                      />
                      <span className="text-xs text-gray-400">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Third Row: Communication Analytics + AI Hiring Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Communication Analytics */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard glowColor="#00f5ff" tiltEnabled={false}>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" style={{ color: '#00f5ff' }} />
                  Communication Analytics
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={communicationData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 245, 255, 0.06)" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[60, 100]}
                        tick={{ fill: '#6b7280', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomCommTooltip />} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="url(#barGradientCyan)" barSize={28}>
                      </Bar>
                      <defs>
                        <linearGradient id="barGradientCyan" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00f5ff" stopOpacity={1} />
                          <stop offset="100%" stopColor="#00f5ff" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Hiring Assistant */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard glowColor="#8b5cf6" tiltEnabled={false}>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Bot className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                  AI Hiring Assistant
                </h3>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139, 92, 246, 0.3) transparent' }}>
                  {aiMessages.map((msg, i) => {
                    const rgb8 = hexToRgb('#8b5cf6');
                    const rgbCyan = hexToRgb('#00f5ff');
                    return (
                      <motion.div
                        key={i}
                        className="flex gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.2 }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            background: `rgba(${rgb8}, 0.15)`,
                            border: `1px solid rgba(${rgb8}, 0.3)`,
                          }}
                        >
                          <Bot className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                        </div>
                        <div
                          className="flex-1 p-3 rounded-xl rounded-tl-sm"
                          style={{
                            background: `linear-gradient(135deg, rgba(${rgb8}, 0.06), rgba(${rgbCyan}, 0.03))`,
                            border: `1px solid rgba(${rgb8}, 0.12)`,
                          }}
                        >
                          <p className="text-sm text-gray-300 leading-relaxed">{msg}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                  {/* Typing indicator */}
                  <div className="flex gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: 'rgba(139, 92, 246, 0.15)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      <Bot className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    </div>
                    <div
                      className="p-3 rounded-xl rounded-tl-sm"
                      style={{
                        background: 'rgba(139, 92, 246, 0.06)',
                        border: '1px solid rgba(139, 92, 246, 0.1)',
                      }}
                    >
                      <div className="flex gap-1.5 items-center h-4">
                        {[0, 1, 2].map((dot) => (
                          <motion.div
                            key={dot}
                            className="w-2 h-2 rounded-full"
                            style={{ background: '#8b5cf6' }}
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: dot * 0.2,
                              ease: 'easeInOut',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
