import React from 'react';
import { Reveal } from '../common/reveal';
import { BrainCircuit, Palette, Sparkles } from 'lucide-react';
import { StarryBackground } from '../common/StarryBackground';
import { CourseCard } from '../common/CourseCard';

const CoursesPage: React.FC = () => (
  <>
    <section id="courses-hero" className="relative w-full pt-32 pb-20 md:pt-40 md:pb-24">
      <StarryBackground />
      <div className="container mx-auto px-6 relative z-10 text-left">
        <Reveal>
          <h1 className="font-quicksand text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Unlock Your <span className="gradient-text">Potential</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-3xl">
            Our courses are meticulously crafted to provide you with the most relevant, in-demand skills for the future of work.
          </p>
        </Reveal>
      </div>
    </section>

    <section id="course-catalog" className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CourseCard 
              title="AI Literacy"
              description="Aimed at all professionals and higher education students, this course covers everything about AI—from the Turing test and its history to where it is right now."
              category="Foundational Course"
              tags={['Artificial Intelligence', 'Beginner Friendly']}
              imageUrl="/images/ai-chip-artificial-intelligence-future-technology-innovation.jpg"
              Icon={BrainCircuit}
              comingSoon
            />
            <CourseCard 
              title="UX/UI Design"
              description="Master the art of creating intuitive and beautiful user interfaces. This course covers the end-to-end design process, from user research to high-fidelity prototyping."
              category="Creative Course"
              tags={['Design Principles', 'Figma & Prototyping']}
              imageUrl="/images/representations-user-experience-interface-design.jpg"
              Icon={Palette}
              comingSoon
            />
            
            {/* More Courses Coming Soon Card */}
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-800 p-8 text-center transition-colors duration-300 hover:border-indigo-500/50 hover:bg-neutral-900/30">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 ring-1 ring-inset ring-white/10">
                <Sparkles className="h-8 w-8 text-neutral-500" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">More on the Horizon</h3>
              <p className="mt-2 text-sm text-neutral-400">New learning opportunities are coming soon. Stay tuned!</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  </>
);

export default CoursesPage;
