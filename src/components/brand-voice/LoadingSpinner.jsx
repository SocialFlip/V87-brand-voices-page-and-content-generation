import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-lg shadow-xl text-center"
      >
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-900">Finding Your Voice</p>
        <p className="text-gray-600">Analyzing your brand voice settings...</p>
      </motion.div>
    </div>
  );
}