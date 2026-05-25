'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlowingOrbProps {
  color?: string;
  size?: number;
  className?: string;
}

export default function GlowingOrb({
  color = '#00f5ff',
  size = 200,
  className = '',
}: GlowingOrbProps) {
  // Parse hex color for rgba values
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return (
    <motion.div
      className={`relative rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, rgba(${r}, ${g}, ${b}, 0.6) 0%, rgba(${r}, ${g}, ${b}, 0.2) 40%, rgba(${r}, ${g}, ${b}, 0.05) 70%, transparent 100%)`,
        boxShadow: `
          0 0 ${size * 0.2}px rgba(${r}, ${g}, ${b}, 0.3),
          0 0 ${size * 0.4}px rgba(${r}, ${g}, ${b}, 0.15),
          0 0 ${size * 0.6}px rgba(${r}, ${g}, ${b}, 0.05),
          inset 0 0 ${size * 0.15}px rgba(${r}, ${g}, ${b}, 0.2)
        `,
        willChange: 'transform, box-shadow',
      }}
      animate={{
        scale: [1, 1.08, 1],
        boxShadow: [
          `0 0 ${size * 0.2}px rgba(${r}, ${g}, ${b}, 0.3), 0 0 ${size * 0.4}px rgba(${r}, ${g}, ${b}, 0.15), 0 0 ${size * 0.6}px rgba(${r}, ${g}, ${b}, 0.05), inset 0 0 ${size * 0.15}px rgba(${r}, ${g}, ${b}, 0.2)`,
          `0 0 ${size * 0.3}px rgba(${r}, ${g}, ${b}, 0.5), 0 0 ${size * 0.5}px rgba(${r}, ${g}, ${b}, 0.25), 0 0 ${size * 0.8}px rgba(${r}, ${g}, ${b}, 0.1), inset 0 0 ${size * 0.2}px rgba(${r}, ${g}, ${b}, 0.3)`,
          `0 0 ${size * 0.2}px rgba(${r}, ${g}, ${b}, 0.3), 0 0 ${size * 0.4}px rgba(${r}, ${g}, ${b}, 0.15), 0 0 ${size * 0.6}px rgba(${r}, ${g}, ${b}, 0.05), inset 0 0 ${size * 0.15}px rgba(${r}, ${g}, ${b}, 0.2)`,
        ],
      }}
      transition={{
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
      }}
    >
      {/* Inner highlight */}
      <div
        className="absolute rounded-full"
        style={{
          top: '15%',
          left: '20%',
          width: '30%',
          height: '30%',
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 70%)`,
          filter: 'blur(2px)',
        }}
      />
    </motion.div>
  );
}
