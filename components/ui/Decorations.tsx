import React from 'react';
import { motion } from 'framer-motion';

export const FloatingSphere = ({ 
  size = 100, 
  color = "bg-indigo-400", 
  delay = 0,
  className = ""
}: { 
  size?: number, 
  color?: string,
  delay?: number,
  className?: string
}) => {
  return (
    <motion.div
      className={`absolute rounded-full opacity-50 pointer-events-none ${color} ${className}`}
      style={{ 
        width: size, 
        height: size,
        filter: `blur(${size * 0.4}px)`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }}
    />
  );
};
