import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HooksContentPage from '../../components/hooks/HooksContentPage';

export default function HooksContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Remove artificial delay and just show content immediately
    setIsLoading(false);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }} // Faster transition
        >
          <HooksContentPage />
        </motion.div>
      )}
    </AnimatePresence>
  );
}