import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiCopy, FiTrash2, FiFileText } from 'react-icons/fi';
import QuickEditModal from '../content/QuickEditModal';
import DeleteConfirmModal from '../content/DeleteConfirmModal';
import HookContentModal from '../content/HookContentModal';
import HookTypeIcon from './HookTypeIcon';

export default function HookCard({ hook, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [error, setError] = useState(null);

  const words = hook.content.split(' ');
  const preview = words.slice(0, 15).join(' ');
  const hasMore = words.length > 15;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hook.content);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy hook');
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(hook.id);
      setShowDeleteConfirm(false);
    } catch (err) {
      setError('Failed to delete hook');
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-2 rounded-lg">
            <HookTypeIcon type={hook.type} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{hook.type}</h3>
            <p className="text-sm text-gray-500">
              Created {new Date(hook.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowContentModal(true)}
            className="p-2 hover:bg-gray-50 rounded-lg"
          >
            <FiFileText className="w-4 h-4 text-gray-400" />
          </button>
          <button 
            onClick={handleCopy}
            className="p-2 hover:bg-gray-50 rounded-lg"
          >
            <FiCopy className="w-4 h-4 text-gray-400" />
          </button>
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-gray-50 rounded-lg"
          >
            <FiEdit2 className="w-4 h-4 text-gray-400" />
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
        <p>{preview}</p>
        {hasMore && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-primary hover:text-primary/80 text-sm mt-2"
          >
            ...See more
          </button>
        )}
      </div>

      <AnimatePresence>
        {showCopied && (
          <motion.div
            key="copied"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 text-green-500 text-sm"
          >
            Copied to clipboard!
          </motion.div>
        )}

        {isEditing && (
          <motion.div
            key="edit-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <QuickEditModal
              content={hook.content}
              onSave={(newContent) => {
                onUpdate(hook.id, newContent);
                setIsEditing(false);
              }}
              onClose={() => setIsEditing(false)}
            />
          </motion.div>
        )}

        {showDeleteConfirm && (
          <motion.div
            key="delete-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <DeleteConfirmModal
              onConfirm={handleDelete}
              onCancel={() => setShowDeleteConfirm(false)}
            />
          </motion.div>
        )}

        {showContentModal && (
          <motion.div
            key="content-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <HookContentModal
              content={hook.content}
              hookType={hook.type}
              onClose={() => setShowContentModal(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}