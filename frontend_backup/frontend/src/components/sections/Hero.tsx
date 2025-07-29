import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { ArrowDownward } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Reveal } from '../common/reveal';

interface HeroProps {}

type Star = {
  x: number;
  y: number;
  r: number;
  alpha: number;
  dir: number;
  speed: number;
};

export const Hero: React.FC<HeroProps> = () => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);
  const animationRef = useRef<number>();

  const initStars = (width: number, height: number) => {
    const density = 2000;
    const count = Math.floor((width * height) / density);
    stars.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.7 + 0.3,
      dir: Math.random() > 0.5 ? 1 : -1,
      speed: Math.random() * 0.02 + 0.01,
    }));
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, width, height);
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, 'rgba(0,0,0,1)');
    bgGradient.addColorStop(0.7, '#091521');
    bgGradient.addColorStop(1, '#091521');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    stars.current.forEach(star => {
      star.alpha += star.speed * star.dir;
      if (star.alpha > 0.9 || star.alpha < 0.3) {
        star.dir *= -1;
      }
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 2);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${star.alpha})`);
      gradient.addColorStop(0.7, `rgba(200, 220, 255, ${star.alpha * 0.7})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    });
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas.getBoundingClientRect();
    initStars(width, height);
    animate();
    const handleResize = () => {
      const { width: newWidth, height: newHeight } = canvas.getBoundingClientRect();
      initStars(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const GradientText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Typography
      component="span"
      sx={{
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </Typography>
  );

  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', minHeight: '60vh' }}>
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </Box>
      <Container sx={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', py: { xs: 6, md: 7 } }}>
        <Reveal>
          <Box sx={{ width: '100%', backdropFilter: 'blur(1px)', borderRadius: 2, p: 3, border: `1px solid ${theme.palette.primary.main}66` }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'white', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>
                Build Your <GradientText>Future-Ready</GradientText> <GradientText>Workforce</GradientText>
              </Typography>
              <Typography variant="h6" sx={{ color: 'grey.300', maxWidth: '800px' }}>
                India is on the cusp of a major economic expansion, fueled by its vibrant young population. However, a{' '}
                <strong><GradientText>significant skills gap</GradientText></strong> threatens progress—companies need{' '}
                <strong><GradientText>job-ready talent</GradientText></strong> but emerging professionals aren't yet prepared.
              </Typography>
              <Typography variant="h6" sx={{ color: 'grey.300', maxWidth: '800px' }}>
                The future of business is being written in India, yet a <strong><GradientText>silent crisis</GradientText></strong>{' '}
                threatens to derail it all. Millions of ambitious individuals are entering the workforce, but they lack the specific, critical skills your company needs to innovate and compete. This{' '}
                <strong><GradientText>talent paradox</GradientText></strong> isn't just a statistic—it's a{' '}
                <strong><GradientText>direct threat to your bottom line and future success</GradientText></strong>.
              </Typography>
              <Box sx={{ pt: 4 }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowDownward />}
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      boxShadow: `0 0 20px ${theme.palette.primary.main}b3`,
                    }
                  }}
                >
                  Uncover the Crisis
                </Button>
              </Box>
            </Box>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
};