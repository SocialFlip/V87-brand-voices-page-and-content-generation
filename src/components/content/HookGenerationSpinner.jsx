import React from 'react';
import { motion } from 'framer-motion';
import ProgressBar from './ProgressBar';

export default function HookGenerationSpinner({ progress }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-4"
      >
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-primary/10 rounded-full"></div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Hang tight, creating content from your hook
        </h3>
        <p className="text-gray-600 mb-6">
          We're crafting platform-specific content that resonates with your audience...
        </p>
        
        <ProgressBar progress={progress} showSparkle={true} />
      </motion.div>
    </div>
  );
}