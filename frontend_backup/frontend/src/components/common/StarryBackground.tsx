import React, { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  dir: number;
  color: string;
  speed: number;
  baseY: number;
  parallax: number;
  isNebula?: boolean;
  hue?: number;
  saturation?: number;
  lightness?: number;
}

export const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvas = useRef<HTMLCanvasElement>();
  const animationFrameId = useRef<number>();
  const lastRenderTime = useRef(0);
  const scrollY = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const stars = useRef<Star[]>([]);
  const nebulas = useRef<{x: number, y: number, radius: number, hue: number, opacity: number, speed: number, noiseOffset: number}[]>([]);
  const reducedMotion = useRef(false);
  const isVisible = useRef(true);

  // Check for reduced motion preference
  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion.current = e.matches;
    };
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisible.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle scroll and mouse movement
  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Create star colors with natural variations
  const getStarColor = (y: number, isNebula = false): string => {
    // Base colors on position and star type
    const hue = isNebula 
      ? 260 + Math.sin(y * 0.001) * 20  // Purple/blue for nebulas
      : 200 + Math.sin(y * 0.002) * 40; // Blue/white for stars
      
    const saturation = isNebula 
      ? 60 + Math.sin(y * 0.0005) * 20  // More saturated nebulas
      : 70 + Math.sin(y * 0.001) * 20;  // Less saturated stars
      
    const lightness = isNebula 
      ? 50 + Math.sin(y * 0.0003) * 10  // Medium lightness for nebulas
      : 80 + Math.sin(y * 0.0007) * 15; // Brighter stars
      
    return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.9)`;
  };

  // Create stars with natural variations
  const createStars = useCallback((canvas: HTMLCanvasElement): Star[] => {
    const density = 1200; // Slightly fewer stars for performance
    const count = Math.floor((canvas.width * canvas.height) / density);
    
    return Array.from({ length: count }, (_, i) => {
      const y = Math.random() * canvas.height * 1.5; // Extend below viewport for scroll
      const baseAlpha = (1 - y / (canvas.height * 1.5)) * 0.9 + 0.1;
      const size = Math.random() ** 2 * 1.5 + 0.3; // More small stars than large ones
      const parallax = 0.5 + Math.random() * 0.5; // Parallax effect depth
      
      return {
        x: Math.random() * canvas.width,
        y: y,
        baseY: y,
        r: size,
        alpha: baseAlpha * (0.8 + Math.random() * 0.4), // Natural variation in brightness
        dir: Math.random() > 0.5 ? 1 : -1,
        speed: 0.1 + Math.random() * 0.2, // Slight movement speed
        parallax: parallax,
        color: getStarColor(y),
        hue: 200 + Math.sin(y * 0.001) * 40,
        saturation: 70 + Math.sin(y * 0.001) * 20,
        lightness: 80 + Math.sin(y * 0.0007) * 15
      };
    });
  }, []);

  // Create more prominent nebula clouds
  const createNebulas = useCallback((canvas: HTMLCanvasElement) => {
    const nebulaCount = 4 + Math.floor(Math.random() * 3); // 4-6 nebulas
    return Array.from({ length: nebulaCount }, (_, i) => {
      // Create nebulas in different sections of the page
      const section = i % 3;
      let yPos, size, hue;
      
      switch(section) {
        case 0: // Top section
          yPos = 0.1 + Math.random() * 0.2;
          size = 150 + Math.random() * 200;
          hue = 240 + Math.random() * 40 - 20; // Blue
          break;
        case 1: // Middle section
          yPos = 0.4 + Math.random() * 0.2;
          size = 200 + Math.random() * 300;
          hue = 280 + Math.random() * 40 - 20; // Purple
          break;
        default: // Bottom section
          yPos = 0.7 + Math.random() * 0.25;
          size = 250 + Math.random() * 400;
          hue = 260 + Math.random() * 60 - 30; // Purple/blue mix
      }
      
      return {
        x: Math.random() * canvas.width,
        y: yPos * canvas.height,
        radius: size,
        hue: hue,
        opacity: 0.1 + Math.random() * 0.15, // More visible
        speed: 0.2 + Math.random() * 0.3, // Slower movement
        noiseOffset: Math.random() * 1000 // For organic movement
      };
    });
  }, []);

  // Draw a single star with glow
  const drawStar = (ctx: CanvasRenderingContext2D, star: Star, time: number) => {
    const scrollOffset = scrollY.current * 0.2 * star.parallax;
    const mouseParallaxX = (mouseX.current - window.innerWidth / 2) * 0.01 * star.parallax;
    const mouseParallaxY = (mouseY.current - window.innerHeight / 2) * 0.01 * star.parallax;
    
    // Apply parallax and subtle movement
    const x = star.x + mouseParallaxX;
    const y = star.y - scrollOffset + mouseParallaxY + Math.sin(time * 0.001 * star.speed) * 5;
    
    // Skip drawing if outside viewport
    if (y < -50 || y > ctx.canvas.height + 50) return;
    
    // Twinkling effect
    const twinkle = Math.sin(time * 0.002 * star.speed) * 0.3 + 0.7;
    const alpha = star.alpha * twinkle;
    
    // Draw glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.r * 2);
    gradient.addColorStop(0, `hsla(${star.hue}, ${star.saturation}%, ${star.lightness}%, ${alpha})`);
    gradient.addColorStop(0.7, `hsla(${star.hue}, ${star.saturation - 20}%, ${star.lightness - 10}%, ${alpha * 0.5})`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, star.r * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw star core
    ctx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, ${star.lightness}%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, star.r * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Draw a more visible and dynamic nebula
  const drawNebula = (ctx: CanvasRenderingContext2D, nebula: any, time: number) => {
    const scrollOffset = scrollY.current * 0.1;
    const scrollFactor = 1 - (scrollY.current / (window.innerHeight * 2));
    const y = nebula.y - scrollOffset * 0.5;
    
    // Skip if not in view or scrolled past
    if (y < -nebula.radius * 2 || y > ctx.canvas.height + nebula.radius * 2 || scrollFactor <= 0) {
      return;
    }
    
    // Calculate position with subtle movement
    const timeOffset = time * 0.0003 * nebula.speed;
    const noiseX = Math.sin(timeOffset + nebula.noiseOffset) * 20;
    const noiseY = Math.cos(timeOffset * 0.8 + nebula.noiseOffset) * 15;
    
    // Base gradient
    const gradient1 = ctx.createRadialGradient(
      nebula.x + noiseX, 
      y + noiseY, 
      0,
      nebula.x + noiseX, 
      y + noiseY, 
      nebula.radius
    );
    
    // More vibrant colors with better blending
    gradient1.addColorStop(0, `hsla(${nebula.hue}, 70%, 60%, ${0.1 * nebula.opacity * scrollFactor})`);
    gradient1.addColorStop(0.5, `hsla(${nebula.hue + 10}, 60%, 50%, ${0.07 * nebula.opacity * scrollFactor})`);
    gradient1.addColorStop(1, 'transparent');
    
    // Draw main nebula
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.filter = 'blur(20px)';
    ctx.fillStyle = gradient1;
    ctx.beginPath();
    ctx.arc(nebula.x + noiseX, y + noiseY, nebula.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add subtle inner glow
    const gradient2 = ctx.createRadialGradient(
      nebula.x + noiseX * 0.5, 
      y + noiseY * 0.5, 
      0,
      nebula.x + noiseX * 0.5, 
      y + noiseY * 0.5, 
      nebula.radius * 0.5
    );
    
    gradient2.addColorStop(0, `hsla(${nebula.hue - 20}, 80%, 70%, ${0.15 * nebula.opacity * scrollFactor})`);
    gradient2.addColorStop(1, 'transparent');
    
    ctx.filter = 'blur(10px)';
    ctx.fillStyle = gradient2;
    ctx.beginPath();
    ctx.arc(nebula.x + noiseX * 0.5, y + noiseY * 0.5, nebula.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Add some noise for texture
    if (!reducedMotion.current) {
      const noiseGradient = ctx.createRadialGradient(
        nebula.x + noiseX, 
        y + noiseY, 
        0,
        nebula.x + noiseX, 
        y + noiseY, 
        nebula.radius * 0.7
      );
      
      noiseGradient.addColorStop(0, 'transparent');
      noiseGradient.addColorStop(0.7, `hsla(${nebula.hue + 30}, 60%, 60%, ${0.03 * nebula.opacity * scrollFactor})`);
      noiseGradient.addColorStop(1, 'transparent');
      
      ctx.filter = 'blur(3px)';
      ctx.fillStyle = noiseGradient;
      ctx.beginPath();
      ctx.arc(nebula.x + noiseX, y + noiseY, nebula.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  // Main render function
  const render = useCallback((time: number) => {
    if (!canvasRef.current || !isVisible.current) {
      animationFrameId.current = requestAnimationFrame(render);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Throttle rendering if tab is not active
    const now = performance.now();
    if (now - lastRenderTime.current < (isVisible.current ? 16 : 100)) { // 60fps when visible, ~10fps when not
      animationFrameId.current = requestAnimationFrame(render);
      return;
    }
    lastRenderTime.current = now;

    // Clear canvas with gradient
    const rootStyles = getComputedStyle(document.documentElement);
    const bgColor = rootStyles.getPropertyValue('--background').trim();
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    // Use the theme's background color for the gradient
    gradient.addColorStop(0, `hsl(${bgColor})`);
    gradient.addColorStop(1, `hsl(${bgColor})`);
    ctx.fillStyle = `hsl(${bgColor})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw nebulas with scroll-based opacity
    const scrollProgress = Math.min(scrollY.current / (window.innerHeight * 0.7), 1);
    if (scrollProgress > 0) {
      // Sort nebulas by y position for proper layering
      const sortedNebulas = [...nebulas.current].sort((a, b) => a.y - b.y);
      sortedNebulas.forEach(nebula => {
        // Apply scroll-based opacity
        ctx.save();
        ctx.globalAlpha = scrollProgress * nebula.opacity;
        drawNebula(ctx, nebula, time);
        ctx.restore();
      });
    }

    // Draw stars
    if (!reducedMotion.current) {
      stars.current.forEach(star => drawStar(ctx, star, time));
    } else {
      // Simplified rendering for reduced motion
      stars.current.forEach(star => {
        const scrollOffset = scrollY.current * 0.2 * star.parallax;
        const y = star.y - scrollOffset;
        if (y >= -10 && y <= canvas.height + 10) {
          ctx.fillStyle = star.color;
          ctx.beginPath();
          ctx.arc(star.x, y, star.r * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Schedule next frame
    animationFrameId.current = requestAnimationFrame(render);
  }, []);

  // Initialize and clean up
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create offscreen canvas for performance
    offscreenCanvas.current = document.createElement('canvas');
    
    const handleResize = () => {
      if (!canvas) return;
      
      // Set canvas dimensions
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      // Scale context for high DPI displays
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      // Recreate stars and nebulas on resize
      if (offscreenCanvas.current) {
        stars.current = createStars(canvas);
        nebulas.current = createNebulas(canvas);
      }
    };

    // Initial setup
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Start animation
    animationFrameId.current = requestAnimationFrame(render);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [createNebulas, createStars, render]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    />
  );
};