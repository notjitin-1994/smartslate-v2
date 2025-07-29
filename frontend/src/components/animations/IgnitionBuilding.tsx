import React from 'react';
import { motion } from 'framer-motion';

const SkillBar = ({ skill, level, color }: { skill: string; level: number; color: string }) => {
  return (
    <div className="w-full mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-indigo-100">{skill}</span>
        <span className="text-indigo-300">{level}%</span>
      </div>
      <div className="w-full h-2 bg-indigo-900 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1.5, delay: 0.2 }}
        />
      </div>
    </div>
  );
};

export const IgnitionBuilding: React.FC = () => {
  const skills = [
    { name: 'AI & ML', level: 85, color: 'bg-purple-500' },
    { name: 'Data Science', level: 78, color: 'bg-blue-500' },
    { name: 'Leadership', level: 92, color: 'bg-indigo-500' },
    { name: 'Strategy', level: 75, color: 'bg-teal-500' },
  ];

  return (
    <div className="relative w-full h-64 md:h-80 p-6">
      <div className="relative h-full">
        {/* Team Members */}
        <div className="absolute inset-0 flex items-end justify-center space-x-1">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xs"
              initial={{ y: 0 }}
              animate={{
                y: [-10, 10, -10],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            >
              {i + 1}
            </motion.div>
          ))}
        </div>

        {/* Skill Bars */}
        <div className="absolute bottom-0 left-0 right-0 bg-indigo-950/80 backdrop-blur-sm p-4 rounded-lg border border-indigo-700/50">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <SkillBar skill={skill.name} level={skill.level} color={skill.color} />
            </motion.div>
          ))}
        </div>

        {/* Animated Stars */}
        <div className="absolute inset-0 overflow-hidden opacity-70">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
