// Constants for hook types and data
export const HOOK_TYPES = {
  ALL: 'All Hooks',
  CURIOSITY: 'Curiosity',
  PROBLEM_SOLUTION: 'Problem-Solution',
  STORY: 'Story',
  STATISTICS: 'Statistics',
  QUESTIONS: 'Questions',
  EDUCATION: 'Education',
  MYTHS: 'Myths',
  STEP_BY_STEP: 'Step-by-step',
  COMMON_MISTAKES: 'Common Mistakes',
  AUTHORITY: 'Authority',
  CONTRARIAN: 'Contrarian'
};

export const hookTypesConfig = [
  { type: HOOK_TYPES.ALL },
  { type: HOOK_TYPES.CURIOSITY },
  { type: HOOK_TYPES.PROBLEM_SOLUTION },
  { type: HOOK_TYPES.STORY },
  { type: HOOK_TYPES.STATISTICS },
  { type: HOOK_TYPES.QUESTIONS },
  { type: HOOK_TYPES.EDUCATION },
  { type: HOOK_TYPES.MYTHS },
  { type: HOOK_TYPES.STEP_BY_STEP },
  { type: HOOK_TYPES.COMMON_MISTAKES },
  { type: HOOK_TYPES.AUTHORITY },
  { type: HOOK_TYPES.CONTRARIAN }
];

// Initial sample hooks remain unchanged
export const sampleHooks = [
  {
    id: '1',
    type: HOOK_TYPES.AUTHORITY,
    content: 'After analyzing 1,000+ successful LinkedIn posts, I discovered the next big trend in B2B marketing. Here\'s what you need to know...',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    type: HOOK_TYPES.PROBLEM_SOLUTION,
    content: 'I\'ve helped 50+ SaaS companies fix their biggest marketing challenge. Here\'s the exact framework I use...',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    type: HOOK_TYPES.STORY,
    content: 'Three years ago, I was struggling to get any engagement on LinkedIn. Today, my posts reach 100k+ people monthly. Here\'s what changed...',
    createdAt: new Date().toISOString()
  }
];