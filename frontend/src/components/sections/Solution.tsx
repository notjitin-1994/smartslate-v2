import React from 'react';
import { BusinessSolutions } from './BusinessSolutions';
import type { FormType } from '../../lib/formUtils';

interface SolutionProps {
  onRevealNext: () => void;
  onContactClick: (formType: FormType) => void;
}

export const Solution: React.FC<SolutionProps> = ({ onRevealNext, onContactClick }) => {
  return (
    <section id="solutions" className="relative py-20 md:py-28 bg-brand-bg">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-left mb-16 max-w-5xl mx-auto">
          <h2 className="font-quicksand text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Smartslate <span className="gradient-text">Framework</span>
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            We don't just train; we <span className="gradient-text font-semibold">transform</span>. Our <span className="gradient-text font-semibold">integrated ecosystem</span> bridges the <span className="gradient-text font-semibold">critical gap</span> between education and industry.
          </p>
        </div>
        
        {/* Business Solutions Content */}
        <BusinessSolutions onContactClick={onContactClick} />
      </div>
    </section>
  );
};