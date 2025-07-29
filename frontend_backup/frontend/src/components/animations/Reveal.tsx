import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ClientOnly from '../common/ClientOnly';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
  className?: string;
}

const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20, // Reduced from 40px for less movement
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6, // Slightly longer for smoother feel
      ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for smoother animation
      type: "tween", // Better performance than default spring
      mass: 0.5,
      damping: 10,
      stiffness: 100
    },
  },
};

export const Reveal: React.FC<RevealProps> = ({ 
  children, 
  delay = 0, 
  threshold = 0.1, 
  className 
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: threshold,
  });

  return (
    <ClientOnly>
      <motion.div
        ref={ref}
        className={`${className || ''} will-change-transform`}
        variants={revealVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ 
          delay: delay / 1000, // delay in seconds
          type: 'tween'
        }}
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)'
        }}
      >
        {children}
      </motion.div>
    </ClientOnly>
  );
};
