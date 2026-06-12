import { create } from 'zustand';

export interface ApiKey {
  id: string;
  provider: string;
  name: string;
  value: string;
  usage: number;
  limit: number;
  active: boolean;
  lastUsed: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'Free' | 'Premium';
  promptsGenerated: number;
  joinDate: string;
  lastActive: string;
}

export interface Engine {
  id: string;
  name: string;
  category: 'video' | 'image' | 'storyboard';
  icon: string;
  description: string;
  rateLimit: string;
}

const DEMO_EMAIL = 'admin@frameforge.com';
const DEMO_PASSWORD = 'admin123';

const INITIAL_API_KEYS: ApiKey[] = [
  { id: 'key_1', provider: 'OpenAI', name: 'OpenAI Production', value: 'sk-proj-aB3d9EfgH2iJkLmN4oPqRs5TuVwXyZ', usage: 12450, limit: 50000, active: true, lastUsed: '2 min ago' },
  { id: 'key_2', provider: 'Anthropic', name: 'Anthropic Claude', value: 'sk-ant-api03-xYz9AbCdeFghIjKlMnOpQr', usage: 8320, limit: 30000, active: true, lastUsed: '15 min ago' },
  { id: 'key_3', provider: 'Midjourney', name: 'MJ Enterprise', value: 'mj-api-7f8a9b0c1d2e3f4a5b6c7d8e', usage: 4210, limit: 10000, active: true, lastUsed: '1 hour ago' },
  { id: 'key_4', provider: 'Runway', name: 'Runway Gen-3', value: 'rw_sk_9a8b7c6d5e4f3g2h1i0j', usage: 6780, limit: 20000, active: true, lastUsed: '45 min ago' },
  { id: 'key_5', provider: 'Pika', name: 'Pika Labs', value: 'pika_sk_1a2b3c4d5e6f7g8h9i0j', usage: 1890, limit: 8000, active: false, lastUsed: '3 days ago' },
  { id: 'key_6', provider: 'OpenRouter', name: 'OpenRouter Multi', value: 'sk-or-v1-7f6e5d4c3b2a1908z7y6x5w', usage: 3210, limit: 15000, active: true, lastUsed: '30 min ago' },
  { id: 'key_7', provider: 'Stability', name: 'Stability AI', value: 'sk-stability-9k8j7h6g5f4d3s2a1q0w', usage: 5670, limit: 12000, active: true, lastUsed: '2 hours ago' },
];

const INITIAL_USERS: User[] = [
  { id: 'user_1', name: 'Alex Chen', email: 'alex.chen@design.co', plan: 'Premium', promptsGenerated: 3420, joinDate: '2024-01-15', lastActive: 'Just now' },
  { id: 'user_2', name: 'Sarah Miller', email: 'sarah.m@gmail.com', plan: 'Premium', promptsGenerated: 2890, joinDate: '2024-02-01', lastActive: '5 min ago' },
  { id: 'user_3', name: 'James Wilson', email: 'jwilson@agency.io', plan: 'Free', promptsGenerated: 456, joinDate: '2024-03-10', lastActive: '2 hours ago' },
  { id: 'user_4', name: 'Emily Zhang', email: 'emily.z@studio.com', plan: 'Premium', promptsGenerated: 5670, joinDate: '2023-12-20', lastActive: '15 min ago' },
  { id: 'user_5', name: 'Michael Park', email: 'mpark@creative.ai', plan: 'Free', promptsGenerated: 234, joinDate: '2024-04-05', lastActive: '1 day ago' },
  { id: 'user_6', name: 'Lisa Thompson', email: 'lisa.t@filmmaker.net', plan: 'Premium', promptsGenerated: 1890, joinDate: '2024-01-28', lastActive: '30 min ago' },
  { id: 'user_7', name: 'David Kim', email: 'dkim@techcorp.com', plan: 'Free', promptsGenerated: 678, joinDate: '2024-05-12', lastActive: '3 hours ago' },
  { id: 'user_8', name: 'Rachel Foster', email: 'rachel.f@visuals.co', plan: 'Premium', promptsGenerated: 4210, joinDate: '2023-11-08', lastActive: '10 min ago' },
  { id: 'user_9', name: 'Tom Anderson', email: 'tanderson@startup.io', plan: 'Free', promptsGenerated: 123, joinDate: '2024-06-01', lastActive: '5 days ago' },
  { id: 'user_10', name: 'Nina Patel', email: 'nina.p@agency.com', plan: 'Premium', promptsGenerated: 2340, joinDate: '2024-02-14', lastActive: '1 hour ago' },
];

