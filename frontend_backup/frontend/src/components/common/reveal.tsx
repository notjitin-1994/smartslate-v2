import React, { useMemo } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
}

/**
 * A component that reveals its children with a fade-in and slide-up animation
 * when it becomes visible in the viewport.
 */
export const Reveal: React.FC<RevealProps> = ({ children, delay = 0, threshold = 0.1 }) => {
  const options = useMemo(() => ({ threshold }), [threshold]);
  const [ref, isIntersecting] = useIntersectionObserver(options);

  const style = {
    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
    transitionDelay: `${delay}ms`,
    opacity: isIntersecting ? 1 : 0,
    transform: isIntersecting ? 'translateY(0)' : 'translateY(40px)',
  };

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
};