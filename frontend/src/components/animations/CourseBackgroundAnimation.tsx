import React from 'react';
import { motion } from 'framer-motion';

interface CourseBackgroundAnimationProps {
  color?: string;
  className?: string;
}

const CourseBackgroundAnimation: React.FC<CourseBackgroundAnimationProps> = ({
  color = 'var(--brand-accent)',
  className = '',
}) => {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at center, ${color}10 0%, transparent 70%)`,
        }}
        initial={{ opacity: 0.1, scale: 0.95 }}
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(45deg, transparent 60%, ${color}03 100%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.2, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default CourseBackgroundAnimation;
