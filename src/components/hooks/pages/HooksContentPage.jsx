import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import HookTypeButton from '../buttons/HookTypeButton';
import HooksContentCard from '../cards/HooksContentCard';
import EmptyState from '../states/EmptyState';
import { HOOK_TYPES } from '../../../data/hookData';
import HookTypeIcon from '../icons/HookTypeIcon';
import { getHooksContent, updateHooksContent, deleteHooksContent } from '../../../services/hooksContentService';

export default function HooksContentPage() {
  const [activeType, setActiveType] = useState(HOOK_TYPES.ALL);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentCounts, setContentCounts] = useState({});

  useEffect(() => {
    loadContent();
  }, [activeType]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHooksContent(activeType);
      
      // Calculate counts for each category
      const counts = {};
      Object.values(HOOK_TYPES).forEach(type => {
        counts[type] = type === HOOK_TYPES.ALL 
          ? data.length 
          : data.filter(item => item.hook_type === type).length;
      });
      
      setContentCounts(counts);
      setContent(data);
    } catch (err) {
      console.error('Error loading hooks content:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, newContent) => {
    try {
      await updateHooksContent(id, newContent);
      await loadContent();
    } catch (err) {
      setError('Failed to update content');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHooksContent(id);
      await loadContent();
    } catch (err) {
      setError('Failed to delete content');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="p-8"
    >
      <Link 
        to="/dashboard/hooks" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Hooks Library
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hooks Content</h1>
        <p className="text-gray-600">Manage your generated hooks content</p>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-8">
        {Object.values(HOOK_TYPES).map((type) => (
          <HookTypeButton
            key={type}
            icon={<HookTypeIcon type={type} />}
            text={type}
            count={contentCounts[type] || 0}
            active={activeType === type}
            onClick={() => setActiveType(type)}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-64 text-gray-600"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p>Loading Hooks Content...</p>
            <p className="text-sm text-gray-500">Just a Sec</p>
          </motion.div>
        ) : content.length > 0 ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {content.map(item => (
              <HooksContentCard
                key={item.id}
                content={item}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}