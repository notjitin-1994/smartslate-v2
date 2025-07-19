import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';

interface PeopleVisualizationProps {
  yesCount?: number;
  noCount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PeopleVisualization: React.FC<PeopleVisualizationProps> = ({
  yesCount = 16,
  noCount = 84,
  size = 'md',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const totalPeople = yesCount + noCount;
  
  // Calculate the grid layout
  const gridCols = {
    sm: 'grid-cols-10',
    md: 'grid-cols-10',
    lg: 'grid-cols-10',
  }[size];
  
  const personSize = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }[size];
  
  // Create arrays for yes and no people
  const yesPeople = Array(yesCount).fill('yes');
  const noPeople = Array(noCount).fill('no');
  const allPeople = [...yesPeople, ...noPeople];
  
  // Shuffle the array for random distribution
  const [shuffledPeople, setShuffledPeople] = useState<string[]>([]);
  
  useEffect(() => {
    // Shuffle the array when component mounts
    const shuffled = [...allPeople].sort(() => Math.random() - 0.5);
    setShuffledPeople(shuffled);
    
    // Trigger animation after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [yesCount, noCount]);
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.01,
        delayChildren: 0.1,
      },
    },
  } as const;
  
  const item = (i: number) => ({
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 10,
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 10,
        delay: 0.05 + (i * 0.01),
      },
    },
  });
  
  return (
    <div className={`${className}`}>
      <motion.div 
        className={`grid ${gridCols} gap-1 md:gap-2`}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={container}
      >
        {shuffledPeople.map((person, index) => (
          <motion.div
            key={`person-${index}`}
            variants={item(index)}
            className={`${personSize} flex items-center justify-center`}
            whileHover={{ 
              scale: 1.2, 
              zIndex: 10,
              transition: { 
                type: 'spring' as const, 
                stiffness: 500 
              } 
            }}
          >
            <User 
              size={size === 'sm' ? 14 : size === 'md' ? 18 : 20} 
              className={`${person === 'yes' ? 'text-green-500' : 'text-gray-400'}`}
              fill={person === 'yes' ? 'currentColor' : 'none'}
              strokeWidth={person === 'yes' ? 0 : 1.5}
            />
          </motion.div>
        ))}
      </motion.div>
      
      <div className="flex justify-between mt-4 text-sm md:text-base">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          <span>{yesCount}% Yes</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"></span>
          <span>{noCount}% No</span>
        </div>
      </div>
    </div>
  );
};

export default PeopleVisualization;
