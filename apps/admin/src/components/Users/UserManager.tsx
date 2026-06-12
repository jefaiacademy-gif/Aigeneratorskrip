import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserCheck, UserX } from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';
import type { UserPlan } from '../../hooks/useAdminStore';

export default function UserManager() {
  const { users, toggleUserStatus, changeUserPlan, deleteUser } = useAdminStore();
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState<UserPlan | 'all'>('all');

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === 'all' || u.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  const plans: Array<UserPlan | 'all'> = ['all', 'free', 'premium', 'enterprise'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white">Users</h2><p className="text-sm text-[#9090a0] mt-1">{users.length} total users</p></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606070]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full bg-[#12121a] border border-[#27273a] rounded-lg pl-10 pr-4 py-2.5 text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#00d4ff] transition text-sm" />
        </div>
        <div className="flex gap-2">
          {plans.map((p) => (
            <button key={p} onClick={() => setFilterPlan(p)} className={`px-3 py-2 rounded-lg text-xs font-medium border transition ${filterPlan === p ? 'bg-[#a855f7]/20 border-[#a855f7]/50 text-[#a855f7]' : 'bg-[#12121a] border-[#27273a] text-[#9090a0] hover:border-[#3a3a50]'}`}>
              {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#12121a]/80 backdrop-blur border border-[#27273a] rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_80px_60px] gap-4 px-4 py-3 border-b border-[#27273a] text-xs text-[#606070] uppercase tracking-wide font-medium">
          <span>User</span><span>Plan</span><span>Prompts</span><span>Actions</span>
        </div>
        <AnimatePresence>
          {filtered.map((u) => (
            <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-[1fr_100px_80px_60px] gap-4 px-4 py-3 border-b border-[#27273a]/50 items-center hover:bg-[#27273a]/20 transition">
              <div className="flex items-center gap-3 min-w-0">
                <img src={u.avatar} alt="" className="w-8 h-8 rounded-full bg-[#27273a] shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-[#f0f0f5] truncate">{u.name}</p>
                  <p className="text-xs text-[#606070] truncate">{u.email}</p>
                </div>
              </div>
              <select value={u.plan} onChange={(e) => changeUserPlan(u.id, e.target.value as UserPlan)} className="bg-[#0a0a0f] border border-[#27273a] rounded-lg px-2 py-1.5 text-xs text-[#f0f0f5] focus:outline-none focus:border-[#a855f7]">
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option

cat > apps/admin/src/components/Engines/EngineConfig.tsx << 'EOF'
import { motion } from 'framer-motion';
import { Settings, ToggleLeft, ToggleRight, Zap } from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';

export default function EngineConfig() {
  const { engineAssignments, apiKeys, toggleEngine, assignApiKey, setEngineRateLimit } = useAdminStore();
  const activeKeys = apiKeys.filter((k) => k.active);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Settings size={22} className="text-[#f59e0b]" /> Engine Configuration</h2>
        <p className="text-sm text-[#9090a0] mt-1">Manage AI engines and their API keys</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {engineAssignments.map((engine, i) => (
          <motion.div key={engine.engineId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`bg-[#12121a]/80 backdrop-blur border rounded-xl p-5 transition ${engine.enabled ? 'border-[#00d4ff]/30 shadow-lg shadow-[#00d4ff]/5' : 'border-[#27273a] opacity-60'}`}>
            <div className="flex items-center justify-between mb-3">
              <div><h3 className="text-sm font-semibold text-[#f0f0f5]">{engine.engineName}</h3><span className="text-xs text-[#606070]">{engine.engineId}</span></div>
              <button onClick={() => toggleEngine(engine.engineId)} className="transition hover:scale-110">
                {engine.enabled ? <ToggleRight size={28} className="text-[#00d4ff]" /> : <ToggleLeft size={28} className="text-[#27273a]" />}
              </button>
            </div>

            {engine.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[#9090a0] mb-1">API Key</label>
                  <select value={engine.apiKeyId || ''} onChange={(e) => assignApiKey(engine.engineId, e.target.value || null)} className="w-full bg-[#0a0a0f] border border-[#27273a] rounded-lg px-3 py-2 text-xs text-[#f0f0f5] focus:outline-none focus:border-[#f59e0b]">
                    <option value="">-- Select API Key --</option>
                    {activeKeys.map((k) => (<option key={k.id} value={k.id}>{k.name} ({k.provider})</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#9090a0] mb-1">Rate Limit: {engine.rateLimit}/day</label>
                  <input type="range" min={100} max={5000} step={100} value={engine.rateLimit} onChange={(e) => setEngineRateLimit(engine.engineId, Number(e.target.value))} className="w-full accent-[#f59e0b]" />
                </div>
                <div className="flex items-center gap-2"><Zap size={12} className="text-[#f59e0b]" /><span className="text-xs text-[#9090a0]">{engine.usage} / {engine.rateLimit} used today</span></div>
                <div className="w-full h-1
cat > apps/admin/src/components/APIKeys/APIKeyManager.tsx << 'EOF'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Plus, Eye, EyeOff, Trash2, Copy, Check } from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';

export default function APIKeyManager() {
  const { apiKeys, toggleApiKey, deleteApiKey, addApiKey } = useAdminStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newKey, setNewKey] = useState({ provider: '', name: '', value: '', limit: 10000 });

  const handleAdd = () => {
    if (!newKey.provider || !newKey.name || !newKey.value) return;
    addApiKey({
      provider: newKey.provider,
      name: newKey.name,
      value: newKey.value,
      masked: newKey.value.substring(0, 8) + '...' + newKey.value.slice(-4),
      active: true,
      usage: 0,
      limit: newKey.limit,
    });
    setNewKey({ provider: '', name: '', value: '', limit: 10000 });
    setShowAdd(false);
  };

  const copyKey = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const providers = ['OpenAI', 'Midjourney', 'Runway', 'Stability', 'OpenRouter', 'Anthropic', 'Pika', 'Luma', 'Custom'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white flex items-center gap-2"><Key size={22} className="text-[#f59e0b]" /> API Keys</h2><p className="text-sm text-[#9090a0] mt-1">{apiKeys.length} keys configured</p></div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ec4899] text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"><Plus size={16} /> Add Key</button>
      </div>

      <div className="bg-[#12121a]/80 backdrop-blur border border-[#27273a] rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_100px_80px_60px] gap-4 px-4 py-3 border-b border-[#27273a] text-xs text-[#606070] uppercase tracking-wide font-medium">
          <span>Name</span><span>Provider</span><span>Usage</span><span>Status</span><span>Actions</span>
        </div>
        {apiKeys.map((k) => (
          <div key={k.id} className
cat > apps/admin/src/components/APIKeys/APIKeyManager.tsx << 'EOF'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Plus, Eye, EyeOff, Trash2, Copy, Check } from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';

export default function APIKeyManager() {
  const { apiKeys, toggleApiKey, deleteApiKey, addApiKey } = useAdminStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newKey, setNewKey] = useState({ provider: '', name: '', value: '', limit: 10000 });

  const handleAdd = () => {
    if (!newKey.provider || !newKey.name || !newKey.value) return;
    addApiKey({
      provider: newKey.provider,
      name: newKey.name,
      value: newKey.value,
      masked: newKey.value.substring(0, 8) + '...' + newKey.value.slice(-4),
      active: true,
      usage: 0,
      limit: newKey.limit,
    });
    setNewKey({ provider: '', name: '', value: '', limit: 10000 });
    setShowAdd(false);
  };

  const copyKey = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const providers = ['OpenAI', 'Midjourney', 'Runway', 'Stability', 'OpenRouter', 'Anthropic', 'Pika', 'Luma', 'Custom'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white flex items-center gap-2"><Key size={22} className="text-[#f59e0b]" /> API Keys</h2><p className="text-sm text-[#9090a0] mt-1">{apiKeys.length} keys configured</p></div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ec4899] text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"><Plus size={16} /> Add Key</button>
      </div>

      <div className="bg-[#12121a]/80 backdrop-blur border border-[#27273a] rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_100px_80px_60px] gap-4 px-4 py-3 border-b border-[#27273a] text-xs text-[#606070] uppercase tracking-wide font-medium">
          <span>Name</span><span>Provider</span><span>Usage</span><span>Status</span><span>Actions</span>
        </div>
        {apiKeys.map((k) => (
          <div key={k.id} className="grid grid-cols-[1fr_120px_100px_80px_60px] gap-4 px-4 py-3 border-b border-[#27273a]/50 items-center hover:bg-[#27273a]/20 transition">
            <div>
              <p className="text-sm text-[#f0f0f5]">{k.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#606070] font-mono">{showKey[k.id] ? k.value : k.masked}</span>
                <button onClick={() => setShowKey((prev) => ({ ...prev, [k.id]: !prev[k.id] }))} className="text-[#606070] hover:text-[#f0f0f5] transition">{showKey[k.id] ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                <button onClick={() => copyKey(k.id, k.value)} className="text-[#606070] hover:text-[#00d4ff] transition">{copiedId === k.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}</button>
              </div>
            </div>
            <span className="text-xs text-[#9090a0]">{k.provider}</span>
            <div className="text-xs text-[#9090a0]">{k.usage.toLocaleString()} / {k.limit.toLocaleString()}</div>
            <button onClick={() => toggleApiKey(k.id)} className={`px-2 py-1 rounded-full text-xs font-medium transition ${k.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{k.active ? 'Active' : 'Inactive'}</button>
            <button onClick={() => deleteApiKey(k.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#12121a] border border-[#27273a] rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-4">Add API Key</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[#9090a0] mb-1">Provider</label>
                  <select value={newKey.provider} onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })} className="w-full bg-[#0a0a0f] border border-[#27273a] rounded-lg px-3 py-2 text-sm text-[#f0f0f5] focus:outline-none focus:border-[#f59e0b]">
                    <option value="">Select provider</option>
                    {providers.map((p) => (<option key={p} value={p}>{p}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#9090a0] mb-1">Key Name</label>
                  <input type="text" value={newKey.name} onChange={(e) => setNewKey({ ...newKey, name: e.target.value })} placeholder="e.g. Production Key" className="w-full bg-[#0a0a0f] border border-[#27273a] rounded-lg px-3 py-2 text-sm text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#f59e0b]" />
                </div>
                <div>
                  <label className="block text-xs text-[#9090a0] mb-1">API Key Value</label>
                  <input type="password" value={newKey.value} onChange={(e) => setNewKey({ ...newKey, value: e.target.value })} placeholder="sk-..." className="w-full bg-[#0a0a0f] border border-[#27273a] rounded-lg px-3 py-2 text-sm text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#f59e0b]" />
                </div>
                <div>
                  <label className="block text-xs text-[#9090a0] mb-1">Usage Limit</label>
                  <input type="number" value={newKey.limit} onChange={(e) => setNewKey({ ...newKey, limit: Number(e.target.value) })} className="w-full bg-[#0a0a0f] border border-[#27273a] rounded-lg px-3 py-2 text-sm text-[#f0f0f5] focus:outline-none focus:border-[#f59e0b]" />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-lg border border-[#27273a] text-[#9090a0] text-sm hover:bg-[#27273a] transition">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ec4899] text-white text-sm font-medium hover:opacity-90 transition">Add Key</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
