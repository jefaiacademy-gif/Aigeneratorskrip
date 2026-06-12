import type { EngineConfig } from '../types';

export const hailuoConfig: EngineConfig = {
  id: 'hailuo-minimax',
  name: 'Hailuo MiniMax',
  category: 'video',
  icon: 'Video',
  description:
    'Character-consistent video generation with strong identity preservation across frames.',
  fields: [
    {
      name: 'prompt',
      label: 'Prompt',
      type: 'textarea',
      placeholder: 'Describe the scene with character details...',
      required: true,
    },
    {
      name: 'characterConsistency',
      label: 'Character Consistency',
      type: 'slider',
      min: 1,
      max: 10,
      step: 1,
      default: 8,
    },
  ],
  promptTemplate: (values) => {
    const parts: string[] = [];
    parts.push(String(values.prompt ?? ''));
    parts.push(`[Character Consistency: ${values.characterConsistency ?? 8}/10]`);
    return parts.join('\n');
  },
  tip: 'Higher character consistency preserves facial features and appearance across frames.',
};
