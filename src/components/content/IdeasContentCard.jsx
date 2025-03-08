import React, { useState } from 'react';
import { FiEdit2, FiCopy, FiTrash2, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import QuickEditModal from './QuickEditModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import PlatformIcon from '../platform/PlatformIcon';
import FunnelStageBadge from '../platform/FunnelStageBadge';

export default function IdeasContentCard({ 
  id, 
  platform, 
  date, 
  content, 
  funnelStage,
  onDelete,
  onUpdate 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
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

  const handleUpdate = async (newContent) => {
    try {
      await onUpdate(id, newContent);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update content');
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(id);
      setShowDeleteConfirm(false);
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
            <FunnelStageBadge stage={funnelStage} />
            <p className="text-sm text-gray-500 mt-1">
              Created {new Date(date).toLocaleString()}
            </p>
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
      
      <div className="text-gray-600">
        {content.length > 150 ? (
          <>
            <p className="whitespace-pre-wrap mb-2">
              {content.substring(0, 150)}...
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              Show more
            </button>
          </>
        ) : (
          <p className="whitespace-pre-wrap mb-2">
            {content}
          </p>
        )}
      </div>

      <AnimatePresence>
        {showCopied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-2 text-green-500 text-sm flex items-center gap-1"
          >
            <FiCheck className="w-4 h-4" />
            Copied!
          </motion.div>
        )}

        {isEditing && (
          <QuickEditModal
            content={content}
            onSave={handleUpdate}
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