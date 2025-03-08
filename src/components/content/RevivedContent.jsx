import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCopy, FiTrash2, FiEdit2 } from 'react-icons/fi';
import QuickEditModal from './QuickEditModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import ContentPreview from './ContentPreview';
import PlatformIcon from '../platform/PlatformIcon';

export default function RevivedContent({ 
  content,
  platform,
  timestamp,
  onDelete,
  onUpdate 
}) {
  const [showCopied, setShowCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleEdit = async (newContent) => {
    try {
      await onUpdate(newContent);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update content');
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } catch (err) {
      setError('Failed to delete content');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <PlatformIcon platformName={platform} />
          <div>
            <h3 className="font-semibold text-gray-900">{platform}</h3>
            <p className="text-sm text-gray-500">
              Revived {new Date(timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
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
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 hover:bg-red-50 rounded-lg text-red-600"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div onClick={() => setIsEditing(true)} className="cursor-pointer">
        <ContentPreview content={content} />
      </div>

      <AnimatePresence>
        {isEditing && (
          <QuickEditModal
            content={content}
            onSave={handleEdit}
            onClose={() => setIsEditing(false)}
          />
        )}

        {showDeleteConfirm && (
          <DeleteConfirmModal
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}