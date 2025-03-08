import React from 'react';

export default function UserTypeCard({ icon, title, description, color }) {
  return (
    <div className="relative bg-[#1A2344] p-6 rounded-[5px] transition-all group">
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300"
          style={{ 
            color: color,
            background: `${color}20`
          }}
        >
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-gray-300 text-sm">{description}</p>
      <div 
        className="absolute inset-0 rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          border: `1px solid ${color}`,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}