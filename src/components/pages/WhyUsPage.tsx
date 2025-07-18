import React from 'react';
import { StarryBackground } from '../common/StarryBackground';

interface WhyUsPageProps {
  onContactClick: (formType?: string) => void;
}

const WhyUsPage: React.FC<WhyUsPageProps> = ({ onContactClick }) => (
  <main>
    <section className="relative py-24 md:py-32">
      <div className="container mx-auto px-6 text-left relative z-10">
        <h1 className="font-quicksand text-4xl md:text-6xl font-bold text-white leading-tight mb-4 max-w-4xl">
          Your <strong className="gradient-text">talent pipeline is leaking.</strong> <br />
          Are you ready to <strong className="gradient-text">fix it?</strong>
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-3xl">
          The disconnect between traditional education and modern economy demands creates the single greatest opportunity for innovation.
        </p>
      </div>
      <StarryBackground />
    </section>
    {/* More sections to be added */}
  </main>
);

export default WhyUsPage;