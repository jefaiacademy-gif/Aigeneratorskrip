import type { EngineConfig } from '../types';

export const recraftConfig: EngineConfig = {
  id: 'recraft-v3',
  name: 'Recraft V3',
  category: 'image',
  icon: 'PenTool',
  description:
    'Vector-native image generation with precise style control and color limiting.',
  fields: [
    {
      name: 'prompt',
      label: 'Prompt',
      type: 'textarea',
      placeholder: 'Describe the image...',
      required: true,
    },
    {
      name: 'vectorMode',
      label: 'Vector Mode',
      type: 'toggle',
      default: false,
    },
    {
      name: 'style',
      label: 'Style',
      type: 'select',
      options: ['Vector', 'Illustration', 'Photo', 'Line Art', 'Icon'],
      default: 'Vector',
    },
    {
      name: 'colors',
      label: 'Color Limit',
      type: 'select',
      options: ['Unlimited', '2', '3', '4', '6', '8'],
      default: 'Unlimited',
    },
  ],
  promptTemplate: (values) => {
    const parts: string[] = [];
    parts.push(String(values.prompt ?? ''));
    parts.push(`Style: ${values.style ?? 'Vector'}`);
    if (values.vectorMode) {
      parts.push('[Vector Mode: ON]');
    }
    if (values.colors && values.colors !== 'Unlimited') {
      parts.push(`[Colors: ${values.colors}]`);
    }
    return parts.join('\n');
  },
  tip: 'Vector Mode produces infinitely scalable SVG-like images. Great for logos and icons.',
};
