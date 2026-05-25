'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleFieldProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

const CYAN = '#00f5ff';
const VIOLET = '#6c63ff';
const CONNECTION_DISTANCE = 120;
const BASE_SPEED = 0.3;

function getParticleCount(): number {
  if (typeof window === 'undefined') return 60;
  return window.innerWidth < 768 ? 40 : window.innerWidth < 1200 ? 80 : 120;
}

function createParticles(width: number, height: number): Particle[] {
  const count = getParticleCount();
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * BASE_SPEED,
      vy: (Math.random() - 0.5) * BASE_SPEED,
      radius: Math.random() * 1.5 + 0.5,
      color: i % 3 === 0 ? VIOLET : CYAN,
      opacity: Math.random() * 0.5 + 0.2,
    });
  }
  return particles;
}

function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  opacity: number
) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 6);
  glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`);
  glowGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * 0.08})`);
  glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

  ctx.beginPath();
  ctx.arc(x, y, radius * 6, 0, Math.PI * 2);
  ctx.fillStyle = glowGradient;
  ctx.fill();

  // Core dot
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  ctx.fill();
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  particles: Particle[]
) {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Move particle
    p.x += p.vx;
    p.y += p.vy;

    // Bounce off edges
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    // Keep within bounds
    p.x = Math.max(0, Math.min(width, p.x));
    p.y = Math.max(0, Math.min(height, p.y));

    // Draw connections to nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONNECTION_DISTANCE) {
        const lineOpacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;

        const gradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);

        const r1 = parseInt(p.color.slice(1, 3), 16);
        const g1 = parseInt(p.color.slice(3, 5), 16);
        const b1 = parseInt(p.color.slice(5, 7), 16);

        const r2 = parseInt(p2.color.slice(1, 3), 16);
        const g2 = parseInt(p2.color.slice(3, 5), 16);
        const b2 = parseInt(p2.color.slice(5, 7), 16);

        gradient.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, ${lineOpacity})`);
        gradient.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, ${lineOpacity})`);

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    // Draw particle with glow
    drawGlow(ctx, p.x, p.y, p.radius, p.color, p.opacity);
  }
}

export default function ParticleField({ className = '' }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const width = parent.clientWidth;
      const height = parent.clientHeight;

      canvas.width = width;
      canvas.height = height;
      dimensionsRef.current = { width, height };
      particlesRef.current = createParticles(width, height);
    };

    handleResize();

    const animate = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = dimensionsRef.current;
      drawFrame(ctx, width, height, particlesRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ display: 'block' }}
    />
  );
}
