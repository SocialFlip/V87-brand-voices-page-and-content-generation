import React from 'react';
import { getPlatformConfig } from '../../utils/platformConfig';

export default function PlatformBadge({ platformName }) {
  const config = getPlatformConfig(platformName);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 ${config.bgColorLight} ${config.textColor} px-3 py-1.5 rounded-full`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{platformName}</span>
    </div>
  );
}