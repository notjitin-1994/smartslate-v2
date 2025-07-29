import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  skills: {
    name: string;
    level: number;
    color: string;
  }[];
  x: number;
  y: number;
}

const TeamSkillNetwork: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Team members with their skills
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Alex',
      role: 'AI Expert',
      skills: [
        { name: 'AI/ML', level: 90, color: '#8B5CF6' },
        { name: 'Data', level: 85, color: '#3B82F6' },
      ],
      x: 0,
      y: 0,
    },
    {
      id: 2,
      name: 'Sam',
      role: 'DevOps',
      skills: [
        { name: 'Cloud', level: 88, color: '#10B981' },
        { name: 'Security', level: 82, color: '#EC4899' },
      ],
      x: 0,
      y: 0,
    },
    {
      id: 3,
      name: 'Jordan',
      role: 'Product',
      skills: [
        { name: 'Strategy', level: 92, color: '#F59E0B' },
        { name: 'UX', level: 78, color: '#6366F1' },
      ],
      x: 0,
      y: 0,
    },
    {
      id: 4,
      name: 'Taylor',
      role: 'Engineering',
      skills: [
        { name: 'Frontend', level: 85, color: '#3B82F6' },
        { name: 'Backend', level: 80, color: '#10B981' },
      ],
      x: 0,
      y: 0,
    },
  ];

  // Calculate positions in a circle
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      
      // Position team members in a circle
      const radius = 120;
      const center = { x: 150, y: 150 };
      const angleStep = (2 * Math.PI) / teamMembers.length;
      
      teamMembers.forEach((member, i) => {
        member.x = center.x + radius * Math.cos(i * angleStep - Math.PI / 2);
        member.y = center.y + radius * Math.sin(i * angleStep - Math.PI / 2);
      });
    }
  }, [isInView, controls]);

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

  const memberVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + i * 0.1,
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    }),
  };

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    }),
  };

  return (
    <div ref={ref} className="relative w-full h-80">
      <motion.div 
        className="h-full w-full relative"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Connection lines */}
        <svg width="100%" height="100%" className="absolute inset-0">
          {teamMembers.map((member, i) => {
            const nextMember = teamMembers[(i + 1) % teamMembers.length];
            return (
              <motion.line
                key={`line-${i}`}
                x1={member.x}
                y1={member.y}
                x2={nextMember.x}
                y2={nextMember.y}
                stroke="#4B5563"
                strokeWidth="1"
                strokeDasharray="4 2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            );
          })}
        </svg>

        {/* Team members */}
        <AnimatePresence>
          {teamMembers.map((member, memberIndex) => (
            <motion.div
              key={member.id}
              className="absolute flex flex-col items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-900/80 to-indigo-800/80 border border-indigo-600/30 shadow-lg z-10"
              style={{
                left: `${member.x - 48}px`,
                top: `${member.y - 48}px`,
              }}
              variants={memberVariants}
              custom={memberIndex}
              whileHover={{ scale: 1.05, zIndex: 20 }}
              onHoverStart={() => setHoveredSkill(null)}
            >
              <div className="text-xs font-bold text-white">{member.name}</div>
              <div className="text-2xs text-indigo-200 mb-1">{member.role}</div>
              
              {/* Skills */}
              <div className="flex space-x-1">
                {member.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={`${member.id}-${skillIndex}`}
                    className={`w-2 h-2 rounded-full ${hoveredSkill === skill.name ? 'scale-125' : ''}`}
                    style={{ backgroundColor: skill.color }}
                    variants={skillVariants}
                    custom={skillIndex}
                    onHoverStart={() => setHoveredSkill(skill.name)}
                    onHoverEnd={() => setHoveredSkill(null)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Center node */}
        <motion.div
          className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-center text-sm left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg border-2 border-indigo-400/30 z-0"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            rotate: [0, 5, -5, 0],
          }}
          transition={{ 
            scale: { duration: 0.5, delay: 0.8 },
            rotate: { 
              duration: 8, 
              repeat: Infinity, 
              ease: 'easeInOut',
              repeatType: 'reverse' as const,
            },
          }}
        >
          <div className="p-2">
            Team
            <br />
            Skills
          </div>
        </motion.div>

        {/* Skill details panel */}
        <AnimatePresence>
          {hoveredSkill && (
            <motion.div 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-900/90 backdrop-blur-sm p-3 rounded-lg border border-indigo-700/50 shadow-lg z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="text-sm font-medium text-white mb-2">{hoveredSkill}</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {teamMembers
                  .filter(member => member.skills.some(s => s.name === hoveredSkill))
                  .map(member => {
                    const skill = member.skills.find(s => s.name === hoveredSkill);
                    return (
                      <div key={member.id} className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: skill?.color }} />
                        <span className="text-indigo-200">{member.name}:</span>
                        <span className="font-medium text-white">{skill?.level}%</span>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TeamSkillNetwork;
