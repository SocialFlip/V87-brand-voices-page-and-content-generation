import React, { useState } from 'react';
import { FiEdit2, FiCopy, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteContent, updateContent } from '../../services/contentStorage';
import QuickEditModal from './QuickEditModal';
import PlatformIcon from '../platform/PlatformIcon';
import PlatformBadge from '../platform/PlatformBadge';

export default function ContentCard({ id, platform, date, content, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy content');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContent(id);
      onDelete && onDelete();
    } catch (err) {
      setError('Failed to delete content');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <PlatformIcon platformName={platform.name} />
          <div>
            <PlatformBadge platformName={platform.name} />
            <p className="text-sm text-gray-500 mt-1">Created {date}</p>
          </div>
        </div>
        <div className="flex gap-2">
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
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 hover:bg-red-50 rounded-lg text-red-600"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{content}</p>

      <AnimatePresence>
        {showCopied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-green-500 text-sm"
          >
            Copied to clipboard!
          </motion.div>
        )}

        {isEditing && (
          <QuickEditModal
            content={content}
            platform={platform}
            onSave={updateContent}
            onClose={() => setIsEditing(false)}
          />
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold mb-4">Delete Content?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this content? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}