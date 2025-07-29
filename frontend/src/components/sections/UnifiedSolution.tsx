import React from 'react';
import { Reveal } from '../common/reveal';
import { Users, Briefcase } from 'lucide-react';

export const UnifiedSolution: React.FC = () => (
  <section className="py-16 md:py-24 bg-brand-card-bg/30">
    <div className="container mx-auto px-6">
      <Reveal>
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="section-title">
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
);
