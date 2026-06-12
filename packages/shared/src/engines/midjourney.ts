import type { EngineConfig } from '../types';

export const midjourneyConfig: EngineConfig = {
  id: 'midjourney-v7',
  name: 'Midjourney v7',
  category: 'image',
  icon: 'Palette',
  description:
    'Industry-leading AI image generation with extensive parameter control for artistic direction.',
  fields: [
    {
      name: 'prompt',
      label: 'Prompt',
      type: 'textarea',
      placeholder: 'Describe the image you want to create...',
      required: true,
    },
    {
      name: 'aspectRatio',
      label: 'Aspect Ratio',
      type: 'select',
      options: ['--ar 1:1', '--ar 16:9', '--ar 9:16', '--ar 4:3', '--ar 21:9', '--ar 2:3'],
      default: '--ar 1:1',
    },
    {
      name: 'stylize',
      label: 'Stylize',
      type: 'slider',
      min: 0,
      max: 1000,
      step: 10,
      default: 100,
    },
    {
      name: 'chaos',
      label: 'Chaos',
      type: 'slider',
      min: 0,
      max: 100,
      step: 1,
      default: 0,
    },
    {
      name: 'weird',
      label: 'Weird',
      type: 'slider',
      min: 0,
      max: 3000,
      step: 10,
      default: 0,
    },
    {
      name: 'version',
      label: 'Version',
      type: 'select',
      options: ['--v 7', '--v 6.1', '--v 6', '--v 5.2'],
      default: '--v 7',
    },
    {
      name: 'styleRaw',
      label: 'Style Raw',
      type: 'toggle',
      default: false,
    },
    {
      name: 'tile',
      label: 'Tile',
      type: 'toggle',
      default: false,
    },
  ],
  promptTemplate: (values) => {
    const parts: string[] = [];
    parts.push(String(values.prompt ?? ''));
    if (values.aspectRatio && values.aspectRatio !== '--ar 1:1') {
      parts.push(values.aspectRatio as string);
    }
    if (values.stylize && values.stylize !== 100) {
      parts.push(`--s ${values.stylize}`);
    }
    if (values.chaos && values.chaos !== 0) {
      parts.push(`--c ${values.chaos}`);
    }
    if (values.weird && values.weird !== 0) {
      parts.push(`--w ${values.weird}`);
    }
    if (values.version && values.version !== '--v 7') {
      parts.push(values.version as string);
    }
    if (values.styleRaw) {
      parts.push('--style raw');
    }
    if (values.tile) {
      parts.push('--tile');
    }
    return parts.join(' ');
  },
  tip: 'Use Stylize for artistic flair, Chaos for variety, and Weird for unconventional results.',
};
