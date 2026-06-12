import type { EngineConfig } from '../types';

export const runwayConfig: EngineConfig = {
  id: 'runway-gen3',
  name: 'Runway Gen-3',
  category: 'video',
  icon: 'Film',
  description:
    'Professional-grade video generation with cinematic camera controls and motion intensity.',
  fields: [
    {
      name: 'prompt',
      label: 'Prompt',
      type: 'textarea',
      placeholder: 'Describe the cinematic scene...',
      required: true,
    },
    {
      name: 'motionIntensity',
      label: 'Motion Intensity',
      type: 'slider',
      min: 1,
      max: 10,
      step: 1,
      default: 5,
    },
    {
      name: 'cameraControl',
      label: 'Camera Control',
      type: 'select',
      options: [
        'None',
        'Pan Left',
        'Pan Right',
        'Tilt Up',
        'Tilt Down',
        'Zoom In',
        'Zoom Out',
        'Orbit',
      ],
      default: 'None',
    },
  ],
  promptTemplate: (values) => {
    const parts: string[] = [];
    parts.push(String(values.prompt ?? ''));
    if (values.cameraControl && values.cameraControl !== 'None') {
      parts.push(`Camera: ${values.cameraControl}`);
    }
    parts.push(`Motion Intensity: ${values.motionIntensity ?? 5}/10`);
    return parts.join('\n');
  },
  tip: 'Use cinematic language like "tracking shot" or "dramatic lighting" for best results.',
};
