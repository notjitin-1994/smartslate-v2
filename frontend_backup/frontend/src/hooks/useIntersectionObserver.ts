import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for observing when an element enters the viewport.
 * @param {object} options - IntersectionObserver options (e.g., threshold, rootMargin).
 * @returns {[React.RefObject, boolean]} - A ref to attach to the element and a boolean indicating if it's intersecting.
 */
export const useIntersectionObserver = (options: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      // Update state when intersection status changes
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        // Stop observing once it's visible to prevent re-triggering
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);

    // Cleanup function to unobserve the element
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]); // Re-run effect if options change

  return [ref, isIntersecting] as const;
};