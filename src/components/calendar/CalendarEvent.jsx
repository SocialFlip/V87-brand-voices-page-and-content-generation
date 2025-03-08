import React from 'react';
import { getPlatformConfig } from '../../utils/platformConfig';

export default function CalendarEvent({ title, time, type, onClick }) {
  const platformConfig = getPlatformConfig(type);
  
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg hover:opacity-90 transition-opacity overflow-hidden group relative"
      style={{ backgroundColor: platformConfig.color }}
    >
      <div className="px-3 py-2 text-white">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs opacity-90">{time}</p>
      </div>
    </button>
  );
}