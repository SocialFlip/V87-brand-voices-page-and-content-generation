import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

export default function EditVoiceModal({ voice, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: voice.id,
    name: voice.name,
    tone: voice.tone,
    style: voice.style,
    description: voice.description
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim() || loading) return;
    
    try {
      setLoading(true);
      setError('');
      await onSave(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    initial: {
      scale: 0.95,
      opacity: 0
    },
    animate: {
      scale: 1,
      opacity: 1,
      width: '100%',
      maxWidth: isExpanded ? '90vw' : '42rem',
      height: isExpanded ? '90vh' : 'auto',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const contentVariants = {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1,
      height: isExpanded ? 'calc(90vh - 129px)' : 'auto',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="bg-white rounded-lg overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Edit Brand Voice</h2>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              title={isExpanded ? "Minimize" : "Maximize"}
            >
              {isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <motion.div
          variants={contentVariants}
          className={`p-6 ${isExpanded ? 'overflow-y-auto' : ''}`}
        >
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <motion.div layout>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Voice Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </motion.div>

            <motion.div layout>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <textarea
                value={formData.tone}
                onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
                className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                placeholder="The tone of your brand voice..."
              />
            </motion.div>

            <motion.div layout>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style
              </label>
              <textarea
                value={formData.style}
                onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                placeholder="The style characteristics of your brand voice..."
              />
            </motion.div>

            <motion.div layout>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Voice Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                placeholder="A comprehensive description of your brand voice..."
              />
            </motion.div>
          </div>

          <motion.div layout className="mt-6 flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-accent to-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}