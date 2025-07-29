import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, Variants } from 'framer-motion';

interface CourseCardGlowProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

const CourseCardGlow: React.FC<CourseCardGlowProps> = ({
  children,
  className = '',
  color = 'var(--brand-accent)',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const glowVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (custom: { delay?: number } = {}) => ({
      opacity: 0.3,
      scale: 1,
      transition: {
        opacity: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: custom?.delay || 0,
        },
        scale: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: custom?.delay || 0,
        },
      },
    }),
  };

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden rounded-xl ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 -z-10 rounded-xl"
        style={{
          background: `radial-gradient(600px at 50% 50%, ${color}10, transparent 80%)`,
        }}
        variants={glowVariants}
        custom={{ delay: 0.2 }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default CourseCardGlow;
