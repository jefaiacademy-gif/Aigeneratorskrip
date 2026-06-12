import { motion } from 'framer-motion';
import {
  Wand2,
  Library,
  Film,
  Crown,
  Calendar,
  Mail,
  User,
  Sparkles,
  Star,
  Clock,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export default function UserDashboard() {
  const { user, prompts, library, storyboardFrames, history } = useStore();

  const stats = [
    {
      label: 'Prompts Generated',
      value: prompts.length + history.length,
      icon: Wand2,
      gradient: 'from-cyan/20 to-cyan/5',
      iconColor: 'text-cyan',
    },
    {
      label: 'Saved to Library',
      value: library.length,
      icon: Library,
      gradient: 'from-purple/20 to-purple/5',
      iconColor: 'text-purple',
    },
    {
      label: 'Storyboard Frames',
      value: storyboardFrames.length,
      icon: Film,
      gradient: 'from-pink/20 to-pink/5',
      iconColor: 'text-pink',
    },
  ];

  const recentActivity = [
    { id: '1', type: 'prompt', description: `Generated prompt with ${prompts[0]?.engineName || 'Runway Gen-3'}`, time: '2 hours ago' },
    { id: '2', type: 'save', description: 'Saved prompt to library', time: '5 hours ago' },
    { id: '3', type: 'storyboard', description: `Added ${storyboardFrames.length} frames to storyboard`, time: '1 day ago' },
    { id: '4', type: 'prompt', description: 'Generated prompt with Midjourney V6', time: '2 days ago' },
    { id: '5', type: 'export', description: 'Exported storyboard project', time: '3 days ago' },
  ];

  const activityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    prompt: Wand2,
    save: Star,
    storyboard: Film,
    export: Library,
  };

  const activityColors: Record<string, string> = {
    prompt: 'text-cyan bg-cyan/10',
    save: 'text-yellow-400 bg-yellow-400/10',
    storyboard: 'text-purple bg-purple/10',
    export: 'text-green-400 bg-green-400/10',
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Page Title */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
          <p className="text-sm text-text-secondary mt-1">Your FrameForge dashboard</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={item}
                className="glass-card p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                </div>
                <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Plan & Account */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Plan Card */}
          <motion.div variants={item} className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">Current Plan</h3>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      user?.plan === 'premium' ? 'text-yellow-400' : 'text-text-muted'
                    }`}
                  >
                    {user?.plan || 'Free'}
                  </span>
                </div>
              </div>
              {user?.plan === 'free' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #00d4ff, #a855f7)' }}
                >
                  Upgrade
                </motion.button>
              )}
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'Video generations', used: 3, limit: 10 },
                { label: 'Image generations', used: 8, limit: 50 },
                { label: 'Storyboard frames', used: storyboardFrames.length, limit: 20 },
              ].map((quota) => (
                <div key={quota.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">{quota.label}</span>
                    <span className="text-text-muted">
                      {quota.used} / {quota.limit}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-bg-elevated overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(quota.used / quota.limit) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #00d4ff, #a855f7)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Account Info */}
          <motion.div variants={item} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan/20 to-cyan/5 flex items-center justify-center">
                <User className="w-5 h-5 text-cyan" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">Account Info</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-bg-elevated/50">
                <User className="w-4 h-4 text-text-muted" />
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Name</p>
                  <p className="text-sm text-text-primary">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-bg-elevated/50">
                <Mail className="w-4 h-4 text-text-muted" />
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Email</p>
                  <p className="text-sm text-text-primary">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-bg-elevated/50">
                <Calendar className="w-4 h-4 text-text-muted" />
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Joined</p>
                  <p className="text-sm text-text-primary">
                    {user?.joinDate
                      ? new Date(user.joinDate).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink/20 to-pink/5 flex items-center justify-center">
              <Clock className="w-5 h-5 text-pink" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">Recent Activity</h3>
          </div>

          <div className="space-y-1">
            {recentActivity.map((activity, i) => {
              const Icon = activityIcons[activity.type] || Sparkles;
              const colors = activityColors[activity.type] || 'text-text-muted bg-bg-elevated';
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-elevated/30 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{activity.description}</p>
                  </div>
                  <span className="text-xs text-text-muted flex-shrink-0">{activity.time}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
