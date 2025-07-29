import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const NUM_NODES = 15;
const SPREAD_RADIUS = 150;

const nodes = Array.from({ length: NUM_NODES }, (_, i) => ({
  id: i,
  x: 50 + SPREAD_RADIUS / 2 * Math.cos((i / NUM_NODES) * 2 * Math.PI),
  y: 50 + SPREAD_RADIUS / 2 * Math.sin((i / NUM_NODES) * 2 * Math.PI),
  size: Math.random() * 8 + 4, // Random size between 4 and 12
}));

const connections = nodes.map((node, i) => ({
  from: node.id,
  to: nodes[(i + 1) % NUM_NODES].id, // Connect to the next node
}));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const nodeVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, type: 'spring' as const, stiffness: 300 },
  }),
};

const lineVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.2, transition: { duration: 0.7, delay: 0.3 } },
};

export const SolaraBrain: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const centerX = 150;
  const centerY = 150;

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="relative w-full h-[400px] flex items-center justify-center"
    >

      <svg viewBox="0 0 300 300" className="absolute w-full h-full overflow-visible">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g>
          {/* Connections */}
          {connections.map((conn, i) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            return (
              <motion.line
                key={i}
                x1={centerX + fromNode.x}
                y1={centerY + fromNode.y}
                x2={centerX + toNode.x}
                y2={centerY + toNode.y}
                stroke="#FFFFFF"
                strokeWidth="1"
                variants={lineVariants}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => (
            <motion.g
              key={node.id}
              transform={`translate(${centerX + node.x}, ${centerY + node.y})`}
              variants={nodeVariants}
              custom={i}
            >
              <motion.circle
                r={node.size}
                fill="#FFFFFF"
                filter="url(#glow)"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'mirror' as const,
                  delay: i * 0.1,
                }}
              />
            </motion.g>
          ))}
        </g>
      </svg>
    </motion.div>
  );
};
