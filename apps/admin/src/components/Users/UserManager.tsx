import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Crown,
  Trash2,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';

type FilterTab = 'All' | 'Free' | 'Premium';

export default function UserManager() {
  const users = useAdminStore((s) => s.users);
  const toggleUserPlan = useAdminStore((s) => s.toggleUserPlan);
  const deleteUser = useAdminStore((s) => s.deleteUser);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('All');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || u.plan === filter;
    return matchesSearch && matchesFilter;
  });

  const premiumCount = users.filter((u) => u.plan === 'Premium').length;
  const freeCount = users.filter((u) => u.plan === 'Free').length;

  const filters: { label: string; value: FilterTab; count: number }[] = [
    { label: 'All Users', value: 'All', count: users.length },
    { label: 'Free', value: 'Free', count: freeCount },
    { label: 'Premium', value: 'Premium', count: premiumCount },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Users</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {users.length} registered users
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg bg-bg-primary border border-border text-text-primary placeholder:text-text-muted text-sm focus:border-amber"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-bg-card border border-border rounded-lg w-fit">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`relative px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === f.value
                ? 'text-amber'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {filter === f.value && (
              <motion.div
                layoutId="userFilter"
                className="absolute inset-0 bg-amber/10 rounded-md"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {f.label}
              <span className="ml-1.5 text-[10px] text-text-muted">{f.count}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Users table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted text-xs uppercase tracking-wide border-b border-border bg-bg-elevated/40">
                <th className="text-left font-medium px-5 py-3">Name</th>
                <th className="text-left font-medium px-5 py-3">Email</th>
                <th className="text-left font-medium px-5 py-3">Plan</th>
                <th className="text-left font-medium px-5 py-3">Prompts</th>
                <th className="text-left font-medium px-5 py-3">Join Date</th>
                <th className="text-left font-medium px-5 py-3">Last Active</th>
                <th className="text-left font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className="border-b border-border/50 last:border-0 hover:bg-bg-elevated/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-xs font-semibold text-text-secondary">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium text-text-primary">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-text-secondary text-xs">{user.email}</td>
                    <td className="px-5 py-3.5">
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
                    <td className="px-5 py-3.5 text-text-secondary">
                      {user.promptsGenerated.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-text-muted text-xs">{user.joinDate}</td>
                    <td className="px-5 py-3.5 text-text-muted text-xs">{user.lastActive}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleUserPlan(user.id)}
                          title={user.plan === 'Free' ? 'Upgrade to Premium' : 'Downgrade to Free'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.plan === 'Free'
                              ? 'text-text-muted hover:text-amber hover:bg-amber/10'
                              : 'text-amber hover:text-text-primary hover:bg-bg-elevated'
                          }`}
                        >
                          <Crown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-red hover:bg-red/10 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-text-muted"
          >
            <Users className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">
              {users.length === 0 ? 'No users found' : 'No matching users'}
            </p>
            <p className="text-xs mt-1">
              {users.length === 0
                ? 'All users have been deleted'
                : 'Try adjusting your search or filter'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-xl w-full max-w-sm p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">Delete User</h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border text-text-secondary text-sm font-medium hover:bg-bg-elevated transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteUser(deleteConfirm);
                    setDeleteConfirm(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-red text-bg-primary text-sm font-medium hover:bg-red/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
