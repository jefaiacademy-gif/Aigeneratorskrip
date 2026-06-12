import type { EngineConfig } from '../types';

export const stableDiffConfig: EngineConfig = {
  id: 'stable-diffusion-3',
  name: 'Stable Diffusion 3',
  category: 'image',
  icon: 'Layers',
  description:
    'Open-source image generation with full control over sampling, steps, and CFG scale.',
  fields: [
    {
      name: 'prompt',
      label: 'Prompt',
      type: 'textarea',
      placeholder: 'Describe the image...',
      required: true,
    },
    {
      name: 'steps',
      label: 'Steps',
      type: 'slider',
      min: 1,
      max: 150,
      step: 1,
      default: 30,
    },
    {
      name: 'cfg',
      label: 'CFG Scale',
      type: 'slider',
      min: 1,
      max: 30,
      step: 0.5,
      default: 7,
    },
    {
      name: 'sampler',
      label: 'Sampler',
      type: 'select',
      options: ['Euler', 'Euler a', 'DDIM', 'DPM++ 2M', 'DPM++ SDE'],
      default: 'Euler a',
    },
  ],
  promptTemplate: (values) => {
    const parts: string[] = [];
    parts.push(String(values.prompt ?? ''));
    parts.push(`Steps: ${values.steps ?? 30}`);
    parts.push(`CFG: ${values.cfg ?? 7}`);
    parts.push(`Sampler: ${values.sampler ?? 'Euler a'}`);
    return parts.join('\n');
  },
  tip: 'CFG controls prompt adherence. Higher values = stricter following but potential artifacts.',
};
