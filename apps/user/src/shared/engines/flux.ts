import type { EngineConfig } from '../types';

export const fluxConfig: EngineConfig = {
  id: 'flux-1',
  name: 'Flux.1',
  category: 'image',
  icon: 'Zap',
  description:
    'Open-weight image generation model with precise control over steps and guidance scale.',
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
      max: 50,
      step: 1,
      default: 20,
    },
    {
      name: 'guidance',
      label: 'Guidance Scale',
      type: 'slider',
      min: 1,
      max: 20,
      step: 0.5,
      default: 7.5,
    },
    {
      name: 'rawMode',
      label: 'Raw Mode',
      type: 'toggle',
      default: false,
    },
  ],
  promptTemplate: (values) => {
    const parts: string[] = [];
    parts.push(String(values.prompt ?? ''));
    parts.push(`Steps: ${values.steps ?? 20}`);
    parts.push(`Guidance: ${values.guidance ?? 7.5}`);
    if (values.rawMode) {
      parts.push('[Raw Mode]');
    }
    return parts.join('\n');
  },
  tip: 'Higher steps = more detail but slower. Guidance controls prompt adherence.',
};
