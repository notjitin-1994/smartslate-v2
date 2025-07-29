import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Skill {
  name: string;
  color: string;
}

interface SkillBlueprintProps {
  skills: {
    core: string;
    categories: Skill[];
  };
}

const brandColors = {
  bg: 'hsl(258 28% 9%)',
  accent: 'hsl(182 40% 73%)',
  accentDark: 'hsl(190 50% 55%)',
  textMain: 'hsl(0 0% 89%)',
  textSecondary: 'hsl(214 14% 63%)',
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5, x: 150, y: 150 },
  visible: (i: number) => {
    const angle = (i / 4) * 2 * Math.PI; // Assuming 4 categories for spiral
    const radius = 120;
    return {
      opacity: 1,
      scale: 1,
      x: 150 + radius * Math.cos(angle),
      y: 150 + radius * Math.sin(angle),
      transition: { type: 'spring', stiffness: 150, damping: 12 },
    };
  },
};

const centerVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.2, duration: 0.4 },
  },
};

export const SkillBlueprint: React.FC<SkillBlueprintProps> = ({ skills }) => {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!skills) return null;

  const { core, categories } = skills;
  const numNodes = categories.length;
  const radius = 120;
  const center = { x: 150, y: 150 };

  return (
    <div 
      ref={ref}
      style={{ 
        color: brandColors.textMain,
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
      }}
    >
      <h3 
        className="font-quicksand"
        style={{ 
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: brandColors.textMain 
        }}>
        {core} Skill Ecosystem
      </h3>
      <motion.svg 
        width="300" 
        height="300" 
        viewBox="0 0 300 300" 
        style={{ margin: '0 auto' }}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Lines */}
        {categories.map((_, i) => {
            const angle = (i / numNodes) * 2 * Math.PI;
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            return (
                <motion.line
                    key={`line-${i}`}
                    x1={center.x}
                    y1={center.y}
                    x2={x}
                    y2={y}
                    stroke={brandColors.accent}
                    strokeWidth={1}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredNode === i ? 0.7 : 0.2 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                />
            );
        })}

        {/* Orbiting Nodes */}
        {categories.map((category, i) => (
          <motion.g
            key={`node-${i}`}
            custom={i}
            variants={itemVariants}
            onMouseEnter={() => setHoveredNode(i)} 
            onMouseLeave={() => setHoveredNode(null)}
          >
            <motion.circle
              r={12}
              fill={brandColors.accentDark}
              stroke={brandColors.accent}
              strokeWidth={2}
              animate={{ scale: hoveredNode === i ? 1.3 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <text y={25} textAnchor="middle" fill={brandColors.textSecondary} fontSize="12">
              {category.name}
            </text>
          </motion.g>
        ))}

        {/* Central Node */}
        <motion.g variants={centerVariants}>
          <motion.circle
            cx={center.x}
            cy={center.y}
            r={60}
            fill={brandColors.bg}
            stroke={brandColors.accent}
            strokeWidth={2}
            filter="url(#glow)"
            animate={{ 
              scale: [1, 1.02, 1], 
              boxShadow: [
                '0 0 0px hsla(182, 40%, 73%, 0.2)',
                '0 0 20px hsla(182, 40%, 73%, 0.4)',
                '0 0 0px hsla(182, 40%, 73%, 0.2)',
              ]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <text x={center.x} y={center.y} textAnchor="middle" dy=".3em" fill={brandColors.textMain} className="font-quicksand" fontWeight="bold">
            {core}
          </text>
        </motion.g>
      </motion.svg>
    </div>
  );
};
