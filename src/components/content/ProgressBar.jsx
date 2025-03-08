import React from 'react';
import { motion } from 'framer-motion';

const Sparkle = ({ delay }) => (
  <motion.div
    className="absolute top-0 bottom-0 w-4 bg-white/20"
    initial={{ x: '-100%' }}
    animate={{ x: '400%' }}
    transition={{
      duration: 1.5,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

export default function ProgressBar({ progress, showSparkle = false }) {
  return (
    <div className="relative w-full pt-6 pb-2">
      <div className="absolute right-0 top-0 text-sm font-medium text-gray-600">
        {Math.round(progress)}%
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          className={`relative h-full bg-gradient-to-r from-accent to-blue-600 transition-all duration-200 
            ${progress < 100 ? 'animate-gradient-pulse' : ''}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2 }}
        >
          {showSparkle && (
            <>
              <Sparkle delay={0} />
              <Sparkle delay={0.5} />
              <Sparkle delay={1} />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}