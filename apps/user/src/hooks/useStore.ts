import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserPlan = 'free' | 'premium' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  plan: UserPlan;
  promptsGenerated: number;
  promptsThisMonth: number;
  promptLimit: number;
  joinDate: string;
  lastActive: string;
}

export interface PromptEntry {
  id: string;
  engineId: string;
  engineName: string;
  prompt: string;
  values: Record<string, any>;
  createdAt: string;
  favorite: boolean;
}

export interface StoryboardFrame {
  id: string;
  shotType: string;
  description: string;
  transition: string;
  duration: number;
  order: number;
}

export const PLAN_CONFIG = {
  free: { name: 'Free', promptLimit: 200, price: 0, features: ['200 prompts/month', 'Basic engines', 'Standard quality', 'Community support'] },
  premium: { name: 'Premium', promptLimit: 2000, price: 19, features: ['2000 prompts/month', 'All engines', 'HD quality', 'Priority support', 'Advanced analytics'] },
  enterprise: { name: 'Enterprise', promptLimit: 999999, price: 49, features: ['Unlimited prompts', 'All engines + API', 'Ultra quality', 'Dedicated support', 'Custom integrations', 'SSO'] },
};

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  selectedEngineId: string;
  prompts: PromptEntry[];
  library: PromptEntry[];
  storyboardFrames: StoryboardFrame[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  upgradePlan: (plan: UserPlan) => void;
  setSelectedEngine: (id: string) => void;
  addPrompt: (engineId: string, engineName: string, prompt: string, values: Record<string, any>) => { success: boolean; error?: string };
  toggleFavorite: (id: string) => void;
  deletePrompt: (id: string) => void;
  addToLibrary: (entry: PromptEntry) => void;
  removeFromLibrary: (id: string) => void;
  addFrame: (frame: Omit<StoryboardFrame, 'id' | 'order'>) => void;
  removeFrame: (id: string) => void;
  reorderFrames: (frames: StoryboardFrame[]) => void;
}

const genId = () => Math.random().toString(36).substring(2, 10);

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      selectedEngineId: 'seedance',
      prompts: [
        { id: 'p1', engineId: 'seedance', engineName: 'Seedance 2.0', prompt: 'Cinematic aerial shot of futuristic city at golden hour, camera slowly orbiting, neon lights, 4K ultra detailed', values: { prompt: 'futuristic city', camera: 'Orbit', duration: 10, intensity: 8 }, createdAt: new Date(Date.now() - 86400000).toISOString(), favorite: true },
        { id: 'p2', engineId: 'midjourney', engineName: 'Midjourney v7', prompt: 'Epic fantasy landscape, floating islands, waterfalls, dragons --ar 16:9 --s 750 --v 7 --style raw', values: { prompt: 'fantasy landscape', aspectRatio: '--ar 16:9', stylize: 750 }, createdAt: new Date(Date.now() - 172800000).toISOString(), favorite: false },
      ],
      library: [],
      storyboardFrames: [
        { id: 'f1', shotType: 'Wide', description: 'Establishing shot of mountain valley at sunrise', transition: 'Fade In', duration: 5, order: 0 },
        { id: 'f2', shotType: 'Medium', description: 'Hiker walking through pine forest', transition: 'Cut', duration: 4, order: 1 },
        { id: 'f3', shotType: 'Close-up', description: 'Hands gripping hiking pole', transition: 'Dissolve', duration: 3, order: 2 },
      ],

      login: (email, password) => {
        if (email.trim().toLowerCase() === 'demo@frameforge.com' && password === 'demo123') {
          set({
            user: {
              id: 'u1', email: 'demo@frameforge.com', name: 'Demo User',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
              plan: 'free', promptsGenerated: 12, promptsThisMonth: 12,
              promptLimit: 200, joinDate: '2025-01-15', lastActive: new Date().toISOString(),
            },
            isAuthenticated: true,
          });
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
        if (user.plan === 'free' && user.promptsThisMonth >= 200) return { success: false, error: 'LIMIT_REACHED' };
        if (user.plan === 'premium' && user.promptsThisMonth >= 2000) return { success: false, error: 'LIMIT_REACHED' };
        const entry: PromptEntry = { id: genId(), engineId, engineName, prompt, values, createdAt: new Date().toISOString(), favorite: false };
        set({
          prompts: [entry, ...prompts],
          user: { ...user, promptsGenerated: user.promptsGenerated + 1, promptsThisMonth: user.promptsThisMonth + 1, lastActive: new Date().toISOString() },
        });
        return { success: true };
      },

      toggleFavorite: (id) => set((s) => ({ prompts: s.prompts.map((p) => p.id === id ? { ...p, favorite: !p.favorite } : p) })),
      deletePrompt: (id) => set((s) => ({ prompts: s.prompts.filter((p) => p.id !== id) })),
      addToLibrary: (entry) => set((s) => ({ library: [entry, ...s.library] })),
      removeFromLibrary: (id) => set((s) => ({ library: s.library.filter((e) => e.id !== id) })),

      addFrame: (frame) => {
        const { storyboardFrames } = get();
        set({ storyboardFrames: [...storyboardFrames, { ...frame, id: genId(), order: storyboardFrames.length }] });
      },
      removeFrame: (id) => set((s) => ({ storyboardFrames: s.storyboardFrames.filter((f) => f.id !== id).map((f, i) => ({ ...f, order: i })) })),
      reorderFrames: (frames) => set({ storyboardFrames: frames.map((f, i) => ({ ...f, order: i })) }),
    }),
    { name: 'frameforge-storage', partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, prompts: state.prompts, library: state.library, storyboardFrames: state.storyboardFrames }) }
  )
);
