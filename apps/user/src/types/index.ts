export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  plan: 'free' | 'premium';
}

export interface EngineField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'slider' | 'toggle' | 'number';
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string | number | boolean;
  required?: boolean;
  description?: string;
}

export interface Engine {
  id: string;
  name: string;
  category: 'video' | 'image' | 'storyboard';
  description: string;
  icon: string;
  fields: EngineField[];
  promptTemplate: string;
  tip: string;
}

export interface PromptEntry {
  id: string;
  engineId: string;
  engineName: string;
  values: Record<string, string | number | boolean>;
  generatedPrompt: string;
  timestamp: number;
  favorite: boolean;
}

export interface StoryboardFrame {
  id: string;
  order: number;
  shotType: string;
  description: string;
  transition: string;
  duration: number;
}

export interface Activity {
  id: string;
  type: 'prompt' | 'storyboard' | 'save' | 'export';
  description: string;
  timestamp: number;
}
