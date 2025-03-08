import React from 'react';

export default function ContentFilter({ active, icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-all ${
        active 
          ? 'text-primary border-b-2 border-primary' 
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{text}</span>
      </div>
    </button>
  );
}