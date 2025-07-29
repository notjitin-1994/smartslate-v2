import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface LearningDemandProps {
  className?: string;
}

interface Person {
  id: number;
  wantsToLearn: boolean;
}

const LearningDemand: React.FC<LearningDemandProps> = ({ className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimation();

  const totalPeople = 100;
  const learningCount = 97;
  const notLearningCount = totalPeople - learningCount;

  // Create array of people
  const people = Array.from({ length: totalPeople }, (_, i) => ({
    id: i,
    wantsToLearn: i < learningCount,
  }));

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        when: "beforeChildren" as const,
      }
    }
  } as const;

  const item = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 150
      }
    }
  } as const;

  const getItemVariants = (delay: number) => ({
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        damping: 15,
        stiffness: 150,
        delay,
      },
    },
  } as const);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <div 
      ref={ref} 
      className={`relative p-6 rounded-xl bg-brand-card-bg/50 border border-white/10 overflow-hidden ${className}`}
    >
      <div className="relative z-10">
        <motion.h3 
          className="text-xl font-semibold mb-2 text-white"
          variants={getItemVariants(0.1)}
          initial="hidden"
          animate={controls}
        >
          Learning Demand
        </motion.h3>
        
        <motion.p 
          className="text-text-secondary mb-4 text-sm"
          variants={getItemVariants(0.15)}
          initial="hidden"
          animate={controls}
        >
          {learningCount}% of professionals want to learn new skills
        </motion.p>

        <motion.div 
          className="grid grid-cols-10 gap-1.5 mb-4"
          variants={container}
          initial="hidden"
          animate={controls}
        >
          {people.map((person) => (
            <motion.div
              key={person.id}
              variants={item}
              className={`w-full aspect-square rounded-full ${
                person.wantsToLearn 
                  ? 'bg-blue-500' 
                  : 'bg-gray-600 border border-gray-500'
              }`}
            />
          ))}
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-4 mt-3 text-xs"
          variants={getItemVariants(0.2)}
          initial="hidden"
          animate={controls}
        >
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
            <span className="text-gray-200">{learningCount}% Want to learn</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-600 border border-gray-500 mr-1.5"></div>
            <span className="text-gray-300">{notLearningCount}% Content</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden rounded-xl opacity-20 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500 rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};

export default LearningDemand;
