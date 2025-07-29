import React from 'react';
import { Box, Container, Typography, Card, CardContent, Chip, Link as MuiLink, Grid, Button } from '@mui/material';
import { OfflineBolt, Hub, Code, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Reveal } from '../common/reveal';
import { useTheme } from '@mui/material/styles';

interface FrameworkSectionProps {
  onDiscoverROI?: () => void;
}

const solutions = [
  {
    id: 'ignite',
    icon: <OfflineBolt sx={{ fontSize: 40 }} />,
    title: 'Ignite Series',
    subtitle: 'AI-Powered Learning',
    tag: { text: 'In-Development', color: 'warning' as const },
    description: 'Experience the future of education with our pre-built AI-assisted courses, featuring your personal AI tutor.',
    link: '/#courses',
    isExternal: false,
  },
  {
    id: 'architecture',
    icon: <Hub sx={{ fontSize: 40 }} />,
    title: 'Strategic Skill Architecture',
    subtitle: 'Future-Proof Workforce',
    description: 'We conduct comprehensive skill gap analysis and design custom learning ecosystems that evolve with your needs.',
    link: 'mailto:jitin@smartslate.io?subject=Strategic%20Skill%20Architecture%20Inquiry',
    isExternal: true,
  },
  {
    id: 'solara',
    icon: <Code sx={{ fontSize: 40 }} />,
    title: 'Solara',
    subtitle: 'End-to-End Learning Platform',
    tag: { text: 'Coming Soon', color: 'info' as const },
    description: 'Revolutionize learning content creation with our all-in-one platform featuring interactive elements and a custom interaction builder.',
    link: '/solutions#solara',
    isExternal: false,
  },
];

export const FrameworkSection: React.FC<FrameworkSectionProps> = ({ onDiscoverROI }) => {
  const theme = useTheme();
  const GradientText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Typography component="span" sx={{ background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      {children}
    </Typography>
  );

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container>
        <Reveal>
          <Typography variant="h2" sx={{ mb: 2 }}>Smartslate <GradientText>Framework</GradientText></Typography>
          <Typography sx={{ mb: 4 }}>We don't just train; we <GradientText>transform</GradientText>. Our integrated ecosystem bridges the critical gap between education and industry.</Typography>
        </Reveal>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {solutions.map((solution, index) => (
            <Grid item xs={12} md={4} key={solution.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {solution.icon}
                      {solution.tag && <Chip label={solution.tag.text} color={solution.tag.color} sx={{ ml: 'auto' }} />}
                    </Box>
                    <Typography variant="h5" sx={{ mb: 1 }}>{solution.title}</Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>{solution.subtitle}</Typography>
                    <Typography>{solution.description}</Typography>
                  </CardContent>
                  <Box sx={{ flexGrow: 1 }} />
                  <CardContent>
                    {solution.isExternal ? (
                      <MuiLink href={solution.link} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center' }}>
                        Get Started Today <ArrowForward sx={{ ml: 1 }} />
                      </MuiLink>
                    ) : (
                      <MuiLink component={Link} to={solution.link} sx={{ display: 'flex', alignItems: 'center' }}>
                        Explore Solution <ArrowForward sx={{ ml: 1 }} />
                      </MuiLink>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
        {onDiscoverROI && (
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Button onClick={onDiscoverROI} variant="contained" size="large">
              Calculate Your Business Impact
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};
