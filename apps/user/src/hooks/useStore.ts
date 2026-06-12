import { create } from 'zustand';
import type { User, PromptEntry, StoryboardFrame } from '../types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  activeTab: string;
  selectedEngineId: string;
  prompts: PromptEntry[];
  storyboardFrames: StoryboardFrame[];
  library: PromptEntry[];
  history: PromptEntry[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setActiveTab: (tab: string) => void;
  setSelectedEngine: (id: string) => void;
  addPrompt: (entry: PromptEntry) => void;
  addFrame: (frame: StoryboardFrame) => void;
  removeFrame: (id: string) => void;
  reorderFrames: (frames: StoryboardFrame[]) => void;
  toggleFavorite: (id: string) => void;
  deleteFromHistory: (id: string) => void;
}

const DEMO_USER: User = {
  id: 'demo-1',
  name: 'Demo User',
  email: 'demo@frameforge.com',
  avatar: '',
  joinDate: '2024-10-15',
  plan: 'free',
};

const mockHistory: PromptEntry[] = [
  {
    id: 'hist-1',
    engineId: 'runway-gen3',
    engineName: 'Runway Gen-3 Alpha',
    values: { subject: 'cyberpunk city at night', style: 'neon-noir', duration: 5 },
    generatedPrompt: 'A cinematic shot of a cyberpunk city at night, neon-noir style, with glowing holographic billboards reflecting on rain-soaked streets, flying vehicles passing between towering skyscrapers, atmospheric fog, blade runner aesthetic, highly detailed, 4K quality, 5 seconds',
    timestamp: Date.now() - 86400000,
    favorite: true,
  },
  {
    id: 'hist-2',
    engineId: 'pika-labs',
    engineName: 'Pika Labs 2.0',
    values: { subject: 'floating island with waterfalls', style: 'fantasy', motion: 'slow drift' },
    generatedPrompt: 'A magical floating island suspended in golden clouds, cascading waterfalls plunging into the abyss below, lush greenery and ancient ruins, fantasy art style, slow drift camera movement, ethereal lighting, dreamlike atmosphere, highly detailed, cinematic',
    timestamp: Date.now() - 172800000,
    favorite: false,
  },
  {
    id: 'hist-3',
    engineId: 'midjourney-v6',
    engineName: 'Midjourney V6',
    values: { subject: 'futuristic mecha warrior', style: 'anime', aspectRatio: '16:9' },
    generatedPrompt: 'A futuristic mecha warrior standing in a battlefield, anime style, sleek armor design with glowing blue energy cores, dynamic pose, dramatic lighting, 16:9 aspect ratio, highly detailed mechanical parts, cinematic composition, sharp focus',
    timestamp: Date.now() - 259200000,
    favorite: true,
  },
  {
    id: 'hist-4',
    engineId: 'stable-video',
    engineName: 'Stable Video Diffusion',
    values: { subject: 'underwater coral reef', style: 'documentary', motion: 'gentle pan' },
    generatedPrompt: 'An underwater coral reef teeming with colorful marine life, documentary style, gentle pan camera movement, schools of tropical fish swimming through vibrant coral formations, sun rays penetrating crystal clear water, serene and peaceful atmosphere, BBC nature documentary quality',
    timestamp: Date.now() - 345600000,
    favorite: false,
  },
];

const mockLibrary: PromptEntry[] = [mockHistory[0], mockHistory[2]];

const mockFrames: StoryboardFrame[] = [
  {
    id: 'frame-1',
    order: 1,
    shotType: 'Wide',
    description: 'Establishing shot of the futuristic city skyline at dusk. Flying cars weave between towering neon-lit skyscrapers. Camera slowly pushes forward.',
    transition: 'Fade',
    duration: 5,
  },
  {
    id: 'frame-2',
    order: 2,
    shotType: 'Medium',
    description: 'Protagonist stands on rooftop balcony, wind blowing their coat. They look out at the city with determination. Holographic UI elements reflect in their eyes.',
    transition: 'Cut',
    duration: 3,
  },
];

