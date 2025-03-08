import React from 'react';
import { 
  FiBookOpen,
  FiHelpCircle,
  FiTarget,
  FiBook,
  FiPieChart,
  FiGrid,
  FiAward,
  FiClock,
  FiAlertCircle,
  FiZap,
  FiCoffee,
  FiTrendingDown
} from 'react-icons/fi';
import { HOOK_TYPES } from '../../data/hookData';

const iconMap = {
  [HOOK_TYPES.ALL]: FiBookOpen,
  [HOOK_TYPES.CURIOSITY]: FiCoffee,
  [HOOK_TYPES.PROBLEM_SOLUTION]: FiTarget,
  [HOOK_TYPES.STORY]: FiBook,
  [HOOK_TYPES.STATISTICS]: FiPieChart,
  [HOOK_TYPES.QUESTIONS]: FiHelpCircle,
  [HOOK_TYPES.EDUCATION]: FiGrid,
  [HOOK_TYPES.MYTHS]: FiAward,
  [HOOK_TYPES.STEP_BY_STEP]: FiClock,
  [HOOK_TYPES.COMMON_MISTAKES]: FiAlertCircle,
  [HOOK_TYPES.AUTHORITY]: FiZap,
  [HOOK_TYPES.CONTRARIAN]: FiTrendingDown
};

export default function HookTypeIcon({ type }) {
  const Icon = iconMap[type] || FiBookOpen;
  return <Icon className="w-4 h-4" />;
}