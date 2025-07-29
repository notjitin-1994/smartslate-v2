import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const ResearchInsightsAnimation = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  // Data points that will fly in from the sides
  const dataPoints = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    x: Math.random() * 80 + 10, // 10-90% of container
    y: Math.random() * 60 + 20,  // 20-80% of container
    size: Math.random() * 3 + 1, // 1-4px
    delay: Math.random() * 0.5,  // Staggered appearance
    color: `hsl(${Math.random() * 60 + 200}, 80%, 60%)`, // Blues and purples
  }));

  // Insights that will appear in the center
  const insights = [
    { id: 1, text: "Market Trends", x: 50, y: 40 },
    { id: 2, text: "User Needs", x: 35, y: 60 },
    { id: 3, text: "Industry Data", x: 65, y: 60 },
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

  const dataPointVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      scale: 0.5,
      x: Math.random() > 0.5 ? -100 : 100,
      y: Math.random() * 100 - 50,
    }),
    visible: (i: number) => ({
      opacity: 0.8,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        delay: i * 0.05,
        type: 'spring' as const,
        damping: 10,
        stiffness: 100,
      },
    }),
  };

  const insightVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.8 + i * 0.2,
        type: 'spring' as const,
        damping: 10,
        stiffness: 100,
      },
    }),
  };

  const connectionVariants = {
    hidden: { pathLength: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      transition: {
        delay: 1.5 + i * 0.1,
        duration: 0.8,
        ease: 'easeInOut' as const,
      },
    }),
  };

  return (
    <div ref={ref} className="relative w-full h-80 rounded-xl overflow-hidden">
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="absolute inset-0"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#00A9FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00A9FF" stopOpacity="0" />
          </radialGradient>
          <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background glow */}
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          fill="url(#glow)"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.4, 0.2],
            scale: [0.5, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <motion.circle
            key={`point-${point.id}`}
            cx={point.x}
            cy={point.y}
            r={point.size}
            fill={point.color}
            custom={i}
            variants={dataPointVariants}
            className="filter drop-shadow-glow"
          />
        ))}

        {/* Connections from data points to center */}
        {dataPoints.slice(0, 6).map((point, i) => (
          <motion.line
            key={`line-${i}`}
            x1={point.x}
            y1={point.y}
            x2={50}
            y2={50}
            stroke="#00A9FF"
            strokeWidth="0.2"
            strokeDasharray="2 1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              delay: 0.5 + i * 0.1,
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Insight bubbles */}
        {insights.map((insight, i) => (
          <React.Fragment key={`insight-${insight.id}`}>
            <motion.circle
              cx={insight.x}
              cy={insight.y}
              r="12"
              fill="rgba(255, 255, 255, 0.1)"
              stroke="#00A9FF"
              strokeWidth="0.5"
              variants={insightVariants}
              custom={i}
              className="filter drop-shadow-glow"
            />
            <motion.text
              x={insight.x}
              y={insight.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="3.5"
              fontWeight="bold"
              variants={insightVariants}
              custom={i}
              className="pointer-events-none"
            >
              {insight.text}
            </motion.text>

            {/* Connections between insights */}
            {i < insights.length - 1 && (
              <motion.line
                x1={insight.x}
                y1={insight.y}
                x2={insights[i + 1].x}
                y2={insights[i + 1].y}
                stroke="#00A9FF"
                strokeWidth="0.2"
                strokeDasharray="2 1"
                variants={connectionVariants}
                custom={i}
              />
            )}
          </React.Fragment>
        ))}

        {/* Central node */}
        <motion.circle
          cx="50"
          cy="50"
          r="6"
          fill="#00A9FF"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.1, 1],
            opacity: [0, 0.8, 1],
          }}
          transition={{
            delay: 0.8,
            duration: 0.8,
            ease: 'easeOut',
          }}
          className="filter drop-shadow-glow"
        />
        <motion.text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="3"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="pointer-events-none"
        >
          Insights
        </motion.text>
      </motion.svg>
    </div>
  );
};

export default ResearchInsightsAnimation;
