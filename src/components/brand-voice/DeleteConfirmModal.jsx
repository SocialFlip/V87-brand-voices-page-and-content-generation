import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

export default function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 text-red-600">
            <FiAlertTriangle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Delete Brand Voice?</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this brand voice? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}