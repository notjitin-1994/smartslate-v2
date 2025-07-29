import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillNode {
  id: string;
  name: string;
  level: number;
  color: string;
  x: number;
  y: number;
  connections: string[];
}

const generateSkillNodes = (): SkillNode[] => {
  const coreSkills = [
    { name: 'AI Strategy', level: 88, color: 'from-purple-500 to-indigo-500' },
    { name: 'Data Governance', level: 82, color: 'from-blue-500 to-teal-500' },
    { name: 'Digital Transformation', level: 91, color: 'from-indigo-500 to-purple-600' },
    { name: 'Innovation', level: 85, color: 'from-teal-400 to-emerald-500' },
  ];

  return coreSkills.map((skill, i) => ({
    id: `skill-${i}`,
    name: skill.name,
    level: skill.level,
    color: skill.color,
    x: 0,
    y: 0,
    connections: coreSkills
      .filter((_, j) => i !== j)
      .map((_, j) => `skill-${j}`)
      .slice(0, 2), // Each node connects to 2 others
  }));
};

export const StrategicSkillBuilding: React.FC = () => {
  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => {
    // Position nodes in a circular layout
    const radius = 120;
    const center = { x: 150, y: 150 };
    const angleStep = (2 * Math.PI) / 4; // 4 nodes
    
    setNodes(
      generateSkillNodes().map((node, i) => ({
        ...node,
        x: center.x + radius * Math.cos(i * angleStep - Math.PI / 2),
        y: center.y + radius * Math.sin(i * angleStep - Math.PI / 2),
      }))
    );
  }, []);

  // Find a node by ID
  const getNode = (id: string) => nodes.find(node => node.id === id);

  // Get the position of a connection line
  const getLinePath = (sourceId: string, targetId: string) => {
    const source = getNode(sourceId);
    const target = getNode(targetId);
    if (!source || !target) return '';
    
    return `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
  };

  // Generate unique connection pairs to avoid duplicates
  const connections = nodes.reduce<string[]>((acc, node) => {
    node.connections.forEach(targetId => {
      // Only add the connection if the reverse doesn't already exist
      if (!acc.some(conn => 
        (conn.startsWith(targetId) && conn.endsWith(node.id)) ||
        (conn.startsWith(node.id) && conn.endsWith(targetId))
      )) {
        acc.push(`${node.id}-${targetId}`);
      }
    });
    return acc;
  }, []);

  return (
    <div className="relative w-full h-80">
      <svg width="100%" height="100%" viewBox="0 0 300 300" className="absolute inset-0">
        {/* Connection lines */}
        {connections.map((connId, i) => {
          const [sourceId, targetId] = connId.split('-');
          const path = getLinePath(sourceId, targetId);
          return (
            <motion.path
              key={i}
              d={path}
              stroke="url(#skillGradient)"
              strokeWidth="2"
              strokeDasharray="0 1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1, delay: i * 0.2 }}
              className="stroke-indigo-400/60"
            />
          );
        })}

        <defs>
          <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>

      <AnimatePresence>
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-white font-medium text-xs text-center cursor-pointer z-10`}
            style={{
              left: `${node.x - 32}px`,
              top: `${node.y - 32}px`,
              background: `linear-gradient(135deg, ${node.color})`,
              boxShadow: activeNode === node.id 
                ? '0 0 20px rgba(139, 92, 246, 0.8)' 
                : '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -10, 0],
            }}
            transition={{ 
              scale: { duration: 0.3 },
              y: { 
                duration: 3, 
                repeat: Infinity, 
                ease: 'easeInOut',
                delay: parseInt(node.id.split('-')[1]) * 0.2,
              },
            }}
            onMouseEnter={() => setActiveNode(node.id)}
            onMouseLeave={() => setActiveNode(null)}
          >
            <div className="p-2">
              <div className="text-xs font-semibold">{node.name}</div>
              <div className="text-xs opacity-80">{node.level}%</div>
            </div>
            
            {/* Skill level indicator */}
            <motion.div 
              className="absolute -bottom-1 left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div 
                className="h-full bg-white/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${node.level}%` }}
                transition={{ duration: 1.5, delay: 0.8 }}
              />
            </motion.div>
          </motion.div>
        ))}

        {/* Center node */}
        <motion.div
          className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-center text-sm left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg border-2 border-indigo-400/30"
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            rotate: [0, 5, -5, 0],
          }}
          transition={{ 
            scale: { duration: 0.5, delay: 0.5 },
            rotate: { 
              duration: 8, 
              repeat: Infinity, 
              ease: 'easeInOut',
              repeatType: 'reverse',
            },
          }}
        >
          <div className="p-2">
            Strategic
            <br />
            Skills
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-indigo-300 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 20],
            y: [0, (Math.random() - 0.5) * 20],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};
