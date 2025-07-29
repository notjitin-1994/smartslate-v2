import { useState, useEffect, useRef, useCallback } from 'react';

interface AnimatedNumberProps {
  target: number;
  suffix?: string;
  isVisible: boolean;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ target, suffix = '', isVisible }) => {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef<number>();
  const targetRef = useRef(target);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  const animate = useCallback(() => {
    setCurrent(prevCurrent => {
      const difference = targetRef.current - prevCurrent;
      // Stop animation when close enough to the target
      if (Math.abs(difference) < 0.01) {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        return targetRef.current;
      }
      // Animate with easing
      const nextValue = prevCurrent + difference / 15;
      frameRef.current = requestAnimationFrame(animate);
      return nextValue;
    });
  }, []);

  useEffect(() => {
    if (isVisible) {
      setCurrent(0); // Start from 0 when it becomes visible
      frameRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isVisible, animate]);

  return (
    <>
      {target.toString().includes('.') ? current.toFixed(2) : Math.ceil(current)}
      {suffix}
    </>
  );
};