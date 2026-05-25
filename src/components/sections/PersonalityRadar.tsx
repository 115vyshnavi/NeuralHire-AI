'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Crown, Shield, Lightbulb, Heart, RefreshCw, Users, Zap } from 'lucide-react';
import GlassCard from '@/components/shared/GlassCard';

const radarData = [
  { dimension: 'Leadership', value: 85 },
  { dimension: 'Confidence', value: 78 },
  { dimension: 'Creativity', value: 92 },
  { dimension: 'Emotional\nIntelligence', value: 88 },
  { dimension: 'Adaptability', value: 80 },
  { dimension: 'Collaboration', value: 75 },
  { dimension: 'Pressure\nHandling', value: 82 },
];

const metricCards = [
  { name: 'Leadership', score: 85, description: 'Strong decision-making and team guidance capabilities', icon: Crown },
  { name: 'Confidence', score: 78, description: 'Demonstrates self-assurance with measured risk-taking', icon: Shield },
  { name: 'Creativity', score: 92, description: 'Exceptional innovative thinking and problem-solving', icon: Lightbulb },
  { name: 'Emotional Intelligence', score: 88, description: 'High empathy and interpersonal awareness', icon: Heart },
  { name: 'Adaptability', score: 80, description: 'Flexible approach to changing environments', icon: RefreshCw },
  { name: 'Collaboration', score: 75, description: 'Effective team player with growth potential', icon: Users },
  { name: 'Pressure Handling', score: 82, description: 'Resilient under stress with composed decision-making', icon: Zap },
];

function getBarColor(score: number): string {
  const ratio = score / 100;
  const r = Math.round(0 + ratio * 139);
  const g = Math.round(245 - ratio * 186);
  const b = Math.round(255 - ratio * 9);
  return `linear-gradient(90deg, #00f5ff, rgb(${r}, ${g}, ${b}))`;
}

// Custom tooltip component for recharts
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'rgba(10, 10, 26, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 245, 255, 0.25)',
          borderRadius: '12px',
          padding: '10px 16px',
          boxShadow: '0 0 20px rgba(0, 245, 255, 0.15)',
        }}
      >
        <p style={{ color: '#c0c0c8', fontSize: '12px', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: '#00f5ff', fontSize: '18px', fontWeight: 'bold' }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
}

// Custom label renderer for polar angle axis
function renderCustomLabel({ x, y, payload }: { x: number; y: number; payload: { value: string } }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill="#c0c0c8"
      fontSize={11}
      fontWeight={500}
    >
      {payload.value.split('\n').map((line: string, i: number) => (
        <tspan key={i} x={x} dy={i === 0 ? '0' : '14'}>{line}</tspan>
      ))}
    </text>
  );
}

export default function PersonalityRadar() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(180deg, #0a0a1a, #16213e, #0a0a1a)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #00f5ff, #8b5cf6)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShiftRadar 4s ease infinite',
            }}
          >
            AI Personality Radar
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Multi-dimensional neural personality mapping
          </p>
        </motion.div>

        {/* Radar + Metric Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mb-10">
          {/* CENTER - Radar Chart */}
          <motion.div
            className="lg:col-span-3 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard className="p-4 sm:p-6 w-full">
              <div className="w-full" style={{ minHeight: '400px' }}>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart
                    data={radarData}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                  >
                    <PolarGrid
                      stroke="rgba(0, 245, 255, 0.12)"
                      strokeDasharray="3 3"
                    />
                    <PolarAngleAxis
                      dataKey="dimension"
                      tick={renderCustomLabel}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Personality"
                      dataKey="value"
                      stroke="#00f5ff"
                      fill="#00f5ff"
                      fillOpacity={0.15}
                      strokeWidth={2}
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(0, 245, 255, 0.4))',
                      }}
                      animationBegin={0}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* RIGHT SIDE - Metric Detail Cards */}
          <motion.div
            className="lg:col-span-2 space-y-3 max-h-[500px] lg:max-h-[520px] overflow-y-auto pr-1"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0, 245, 255, 0.2) transparent',
            }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {metricCards.map((metric, i) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <GlassCard className="p-4" glowColor={metric.score >= 85 ? '#00f5ff' : '#8b5cf6'}>
                  <div className="flex items-start gap-3">
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{
                        background: metric.score >= 85
                          ? 'rgba(0, 245, 255, 0.1)'
                          : 'rgba(139, 92, 246, 0.1)',
                        border: `1px solid ${metric.score >= 85 ? 'rgba(0, 245, 255, 0.2)' : 'rgba(139, 92, 246, 0.2)'}`,
                      }}
                    >
                      <metric.icon
                        className="w-4 h-4"
                        style={{ color: metric.score >= 85 ? '#00f5ff' : '#8b5cf6' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white">{metric.name}</p>
                        <span
                          className="text-sm font-bold tabular-nums"
                          style={{ color: metric.score >= 85 ? '#00f5ff' : '#8b5cf6' }}
                        >
                          {metric.score}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 leading-relaxed">{metric.description}</p>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: getBarColor(metric.score) }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${metric.score}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.08 + 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* BOTTOM - Personality Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassCard className="p-6 sm:p-8" glowColor="#8b5cf6">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(139, 92, 246, 0.15))',
                  border: '1px solid rgba(0, 245, 255, 0.2)',
                }}
              >
                <Zap className="w-5 h-5" style={{ color: '#00f5ff' }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Personality Summary</h3>
                <p className="text-xs" style={{ color: 'rgba(0, 245, 255, 0.6)' }}>AI-Generated Neural Assessment</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              The candidate exhibits a rare combination of creative innovation and emotional intelligence.
              Their leadership profile suggests natural authority balanced with empathy. Most notable is their
              exceptional creativity score (92), indicating strong potential for roles requiring innovative
              problem-solving. Emotional intelligence at 88 positions them well for people-centric leadership roles.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {['Creative Thinker', 'Empathetic Leader', 'Innovation-Driven', 'People-Centric'].map((tag, i) => (
                <motion.span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: i % 2 === 0 ? 'rgba(0, 245, 255, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                    border: `1px solid ${i % 2 === 0 ? 'rgba(0, 245, 255, 0.2)' : 'rgba(139, 92, 246, 0.2)'}`,
                    color: i % 2 === 0 ? '#00f5ff' : '#8b5cf6',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* CSS Keyframes */}
      <style jsx global>{`
        @keyframes gradientShiftRadar {
          0% { background-position: 0% center; }
          50% { background-position: 200% center; }
          100% { background-position: 0% center; }
        }

        .lg\:col-span-2::-webkit-scrollbar {
          width: 4px;
        }
        .lg\:col-span-2::-webkit-scrollbar-track {
          background: transparent;
        }
        .lg\:col-span-2::-webkit-scrollbar-thumb {
          background: rgba(0, 245, 255, 0.2);
          border-radius: 4px;
        }
        .lg\:col-span-2::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 245, 255, 0.35);
        }
      `}</style>
    </section>
  );
}
