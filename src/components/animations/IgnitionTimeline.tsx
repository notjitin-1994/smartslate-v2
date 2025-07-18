import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface TimelinePoint {
  time: string;
  title: string;
  description: string;
}

const timelinePoints: TimelinePoint[] = [
  {
    time: 'Day 0',
    title: 'Skill Gap Identified',
    description: 'Initial assessment reveals critical skill gaps.',
  },
  {
    time: 'Day 2',
    title: 'Ignition Academy Deployed',
    description: 'A complete, branded learning environment goes live.',
  },
  {
    time: 'Day 90',
    title: 'Productivity Uplift',
    description: 'Teams report a 35% increase in efficiency and output.',
  },
];

const TimelineItem: React.FC<{ item: TimelinePoint; index: number }> = ({ item, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

  const variants = {
    hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  return (
    <div ref={ref} className="mb-8 flex justify-between items-center w-full">
      <div className={`order-1 w-5/12 ${index % 2 === 0 ? 'text-right' : ''}`}></div>
      <div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-8 h-8 rounded-full">
        <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: inView ? 1 : 0 }}
           transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
           className="mx-auto text-white font-semibold text-lg">•</motion.div>
      </div>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={variants}
        className={`order-1 rounded-lg shadow-xl w-5/12 px-6 py-4 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
        <p className="font-bold text-brand-accent text-sm">{item.time}</p>
        <h3 className="mb-3 font-bold text-white text-lg">{item.title}</h3>
        <p className="text-sm leading-snug tracking-wide text-text-secondary/80 text-opacity-100">{item.description}</p>
      </motion.div>
    </div>
  );
};

export const IgnitionTimeline: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="container mx-auto w-full h-full">
      <div ref={ref} className="relative wrap overflow-hidden p-10 h-full">
        <motion.div
          className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border"
          style={{ left: '50%' }}
          initial={{ height: 0 }}
          animate={{ height: inView ? '100%' : 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        ></motion.div>
        {timelinePoints.map((item, index) => (
          <TimelineItem key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};
