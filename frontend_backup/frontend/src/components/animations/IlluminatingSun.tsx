import React from 'react';
import { motion, Variants } from 'framer-motion';

export const IlluminatingSun: React.FC = () => {
  // Sun rays configuration - more rays for a more dynamic look
  const rays = Array(24).fill(0).map((_, i) => ({
    id: i,
    rotation: (i * 15) + 7.5, // 15 degrees between each ray for more rays
    length: 80 + Math.random() * 40, // Longer rays for more impact
    opacity: 0.7 + Math.random() * 0.3, // More consistent opacity
    width: 1.5 + Math.random(), // Variable width for more natural look
  }));

  // Glow effect for the sun - more intense and colorful
  const glowVariants: Variants = {
    initial: { 
      filter: 'drop-shadow(0 0 20px rgba(255, 200, 100, 0.8))',
      opacity: 0.9
    },
    animate: { 
      filter: [
        'drop-shadow(0 0 30px rgba(255, 220, 120, 1))',
        'drop-shadow(0 0 50px rgba(255, 180, 50, 0.8))',
        'drop-shadow(0 0 70px rgba(255, 150, 0, 0.6))',
        'drop-shadow(0 0 50px rgba(255, 180, 50, 0.8))',
        'drop-shadow(0 0 30px rgba(255, 220, 120, 1))',
      ],
      scale: [1, 1.05, 1],
      opacity: [0.9, 1, 0.9],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'easeInOut'
      }
    }
  };

  // Particles configuration
  const particles = Array(50).fill(0).map((_, i) => ({
    id: i,
    size: 1 + Math.random() * 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
    distance: 10 + Math.random() * 20,
  }));

  return (
    <div className="relative w-full h-80 flex items-center justify-center">
      {/* Removed background glow and grid */}

      {/* Sun Core - larger and more vibrant */}
      <motion.div
        className="relative z-10 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500"
        initial="initial"
        animate="animate"
        variants={glowVariants}
      >
        {/* Sun surface details */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300/90 via-orange-400/90 to-pink-500/90">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/40 via-orange-300/30 to-pink-400/20 rounded-full" />
          
          {/* Sun flares */}
          {[0, 90, 180, 270].map((angle) => (
            <motion.div
              key={angle}
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle at ${angle}deg, rgba(255,255,255,0.4) 0%, transparent 50%)`,
              }}
              animate={{
                opacity: [0.6, 0.9, 0.6],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: angle / 90,
              }}
            />
          ))}
        </div>

        {/* Sun rays - more dynamic with variable widths and colors */}
        {rays.map((ray) => (
          <motion.div
            key={ray.id}
            className="absolute top-1/2 left-1/2 origin-left"
            style={{
              width: `${ray.length}px`,
              height: `${ray.width}px`,
              transform: `rotate(${ray.rotation}deg) translateX(50%)`,
              background: `linear-gradient(90deg, 
                rgba(255, 240, 150, ${ray.opacity}) 0%, 
                rgba(255, 180, 50, ${ray.opacity * 0.7}) 50%, 
                rgba(255, 100, 0, 0) 100%)`,
              borderRadius: '50%',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.3, 0.9, 0.3],
              scale: [0.8, 1.3, 0.8],
              x: [0, Math.random() * 10 - 5, 0],
              y: [0, Math.random() * 10 - 5, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* Light rays spreading out - more dynamic */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(16)].map((_, i) => {
          const angle = (i / 16) * 2 * Math.PI;
          const distance = 120 + Math.random() * 80;
          const duration = 10 + Math.random() * 6;
          const width = 1 + Math.random() * 2;
          
          return (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 h-1 bg-gradient-to-r from-yellow-200/30 via-yellow-100/20 to-transparent"
              style={{
                width: '200px',
                height: `${width}px`,
                transform: `rotate(${angle}rad) translateX(0)`,
                transformOrigin: 'left center',
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
                scaleX: [0, 1, 1.8],
                x: [0, distance, distance * 1.5],
              }}
              transition={{
                duration,
                repeat: Infinity,
                repeatDelay: 0.5,
                delay: i * 0.5,
                ease: 'easeOut',
              }}
            />
          );
        })}
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-yellow-200/70"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
            x: [0, (Math.random() - 0.5) * 40],
            y: [0, (Math.random() - 0.5) * 40],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};
