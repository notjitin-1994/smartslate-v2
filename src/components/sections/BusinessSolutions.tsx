import React from 'react';
import { Reveal } from '../common/reveal';
import { IgnitionTimeline } from '../animations/IgnitionTimeline';
import { SkillBlueprint } from '../animations/SkillBlueprint';
import { SolaraBrain } from '../animations/SolaraBrain';

import type { FormType } from '../../lib/formUtils';

interface BusinessSolutionsProps {
  onContactClick: (formType: FormType) => void;
}

const leadershipBlueprintData = {
  core: 'Leadership',
  categories: [
    { name: 'AI & ML', color: '#4ECDC4' },
    { name: 'Data Science', color: '#45B7D1' },
    { name: 'Negotiation', color: '#96CEB4' },
    { name: 'Strategy', color: '#FF6B6B' },
  ],
};

export const BusinessSolutions: React.FC<BusinessSolutionsProps> = ({ onContactClick }) => {
  return (
    <div className="space-y-20 md:space-y-32">
      {/* Product 1: Ignition Series */}
      <section id="ignition-series" className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div className="space-y-4">
                <h2 className="font-quicksand text-3xl md:text-4xl font-bold text-white">
                  Ignition Series: <span className="gradient-text">Ready-to-Deploy Academies</span>
                </h2>
                <p className="text-lg text-text-secondary leading-relaxed">
                  Your team is your engine, but even the best engines need the right fuel. Don't let skill gaps slow your momentum. Our <strong>Ignition Series</strong> offers a curated library of over <strong>250+ ready-to-deploy courses</strong> in critical domains like AI, Data Science, and Leadership.
                </p>
                <p className="text-lg text-text-secondary leading-relaxed">
                  Stop waiting for curriculum development. Deploy a world-class training academy in <strong>under 48 hours</strong> and see an average <strong>35% increase in team productivity</strong> within the first quarter. You're not just buying courses; you're buying speed, efficiency, and a decisive competitive edge.
                </p>
              </div>
            </Reveal>
            <div className="flex items-center justify-center">
              <IgnitionTimeline />
            </div>
          </div>
        </div>
      </section>

      {/* Product 2: Strategic Skill Architecture */}
      <section id="skill-architecture" className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex items-center justify-center order-last md:order-first">
              <SkillBlueprint skills={leadershipBlueprintData} />
            </div>
            <Reveal>
              <div className="space-y-4">
                <h2 className="font-quicksand text-3xl md:text-4xl font-bold text-white">
                  Strategic Skill Architecture: <span className="gradient-text">Bespoke Learning Blueprints</span>
                </h2>
                <p className="text-lg text-text-secondary leading-relaxed">
                  Off-the-shelf solutions address common problems. You're not solving common problems. Your vision is unique, and your challenges are complex. That's why you need more than training; you need a strategic weapon.
                </p>
                <p className="text-lg text-text-secondary leading-relaxed">
                  Our <strong>Strategic Skill Architecture</strong> service goes beyond course creation. We partner with your leadership to create a <strong>bespoke learning blueprint</strong> that aligns directly with your 3-to-5-year business objectives. We've helped leaders like you <strong>reduce employee ramp-up time by 60%</strong> and <strong>increase role-specific proficiency by over 70%</strong>. This isn't just custom content; it's your corporate strategy, encoded into your talent.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Product 3: Solara AI */}
      <section id="odyssey-ai" className="py-12 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div className="space-y-4">
                 <div className="inline-block bg-brand-accent/10 text-brand-accent font-semibold px-4 py-1 rounded-full text-sm border border-brand-accent/30">
                  WORK IN PROGRESS: SHAPE THE FUTURE WITH US
                </div>
                <h2 className="font-quicksand text-3xl md:text-4xl font-bold text-white">
                  Solara AI: <span className="gradient-text">The Self-Evolving LXP</span>
                </h2>
                <p className="text-lg text-text-secondary leading-relaxed">
                  The future doesn't wait for you to be ready. It's built by those who dare to innovate first. We are currently crafting the next generation of learning platforms, and we're inviting a select group of visionaries to shape its development.
                </p>
                <p className="text-lg text-text-secondary leading-relaxed">
                  <strong>Solara AI</strong> is a self-evolving Learning Experience Platform (LXP) that doesn't just manage content—it anticipates needs. Using predictive analytics, it identifies future skill gaps and auto-generates learning paths, turning your organization into a truly adaptive workforce. Be more than a client; be a pioneer.
                </p>
                 <button 
                  onClick={() => onContactClick('introduction')}
                  className="px-6 py-2 bg-transparent border border-brand-accent text-brand-accent font-semibold rounded-lg hover:bg-brand-accent hover:text-brand-bg transition-colors duration-300">
                  Register Interest
                </button>
              </div>
            </Reveal>
            <div className="flex items-center justify-center">
              <SolaraBrain />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
