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

export const PLAN_CONFIG = {
  free: { name: 'Free', promptLimit: 200, price: 0 },
  premium: { name: 'Premium', promptLimit: 2000, price: 19 },
  enterprise: { name: 'Enterprise', promptLimit: 999999, price: 49 },
};

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  selectedEngineId: string;
  prompts: PromptEntry[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  upgradePlan: (plan: UserPlan) => void;
  setSelectedEngine: (id: string) => void;
  addPrompt: (engineId: string, engineName: string, prompt: string, values: Record<string, any>) => { success: boolean; error?: string };
  toggleFavorite: (id: string) => void;
  deletePrompt: (id: string) => void;
}

const genId = () => Math.random().toString(36).substring(2, 10);

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      selectedEngineId: 'seedance',
      prompts: [],

      login: (email, password) => {
        if (email.trim().toLowerCase() === 'demo@frameforge.com' && password === 'demo123') {
          set({
            user: {
              id: 'u1',
              email: 'demo@frameforge.com',
              name: 'Demo User',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
              plan: 'free',
              promptsGenerated: 12,
              promptsThisMonth: 12,
              promptLimit: 200,
              joinDate: '2025-01-15',
              lastActive: new Date().toISOString(),
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
        set({ prompts: [entry, ...prompts], user: { ...user, promptsGenerated: user.promptsGenerated + 1, promptsThisMonth: user.promptsThisMonth + 1, lastActive: new Date().toISOString() } });
        return { success: true };
      },

      toggleFavorite: (id) => set((s) => ({ prompts: s.prompts.map((p) => p.id === id ? { ...p, favorite: !p.favorite } : p) })),

      deletePrompt: (id) => set((s) => ({ prompts: s.prompts.filter((p) => p.id !== id) })),
    }),
    { name: 'frameforge-storage', partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, prompts: state.prompts }) }
  )
);