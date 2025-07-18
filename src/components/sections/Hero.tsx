import React, { useEffect, useRef } from 'react';
import './Hero.css';
import { Reveal } from '../common/reveal';

interface HeroProps {
  onRevealNext: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRevealNext }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight * 0.6;
    };

    const handleResize = () => {
      resize();
      stars = createStars();
    };

    window.addEventListener('resize', handleResize);
    resize();

    type Star = { x: number; y: number; r: number; alpha: number; dir: number };
    const createStars = () => {
      const density = 1500;
      const count = Math.floor((canvas.width * canvas.height) / density);
      return Array.from({ length: count }, () => {
        const y = Math.random() * canvas.height;
        const alpha = Math.random() * (1 - y / canvas.height) * 0.9 + 0.1; // Fade out at the bottom
        return {
          x: Math.random() * canvas.width,
          y: y,
          r: Math.random() * 1.2 + 0.4,
          alpha: alpha,
          dir: Math.random() > 0.5 ? 1 : -1,
        };
      });
    };

    let stars: Star[] = createStars();

    const draw = (time: number) => {
      if (!ctx) return;

      // Background gradient (space -> brand background)
      const rootStyles = getComputedStyle(document.documentElement);
      const brandBg = rootStyles.getPropertyValue('--brand-bg') || '210 53% 11%';
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(1, `hsl(${brandBg.trim()})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Star color uses secondary brand color (primary variable)
      const starColor = `hsl(${rootStyles.getPropertyValue('--primary').trim() || '243 72% 58%'})`;

      // Draw and update twinkling stars
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

        // Independent and dynamic twinkle effect
        const baseAlpha = (1 - s.y / canvas.height) * 0.9 + 0.1; // Fade out at the bottom
        s.alpha += s.dir * 0.01;
        if (s.alpha < baseAlpha * 0.3) {
          s.alpha = baseAlpha * 0.3;
          s.dir = 1;
        } else if (s.alpha > baseAlpha) {
          s.alpha = baseAlpha;
          s.dir = -1;
        }
      });

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (

  <section id="hero" className="relative w-full flex items-center pt-24 pb-12 md:pt-32 md:pb-20" style={{ minHeight: '60vh' }}>
    {/* Starry night animated canvas background */}
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
    
    <div className="container mx-auto px-4 sm:px-6 relative z-10 flex items-center" style={{ minHeight: '60vh' }}>
      <Reveal>
        <div className="w-full backdrop-blur-[1px] rounded-xl p-6 border border-brand-accent/40 relative">
          <div className="space-y-6 md:space-y-8">
            <h1 className="font-quicksand text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Build Your <span className="gradient-text">Future-Ready</span> <span className="gradient-text">Workforce</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
              India is on the cusp of a major economic expansion, fueled by its vibrant young population. However, a <strong><span className="gradient-text">significant skills gap</span></strong> threatens progress—companies need <strong><span className="gradient-text">job-ready talent</span></strong> but emerging professionals aren't yet prepared.
            </p>
            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mt-4">
              The future of business is being written in India, yet a <strong><span className="gradient-text">silent crisis</span></strong> threatens to derail it all. Millions of ambitious individuals are entering the workforce, but they lack the specific, critical skills your company needs to innovate and compete. This <strong><span className="gradient-text">talent paradox</span></strong> isn't just a statistic—it's a <strong><span className="gradient-text">direct threat to your bottom line and future success</span></strong>.
            </p>
          </div>

          <div className="mt-8">
            <button 
              onClick={onRevealNext} 
              className="px-8 py-3 bg-brand-accent text-brand-bg font-semibold rounded-lg hover:bg-brand-accent/90 transition-colors duration-300 flex items-center space-x-2 group border border-brand-accent/50"
            >
              <span>Uncover the Crisis</span>
              <svg 
                className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300 animate-arrow-bounce" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
  );
};