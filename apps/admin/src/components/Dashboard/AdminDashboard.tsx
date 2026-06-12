import { motion } from 'framer-motion';
import {
  Users,
  Key,
  Zap,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Check,
  Crown,
} from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';
import StatsChart from './StatsChart';
import TopEnginesChart from './TopEnginesChart';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const usageData = [
  { day: 'Mon', requests: 12400 },
  { day: 'Tue', requests: 15200 },
  { day: 'Wed', requests: 11800 },
  { day: 'Thu', requests: 18900 },
  { day: 'Fri', requests: 22100 },
  { day: 'Sat', requests: 16400 },
  { day: 'Sun', requests: 13700 },
];

const topEnginesData = [
  { name: 'GPT-4o', value: 8450 },
  { name: 'DALL-E 3', value: 6720 },
  { name: 'Runway', value: 5340 },
  { name: 'Claude', value: 4890 },
  { name: 'Midjourney', value: 3650 },
  { name: 'Luma', value: 2180 },
];

export default function AdminDashboard() {
  const users = useAdminStore((s) => s.users);
  const apiKeys = useAdminStore((s) => s.apiKeys);
  const engineEnabled = useAdminStore((s) => s.engineEnabled);

  const totalUsers = users.length;
  const activeKeys = apiKeys.filter((k) => k.active).length;
  const totalGens = usageData.reduce((a, b) => a + b.requests, 0);
  const revenue = 2840;
  const activeEngines = Object.values(engineEnabled).filter(Boolean).length;

  const stats = [
    {
      label: 'Total Users',
      value: totalUsers,
      trend: '+12%',
      trendUp: true,
      icon: Users,
      iconBg: 'bg-cyan/10',
      iconColor: 'text-cyan',
    },
    {
      label: 'Active API Keys',
      value: activeKeys,
      trend: 'of ' + apiKeys.length,
      trendUp: true,
      icon: Key,
      iconBg: 'bg-amber/10',
      iconColor: 'text-amber',
    },
    {
      label: 'Generations Today',
      value: (totalGens / 1000).toFixed(1) + 'K',
      trend: '+8.4%',
      trendUp: true,
      icon: Zap,
      iconBg: 'bg-pink/10',
      iconColor: 'text-pink',
    },
    {
      label: 'Revenue',
      value: '$' + revenue.toLocaleString(),
      trend: '-2.1%',
      trendUp: false,
      icon: CreditCard,
      iconBg: 'bg-green/10',
      iconColor: 'text-green',
    },
  ];

  const recentUsers = [...users]
    .sort((a, b) => (a.lastActive === 'Just now' ? -1 : 1))
    .slice(0, 6);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Page title */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-0.5">
          Overview of your FrameForge platform
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="glass-card rounded-xl p-5 hover:border-border-hover transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <div className="flex items-center gap-1">
                  {stat.trendUp ? (
                    <TrendingUp className="w-3 h-3 text-green" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red" />
                  )}
                  <span className={`text-xs font-medium ${stat.trendUp ? 'text-green' : 'text-red'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">API Usage (7 Days)</h3>
          <StatsChart data={usageData} />
        </motion.div>
        <motion.div variants={item} className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Top Engines</h3>
          <TopEnginesChart data={topEnginesData} />
        </motion.div>
      </div>

      {/* Recent Users + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Users */}
        <motion.div variants={item} className="lg:col-span-2 glass-card rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Recent Users</h3>
            <span className="text-xs text-text-muted">{users.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted text-xs uppercase tracking-wide border-b border-border">
                  <th className="text-left font-medium px-5 py-3">User</th>
                  <th className="text-left font-medium px-5 py-3">Plan</th>
                  <th className="text-left font-medium px-5 py-3">Prompts</th>
                  <th className="text-left font-medium px-5 py-3">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="border-b border-border/50 last:border-0 hover:bg-bg-elevated/40 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-xs font-semibold text-text-secondary">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{user.name}</p>
                          <p className="text-xs text-text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {user.plan === 'Premium' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber/10 text-amber px-2 py-0.5 rounded-full">
                          <Crown className="w-3 h-3" />
                          Premium
                        </span>
                      ) : (
                        <span className="text-xs font-medium bg-bg-elevated text-text-secondary px-2 py-0.5 rounded-full">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{user.promptsGenerated.toLocaleString()}</td>
                    <td className="px-5 py-3 text-text-muted text-xs">{user.lastActive}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div variants={item} className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">System Status</h3>
          <div className="space-y-3">
            {Object.entries(engineEnabled).map(([id, enabled]) => {
              const engine = [
                { id: 'gpt4o', name: 'GPT-4o' },
                { id: 'claude', name: 'Claude 3.5' },
                { id: 'dalle3', name: 'DALL-E 3' },
                { id: 'midjourney', name: 'Midjourney' },
                { id: 'runway', name: 'Runway Gen-3' },
                { id: 'pika', name: 'Pika Labs' },
                { id: 'luma', name: 'Luma Dream' },
                { id: 'sora', name: 'Sora' },
              ].find((e) => e.id === id);
              if (!engine) return null;
              return (
                <div key={id} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-text-secondary">{engine?.name}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green' : 'bg-red'}`} />
                    <span className={`text-xs ${enabled ? 'text-green' : 'text-red'}`}>
                      {enabled ? 'Operational' : 'Offline'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-green">
            <Check className="w-4 h-4" />
            <span className="text-xs font-medium">All systems operational</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
