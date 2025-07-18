import React, { useEffect, useRef } from 'react';

export const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      // Use the parent's height, or fallback to the full viewport height
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    let stars: Star[] = [];
    const handleResize = () => {
      resize();
      stars = createStars();
    };

    window.addEventListener('resize', handleResize);
    // Initial setup
    setTimeout(handleResize, 100); // Delay to ensure parent dimensions are available

    type Star = { x: number; y: number; r: number; alpha: number; dir: number };
    const createStars = () => {
      if (!canvas) return [];
      const density = 1500;
      const count = Math.floor((canvas.width * canvas.height) / density);
      return Array.from({ length: count }, () => {
        const y = Math.random() * canvas.height;
        const alpha = Math.random() * (1 - y / canvas.height) * 0.9 + 0.1;
        return {
          x: Math.random() * canvas.width,
          y: y,
          r: Math.random() * 1.2 + 0.4,
          alpha: alpha,
          dir: Math.random() > 0.5 ? 1 : -1,
        };
      });
    };

    let animationFrameId: number;
    const draw = () => {
      if (!ctx || !canvas) return;

      const rootStyles = getComputedStyle(document.documentElement);
      const brandBg = rootStyles.getPropertyValue('--brand-bg').trim() || '210 53% 11%';
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(1, `hsl(${brandBg})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        ctx.save();
        const starGradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
        starGradient.addColorStop(0, `hsla(243, 72%, 90%, ${s.alpha})`);
        starGradient.addColorStop(0.8, `hsla(243, 72%, 70%, ${s.alpha * 0.5})`);
        starGradient.addColorStop(1, `hsla(243, 72%, 58%, 0)`);
        ctx.fillStyle = starGradient;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const baseAlpha = (1 - s.y / canvas.height) * 0.9 + 0.1;
        s.alpha += s.dir * 0.01;
        if (s.alpha < baseAlpha * 0.3) {
          s.alpha = baseAlpha * 0.3;
          s.dir = 1;
        } else if (s.alpha > baseAlpha) {
          s.alpha = baseAlpha;
          s.dir = -1;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
    />
  );
};