export const ENGINES: Engine[] = [
  { id: 'gpt4o', name: 'GPT-4o', category: 'storyboard', icon: 'MessageSquare', description: 'Script generation and storyboarding', rateLimit: '500/min' },
  { id: 'claude', name: 'Claude 3.5', category: 'storyboard', icon: 'MessageSquare', description: 'Advanced scriptwriting and analysis', rateLimit: '300/min' },
  { id: 'dalle3', name: 'DALL-E 3', category: 'image', icon: 'Image', description: 'Image generation from prompts', rateLimit: '200/min' },
  { id: 'midjourney', name: 'Midjourney', category: 'image', icon: 'Image', description: 'High-quality artistic images', rateLimit: '100/min' },
  { id: 'runway', name: 'Runway Gen-3', category: 'video', icon: 'Video', description: 'Video generation from images', rateLimit: '50/min' },
  { id: 'pika', name: 'Pika Labs', category: 'video', icon: 'Video', description: 'Video creation and editing', rateLimit: '60/min' },
  { id: 'luma', name: 'Luma Dream Machine', category: 'video', icon: 'Video', description: 'Cinematic video generation', rateLimit: '40/min' },
  { id: 'hailuo', name: 'Hailuo MiniMax', category: 'video', icon: 'Video', description: 'Character-based video generation', rateLimit: '45/min' },
  { id: 'stablevideo', name: 'Stable Video', category: 'video', icon: 'Video', description: 'Open-source video generation', rateLimit: '80/min' },
  { id: 'kling', name: 'Kling AI', category: 'video', icon: 'Video', description: 'Professional video generation', rateLimit: '55/min' },
  { id: 'sora', name: 'Sora', category: 'video', icon: 'Video', description: 'OpenAI video generation', rateLimit: '30/min' },
  { id: 'stablexl', name: 'Stable Diffusion XL', category: 'image', icon: 'Image', description: 'Open-source image generation', rateLimit: '150/min' },
];

const ENGINE_IDS = ENGINES.map(e => e.id);

interface AdminState {
  isAuthenticated: boolean;
  apiKeys: ApiKey[];
  users: User[];
  engineAssignments: Record<string, string>;
  engineEnabled: Record<string, boolean>;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addApiKey: (key: Omit<ApiKey, 'id' | 'lastUsed'>) => void;
  toggleApiKey: (id: string) => void;
  deleteApiKey: (id: string) => void;
  updateApiKeyLimit: (id: string, limit: number) => void;
  toggleEngine: (engineId: string) => void;
  assignApiKeyToEngine: (engineId: string, apiKeyId: string) => void;
  toggleUserPlan: (userId: string) => void;
  deleteUser: (userId: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  apiKeys: INITIAL_API_KEYS,
  users: INITIAL_USERS,
  engineAssignments: {
    gpt4o: 'key_1',
    claude: 'key_2',
    dalle3: 'key_1',
    midjourney: 'key_3',
    runway: 'key_4',
    pika: 'key_5',
    luma: 'key_4',
    hailuo: 'key_6',
    stablevideo: 'key_7',
    kling: 'key_6',
    sora: 'key_1',
    stablexl: 'key_7',
  },
  engineEnabled: ENGINE_IDS.reduce((acc, id) => {
    acc[id] = id !== 'pika' && id !== 'hailuo';
    return acc;
  }, {} as Record<string, boolean>),

  login: (email: string, password: string) => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => set({ isAuthenticated: false }),

  addApiKey: (keyData) =>
    set((state) => ({
      apiKeys: [
        ...state.apiKeys,
        {
          ...keyData,
          id: `key_${Date.now()}`,
          lastUsed: 'Never',
        },
      ],
    })),

  toggleApiKey: (id: string) =>
    set((state) => ({
      apiKeys: state.apiKeys.map((key) =>
        key.id === id ? { ...key, active: !key.active } : key
      ),
    })),

  deleteApiKey: (id: string) =>
    set((state) => ({
      apiKeys: state.apiKeys.filter((key) => key.id !== id),
    })),

  updateApiKeyLimit: (id: string, limit: number) =>
    set((state) => ({
      apiKeys: state.apiKeys.map((key) =>
        key.id === id ? { ...key, limit } : key
      ),
    })),

  toggleEngine: (engineId: string) =>
    set((state) => ({
      engineEnabled: {
        ...state.engineEnabled,
        [engineId]: !state.engineEnabled[engineId],
      },
    })),

  assignApiKeyToEngine: (engineId: string, apiKeyId: string) =>
    set((state) => ({
      engineAssignments: {
        ...state.engineAssignments,
        [engineId]: apiKeyId,
      },
    })),

  toggleUserPlan: (userId: string) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId
          ? { ...user, plan: user.plan === 'Free' ? 'Premium' : 'Free' as 'Free' | 'Premium' }
          : user
      ),
    })),

  deleteUser: (userId: string) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
    })),
}));
