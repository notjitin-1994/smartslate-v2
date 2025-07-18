import React from 'react';
import { Reveal } from '../common/reveal';
import { BrainCircuit, Zap } from 'lucide-react';

interface CoreDifferenceProps {
  onRevealNext: () => void;
}

export const CoreDifference: React.FC<CoreDifferenceProps> = ({ onRevealNext }) => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-6">
      <Reveal>
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="section-title">
            The <span className="gradient-text">AI-Powered</span> Core
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Our revolutionary AI Tutor is the heart of the Smartslate experience. It's more than a tool—it's a personalized mentor for every learner, ensuring concepts aren't just memorized, but mastered.
          </p>
        </div>
      </Reveal>
      
      <div className="mt-16 grid md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div>
            <h3 className="text-white font-quicksand text-3xl mb-4">Born from <span className="gradient-text">Deep Research</span></h3>
            <div className="space-y-4 text-text-secondary text-lg">
              <p>
                We didn't build our courses in a vacuum. We engaged in extensive dialogues with industry veterans, startup founders, and market leaders to decode the precise skills that drive success. 
              </p>
              <p>
                This collaborative research, combined with massive-scale data analysis on market demand, ensures every course is hyper-relevant and future-focused.
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div className="relative h-80 w-full">
            <BrainCircuit className="absolute w-full h-full text-brand-accent/10 -z-1" />
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-8 bg-brand-card-bg/50 backdrop-blur-sm rounded-lg border border-brand-accent/20">
                <Zap className="w-12 h-12 mx-auto text-brand-accent"/>
                <p className="mt-4 font-semibold text-white">AI-Driven Personalization</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="mt-12 text-center">
        <button 
          onClick={onRevealNext}
          className="px-8 py-3 bg-brand-accent text-brand-bg font-semibold rounded-lg hover:bg-brand-accent/90 transition-colors duration-300 flex items-center space-x-2 group border border-brand-accent/50 mx-auto"
        >
          <span>See the Solution</span>
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
  </section>
);
