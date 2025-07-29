import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Card, CardActionArea, Typography, useTheme, Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import { OfflineBolt, Group, TrackChanges, FactCheck } from '@mui/icons-material';
import { Reveal } from '../common/reveal';
import PeopleVisualization from '../common/PeopleVisualization';
import DisruptionTimeline from '../common/DisruptionTimeline';
import EmployabilityCrisis from '../common/EmployabilityCrisis';
import LearningDemand from '../common/LearningDemand';
import { Button } from '../common/Button';

interface DataItem {
  value: number;
  label: string;
  desc: React.ReactNode;
  excerpt: string;
  icon: React.ReactElement;
  key: string;
}

const StatIconCard: React.FC<{
  icon: React.ReactElement;
  value: number;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, value, label, active, onClick }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        p: 2,
        textAlign: 'center',
        transition: 'transform 0.3s, box-shadow 0.3s',
        border: `1px solid ${theme.palette.primary.main}33`,
        ...(active && {
          transform: 'translateY(-5px) scale(1.02)',
          boxShadow: `0 0 20px ${theme.palette.primary.main}b3`,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }),
      }}
    >
      <CardActionArea onClick={onClick}>
        <Box sx={{ mb: 1 }}>{icon}</Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{Math.ceil(value)}%</Typography>
        <Typography>{label}</Typography>
      </CardActionArea>
    </Card>
  );
};

export const TalentParadox: React.FC = () => {
  const [activeSection, setActiveSection] = useState('perception');
  const [counterValues, setCounterValues] = useState({ disruption: 0, perception: 0, crisis: 0, demand: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const data = useMemo<Record<string, DataItem>>(() => ({
    perception: { value: 16, label: "Perception Gap", desc: "Industry leaders disagree on work-readiness.", excerpt: "Only 16% of industry leaders believe emerging talent is work-ready.", icon: <Group />, key: 'perception' },
    disruption: { value: 40, label: "Skills Disruption", desc: "Core skills will change by 2030.", excerpt: "40% of core skills will change.", icon: <OfflineBolt />, key: 'disruption' },
    crisis: { value: 42.6, label: "Employability Crisis", desc: "A shrinking talent pipeline.", excerpt: "Employability rate for emerging talent is 42.6%.", icon: <TrackChanges />, key: 'crisis' },
    demand: { value: 97, label: "Learning Demand", desc: "The workforce is eager to adapt.", excerpt: "97% of young professionals demand on-the-job learning.", icon: <FactCheck />, key: 'demand' }
  }), []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let animationFrameId: number | null = null;
    const duration = 1500;
    const startTime = Date.now();
    const updateCounters = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCounterValues({
        disruption: data.disruption.value * progress,
        perception: data.perception.value * progress,
        crisis: data.crisis.value * progress,
        demand: data.demand.value * progress,
      });
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounters);
      }
    };
    updateCounters();
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible, data]);

  const activeData = useMemo(() => data[activeSection] || data.perception, [activeSection, data]);

  const GradientText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Typography component="span" sx={{ background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' }}>
      {children}
    </Typography>
  );

  return (
    <Box component="section" sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container>
        <Reveal>
          <Typography variant="h2" sx={{ mb: 2 }}><GradientText>The Talent Paradox</GradientText>: A <GradientText>Crisis</GradientText> of Scale</Typography>
          <Typography sx={{ mb: 4 }}>The numbers paint a clear picture. India's potential is immense, but it's constrained by a persistent skills gap.</Typography>
        </Reveal>
        <Reveal delay={200}>
          <Box ref={ref} sx={{ border: `1px solid ${theme.palette.primary.main}33`, borderRadius: 2, p: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  {Object.values(data).map((item) => (
                    <Grid item xs={6} key={item.key}>
                      <StatIconCard
                        active={activeSection === item.key}
                        value={counterValues[item.key as keyof typeof counterValues] || 0}
                        label={item.label}
                        icon={item.icon}
                        onClick={() => setActiveSection(item.key)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, height: '100%' }}>
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>{activeData.label}</Typography>
                  {activeSection === 'perception' && <PeopleVisualization yesCount={16} noCount={84} size="md" />}
                  {activeSection === 'disruption' && <DisruptionTimeline startYear={2024} endYear={2030} disruptionPercentage={40} isInteractive={false} />}
                  {activeSection === 'crisis' && <EmployabilityCrisis />}
                  {activeSection === 'demand' && <LearningDemand />}
                  <Typography sx={{ mt: 2 }}>{activeData.desc}</Typography>
                  <Box sx={{ mt: 2, p: 2, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>"{activeData.excerpt}"</Typography>
                  </Box>
                  <Button
                    sx={{
                      mt: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      '&:hover': {
                        boxShadow: `0 0 20px ${theme.palette.primary.main}b3`,
                      }
                    }}
                  >
                    Discover our Framework
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
};
