import React from 'react';
import { ArrowDown } from 'lucide-react';
import { Reveal } from '@/components/common/reveal';

export const Contact: React.FC = () => {
  const handleContact = () => {
    // Handle contact form submission
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="max-w-3xl">
              <h2 className="font-quicksand text-4xl font-bold text-white mb-4">Let's Build a <span className="gradient-text">Future-Ready India.</span> Together.</h2>
              <p className="text-lg text-text-secondary mb-8">The time for incremental change is over. The demands of today's dynamic, skills-first economy require a bold and strategic response. Smartslate provides the essential framework, the tools, and the <strong className="gradient-text">strategic partnership</strong> required to turn India's demographic dividend into its greatest strength. <br /><br /> Join us in building the <strong className="gradient-text">talent pipeline that will define tomorrow</strong>.</p>
              <button 
                onClick={handleContact}
                className="group bg-[#A8DADC] hover:bg-[#8fc8ca] text-[#13111c] font-bold py-3 px-8 rounded-lg transition-colors duration-300 flex items-center gap-2"
              >
                Uncover the Crisis
                <ArrowDown className="transition-transform duration-300 group-hover:translate-y-1" />
              </button>
            </div>
            <div>
              <img 
                src="https://placehold.co/600x400/100F1C/A0AEC0?text=Collaboration" 
                alt="Illustration showing collaboration and building together" 
                className="rounded-xl" 
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};