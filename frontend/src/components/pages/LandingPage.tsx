import React, { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Hero } from '../sections/Hero';
import { TalentParadox } from '../sections/TalentParadox';
import { FrameworkSection } from '../sections/FrameworkSection';
import { WhoWePartnerWith } from '../sections/WhoWePartnerWith';
const ROICalculator = lazy(() => import('../sections/ROICalculator'));

const LandingPage: React.FC = () => {
  return (
    <Box>
      <Hero />
      <TalentParadox />
      <FrameworkSection />
      <Suspense fallback={<CircularProgress />}>
        <ROICalculator />
      </Suspense>
      <WhoWePartnerWith />
    </Box>
  );
};

export default LandingPage;