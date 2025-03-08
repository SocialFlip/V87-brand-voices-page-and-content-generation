import React from 'react';
import { HOOK_LIMITS } from '../../utils/hookLimits';

export default function HookTypeButton({ icon, text, count = 0, active, onClick }) {
  const limit = HOOK_LIMITS[text] || 12;
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
        active ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {icon}
      <span>{text}</span>
      {text !== 'All Hooks' && <span className="text-gray-400">{count}/{limit}</span>}
    </button>
  );
}