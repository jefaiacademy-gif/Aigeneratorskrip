import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Crown, UserX, UserCheck, Filter } from 'lucide-react';
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

      {/* Search & Filter */}
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

      {/* Users Table */}
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
              <select
                value={u.plan}
                onChange={(e) => changeUserPlan(u.id, e.target.value as UserPlan)}
                className="bg-[#0a0a0f] border border-[#27273a] rounded-lg px-2 py-1.5 text-xs text-[#f0f0f5] focus:outline-none focus:border-[#a855f7]"
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <span className="text-xs text-[#9090a0]">{u.promptsThisMonth}/{u.promptLimit === 999999 ? '∞' : u.promptLimit}</span>
              <div className="flex gap-1">
                <button onClick={() => toggleUserStatus(u.id)} title={u.status === 'active' ? 'Suspend' : 'Activate'} className={`p-1.5 rounded-lg transition ${u.status === 'active' ? 'text-green-400 hover:bg-green-400/10' : 'text-red-400 hover:bg-red-400/10'}`}>
                  {u.status === 'active' ? <UserCheck size={14} /> : <UserX size={14} />}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && <p className="text-center text-sm text-[#606070] py-8">No users found.</p>}
      </div>
    </div>
  );