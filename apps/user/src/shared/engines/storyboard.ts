import type { EngineConfig } from '../types';

export const storyboardConfig: EngineConfig = {
  id: 'auto-storyboard',
  name: 'Auto Storyboard',
  category: 'storyboard',
  icon: 'LayoutGrid',
  description:
    'Automatically generate structured storyboards with shot types, transitions, and pacing.',
  fields: [
    {
      name: 'sceneDescription',
      label: 'Scene Description',
      type: 'textarea',
      placeholder: 'Describe the full scene or story you want to storyboard...',
      required: true,
    },
    {
      name: 'shots',
      label: 'Number of Shots',
      type: 'select',
      options: ['3', '5', '8', '12', '16'],
      default: '8',
    },
    {
      name: 'transitions',
      label: 'Transition Style',
      type: 'select',
      options: ['Cut', 'Dissolve', 'Fade', 'Wipe', 'Zoom'],
      default: 'Cut',
    },
    {
      name: 'pacing',
      label: 'Pacing',
      type: 'select',
      options: ['Slow', 'Medium', 'Fast', 'Dynamic'],
      default: 'Medium',
    },
    {
      name: 'directorNotes',
      label: 'Director Notes',
      type: 'textarea',
      placeholder: 'Any specific directions — mood, lighting, camera angles...',
    },
  ],
  promptTemplate: (values) => {
    const parts: string[] = [];
    parts.push('STORYBOARD REQUEST');
    parts.push(`Shots: ${values.shots ?? 8}`);
    parts.push(`Transitions: ${values.transitions ?? 'Cut'}`);
    parts.push(`Pacing: ${values.pacing ?? 'Medium'}`);
    parts.push('');
    parts.push('SCENE:');
    parts.push(String(values.sceneDescription ?? ''));
    if (values.directorNotes) {
      parts.push('');
      parts.push('DIRECTOR NOTES:');
      parts.push(String(values.directorNotes));
    }
    return parts.join('\n');
  },
  tip: 'Provide detailed scene descriptions for better shot breakdowns. Director notes guide mood and style.',
};
