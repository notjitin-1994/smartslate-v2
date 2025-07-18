import React, { Suspense } from 'react';

// Lazy load pages for better performance
const LandingPage = React.lazy(() => import('../components/pages/LandingPage'));
// TODO: The following pages are not yet routed, but are kept for future use.
// const SolutionsPage = React.lazy(() => import('@/components/pages/SolutionsPage'));
// const WhyUsPage = React.lazy(() => import('@/components/pages/WhyUsPage'));
// const CollaboratePage = React.lazy(() => import('@/components/pages/CollaboratePage'));

const Index = () => {
  // The state-based routing has been replaced by react-router-dom.
  // This component now primarily serves as the entry point for the landing page.
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-brand-accent text-2xl">Loading...</div>
      </div>
    }>
      <LandingPage />
    </Suspense>
  );
};

export default Index;
