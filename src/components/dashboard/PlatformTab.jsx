import React from 'react';

export default function PlatformTab({ icon, text, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
        active ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {icon}
      <span>{text}</span>
      <span className="text-gray-400">{count}/25</span>
    </button>
  );
}