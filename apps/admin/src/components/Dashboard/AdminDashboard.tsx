import { motion } from 'framer-motion';
import { Users, Key, Zap, DollarSign, Activity, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';

export default function AdminDashboard() {
  const { users, apiKeys, engineAssignments } = useAdminStore();

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const totalGenerations = users.reduce((acc, u) => acc + u.promptsGenerated, 0);
  const activeKeys = apiKeys.filter((k) => k.active).length;
  const enabledEngines = engineAssignments.filter((e) => e.enabled).length;

  const topEngines = [...engineAssignments]
    .filter((e) => e.enabled)
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 5);

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
    .slice(0, 6);

  const stats = [
    { label: 'Total Users', value: totalUsers, change: '+12%', up: true, icon: Users, color: 'from-[#00d4ff] to-[#00d4ff]/50' },
    { label: 'Active Now', value: activeUsers, change: '+5%', up: true, icon: Activity, color: 'from-green-400 to-green-400/50' },
    { label: 'API Keys', value: activeKeys, change: '0', up: true, icon: Key, color: 'from-[#a855f7] to-[#a855f7]/50' },
    { label: 'Total Prompts', value: totalGenerations.toLocaleString(), change: '+23%', up: true, icon: Zap, color: 'from-amber-400 to-amber-400/50' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-sm text-[#9090a0] mt-1">FrameForge platform overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#12121a]/80 backdrop-blur border border-[#27273a] rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${s.color} flex items-center justify-center mb-3`}><s.icon size={16} className="text-white" /></div>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-[#9090a0]">{s.label}</span>
              <span className={`text-xs flex items-center gap-0.5 ml-auto ${s.up ? 'text-green-400' : 'text-red-400'}`}>{s.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}{s.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Engines */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#12121a]/80 backdrop-blur border border-[#27273a] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#f0f0f5] mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-[#a855f7]" /> Top Engines</h3>
          <div className="space-y-3">
            {topEngines.map((e) => (
              <div key={e.engineId} className="flex items-center gap-3">
                <span className="text-xs text-[#9090a0] w-24 truncate">{e.engineName}</span>
                <div className="flex-1 h-2 bg-[#27273a] rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899]" initial={{ width: 0 }} animate={{ width: `${Math.min((e.usage / e.rateLimit) * 100, 100)}%` }} transition={{ duration: 0.8 }} />
                </div>
                <span className="text-xs text-[#9090a0] w-12 text-right">{e.usage}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#12121a]/80 backdrop-blur border border-[#27273a] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#f0f0f5] mb-4 flex items-center gap-2"><Users size={14} className="text-[#00d4ff]" /> Recent Users</h3>
          <div className="space-y-2">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#27273a]/30 transition">
                <img src={u.avatar} alt="" className="w-8 h-8 rounded-full bg-[#27273a]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#f0f0f5] truncate">{u.name}</p>
                  <p className="text-xs text-[#606070]">{u.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${u.plan === 'enterprise' ? 'bg-purple-500/20 text-purple-400' : u.plan === 'premium' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'}`}>{u.plan}</span>
                <span className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}