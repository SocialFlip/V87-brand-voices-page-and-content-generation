import React from 'react';
import { FiFileText, FiVideo, FiImage } from 'react-icons/fi';

const contentTypes = [
  { id: 'blog', icon: <FiFileText />, label: 'Blog Post' },
  { id: 'video', icon: <FiVideo />, label: 'YouTube Video' },
  { id: 'image', icon: <FiImage />, label: 'Image' }
];

export default function ContentTypeSelector({ selectedType, onSelect }) {
  return (
    <div className="flex gap-4 mb-6">
      {contentTypes.map(type => (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            selectedType === type.id
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {type.icon}
          <span>{type.label}</span>
        </button>
      ))}
    </div>
  );
}