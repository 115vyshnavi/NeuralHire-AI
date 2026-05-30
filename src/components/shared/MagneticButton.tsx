'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'cyan' | 'violet' | 'ghost';
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const variantStyles = {
  cyan: {
    bg: 'rgba(0, 245, 255, 0.08)',
    border: 'linear-gradient(135deg, rgba(0, 245, 255, 0.4), rgba(0, 245, 255, 0.1))',
    glow: '0 0 20px rgba(0, 245, 255, 0.3), 0 0 40px rgba(0, 245, 255, 0.1)',
    text: '#00f5ff',
    rippleColor: 'rgba(0, 245, 255, 0.3)',
    hoverBg: 'rgba(0, 245, 255, 0.15)',
  },
  violet: {
    bg: 'rgba(139, 92, 246, 0.08)',
    border: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(139, 92, 246, 0.1))',
    glow: '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)',
    text: '#8b5cf6',
    rippleColor: 'rgba(139, 92, 246, 0.3)',
    hoverBg: 'rgba(139, 92, 246, 0.15)',
  },
  ghost: {
    bg: 'rgba(255, 255, 255, 0.03)',
    border: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
    glow: '0 0 15px rgba(255, 255, 255, 0.05)',
    text: '#e2e8f0',
    rippleColor: 'rgba(255, 255, 255, 0.15)',
    hoverBg: 'rgba(255, 255, 255, 0.06)',
  },
};

const sizeStyles = {
  sm: { padding: '6px 16px', fontSize: '12px', borderRadius: '8px' },
  md: { padding: '10px 24px', fontSize: '14px', borderRadius: '12px' },
  lg: { padding: '14px 32px', fontSize: '16px', borderRadius: '14px' },
};

export default function MagneticButton({
  children,
  className = '',
  variant = 'cyan',
  onClick,
  size = 'md',
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  useEffect(() => {
    // Detect touch device to disable magnetic effect
    const handleTouchDetection = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);
    };
    // Defer to avoid synchronous setState in effect
    const timer = setTimeout(handleTouchDetection, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTouchDevice || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x: rippleX, y: rippleY }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.();
  };

  const style = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      style={{
        x: isTouchDevice ? 0 : springX,
        y: isTouchDevice ? 0 : springY,
        position: 'relative',
        overflow: 'hidden',
        background: isHovered ? style.hoverBg : style.bg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid transparent',
        backgroundImage: style.border,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        boxShadow: isHovered && !isTouchDevice ? style.glow : 'none',
        color: style.text,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        borderRadius: sizeStyle.borderRadius,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.2s, box-shadow 0.3s',
        // Ensure minimum touch target
        minHeight: '44px',
      }}
      className={`inline-flex items-center justify-center gap-2 ${className}`}
      whileTap={{ scale: 0.97 }}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x - 5,
            top: ripple.y - 5,
            width: 10,
            height: 10,
            background: style.rippleColor,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          background: `radial-gradient(circle at center, ${style.rippleColor}, transparent 70%)`,
        }}
      />
    </motion.button>
  );
}
