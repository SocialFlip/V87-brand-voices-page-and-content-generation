import React from 'react';
import { getPlatformConfig } from '../../utils/platformConfig';

export default function PlatformIcon({ platformName, size = 'md' }) {
  const config = getPlatformConfig(platformName);
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`${config.bgColorLight} ${config.textColor} p-2 rounded-lg`}>
      <Icon className={sizeClasses[size]} />
    </div>
  );
}