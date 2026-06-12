// ============================================
// FrameForge Shared Types
// ============================================

/** Engine category classification */
export type EngineCategory = 'video' | 'image' | 'storyboard';

/** Supported field types for engine configuration forms */
export type EngineFieldType =
  | 'text'
  | 'select'
  | 'slider'
  | 'toggle'
  | 'number'
  | 'textarea';

/** A single configurable field for an engine */
export interface EngineField {
  name: string;
  label: string;
  type: EngineFieldType;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  default?: string | number | boolean;
  placeholder?: string;
  required?: boolean;
}

/** Complete configuration for a generation engine */
export interface EngineConfig {
  id: string;
  name: string;
  category: EngineCategory;
  icon: string; // lucide icon name
  description: string;
  fields: EngineField[];
  promptTemplate: (values: Record<string, unknown>) => string;
  tip?: string;
}

/** A saved prompt entry */
export interface PromptEntry {
  id: string;
  engineId: string;
  engineName: string;
  values: Record<string, unknown>;
  prompt: string;
  createdAt: string;
  favorite?: boolean;
}

/** A single frame in a storyboard */
export interface StoryboardFrame {
  id: string;
  shotType: string;
  description: string;
  transition: string;
  duration: number;
  order: number;
}

/** User account information */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'premium';
  promptsGenerated: number;
  joinDate: string;
  lastActive: string;
}

/** Stored API key for a provider */
export interface ApiKey {
  id: string;
  provider: string;
  name: string;
  value: string;
  masked: string;
  active: boolean;
  usage: number;
  limit: number;
  createdAt: string;
}
