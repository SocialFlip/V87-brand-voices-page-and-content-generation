import React, { useState } from 'react';
import { FiZap } from 'react-icons/fi';

export default function GenerateHookForm({ onSubmit, onClose, selectedType }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    try {
      setLoading(true);
      await onSubmit(content);
      setContent('');
    } catch (err) {
      console.error('Error generating hook:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Create {selectedType} Hook</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your hook content here..."
          className="w-full h-48 bg-gray-900 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
          disabled={loading}
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={!content.trim() || loading}
            className="flex items-center gap-2 bg-gradient-to-r from-accent to-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiZap className="w-4 h-4" />
            {loading ? 'Creating...' : 'Create Hook'}
          </button>
        </div>
      </form>
    </div>
  );
}