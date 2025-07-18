import React from 'react';
import { Reveal } from '../common/reveal';

interface DifferenceHeroProps {
  onRevealNext: () => void;
}

export const DifferenceHero: React.FC<DifferenceHeroProps> = ({ onRevealNext }) => (
  <section className="relative text-center container mx-auto px-6 py-16 md:py-24">
    <Reveal>
      <h1 className="font-quicksand text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
        Engineered for <span className="gradient-text">Excellence</span>
      </h1>
      <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
        Smartslate isn't just another learning platform. It's a meticulously crafted ecosystem designed to bridge the gap between potential and performance, built on a foundation of deep research and real-world insights.
      </p>
      <div className="mt-8">
        <button 
          onClick={onRevealNext}
          className="px-8 py-3 bg-brand-accent text-brand-bg font-semibold rounded-lg hover:bg-brand-accent/90 transition-colors duration-300 flex items-center space-x-2 group border border-brand-accent/50 mx-auto"
        >
          <span>Discover the Core</span>
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
    </Reveal>
  </section>
);
