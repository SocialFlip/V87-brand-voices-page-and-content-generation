import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContentPreview({ content, onClick }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const words = content.split(' ');
  const preview = words.slice(0, 15).join(' ');
  const hasMore = words.length > 15;

  return (
    <div className="text-gray-600">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="full"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="whitespace-pre-wrap">{content}</p>
            {hasMore && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="text-primary hover:text-primary/80 text-sm mt-2"
              >
                Show less
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{preview}</p>
            {hasMore && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick ? onClick() : setIsExpanded(true);
                }}
                className="text-primary hover:text-primary/80 text-sm mt-2"
              >
                ...See more
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}