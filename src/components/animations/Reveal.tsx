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
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
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
        className={className}
        variants={revealVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ delay: delay / 1000 }} // delay in seconds
      >
        {children}
      </motion.div>
    </ClientOnly>
  );
};
