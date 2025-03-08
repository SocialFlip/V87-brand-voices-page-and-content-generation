import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiEdit2, FiTrash2 } from 'react-icons/fi';
import DeleteConfirmModal from './DeleteConfirmModal';
import EditVoiceModal from './EditVoiceModal';

export default function BrandVoiceCard({ voice, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedVoice) => {
    await onEdit(updatedVoice);
    setIsEditing(false);
  };

  // Function to truncate text and add ellipsis
  const truncateText = (text, limit) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FiUsers className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-gray-900">{voice.name}</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleEdit}
            className="p-2 hover:bg-gray-50 rounded-lg"
            title="Edit voice"
          >
            <FiEdit2 className="w-4 h-4 text-gray-400" />
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 hover:bg-red-50 rounded-lg text-red-600"
            title="Delete voice"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tone</label>
          <p className="text-gray-600">{truncateText(voice.tone, 150)}</p>
          {voice.tone?.length > 150 && (
            <button
              onClick={handleEdit}
              className="text-primary hover:text-primary/80 text-sm mt-1"
            >
              Show more
            </button>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Style</label>
          <p className="text-gray-600">{truncateText(voice.style, 150)}</p>
          {voice.style?.length > 150 && (
            <button
              onClick={handleEdit}
              className="text-primary hover:text-primary/80 text-sm mt-1"
            >
              Show more
            </button>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <p className="text-gray-600">{truncateText(voice.description, 150)}</p>
          {voice.description?.length > 150 && (
            <button
              onClick={handleEdit}
              className="text-primary hover:text-primary/80 text-sm mt-1"
            >
              Show more
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <DeleteConfirmModal
            onConfirm={() => {
              onDelete(voice.id);
              setShowDeleteConfirm(false);
            }}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
        {isEditing && (
          <EditVoiceModal
            voice={voice}
            onClose={() => setIsEditing(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}