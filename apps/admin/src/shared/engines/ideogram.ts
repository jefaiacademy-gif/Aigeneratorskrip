import type { EngineConfig } from '../types';

export const ideogramConfig: EngineConfig = {
  id: 'ideogram-3',
  name: 'Ideogram 3.0',
  category: 'image',
  icon: 'Type',
  description:
    'Specialized in typography and text-in-image generation with realistic rendering modes.',
  fields: [
    {
      name: 'prompt',
      label: 'Prompt',
      type: 'textarea',
      placeholder: 'Describe the image — include any text you want rendered...',
      required: true,
    },
    {
      name: 'typography',
      label: 'Typography Mode',
      type: 'toggle',
      default: false,
    },
    {
      name: 'rendering',
      label: 'Rendering Style',
      type: 'select',
      options: ['Realistic', 'Design', '3D', 'Painting'],
      default: 'Realistic',
    },
  ],
  promptTemplate: (values) => {
    const parts: string[] = [];
    parts.push(String(values.prompt ?? ''));
    if (values.typography) {
      parts.push('[Typography Mode: ON]');
    }
    if (values.rendering && values.rendering !== 'Realistic') {
      parts.push(`[Style: ${values.rendering}]`);
    }
    return parts.join('\n');
  },
  tip: 'Enable Typography Mode for crisp, readable text within generated images.',
};
