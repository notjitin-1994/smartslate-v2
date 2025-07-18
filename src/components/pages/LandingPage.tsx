import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Hero } from '../sections/Hero';
import { TalentParadox } from '../sections/TalentParadox';
import { Solution } from '../sections/Solution';
import { WhoWePartnerWith } from '../sections/WhoWePartnerWith';

const ROICalculator = lazy(() => import('../sections/ROICalculator'));

const LandingPage: React.FC = () => {
  const [revealedSections, setRevealedSections] = useState(() => {
    try {
      const savedState = sessionStorage.getItem('revealedSections');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Basic validation to ensure we don't crash on malformed data
        if (typeof parsed.talentParadox === 'boolean') {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Could not parse revealed sections from session storage', error);
    }
    return {
      talentParadox: false,
      solution: false,
      roiCalculator: false,
      partners: false,
    };
  });

  useEffect(() => {
    sessionStorage.setItem('revealedSections', JSON.stringify(revealedSections));
  }, [revealedSections]);

  const sectionRefs = {
    talentParadox: useRef<HTMLDivElement>(null),
    solution: useRef<HTMLDivElement>(null),
    roiCalculator: useRef<HTMLDivElement>(null),
    partners: useRef<HTMLDivElement>(null),
  };

  const handleReveal = (sectionId: keyof typeof revealedSections) => {
    setRevealedSections(prev => ({ ...prev, [sectionId]: true }));

    setTimeout(() => {
      const ref = sectionRefs[sectionId as keyof typeof sectionRefs];
      const header = document.getElementById('main-header');

      if (ref.current && header) {
        const headerHeight = header.offsetHeight;
        const elementPosition = ref.current.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      } else if (ref.current) {
        // Fallback for safety
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150); // Adjusted timeout for reliability
  };

  return (
    <div>
      <Hero onRevealNext={() => handleReveal('talentParadox')} />

      {revealedSections.talentParadox && (
        <div id="talent-paradox" ref={sectionRefs.talentParadox} className="section-wrapper transition-opacity duration-1000 ease-in opacity-100">
          <TalentParadox onRevealNext={() => handleReveal('solution')} />
        </div>
      )}

      {revealedSections.solution && (
        <div id="solution" ref={sectionRefs.solution} className="section-wrapper transition-opacity duration-1000 ease-in opacity-100">
          <Solution onRevealNext={() => handleReveal('roiCalculator')} />
        </div>
      )}

      {revealedSections.roiCalculator && (
        <div id="roi-calculator" ref={sectionRefs.roiCalculator} className="section-wrapper transition-opacity duration-1000 ease-in opacity-100">
          <Suspense fallback={<div className="loading-screen">Loading...</div>}>
            <ROICalculator onRevealNext={() => handleReveal('partners')} />
          </Suspense>
        </div>
      )}

      {revealedSections.partners && (
        <div id="partners" ref={sectionRefs.partners} className="section-wrapper transition-opacity duration-1000 ease-in opacity-100">
          <WhoWePartnerWith />
        </div>
      )}
    </div>
  );
};

export default LandingPage;