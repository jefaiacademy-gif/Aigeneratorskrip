import type { EngineConfig } from '../types';

export const seedanceConfig: EngineConfig = {
  id: 'seedance-2',
  name: 'Seedance 2.0',
  category: 'video',
  icon: 'Clapperboard',
  description:
    'High-quality AI video generation with precise camera controls and multilingual support.',
  fields: [
    {
      name: 'prompt',
      label: 'Prompt',
      type: 'textarea',
      placeholder: 'Describe the video scene you want to generate...',
      required: true,
    },
    {
      name: 'camera',
      label: 'Camera Movement',
      type: 'select',
      options: ['Static', 'Orbit', 'Pan', 'Tilt', 'Zoom', 'Dolly', 'Handheld'],
      default: 'Static',
    },
    {
      name: 'duration',
      label: 'Duration (seconds)',
      type: 'slider',
      min: 5,
      max: 60,
      step: 5,
      default: 5,
    },
    {
      name: 'intensity',
      label: 'Motion Intensity',
      type: 'slider',
      min: 1,
      max: 10,
      step: 1,
      default: 5,
    },
    {
      name: 'language',
      label: 'Language',
      type: 'select',
      options: ['English', 'Chinese', 'Japanese', 'Korean'],
      default: 'English',
    },
  ],
  promptTemplate: (values) => {
    const parts: string[] = [];
    parts.push(String(values.prompt ?? ''));
    if (values.camera && values.camera !== 'Static') {
      parts.push(`Camera: ${values.camera}`);
    }
    parts.push(`Duration: ${values.duration ?? 5}s`);
    parts.push(`Intensity: ${values.intensity ?? 5}/10`);
    if (values.language && values.language !== 'English') {
      parts.push(`Language: ${values.language}`);
    }
    return parts.join('\n');
  },
  tip: 'Use detailed scene descriptions for best results. Camera movement adds dynamism.',
};
