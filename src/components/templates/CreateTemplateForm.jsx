import React, { useState } from 'react';
import { FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ProgressBar from '../content/ProgressBar';

export default function CreateTemplateForm({ onAnalyze, onClose }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);
    return interval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    try {
      setLoading(true);
      const progressInterval = simulateProgress();
      
      await onAnalyze(content);
      
      clearInterval(progressInterval);
      setProgress(100);
    } catch (error) {
      setProgress(0);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Create Template</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your viral content here..."
          className="w-full h-48 bg-gray-900 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
          disabled={loading}
        />
        
        {loading && (
          <div className="mt-4">
            <ProgressBar progress={progress} />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={!content.trim() || loading}
            className="flex items-center gap-2 bg-gradient-to-r from-accent to-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiZap className="w-4 h-4" />
            {loading ? 'Analyzing...' : 'Analyze Structure'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}