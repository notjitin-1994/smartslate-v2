import React, { useState, useRef } from 'react';
import { Reveal } from '../common/reveal';
import { ChevronLeft, ChevronRight, GraduationCap, Zap, BrainCircuit } from 'lucide-react';

interface SolutionProps {
  onRevealNext: () => void;
}

export const Solution: React.FC<SolutionProps> = ({ onRevealNext }) => {
  const [activeTab, setActiveTab] = useState(0);

  const solutions = [
    {
      title: <>Ignite <span className="gradient-text font-bold">Day-One</span> Readiness</>,
      description: <>Don't just hire for potential; onboard <span className="gradient-text font-bold">elite, industry-fluent professionals</span>. We meticulously bridge the gap between academic knowledge and enterprise demands, ensuring your new talent delivers <span className="gradient-text font-bold">peak performance</span> from the <span className="gradient-text font-bold">very first day</span>.</>,
      icon: <GraduationCap className="w-12 h-12 text-brand-accent" />,
    },
    {
      title: <>Future-Proof Your <span className="gradient-text font-bold">Existing Talent</span></>,
      description: <>In a rapidly evolving landscape, stagnation is not an option. We empower your current workforce with <span className="gradient-text font-bold">critical, in-demand skills</span>, fostering a resilient culture of <span className="gradient-text font-bold">continuous innovation</span> that drives retention and <span className="gradient-text font-bold">competitive advantage</span>.</>,
      icon: <Zap className="w-12 h-12 text-brand-accent" />,
    },
    {
      title: <>Unlock <span className="gradient-text font-bold">Predictive</span> Insights</>,
      description: <>Move beyond guesswork and make <span className="gradient-text font-bold">data-driven talent decisions</span>. Our Solara Engine provides <span className="gradient-text font-bold">AI-powered analytics</span> and personalized learning paths, delivering a clear, <span className="gradient-text font-bold">quantifiable return</span> on your most valuable asset: your people.</>,
      icon: <BrainCircuit className="w-12 h-12 text-brand-accent" />,
    },
  ];

  const activeSolution = solutions[activeTab];

  return (
        <section id="solution" className="relative w-full py-16 md:py-24 bg-brand-background">
      <div className="container mx-auto px-4">
        <Reveal>
          <div className="text-left mb-12 max-w-4xl">
            <h2 className="section-title">
              Our <span className="gradient-text font-bold">Solution</span>: The <span className="gradient-text font-bold">Smartslate Framework</span>
            </h2>
            <p className="text-text-secondary text-lg mt-4">
              We don't just train; we <span className="gradient-text font-bold">transform</span>. Our <span className="gradient-text font-bold">integrated ecosystem</span> bridges the <span className="gradient-text font-bold">critical gap</span> between education and industry, building a workforce that's not just ready for today, but <span className="gradient-text font-bold">engineered for tomorrow</span>.
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="bg-brand-card-bg/80 backdrop-blur-sm border border-brand-accent/20 rounded-2xl p-8 md:p-12 shadow-elegant-subtle">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              {/* Left Column: Tab Buttons */}
              <div className="flex flex-col gap-4 md:w-1/3 lg:w-1/4">
                {solutions.map((solution, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    aria-selected={activeTab === index}
                    className={`relative group w-full text-left p-4 rounded-lg transition-all duration-300 border cursor-pointer focus:outline-none ${activeTab === index ? 'bg-brand-accent/10 border-brand-accent/50 shadow-lg' : 'bg-brand-card-bg/50 border-transparent hover:bg-brand-card-bg'}`}
                  >
                    {/* Active left indicator bar */}
                    {activeTab === index && (
                      <span className="absolute left-0 top-0 h-full w-1 bg-brand-accent rounded-r"></span>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <h3 className="text-lg font-bold text-white font-quicksand">{solution.title}</h3>
                      <ChevronRight
                          className={`w-5 h-5 transition-transform duration-300 transform mt-2 sm:mt-0 sm:group-hover:translate-x-1 group-hover:translate-y-1 sm:rotate-0 rotate-90 ${activeTab === index ? 'text-brand-accent' : 'text-text-secondary group-hover:text-white'}`}
                        />
                    </div>
                  </button>
                ))}
              </div>

              {/* Separator and Right Column */}
              <div className="relative flex-1 md:border-l md:border-brand-accent/20 md:pl-8 lg:pl-12 flex items-center">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-8">
                  <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-brand-accent/10 to-transparent rounded-full flex items-center justify-center ring-4 ring-[#a7dadb]">
                    {activeSolution.icon}
                  </div>
                  <div>
                    <p className="text-text-secondary text-lg leading-relaxed">{activeSolution.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-left">
            <button 
              onClick={onRevealNext}
              className="px-8 py-3 bg-brand-accent text-brand-bg font-semibold rounded-lg hover:bg-brand-accent/90 transition-colors duration-300 flex items-center space-x-2 group/btn border border-brand-accent/50"
            >
              <span>Discover the ROI</span>
              <svg 
                className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform duration-300 animate-arrow-bounce" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};