import type { EngineConfig } from '../types';

export const pikaConfig: EngineConfig = {
  id: 'pika-2',
  name: 'Pika 2.0',
  category: 'video',
  icon: 'Sparkles',
  description:
    'Creative video generation with Pikaffects for stunning visual transformations.',
  fields: [
    {
      name: 'prompt',
      label: 'Prompt',
      type: 'textarea',
      placeholder: 'Describe your creative scene...',
      required: true,
    },
    {
      name: 'pikaffect',
      label: 'Pikaffect',
      type: 'select',
      options: ['None', 'Inflate', 'Crush', 'Melt', 'Explode', 'Squish', 'Cake-ify'],
      default: 'None',
    },
    {
      name: 'modifyRegion',
      label: 'Modify Region',
      type: 'text',
      placeholder: 'Describe region to modify — e.g., "the character\'s face"',
    },
  ],
  promptTemplate: (values) => {
    const parts: string[] = [];
    parts.push(String(values.prompt ?? ''));
    if (values.pikaffect && values.pikaffect !== 'None') {
      parts.push(`[Pikaffect: ${values.pikaffect}]`);
    }
    if (values.modifyRegion) {
      parts.push(`[Modify Region: ${values.modifyRegion}]`);
    }
    return parts.join('\n');
  },
  tip: 'Pikaffects apply creative transformations. Use "Modify Region" to target specific areas.',
};
