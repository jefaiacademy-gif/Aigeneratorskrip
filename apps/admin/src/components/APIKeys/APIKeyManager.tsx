import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  X,
  Zap,
  AlertTriangle,
  Key,
} from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';

const PROVIDERS = [
  'OpenAI',
  'Anthropic',
  'Midjourney',
  'Runway',
  'Pika',
  'Luma',
  'Hailuo',
  'Stability',
  'Flux',
  'Recraft',
  'Ideogram',
  'OpenRouter',
  'Custom',
];

const maskKey = (value: string) => {
  if (!value || value.length <= 8) return '••••••••';
  const last4 = value.slice(-4);
  return `${value.slice(0, 3)}${'•'.repeat(12)}${last4}`;
};

function getUsageColor(usage: number, limit: number) {
  const pct = (usage / limit) * 100;
  if (pct > 90) return 'bg-red';
  if (pct > 70) return 'bg-amber';
  return 'bg-green';
}

function getUsageTextColor(usage: number, limit: number) {
  const pct = (usage / limit) * 100;
  if (pct > 90) return 'text-red';
  if (pct > 70) return 'text-amber';
  return 'text-green';
}

export default function APIKeyManager() {
  const apiKeys = useAdminStore((s) => s.apiKeys);
  const toggleApiKey = useAdminStore((s) => s.toggleApiKey);
  const deleteApiKey = useAdminStore((s) => s.deleteApiKey);
  const addApiKey = useAdminStore((s) => s.addApiKey);

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formProvider, setFormProvider] = useState('OpenAI');
  const [formName, setFormName] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formLimit, setFormLimit] = useState(10000);
  const [formError, setFormError] = useState('');

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formName.trim()) {
      setFormError('Key name is required');
      return;
    }
    if (!formValue.trim()) {
      setFormError('Key value is required');
      return;
    }
    addApiKey({
      provider: formProvider,
      name: formName.trim(),
      value: formValue.trim(),
      usage: 0,
      limit: formLimit,
      active: true,
    });
    setShowAdd(false);
    setFormProvider('OpenAI');
    setFormName('');
    setFormValue('');
    setFormLimit(10000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">API Keys</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            Manage provider API keys and usage limits
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-bg-primary transition-all"
          style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}
        >
          <Plus className="w-4 h-4" />
          Add New Key
        </motion.button>
      </div>

      {/* Keys table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted text-xs uppercase tracking-wide border-b border-border bg-bg-elevated/40">
                <th className="text-left font-medium px-5 py-3">Provider</th>
                <th className="text-left font-medium px-5 py-3">Name</th>
                <th className="text-left font-medium px-5 py-3">Key</th>
                <th className="text-left font-medium px-5 py-3">Usage</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
                <th className="text-left font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {apiKeys.map((key, i) => (
                  <motion.tr
                    key={key.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="border-b border-border/50 last:border-0 hover:bg-bg-elevated/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-bg-elevated border border-border flex items-center justify-center">
                          <Zap className="w-3.5 h-3.5 text-amber" />
                        </div>
                        <span className="font-medium text-text-primary">{key.provider}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-text-secondary">{key.name}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-text-muted font-mono">
                          {visibleKeys[key.id] ? key.value : maskKey(key.value)}
                        </code>
                        <button
                          onClick={() => toggleVisibility(key.id)}
                          className="text-text-muted hover:text-text-secondary transition-colors"
                        >
                          {visibleKeys[key.id] ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="w-full max-w-[140px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium ${getUsageTextColor(key.usage, key.limit)}`}>
                            {((key.usage / key.limit) * 100).toFixed(0)}%
                          </span>
                          <span className="text-[10px] text-text-muted">
                            {key.usage.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${getUsageColor(key.usage, key.limit)}`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min((key.usage / key.limit) * 100, 100)}%`,
                            }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleApiKey(key.id)}
                        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${
                          key.active ? 'bg-green/30' : 'bg-bg-elevated'
                        }`}
                      >
                        <motion.div
                          animate={{ x: key.active ? 18 : 2 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          className={`absolute top-[2px] w-[18px] h-[18px] rounded-full shadow ${
                            key.active ? 'bg-green' : 'bg-text-muted'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg text-text-muted hover:text-amber hover:bg-amber/10 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(key.id)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-red hover:bg-red/10 transition-colors"
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

        {apiKeys.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted">
            <Key className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No API keys configured</p>
            <p className="text-xs mt-1">Add your first API key to get started</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              className="glass-card rounded-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="text-base font-semibold text-text-primary">Add New API Key</h3>
                <button
                  onClick={() => setShowAdd(false)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="p-6 space-y-4">
                {formError && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red/10 text-red text-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {formError}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Provider
                  </label>
                  <select
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border text-text-primary text-sm focus:border-amber"
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Production Key"
                    className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border text-text-primary placeholder:text-text-muted text-sm focus:border-amber"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Key Value
                  </label>
                  <input
                    type="password"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border text-text-primary placeholder:text-text-muted text-sm focus:border-amber"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formLimit}
                    onChange={(e) => setFormLimit(Number(e.target.value))}
                    min={100}
                    step={100}
                    className="w-full px-3 py-2 rounded-lg bg-bg-primary border border-border text-text-primary text-sm focus:border-amber"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-border text-text-secondary text-sm font-medium hover:bg-bg-elevated transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-bg-primary transition-all"
                    style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}
                  >
                    Save Key
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <h3 className="text-base font-semibold text-text-primary">Delete API Key</h3>
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
                    deleteApiKey(deleteConfirm);
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
