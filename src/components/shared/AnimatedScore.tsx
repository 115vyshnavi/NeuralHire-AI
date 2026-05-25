'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AnimatedScoreProps {
  value: number;
  label: string;
  maxValue?: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { ring: 60, strokeWidth: 4, textSize: 'text-lg', labelSize: 'text-[10px]' },
  md: { ring: 90, strokeWidth: 6, textSize: 'text-3xl', labelSize: 'text-xs' },
  lg: { ring: 130, strokeWidth: 8, textSize: 'text-5xl', labelSize: 'text-sm' },
};

export default function AnimatedScore({
  value,
  label,
  maxValue = 100,
  color = '#00f5ff',
  size = 'md',
}: AnimatedScoreProps) {
  const config = sizeConfig[size];
  const radius = (config.ring - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / maxValue, 1);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 40, damping: 20 });
  const displayValue = useTransform(springValue, (v) => Math.round(v));
  const dashOffset = useTransform(springValue, (v) => {
    const p = Math.min(v / maxValue, 1);
    return circumference * (1 - p);
  });

  const [displayNum, setDisplayNum] = React.useState(0);
  const [offset, setOffset] = React.useState(circumference);

  useEffect(() => {
    const unsubValue = displayValue.on('change', (v) => setDisplayNum(v));
    const unsubOffset = dashOffset.on('change', (v) => setOffset(v));
    return () => {
      unsubValue();
      unsubOffset();
    };
  }, [displayValue, dashOffset]);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  const colorRgb = hexToRgb(color);

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative" style={{ width: config.ring, height: config.ring }}>
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 ${config.ring * 0.3}px ${color}20, 0 0 ${config.ring * 0.15}px ${color}10`,
          }}
        />

        <svg
          width={config.ring}
          height={config.ring}
          viewBox={`0 0 ${config.ring} ${config.ring}`}
          className="transform -rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke={`rgba(${colorRgb}, 0.1)`}
            strokeWidth={config.strokeWidth}
          />

          {/* Progress ring */}
          <motion.circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              filter: `drop-shadow(0 0 6px ${color}80)`,
              transition: 'stroke-dashoffset 0.05s linear',
            }}
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold ${config.textSize} tabular-nums`}
            style={{ color }}
          >
            {displayNum}
          </span>
        </div>
      </div>

      {/* Label */}
      <span
        className={`${config.labelSize} font-medium tracking-wider uppercase`}
        style={{ color: `rgba(${colorRgb}, 0.7)` }}
      >
        {label}
      </span>
    </motion.div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 245, 255';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
