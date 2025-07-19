import React from 'react';
import { Reveal } from '../common/reveal';
import { Users, Briefcase } from 'lucide-react';
import DeepResearchAnimation from '../animations/DeepResearchAnimation';
import { StarryNight } from '../common/StarryNight';
const SmartslateDifference: React.FC = () => {
  return (
    <div className="bg-brand-background text-text-primary">
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-24 sm:pt-32 pb-16 md:pb-24">
          <StarryNight className="opacity-80" />
          <div className="container mx-auto px-6 relative z-10">
          <Reveal>
            <h1 className="font-quicksand text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Engineered for <span className="gradient-text">Excellence</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl leading-relaxed">
              Smartslate isn't just another learning platform. It's a meticulously crafted ecosystem designed to bridge the gap between potential and performance, built on a foundation of deep research and real-world insights.
            </p>
          </Reveal>
          </div>
        </section>

        {/* The Core Difference Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <Reveal>
              <div className="max-w-4xl">
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
                  <h3 className="text-white font-quicksand text-3xl font-bold mb-4">Born from <span className="gradient-text">Deep Research</span></h3>
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
                <DeepResearchAnimation />
              </Reveal>
            </div>
          </div>
        </section>

        {/* For Academic & Business Leaders Section */}
        <section className="py-16 md:py-24 bg-brand-card-bg/30">
          <div className="container mx-auto px-6">
            <Reveal>
              <div className="max-w-4xl">
                <h2 className="section-title font-bold">
                  A <span className="gradient-text">Unified Solution</span> for Growth
                </h2>
                <p className="mt-4 text-lg text-text-secondary">
                  Whether you're shaping the next generation of talent or leading a competitive business, Smartslate provides the tools to build a future-ready workforce.
                </p>
              </div>
            </Reveal>

            <div className="mt-16 grid md:grid-cols-2 gap-8">
              {/* Card for Academic Leaders */}
              <Reveal>
                <div className="h-full p-8 rounded-xl bg-brand-card-bg border border-brand-accent/20 shadow-2xl flex flex-col">
                  <div className="flex-shrink-0">
                    <Users className="w-10 h-10 text-brand-accent mb-4" />
                    <h3 className="font-quicksand text-2xl font-bold text-white">For Academic Leaders</h3>
                  </div>
                  <div className="flex-grow mt-4">
                    <p className="text-text-secondary">
                      Elevate your institution by bridging the gap between academic theory and industry demands. Our platform complements your curriculum, offering students a personalized, AI-guided path to mastering the skills that employers are actively seeking. Partner with us to boost student employability and solidify your reputation as a forward-thinking institution.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Card for Business Leaders */}
              <Reveal delay={200}>
                <div className="h-full p-8 rounded-xl bg-brand-card-bg border border-brand-accent/20 shadow-2xl flex flex-col">
                  <div className="flex-shrink-0">
                    <Briefcase className="w-10 h-10 text-brand-accent mb-4" />
                    <h3 className="font-quicksand text-2xl font-bold text-white">For Business Leaders</h3>
                  </div>
                  <div className="flex-grow mt-4">
                    <p className="text-text-secondary">
                      In a rapidly evolving market, your team's skills are your greatest asset. Smartslate offers a scalable, effective solution to upskill and reskill your workforce. Our AI Tutor adapts to individual learning styles, maximizing engagement and ROI. Invest in your team's growth to drive innovation, improve retention, and secure your competitive edge.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SmartslateDifference;
