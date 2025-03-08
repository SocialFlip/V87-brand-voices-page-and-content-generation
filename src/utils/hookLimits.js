// Hook limits configuration
export const HOOK_LIMITS = {
  'All Hooks': 108,
  'Curiosity': 12,
  'Problem-Solution': 12,
  'Story': 12,
  'Statistics': 12,
  'Questions': 12,
  'Education': 12,
  'Myths': 12,
  'Step-by-step': 12,
  'Common Mistakes': 12,
  'Authority': 12,
  'Contrarian': 12
};

export function getHookCount(hooks, type) {
  if (!Array.isArray(hooks)) return 0;
  if (type === 'All Hooks') return hooks.length;
  return hooks.filter(hook => hook.type === type).length;
}