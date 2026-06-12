import type { EngineConfig } from '../types';

export const klingConfig: EngineConfig = {
  id: 'kling-1.6',
  name: 'Kling 1.6',
  category: 'video',
  icon: 'Camera',
  description:
    'Advanced video generation with motion brush for precise control over movement areas.',
  fields: [
    {
      name: 'prompt',
      label: 'Prompt',
      type: 'textarea',
      placeholder: 'Describe the video scene you want to generate...',
      required: true,
    },
    {
      name: 'motionBrush',
      label: 'Motion Brush',
      type: 'textarea',
      placeholder: 'Describe motion areas — e.g., "the leaves swaying in the wind, clouds moving left"',
    },
    {
      name: 'aspectRatio',
      label: 'Aspect Ratio',
      type: 'select',
      options: ['16:9', '9:16', '1:1', '4:3', '21:9'],
      default: '16:9',
    },
  ],
  promptTemplate: (values) => {
    const parts: string[] = [];
    parts.push(String(values.prompt ?? ''));
    if (values.aspectRatio && values.aspectRatio !== '16:9') {
      parts.push(`[Aspect Ratio: ${values.aspectRatio}]`);
    }
    if (values.motionBrush) {
      parts.push(`[Motion: ${values.motionBrush}]`);
    }
    return parts.join('\n');
  },
  tip: 'Motion Brush lets you specify exactly which parts of the scene should move.',
};
