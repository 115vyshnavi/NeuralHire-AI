'use client';

import React, { useEffect, useRef, useState } from 'react';

interface NeuralBackgroundProps {
  children: React.ReactNode;
}

const keyframeStyles = `
@keyframes floatOrb1 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(80px, -60px) scale(1.1);
  }
  50% {
    transform: translate(-40px, 40px) scale(0.95);
  }
  75% {
    transform: translate(60px, 80px) scale(1.05);
  }
}

@keyframes floatOrb2 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(-70px, 50px) scale(1.05);
  }
  50% {
    transform: translate(60px, -30px) scale(1.1);
  }
  75% {
    transform: translate(-50px, -70px) scale(0.9);
  }
}

@keyframes floatOrb3 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(40px, 70px) scale(0.95);
  }
  50% {
    transform: translate(-80px, -20px) scale(1.1);
  }
  75% {
    transform: translate(30px, -60px) scale(1);
  }
}

@keyframes driftParticle {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(50px);
    opacity: 0;
  }
}

@keyframes subtlePulse {
  0%, 100% {
    opacity: 0.03;
  }
  50% {
    opacity: 0.06;
  }
}
`;

interface FloatingOrb {
  id: number;
  color: string;
  size: number;
  mobileSize: number;
  top: string;
  left: string;
  animation: string;
  duration: string;
  delay: string;
  blur: number;
  mobileBlur: number;
}

interface AmbientParticle {
  id: number;
  left: string;
  size: number;
  duration: string;
  delay: string;
  opacity: number;
  color: string;
}

const ORB_COLORS = [
  'rgba(0, 245, 255, 0.15)',
  'rgba(108, 99, 255, 0.15)',
  'rgba(20, 20, 60, 0.2)',
  'rgba(0, 245, 255, 0.1)',
  'rgba(108, 99, 255, 0.1)',
];

const ORB_ANIMATIONS = ['floatOrb1', 'floatOrb2', 'floatOrb3'];

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export default function NeuralBackground({ children }: NeuralBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseIn, setIsMouseIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const orbs: FloatingOrb[] = [
    { id: 0, color: ORB_COLORS[0], size: 300, mobileSize: 150, top: '10%', left: '10%', animation: ORB_ANIMATIONS[0], duration: '20s', delay: '0s', blur: 80, mobileBlur: 40 },
    { id: 1, color: ORB_COLORS[1], size: 250, mobileSize: 130, top: '60%', left: '60%', animation: ORB_ANIMATIONS[1], duration: '25s', delay: '-5s', blur: 70, mobileBlur: 35 },
    { id: 2, color: ORB_COLORS[2], size: 350, mobileSize: 180, top: '40%', left: '30%', animation: ORB_ANIMATIONS[2], duration: '30s', delay: '-10s', blur: 90, mobileBlur: 45 },
    { id: 3, color: ORB_COLORS[3], size: 200, mobileSize: 100, top: '80%', left: '15%', animation: ORB_ANIMATIONS[0], duration: '22s', delay: '-3s', blur: 60, mobileBlur: 30 },
    { id: 4, color: ORB_COLORS[4], size: 200, mobileSize: 100, top: '20%', left: '70%', animation: ORB_ANIMATIONS[1], duration: '28s', delay: '-8s', blur: 65, mobileBlur: 30 },
  ];

  const particleCount = isMobile ? 10 : 25;

  const particles: AmbientParticle[] = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    left: `${seededRandom(i * 7 + 1) * 100}%`,
    size: seededRandom(i * 7 + 2) * 3 + 1,
    duration: `${seededRandom(i * 7 + 3) * 15 + 15}s`,
    delay: `${seededRandom(i * 7 + 4) * -20}s`,
    opacity: seededRandom(i * 7 + 5) * 0.5 + 0.2,
    color: i % 2 === 0 ? '#00f5ff' : '#6c63ff',
  }));

  useEffect(() => {
    const init = () => {
      setMounted(true);
      setIsMobile(window.innerWidth < 768);
    };
    init();
    window.addEventListener('resize', () => setIsMobile(window.innerWidth < 768));
    return () => window.removeEventListener('resize', () => setIsMobile(window.innerWidth < 768));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (containerRef.current && e.touches[0]) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        });
        setIsMouseIn(true);
      }
    };

    const handleMouseEnter = () => setIsMouseIn(true);
    const handleMouseLeave = () => setIsMouseIn(false);
    const handleTouchStart = () => setIsMouseIn(true);
    const handleTouchEnd = () => setIsMouseIn(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#0a0a1a' }}
    >
      <style dangerouslySetInnerHTML={{ __html: keyframeStyles }} />

      {/* Base gradient layer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(0, 245, 255, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(108, 99, 255, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(20, 20, 80, 0.05) 0%, transparent 50%)
          `,
        }}
      />

      {/* Floating gradient orbs */}
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: isMobile ? orb.mobileSize : orb.size,
            height: isMobile ? orb.mobileSize : orb.size,
            top: orb.top,
            left: orb.left,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${isMobile ? orb.mobileBlur : orb.blur}px)`,
            animation: `${orb.animation} ${orb.duration} ease-in-out infinite`,
            animationDelay: orb.delay,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Subtle grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: isMobile ? '40px 40px' : '60px 60px',
          animation: 'subtlePulse 8s ease-in-out infinite',
        }}
      />

      {/* Mouse/touch-reactive light effect */}
      {mounted && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 max-w-full"
          style={{
            opacity: isMouseIn ? 1 : 0,
            background: `radial-gradient(${isMobile ? '200px' : '400px'} circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 245, 255, 0.06), transparent 40%)`,
          }}
        />
      )}

      {/* Ambient floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `driftParticle ${p.duration} linear infinite`,
            animationDelay: p.delay,
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* Noise texture overlay - skip on mobile for performance */}
      {!isMobile && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ opacity: 0.015 }}
        >
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      )}

      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
