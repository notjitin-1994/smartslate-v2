import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const DeepResearchAnimation: React.FC = () => {
  const numNodes = 30;
  const numConnections = 3;

  const nodes = useMemo(() => {
    return Array.from({ length: numNodes }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  const connections = useMemo(() => {
    const conns: { from: number; to: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < numConnections; j++) {
        let targetNode = Math.floor(Math.random() * numNodes);
        // Avoid connecting a node to itself
        while (targetNode === i) {
          targetNode = Math.floor(Math.random() * numNodes);
        }
        conns.push({ from: i, to: targetNode });
      }
    }
    return conns;
  }, [nodes]);

  const containerStyle = {
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
  };

  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden" style={containerStyle}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#00A9FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00A9FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Connections */}
        <g>
          {connections.map((conn, index) => {
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];
            return (
              <motion.line
                key={index}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="url(#glow)"
                strokeWidth="0.2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{
                  duration: 1.2,
                  delay: Math.random() * 1.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map(node => (
            <motion.circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.size / 2}
              fill="#FFFFFF"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: node.opacity, scale: 1 }}
              transition={{ duration: 0.6, delay: Math.random() * 1.5, ease: 'backOut' }}
            />
          ))}
        </g>

        {/* Central Insight */}
        <motion.circle
          cx="50"
          cy="50"
          r="6"
          fill="url(#glow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.1, 1], opacity: [0, 0.7, 0.5] }}
          transition={{ duration: 1.8, delay: 1, ease: 'circOut' }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="8"
          fill="transparent"
          stroke="#00A9FF"
          strokeWidth="0.5"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.5, opacity: [0, 1, 0] }}
          transition={{
            duration: 2.0,
            delay: 1.5,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: 'easeInOut',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-4 bg-brand-card-bg/60 rounded-lg">
          <p className="font-semibold text-white">Synthesizing Insights</p>
          <p className="text-xs text-text-secondary">From Data to Decisions</p>
        </div>
      </div>
    </div>
  );
};

export default DeepResearchAnimation;
