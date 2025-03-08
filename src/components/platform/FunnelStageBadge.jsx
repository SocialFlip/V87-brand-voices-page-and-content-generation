import React from 'react';

const FUNNEL_STAGE_CONFIG = {
  'TOFU': {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    label: 'Top of Funnel'
  },
  'MOFU': {
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    label: 'Middle of Funnel'
  },
  'BOFU': {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    label: 'Bottom of Funnel'
  }
};

export default function FunnelStageBadge({ stage }) {
  const config = FUNNEL_STAGE_CONFIG[stage] || FUNNEL_STAGE_CONFIG.TOFU;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {config.label}
    </span>
  );
}