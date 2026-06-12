// ============================================
// Engine Configurations
// ============================================

import { seedanceConfig } from './seedance';
import { klingConfig } from './kling';
import { runwayConfig } from './runway';
import { pikaConfig } from './pika';
import { lumaConfig } from './luma';
import { hailuoConfig } from './hailuo';
import { midjourneyConfig } from './midjourney';
import { fluxConfig } from './flux';
import { recraftConfig } from './recraft';
import { ideogramConfig } from './ideogram';
import { stableDiffConfig } from './stableDiff';
import { storyboardConfig } from './storyboard';

/** All available engine configurations */
export const engines = [
  seedanceConfig,
  klingConfig,
  runwayConfig,
  pikaConfig,
  lumaConfig,
  hailuoConfig,
  midjourneyConfig,
  fluxConfig,
  recraftConfig,
  ideogramConfig,
  stableDiffConfig,
  storyboardConfig,
] as const;

/** Video generation engines */
export const videoEngines = engines.filter((e) => e.category === 'video');

/** Image generation engines */
export const imageEngines = engines.filter((e) => e.category === 'image');

/** Storyboard engines */
export const storyboardEngines = engines.filter((e) => e.category === 'storyboard');

// Re-export individual configs
export * from './seedance';
export * from './kling';
export * from './runway';
export * from './pika';
export * from './luma';
export * from './hailuo';
export * from './midjourney';
export * from './flux';
export * from './recraft';
export * from './ideogram';
export * from './stableDiff';
export * from './storyboard';
