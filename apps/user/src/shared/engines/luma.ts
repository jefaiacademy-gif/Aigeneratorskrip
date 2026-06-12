import type { EngineConfig } from '../types';

export const lumaConfig: EngineConfig = {
  id: 'luma-dream-machine',
  name: 'Luma Dream Machine',
  category: 'video',
  icon: 'Sun',
  description:
    'Fast, high-fidelity video generation with seamless looping and extension capabilities.',
  fields: [
    {
      name: 'prompt',
      label: 'Prompt',
      type: 'textarea',
      placeholder: 'Describe the scene...',
      required: true,
    },
    {
      name: 'loop',
      label: 'Loop Video',
      type: 'toggle',
      default: false,
    },
    {
      name: 'extend',
      label: 'Extend Video',
      type: 'toggle',
      default: false,
    },
  ],
  promptTemplate: (values) => {
    const parts: string[] = [];
    parts.push(String(values.prompt ?? ''));
    if (values.loop) {
      parts.push('[Loop: true]');
    }
    if (values.extend) {
      parts.push('[Extend: true]');
    }
    return parts.join('\n');
  },
  tip: 'Enable Loop for seamlessly repeating videos. Extend continues the scene.',
};
