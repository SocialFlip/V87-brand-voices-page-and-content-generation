import React from 'react';

export default function ContentTypeButton({ Icon, text, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
        ${active 
          ? 'text-white' 
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
      style={active ? { backgroundColor: color } : {}}
    >
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </button>
  );
}