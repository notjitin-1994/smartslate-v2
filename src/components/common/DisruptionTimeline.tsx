import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface DisruptionTimelineProps {
  className?: string;
  startYear?: number;
  endYear?: number;
  disruptionPercentage?: number;
}

const DisruptionTimeline: React.FC<DisruptionTimelineProps> = ({
  className = '',
  startYear = 2024,
  endYear = 2030,
  disruptionPercentage = 40,
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const totalYears = years.length;
  const disruptionYearIndex = Math.floor(totalYears * (1 - disruptionPercentage / 100));
  const disruptionYear = years[disruptionYearIndex];

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  } as const;

  const item = (index: number) => ({
    hidden: { 
      opacity: 0, 
      y: 20,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 10,
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 10,
        delay: index * 0.05,
      },
    },
  });

  const progressBar = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
        delay: 0.3,
      },
    },
  };

  const disruptionIndicator = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 10,
        delay: 0.5,
      },
    },
  };

  return (
    <div 
      ref={ref} 
      className={`relative w-full max-w-4xl mx-auto p-4 sm:p-6 bg-brand-card-bg/80 rounded-xl border border-brand-accent/30 shadow-lg overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(168,218,220,0.05) 100%)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Progress bar */}
      <div className="relative h-2 sm:h-3 bg-gray-200/20 dark:bg-gray-700/50 rounded-full overflow-hidden mb-6 sm:mb-10 mx-2 sm:mx-0">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 origin-left"
          initial="hidden"
          animate={controls}
          variants={progressBar}
        />
        
        {/* Disruption point indicator */}
        <motion.div
          className="absolute top-0 h-full w-0.5 sm:w-1 bg-red-500"
          style={{
            left: `${(1 - disruptionPercentage / 100) * 100}%`,
          }}
          initial="hidden"
          animate={controls}
          variants={disruptionIndicator}
        >
          <motion.div 
            className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 text-[10px] sm:text-xs font-semibold text-red-500 whitespace-nowrap bg-brand-card-bg/90 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded"
            animate={{
              y: isHovered ? -3 : 0,
              opacity: isHovered ? 1 : 0.7,
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {disruptionPercentage}% Skills Shift
          </motion.div>
        </motion.div>
      </div>

      {/* Years */}
      <div className="relative overflow-x-auto pb-2 -mx-2 sm:mx-0">
        <motion.div 
          className="flex justify-between relative mt-6 sm:mt-8 mb-8 sm:mb-12 min-w-[500px] sm:min-w-auto px-2 sm:px-0"
          initial="hidden"
          animate={controls}
          variants={container}
        >
          {years.map((year, index) => {
            const isDisruptionPoint = year >= disruptionYear;
            const isCurrentYear = year === new Date().getFullYear();
            
            return (
              <motion.div 
                key={year}
                className="flex flex-col items-center relative group px-1"
                variants={item(index)}
              >
                <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mb-1.5 sm:mb-2 transition-all duration-300 ${
                  isDisruptionPoint 
                    ? 'bg-brand-accent ring-3 sm:ring-4 ring-brand-accent/30' 
                    : 'bg-gray-500/50 ring-1 sm:ring-2 ring-transparent group-hover:ring-gray-500/30'
                }`} />
                <span className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
                  isDisruptionPoint ? 'text-brand-accent' : 'text-gray-400'
                }`}>
                  {year}
                </span>
                {isCurrentYear && (
                  <span className="absolute -top-6 sm:-top-7 text-[10px] sm:text-xs font-semibold text-brand-accent bg-brand-card-bg/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border border-brand-accent/30">
                    Today
                  </span>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Skills change visualization */}
      <motion.div 
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.4,
            },
          },
        }}
      >
        <motion.div 
          className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm hover:border-brand-accent/30 transition-all duration-300"
          variants={item(0)}
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        >
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-3" />
            <h4 className="text-lg font-semibold text-white">Current Skills</h4>
          </div>
          <div className="space-y-3 pl-6">
            {[
              { name: 'Technical Skills', icon: '🔧' },
              { name: 'Soft Skills', icon: '🤝' },
              { name: 'Domain Knowledge', icon: '📚' },
              { name: 'Digital Literacy', icon: '💻' }
            ].map((skill, i) => (
              <div key={i} className="flex items-center group">
                <span className="opacity-70 group-hover:opacity-100 transition-opacity mr-2">{skill.icon}</span>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{skill.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="p-6 bg-brand-accent/5 rounded-xl border border-brand-accent/20 backdrop-blur-sm hover:border-brand-accent/40 transition-all duration-300"
          variants={item(1)}
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        >
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-brand-accent mr-3" />
            <h4 className="text-lg font-semibold text-white">By 2030</h4>
          </div>
          <div className="space-y-3 pl-6">
            {[
              { name: 'AI & ML Literacy', icon: '🧠' },
              { name: 'Critical Thinking', icon: '💡' },
              { name: 'Emotional Intelligence', icon: '❤️' },
              { name: 'Cross-functional Collaboration', icon: '🤝' },
              { name: 'Adaptability', icon: '🔄' }
            ].map((skill, i) => (
              <div key={i} className="flex items-center group">
                <span className="opacity-70 group-hover:opacity-100 transition-opacity mr-2">{skill.icon}</span>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{skill.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>40% of core skills required for jobs will change by 2030</p>
      </motion.div>
    </div>
  );
};

export default DisruptionTimeline;
