import React, { useState } from 'react';
import { FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import HookLoadingSpinner from '../../content/HookLoadingSpinner';
import { generateHook } from '../../../services/hookGeneration';

export default function CreateHookForm({ onSubmit, onClose, selectedType }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

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
      setError('');
      const progressInterval = simulateProgress();

      // Generate hook using webhook
      const generatedHook = await generateHook(content, selectedType);
      
      clearInterval(progressInterval);
      setProgress(92);
      setTimeout(() => setProgress(95), 300);
      setTimeout(() => setProgress(97), 600);
      setTimeout(() => setProgress(99), 900);
      setTimeout(() => {
        setProgress(100);
        setTimeout(async () => {
          await onSubmit(generatedHook, selectedType);
          setContent('');
          setLoading(false);
          setProgress(0);
          onClose();
        }, 500);
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to generate hook');
      setProgress(0);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Create {selectedType} Hook</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your content to generate a hook..."
          className="w-full h-48 bg-gray-900 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
          disabled={loading}
        />

        <div className="flex justify-end gap-3">
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
            {loading ? 'Generating...' : 'Generate Hook'}
          </button>
        </div>
      </form>

      {loading && <HookLoadingSpinner progress={progress} />}
    </div>
  );
}