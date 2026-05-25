'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Eye, Radar, Mic, Activity, TrendingUp, LayoutDashboard } from 'lucide-react';
import MagneticButton from '@/components/shared/MagneticButton';
import GlassCard from '@/components/shared/GlassCard';
import AIBrain from '@/components/neural/AIBrain';
import GlowingOrb from '@/components/neural/GlowingOrb';

/* ============================================================
   TYPES
   ============================================================ */

interface LandingPageProps {
  onNavigate: (section: string) => void;
}

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */

const heroLineVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: 0.3 + i * 0.25,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

/* ============================================================
   STAT COUNTER COMPONENT
   ============================================================ */

function StatCounter({
  value,
  suffix,
  prefix,
  label,
  duration = 2,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, value, duration]);

  // Format with comma for large numbers
  const formatted = count >= 1000 ? count.toLocaleString() : count.toString();

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-1 px-4 py-2"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-cyan tracking-tight">
        {prefix}
        {formatted}
        {suffix}
      </span>
      <span className="text-xs sm:text-sm text-muted-foreground tracking-wide uppercase">
        {label}
      </span>
    </motion.div>
  );
}

/* ============================================================
   TYPING TEXT COMPONENT
   ============================================================ */

function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, text, delay]);

  return (
    <span ref={ref}>
      {displayedText}
      {!isComplete && (
        <span className="inline-block w-[2px] h-[1em] bg-[#00f5ff] ml-1 animate-pulse" />
      )}
    </span>
  );
}

/* ============================================================
   FEATURE DATA
   ============================================================ */

const features = [
  {
    icon: Eye,
    title: 'AI Video Analysis',
    description:
      'Deep analysis of communication, confidence, and emotional intelligence through video resumes',
    glowColor: '#00f5ff',
  },
  {
    icon: Radar,
    title: 'Personality Radar',
    description:
      'Multi-dimensional personality mapping with neural network-powered behavioral analysis',
    glowColor: '#6c63ff',
  },
  {
    icon: Mic,
    title: 'Live AI Interview',
    description:
      'Real-time AI interviewer that adapts, evaluates, and understands human potential',
    glowColor: '#00f5ff',
  },
  {
    icon: Activity,
    title: 'Emotional Timeline',
    description:
      'Track confidence fluctuations, emotional shifts, and stress responses in real-time',
    glowColor: '#8b5cf6',
  },
  {
    icon: TrendingUp,
    title: 'Career Prediction',
    description:
      'AI-powered career trajectory forecasting with leadership and founder potential analysis',
    glowColor: '#00f5ff',
  },
  {
    icon: LayoutDashboard,
    title: 'Command Center',
    description:
      'Mission control for recruiters with AI intelligence scores and candidate analytics',
    glowColor: '#6c63ff',
  },
];

/* ============================================================
   HOW IT WORKS STEPS
   ============================================================ */

const steps = [
  {
    number: 1,
    title: 'Upload & Record',
    description:
      'Submit your video resume, portfolio, or connect your professional profile',
  },
  {
    number: 2,
    title: 'AI Analysis',
    description:
      'Our neural engine analyzes 50+ behavioral, emotional, and cognitive indicators',
  },
  {
    number: 3,
    title: 'Intelligence Report',
    description:
      'Receive a comprehensive AI-generated human intelligence snapshot',
  },
];

