'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HexagonalAvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  glowColor?: string;
}

export default function HexagonalAvatar({
  src,
  alt = '',
  size = 80,
  glowColor = '#00f5ff',
}: HexagonalAvatarProps) {
  const colorRgb = hexToRgb(glowColor);

  // Hexagon clip-path (pointy-top orientation)
  const hexClipPath =
    'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)';

  // Extract initials from alt text
  const initials = alt
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Pulsing glow background */}
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath: hexClipPath,
          background: `rgba(${colorRgb}, 0.15)`,
          boxShadow: `0 0 ${size * 0.3}px ${glowColor}40, 0 0 ${size * 0.6}px ${glowColor}15`,
        }}
        animate={{
          boxShadow: [
            `0 0 ${size * 0.2}px ${glowColor}30, 0 0 ${size * 0.4}px ${glowColor}10`,
            `0 0 ${size * 0.4}px ${glowColor}50, 0 0 ${size * 0.8}px ${glowColor}20`,
            `0 0 ${size * 0.2}px ${glowColor}30, 0 0 ${size * 0.4}px ${glowColor}10`,
          ],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Glow border */}
      <motion.div
        className="absolute"
        style={{
          width: size,
          height: size,
          clipPath: hexClipPath,
          background: `linear-gradient(135deg, ${glowColor}, rgba(${colorRgb}, 0.3))`,
          padding: 2,
        }}
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Inner hexagon (avatar or placeholder) */}
      <div
        className="relative z-10"
        style={{
          width: size - 4,
          height: size - 4,
          clipPath: hexClipPath,
          background: src
            ? 'transparent'
            : `linear-gradient(135deg, rgba(${colorRgb}, 0.15), rgba(${colorRgb}, 0.05))`,
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            style={{ clipPath: hexClipPath }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, rgba(${colorRgb}, 0.12), rgba(${colorRgb}, 0.04))`,
            }}
          >
            <span
              className="font-bold"
              style={{
                color: glowColor,
                fontSize: size * 0.3,
                textShadow: `0 0 10px ${glowColor}50`,
              }}
            >
              {initials || '?'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 245, 255';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
