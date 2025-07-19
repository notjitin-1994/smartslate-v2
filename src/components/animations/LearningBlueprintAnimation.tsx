import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';

interface SkillNode {
  id: string;
  name: string;
  level: number;
  x: number;
  y: number;
  color: string;
  connections: string[];
}

const LearningBlueprintAnimation: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });
  const [nodes, setNodes] = useState<SkillNode[]>([]);

  // Define skill nodes with connections
  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(300, Math.min(500, width)),
          height: Math.max(300, Math.min(500, height))
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize nodes
  useEffect(() => {
    if (dimensions.width === 0) return;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35;
    
    const newNodes: SkillNode[] = [
      {
        id: 'strategy',
        name: 'Strategy',
        level: 100,
        x: centerX,
        y: centerY - radius * 0.7,
        color: '#8B5CF6',
        connections: ['leadership', 'data']
      },
      {
        id: 'leadership',
        name: 'Leadership',
        level: 85,
        x: centerX + radius * 0.7,
        y: centerY,
        color: '#3B82F6',
        connections: ['strategy', 'ai']
      },
      {
        id: 'data',
        name: 'Data',
        level: 92,
        x: centerX - radius * 0.7,
        y: centerY,
        color: '#10B981',
        connections: ['strategy', 'ai']
      },
      {
        id: 'ai',
        name: 'AI/ML',
        level: 88,
        x: centerX,
        y: centerY + radius * 0.7,
        color: '#EC4899',
        connections: ['leadership', 'data']
      }
    ];

    setNodes(newNodes);
  }, [dimensions]);

  // Animation controls
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
        delay: custom * 0.1,
      },
    }),
    hover: (node: SkillNode) => ({
      scale: 1.1,
      boxShadow: `0 0 15px ${node.color}80`,
      transition: { duration: 0.2 },
    }),
  };

  const connectionVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom: number) => ({
      pathLength: 1,
      opacity: 0.3,
      transition: {
        duration: 0.8,
        delay: 0.3 + custom * 0.1,
        ease: 'easeInOut' as const,
      },
    }),
  };

  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    const rendered = new Set<string>();

    nodes.forEach((node) => {
      node.connections.forEach((targetId, index) => {
        const targetNode = nodes.find((n) => n.id === targetId);
        if (!targetNode) return;

        const connectionId = [node.id, targetId].sort().join('-');
        if (rendered.has(connectionId)) return;
        rendered.add(connectionId);

        connections.push(
          <motion.path
            key={connectionId}
            d={`M${node.x},${node.y} Q${(node.x + targetNode.x) / 2},${(node.y + targetNode.y) / 2 + 30} ${targetNode.x},${targetNode.y}`}
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            variants={connectionVariants}
            custom={index}
            className="text-gray-400"
          />
        );
      });
    });

    return connections;
  };

  return (
    <div ref={ref} className="relative w-full h-full flex items-center justify-center">
      <motion.svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Connections */}
        {renderConnections()}

        {/* Nodes */}
        {nodes.map((node, index) => (
          <motion.g
            key={node.id}
            custom={index}
            variants={nodeVariants}
            initial="hidden"
            animate={controls}
            whileHover={nodeVariants.hover(node) as any}
            onHoverStart={() => setActiveNode(node.id)}
            onHoverEnd={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.level / 8}
              fill={node.color}
              className="transition-all duration-300"
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={node.level / 8 + 8}
              fill="transparent"
              stroke={node.color}
              strokeWidth="1"
              strokeOpacity="0.3"
              className="transition-all duration-500"
            />
          </motion.g>
        ))}

        {/* Node labels */}
        {nodes.map((node) => (
          <motion.text
            key={`${node.id}-label`}
            x={node.x}
            y={node.y + 24}
            textAnchor="middle"
            fill="currentColor"
            className={`text-xs font-medium transition-all duration-300 ${
              activeNode === node.id ? 'opacity-100 scale-110' : 'opacity-70'
            }`}
            style={{ color: node.color }}
          >
            {node.name}
          </motion.text>
        ))}
      </motion.svg>
    </div>
  );
};

export default LearningBlueprintAnimation;