/* ============================================================
   MAIN LANDING PAGE COMPONENT
   ============================================================ */

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: '-100px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' });

  // Parallax for hero
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroBgY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <div className="relative w-full bg-background">
      {/* ============================================================
          SECTION 1: HERO
          ============================================================ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background: AIBrain */}
        <motion.div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ y: heroBgY }}
        >
          <AIBrain className="w-full h-full" />
        </motion.div>

        {/* Gradient overlay on top of brain */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/60 via-transparent to-background" />

        {/* Floating gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 animate-float-slow">
            <GlowingOrb color="#00f5ff" size={200} />
          </div>
          <div className="absolute top-1/4 -right-16 animate-float-delayed">
            <GlowingOrb color="#6c63ff" size={180} />
          </div>
          <div className="absolute -bottom-20 left-1/3 animate-float">
            <GlowingOrb color="#8b5cf6" size={150} />
          </div>
          <div className="absolute top-1/2 left-1/4 animate-float-slow">
            <GlowingOrb color="#00f5ff" size={120} />
          </div>
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-5xl mx-auto"
          style={{ y: heroContentY }}
        >
          {/* Headline line 1 */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.1]"
            variants={heroLineVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span className="text-gradient-cyan">Beyond Resumes.</span>
          </motion.h1>

          {/* Headline line 2 */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.1] mt-2 sm:mt-4"
            variants={heroLineVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <span className="text-gradient-violet">Beyond Interviews.</span>
          </motion.h1>

          {/* Subheadline with typing effect */}
          <motion.div
            className="mt-6 sm:mt-8 text-xl sm:text-2xl md:text-3xl font-semibold"
            variants={heroLineVariants}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <span className="text-gradient-hybrid">
              <TypingText text="AI That Understands Humans." delay={1.2} />
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed"
            variants={heroLineVariants}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            NeuralHire AI analyzes human potential through behavior, confidence,
            communication, emotional intelligence, and AI-driven personality
            analysis.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6"
            variants={heroLineVariants}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <MagneticButton
              variant="cyan"
              size="lg"
              onClick={() => onNavigate('profile')}
            >
              Get Started
            </MagneticButton>
            <MagneticButton
              variant="violet"
              size="lg"
              onClick={() => onNavigate('analyze')}
            >
              Explore Analysis
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Stats counter row */}
        <motion.div
          className="relative z-10 w-full max-w-4xl mx-auto mt-auto mb-8 sm:mb-12"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            <StatCounter value={98.7} suffix="%" label="Accuracy" />
            <div className="hidden sm:block w-px h-12 bg-border self-center" />
            <StatCounter value={50} suffix="K+" prefix="" label="Candidates Analyzed" />
            <div className="hidden sm:block w-px h-12 bg-border self-center" />
            <StatCounter value={12} suffix="ms" label="Response Time" />
            <div className="hidden sm:block w-px h-12 bg-border self-center" />
            <StatCounter value={360} suffix="°" label="Human Analysis" />
          </div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ============================================================
          SECTION 2: FEATURES SHOWCASE
          ============================================================ */}
      <section
        ref={featuresRef}
        className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6"
      >
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 right-0 animate-float-slow opacity-50">
            <GlowingOrb color="#6c63ff" size={150} />
          </div>
          <div className="absolute bottom-1/4 left-0 animate-float-delayed opacity-40">
            <GlowingOrb color="#00f5ff" size={130} />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section title */}
          <motion.div
            className="text-center mb-12 sm:mb-16 md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="text-gradient-hybrid">The Future of Human Intelligence</span>
            </h2>
            <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#6c63ff]" />
          </motion.div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={featuresInView ? 'visible' : 'hidden'}
              >
                <GlassCard
                  className="h-full"
                  glowColor={feature.glowColor}
                >
                  <div className="p-6 sm:p-8 flex flex-col gap-4">
                    {/* Glowing icon */}
                    <div
                      className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${feature.glowColor}15, ${feature.glowColor}08)`,
                        border: `1px solid ${feature.glowColor}25`,
                        boxShadow: `0 0 20px ${feature.glowColor}15, inset 0 0 12px ${feature.glowColor}08`,
                      }}
                    >
                      <feature.icon
                        className="w-6 h-6 sm:w-7 sm:h-7"
                        style={{ color: feature.glowColor }}
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: HOW IT WORKS
          ============================================================ */}
      <section
        ref={howItWorksRef}
        className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6"
      >
        {/* Subtle background */}
        <div className="absolute inset-0 pointer-events-none mesh-gradient-subtle" />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section title */}
          <motion.div
            className="text-center mb-16 sm:mb-20 md:mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="text-gradient-hybrid">How NeuralHire AI Works</span>
            </h2>
            <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#6c63ff]" />
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Animated connecting line (desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00f5ff] via-[#8b5cf6] to-[#6c63ff]"
                initial={{ scaleX: 0 }}
                animate={howItWorksInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                style={{ transformOrigin: 'left' }}
              />
            </div>

            {/* Mobile connecting line */}
            <div className="md:hidden absolute top-0 bottom-0 left-8 w-[2px]">
              <motion.div
                className="h-full w-full bg-gradient-to-b from-[#00f5ff] via-[#8b5cf6] to-[#6c63ff]"
                initial={{ scaleY: 0 }}
                animate={howItWorksInView ? { scaleY: 1 } : {}}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                style={{ transformOrigin: 'top' }}
              />
            </div>

            {/* Steps */}
            <div className="flex flex-col md:flex-row gap-12 md:gap-0 md:justify-between">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-6 md:flex-1"
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate={howItWorksInView ? 'visible' : 'hidden'}
                >
                  {/* Numbered circle with glow */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl text-background relative z-10"
                      style={{
                        background: 'linear-gradient(135deg, #00f5ff, #6c63ff)',
                        boxShadow:
                          '0 0 20px rgba(0, 245, 255, 0.3), 0 0 40px rgba(108, 99, 255, 0.2)',
                      }}
                      whileHover={{
                        boxShadow:
                          '0 0 30px rgba(0, 245, 255, 0.5), 0 0 60px rgba(108, 99, 255, 0.3)',
                        scale: 1.05,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.number}
                    </motion.div>
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-full animate-ai-pulse pointer-events-none" />
                  </div>

                  {/* Text content */}
                  <div className="flex flex-col md:text-center md:max-w-xs">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: CTA
          ============================================================ */}
      <section
        ref={ctaRef}
        className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 overflow-hidden"
      >
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 animate-float opacity-40">
            <GlowingOrb color="#00f5ff" size={180} />
          </div>
          <div className="absolute bottom-0 right-1/4 animate-float-delayed opacity-40">
            <GlowingOrb color="#6c63ff" size={180} />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-slow opacity-20">
            <GlowingOrb color="#8b5cf6" size={250} />
          </div>
        </div>

        {/* Subtle particle dots overlay */}
        <div className="absolute inset-0 pointer-events-none neural-dots opacity-40" />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* CTA Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="text-gradient-hybrid">
              Ready to See the Future of Hiring?
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of companies using AI to understand human potential
          </p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <MagneticButton
              variant="cyan"
              size="lg"
              onClick={() => onNavigate('profile')}
            >
              Get Started
            </MagneticButton>
            <MagneticButton
              variant="violet"
              size="lg"
              onClick={() => onNavigate('command')}
            >
              View Dashboard
            </MagneticButton>
          </motion.div>

          {/* Decorative element */}
          <motion.div
            className="mt-12 sm:mt-16 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#00f5ff]/50" />
            <div className="w-2 h-2 rounded-full bg-[#00f5ff] animate-dot-pulse" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#6c63ff]/50" />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
