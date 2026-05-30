'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GlowingOrbProps {
  color?: string;
  size?: number;
  mobileSize?: number;
  className?: string;
}

export default function GlowingOrb({
  color = '#00f5ff',
  size = 200,
  mobileSize,
  className = '',
}: GlowingOrbProps) {
  const [isMobile, setIsMobile] = useState(false);
  const responsiveMobileSize = mobileSize || Math.round(size * 0.6);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const currentSize = isMobile ? responsiveMobileSize : size;
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return (
    <motion.div
      className={`relative rounded-full ${className}`}
      style={{
        width: currentSize,
        height: currentSize,
        maxWidth: '100%',
        background: `radial-gradient(circle at 35% 35%, rgba(${r}, ${g}, ${b}, 0.6) 0%, rgba(${r}, ${g}, ${b}, 0.2) 40%, rgba(${r}, ${g}, ${b}, 0.05) 70%, transparent 100%)`,
        boxShadow: `
          0 0 ${currentSize * 0.2}px rgba(${r}, ${g}, ${b}, 0.3),
          0 0 ${currentSize * 0.4}px rgba(${r}, ${g}, ${b}, 0.15),
          0 0 ${currentSize * 0.6}px rgba(${r}, ${g}, ${b}, 0.05),
          inset 0 0 ${currentSize * 0.15}px rgba(${r}, ${g}, ${b}, 0.2)
        `,
        willChange: 'transform',
      }}
      animate={{
        scale: [1, 1.06, 1],
      }}
      transition={{
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
      }}
    >
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
