import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const CourseBuildingAnimation: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  // Course modules that will be built
  const modules = [
    { id: 1, title: 'AI & ML', color: '#8B5CF6', width: '70%', delay: 0.1 },
    { id: 2, title: 'Data Science', color: '#3B82F6', width: '60%', delay: 0.3 },
    { id: 3, title: 'Leadership', color: '#10B981', width: '85%', delay: 0.5 },
    { id: 4, title: 'Strategy', color: '#EC4899', width: '65%', delay: 0.7 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const moduleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: { delay: number }) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom.delay,
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    }),
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: (custom: { delay: number; width: string }) => ({
      width: custom.width,
      transition: {
        delay: custom.delay + 0.3,
        duration: 1,
        ease: 'easeInOut' as const,
      },
    }),
  };

  return (
    <div ref={ref} className="relative w-full h-64 md:h-80 p-6">
      <motion.div 
        className="h-full flex flex-col justify-center space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {modules.map((module) => (
          <motion.div 
            key={module.id}
            className="relative"
            variants={moduleVariants}
            custom={{ delay: module.delay }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-indigo-100">{module.title}</span>
              <span className="text-xs text-indigo-300">
                {parseInt(module.width, 10)}% Complete
              </span>
            </div>
            <div className="h-2 bg-indigo-900/50 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full`}
                style={{ backgroundColor: module.color }}
                variants={progressVariants}
                custom={{ delay: module.delay, width: module.width }}
              />
            </div>
          </motion.div>
        ))}

        {/* Team members working on the courses */}
        <motion.div 
          className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1.2 + (i * 0.2),
                ease: "easeInOut",
              }}
            >
              {i}
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative elements */}
        <motion.div 
          className="absolute top-0 right-4 w-16 h-16 rounded-full bg-purple-500/10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-8 w-8 h-8 rounded-full bg-blue-500/10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
        />
      </motion.div>
    </div>
  );
};

export default CourseBuildingAnimation;
