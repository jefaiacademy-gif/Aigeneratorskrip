import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserPlan = 'free' | 'premium' | 'enterprise';

export interface AppUser {
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
  status: 'active' | 'suspended';
}

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

export interface EngineAssignment {
  engineId: string;
  engineName: string;
  apiKeyId: string | null;
  enabled: boolean;
  rateLimit: number;
  usage: number;
}

interface AdminState {
  isAuthenticated: boolean;
  users: AppUser[];
  apiKeys: ApiKey[];
  engineAssignments: EngineAssignment[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  toggleUserStatus: (userId: string) => void;
  changeUserPlan: (userId: string, plan: UserPlan) => void;
  deleteUser: (userId: string) => void;
  addApiKey: (key: Omit<ApiKey, 'id' | 'createdAt'>) => void;
  toggleApiKey: (id: string) => void;
  deleteApiKey: (id: string) => void;
  toggleEngine: (engineId: string) => void;
  assignApiKey: (engineId: string, apiKeyId: string | null) => void;
  setEngineRateLimit: (engineId: string, limit: number) => void;
}

const genId = () => Math.random().toString(36).substring(2, 10);

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      users: [
        { id: 'u1', email: 'demo@frameforge.com', name: 'Demo User', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo', plan: 'free', promptsGenerated: 156, promptsThisMonth: 45, promptLimit: 200, joinDate: '2025-01-15', lastActive: '2026-06-12T10:00:00Z', status: 'active' },
        { id: 'u2', email: 'sarah@design.co', name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', plan: 'premium', promptsGenerated: 2341, promptsThisMonth: 892, promptLimit: 2000, joinDate: '2025-02-20', lastActive: '2026-06-12T14:30:00Z', status: 'active' },
        { id: 'u3', email: 'mike@studio.com', name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', plan: 'enterprise', promptsGenerated: 8920, promptsThisMonth: 1567, promptLimit: 999999, joinDate: '2025-03-01', lastActive: '2026-06-12T16:00:00Z', status: 'active' },
        { id: 'u4', email: 'lisa@agency.io', name: 'Lisa Wong', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', plan: 'premium', promptsGenerated: 876, promptsThisMonth: 234, promptLimit: 2000, joinDate: '2025-04-10', lastActive: '2026-06-11T22:00:00Z', status: 'active' },
        { id: 'u5', email: 'tom@freelance.net', name: 'Tom Baker', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom', plan: 'free', promptsGenerated: 89, promptsThisMonth: 198, promptLimit: 200, joinDate: '2025-05-05', lastActive: '2026-06-10T08:00:00Z', status: 'suspended' },
        { id: 'u6', email: 'emma@corp.com', name: 'Emma Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', plan: 'enterprise', promptsGenerated: 12045, promptsThisMonth: 2341, promptLimit: 999999, joinDate: '2025-01-20', lastActive: '2026-06-12T18:00:00Z', status: 'active' },
      ],
      apiKeys: [
        { id: 'k1', provider: 'OpenAI', name: 'OpenAI Production', value: 'sk-proj-abc123xyz', masked: 'sk-proj-...xyz', active: true, usage: 45200, limit: 100000, createdAt: '2025-01-01' },
        { id: 'k2', provider: 'Midjourney', name: 'MJ API Key', value: 'mj-api-456def', masked: 'mj-api-...def', active: true, usage: 23400, limit: 50000, createdAt: '2025-02-01' },
        { id: 'k3', provider: 'Runway', name: 'Runway Gen-3', value: 'rw-key-789ghi', masked: 'rw-key-...ghi', active: true, usage: 12300, limit: 30000, createdAt: '2025-03-01' },
        { id: 'k4', provider: 'Stability', name: 'SD3 API', value: 'st-key-012jkl', masked: 'st-key-...jkl', active: false, usage: 8900, limit: 25000, createdAt: '2025-01-15' },
        { id: 'k5', provider: 'OpenRouter', name: 'OpenRouter Default', value: 'or-key-345mno', masked: 'or-key-...mno', active: true, usage: 67000, limit: 200000, createdAt: '2025-01-01' },
      ],
      engineAssignments: [
        { engineId: 'seedance', engineName: 'Seedance 2.0', apiKeyId: 'k5', enabled: true, rateLimit: 1000, usage: 450 },
        { engineId: 'kling', engineName: 'Kling 1.6', apiKeyId: 'k5', enabled: true, rateLimit: 1000, usage: 230 },
        { engineId: 'runway', engineName: 'Runway Gen-3', apiKeyId: 'k3', enabled: true, rateLimit: 500, usage: 340 },
        { engineId: 'pika', engineName: 'Pika 2.0', apiKeyId: 'k5', enabled: true, rateLimit: 500, usage: 120 },
        { engineId: 'luma', engineName: 'Luma Dream Machine', apiKeyId: 'k5', enabled: true, rateLimit: 500, usage: 89 },
        { engineId: 'hailuo', engineName: 'Hailuo MiniMax', apiKeyId: 'k5', enabled: false, rateLimit: 300, usage: 0 },
        { engineId: 'midjourney', engineName: 'Midjourney v7', apiKeyId: 'k2', enabled: true, rateLimit: 2000, usage: 1560 },
        { engineId: 'flux', engineName: 'Flux.1', apiKeyId: 'k1', enabled: true, rateLimit: 1500, usage: 890 },
        { engineId: 'recraft', engineName: 'Recraft V3', apiKeyId: 'k5', enabled: true, rateLimit: 500, usage: 234 },
        { engineId: 'ideogram', engineName: 'Ideogram 3.0', apiKeyId: 'k5', enabled: true, rateLimit: 500, usage: 178 },
        { engineId: 'stableDiff', engineName: 'Stable Diffusion 3', apiKeyId: 'k4', enabled: false, rateLimit: 1000, usage: 0 },
        { engineId: 'storyboard', engineName: 'Auto Storyboard', apiKeyId: 'k1', enabled: true, rateLimit: 500, usage: 312 },
      ],
      login: (email, password) => {
        if (email === 'admin@frameforge.com' && password === 'admin123') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      toggleUserStatus: (userId) => set((s) => ({ users: s.users.map((u) => u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u) })),
      changeUserPlan: (userId, plan) => set((s) => ({ users: s.users.map((u) => u.id === userId ? { ...u, plan, promptLimit: plan === 'free' ? 200 : plan === 'premium' ? 2000 : 999999 } : u) })),
      deleteUser: (userId) => set((s) => ({ users: s.users.filter((u) => u.id !== userId) })),
      addApiKey: (key) => set((s) => ({ apiKeys: [...s.apiKeys, { ...key, id: genId(), createdAt: new Date().toISOString().split('T')[0] }] })),
      toggleApiKey: (id) => set((s) => ({ apiKeys: s.apiKeys.map((k) => k.id === id ? { ...k, active: !k.active } : k) })),
      deleteApiKey: (id) => set((s) => ({ apiKeys: s.apiKeys.filter((k) => k.id !== id) })),
      toggleEngine: (engineId) => set((s) => ({ engineAssignments: s.engineAssignments.map((e) => e.engineId === engineId ? { ...e, enabled: !e.enabled } : e) })),
      assignApiKey: (engineId, apiKeyId) => set((s) => ({ engineAssignments: s.engineAssignments.map((e) => e.engineId === engineId ? { ...e, apiKeyId } : e) })),
      setEngineRateLimit: (engineId, limit) => set((s) => ({ engineAssignments: s.engineAssignments.map((e) => e.engineId === engineId ? { ...e, rateLimit: limit } : e) })),
    }),
    { name: 'frameforge-admin', partialize: (state) => ({ users: state.users, apiKeys: state.apiKeys, engineAssignments: state.engineAssignments }) }
  )
)