export const useStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  activeTab: 'generate',
  selectedEngineId: 'runway-gen3',
  prompts: mockHistory,
  storyboardFrames: mockFrames,
  library: mockLibrary,
  history: mockHistory,

  login: (email: string, password: string) => {
    if (email === 'demo@frameforge.com' && password === 'demo123') {
      set({ user: DEMO_USER, isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, activeTab: 'generate' });
  },

  setActiveTab: (tab: string) => set({ activeTab: tab }),

  setSelectedEngine: (id: string) => set({ selectedEngineId: id }),

  addPrompt: (entry: PromptEntry) => {
    const state = get();
    set({
      history: [entry, ...state.history],
      prompts: [entry, ...state.prompts],
    });
  },

  addFrame: (frame: StoryboardFrame) => {
    const state = get();
    const newFrame = { ...frame, order: state.storyboardFrames.length + 1 };
    set({
      storyboardFrames: [...state.storyboardFrames, newFrame],
    });
  },

  removeFrame: (id: string) => {
    const state = get();
    const filtered = state.storyboardFrames.filter((f) => f.id !== id);
    const reordered = filtered.map((f, i) => ({ ...f, order: i + 1 }));
    set({ storyboardFrames: reordered });
  },

  reorderFrames: (frames: StoryboardFrame[]) => {
    const reordered = frames.map((f, i) => ({ ...f, order: i + 1 }));
    set({ storyboardFrames: reordered });
  },

  toggleFavorite: (id: string) => {
    const state = get();
    const newHistory = state.history.map((h) =>
      h.id === id ? { ...h, favorite: !h.favorite } : h
    );
    const newLibrary = newHistory.filter((h) => h.favorite);
    set({ history: newHistory, library: newLibrary });
  },

  deleteFromHistory: (id: string) => {
    const state = get();
    const newHistory = state.history.filter((h) => h.id !== id);
    const newLibrary = newHistory.filter((h) => h.favorite);
    set({ history: newHistory, library: newLibrary });
  },

  import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserPlan = 'free' | 'premium' | 'enterprise';

export interface User {
  id: string; email: string; name: string; avatar: string;
  plan: UserPlan; promptsGenerated: number; promptsThisMonth: number;
  promptLimit: number; joinDate: string; lastActive: string;
}

export interface PromptEntry {
  id: string; engineId: string; engineName: string;
  prompt: string; values: Record<string, any>;
  createdAt: string; favorite: boolean;
}

export const PLAN_CONFIG = {
  free: { name: 'Free', promptLimit: 200, price: 0, color: 'gray' },
  premium: { name: 'Premium', promptLimit: 2000, price: 19, color: 'amber' },
  enterprise: { name: 'Enterprise', promptLimit: 999999, price: 49, color: 'purple' },
};

interface AppState {
  user: User | null; isAuthenticated: boolean;
  selectedEngineId: string; prompts: PromptEntry[];
  login: (email: string, password: string) => boolean;
  logout: () => void; upgradePlan: (plan: UserPlan) => void;
  setSelectedEngine: (id: string) => void;
  addPrompt: (engineId: string, engineName: string, prompt: string, values: Record<string, any>) => { success: boolean; error?: string };
  toggleFavorite: (id: string) => void; deletePrompt: (id: string) => void;
}

const genId = () => Math.random().toString(36).substring(2, 10);

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null, isAuthenticated: false, selectedEngineId: 'seedance', prompts: [],
      
      login: (email, password) => {
        if (email.trim().toLowerCase() === 'demo@frameforge.com' && password === 'demo123') {
          set({ user: { id: 'u1', email: 'demo@frameforge.com', name: 'Demo User', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo', plan: 'free', promptsGenerated: 12, promptsThisMonth: 12, promptLimit: 200, joinDate: '2025-01-15', lastActive: new Date().toISOString() }, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      upgradePlan: (plan) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, plan, promptLimit: PLAN_CONFIG[plan].promptLimit } });
      },
      
      setSelectedEngine: (id) => set({ selectedEngineId: id }),
      
      addPrompt: (engineId, engineName, prompt, values) => {
        const { user, prompts } = get();
        if (!user) return { success: false, error: 'Not logged in' };
        
        // ⛔ LIMIT CHECK: Free users = 200/month
        if (user.plan === 'free' && user.promptsThisMonth >= 200) {
          return { success: false, error: 'LIMIT_REACHED' };
        }
        if (user.plan === 'premium' && user.promptsThisMonth >= 2000) {
          return { success: false, error: 'LIMIT_REACHED' };
        }
        
        const entry: PromptEntry = { id: genId(), engineId, engineName, prompt, values, createdAt: new Date().toISOString(), favorite: false };
        set({ prompts: [entry, ...prompts], user: { ...user, promptsGenerated: user.promptsGenerated + 1, promptsThisMonth: user.promptsThisMonth + 1, lastActive: new Date().toISOString() } });
        return { success: true };
      },
      
      toggleFavorite: (id) => set((s) => ({ prompts: s.prompts.map((p) => p.id === id ? { ...p, favorite: !p.favorite } : p) })),
      deletePrompt: (id) => set((s) => ({ prompts: s.prompts.filter((p) => p.id !== id) })),
    }),
    { name: 'frameforge-storage', partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, prompts: state.prompts }) }
  )
);
}));
