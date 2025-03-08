import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiCopy, FiTrash2 } from 'react-icons/fi';
import QuickEditModal from '../content/QuickEditModal';
import DeleteConfirmModal from '../content/DeleteConfirmModal';
import HookTypeIcon from './HookTypeIcon';

export default function HooksContentCard({ content, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content.content);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy content');
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
            <HookTypeIcon type={content.hook_type} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{content.hook_type}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">
                {content.platform} • {content.content_type}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Created {new Date(content.created_at).toLocaleDateString()}
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
        {content.content.length > 150 ? (
          <>
            <p className="whitespace-pre-wrap mb-2">
              {content.content.substring(0, 150)}...
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
            {content.content}
          </p>
        )}
      </div>

      <AnimatePresence>
        {showCopied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-2 text-green-500 text-sm"
          >
            Copied to clipboard!
          </motion.div>
        )}

        {isEditing && (
          <QuickEditModal
            content={content.content}
            onSave={(newContent) => {
              onUpdate(content.id, newContent);
              setIsEditing(false);
            }}
            onClose={() => setIsEditing(false)}
          />
        )}

        {showDeleteConfirm && (
          <DeleteConfirmModal
            onConfirm={() => {
              onDelete(content.id);
              setShowDeleteConfirm(false);
            }}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}