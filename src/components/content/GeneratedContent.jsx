import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCopy, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { updateGeneratedContent, deleteGeneratedContent } from '../../services/contentGeneration';
import QuickEditModal from './QuickEditModal';
import ContentPreview from './ContentPreview';
import PlatformIcon from '../platform/PlatformIcon';

export default function GeneratedContent({ content: initialContent, onDelete }) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [error, setError] = useState(null);

  const platformName = content.platform?.name || initialContent.platform?.name || 'LinkedIn';
  const timestamp = content.created_at || initialContent.created_at;
  const brandVoice = content.brand_voice || initialContent.brand_voice;

  const handleSave = async (newContent) => {
    try {
      setError(null);
      if (!content.id) {
        throw new Error('Content ID is required');
      }
      
      const updatedContent = await updateGeneratedContent(content.id, newContent);
      setContent(prev => ({ ...prev, content_text: updatedContent.content_text }));
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } catch (err) {
      setError('Failed to save content. Please try again.');
      console.error('Error saving content:', err);
    }
  };

  const handleDelete = async () => {
    try {
      setError(null);
      if (content.id) {
        await deleteGeneratedContent(content.id);
      }
      onDelete && onDelete();
    } catch (err) {
      setError('Failed to delete content. Please try again.');
      console.error('Error deleting content:', err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content.content_text || content);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy content. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <PlatformIcon platformName={platformName} />
          <div>
            <h3 className="font-semibold text-gray-900">{platformName}</h3>
            <p className="text-sm text-gray-500">
              Generated {timestamp ? new Date(timestamp).toLocaleString() : 'Just now'}
            </p>
            {brandVoice && (
              <p className="text-sm text-primary mt-1">
                Using {brandVoice.name} voice
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {showSaved && (
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-green-500 text-sm"
            >
              Saved!
            </motion.span>
          )}
          {showCopied && (
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-green-500 text-sm"
            >
              Copied!
            </motion.span>
          )}
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-gray-50 rounded-lg"
          >
            <FiEdit2 className="w-4 h-4 text-gray-400" />
          </button>
          <button 
            onClick={handleCopy}
            className="p-2 hover:bg-gray-50 rounded-lg"
          >
            <FiCopy className="w-4 h-4 text-gray-400" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 hover:bg-red-50 rounded-lg text-red-600"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div onClick={() => setIsEditing(true)} className="cursor-pointer">
        <ContentPreview 
          content={content.content_text || content} 
          onClick={() => setIsEditing(true)}
        />
      </div>

      <AnimatePresence>
        {isEditing && (
          <QuickEditModal
            content={content.content_text || content}
            onSave={handleSave}
            onClose={() => setIsEditing(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}