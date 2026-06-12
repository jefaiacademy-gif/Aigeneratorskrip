import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Image, Video, Check } from 'lucide-react';
import { useAdminStore, ENGINES } from '../../hooks/useAdminStore';

const categoryBadge = {
  video: { label: 'Video', color: 'bg-pink/10 text-pink border-pink/20' },
  image: { label: 'Image', color: 'bg-cyan/10 text-cyan border-cyan/20' },
  storyboard: { label: 'Storyboard', color: 'bg-amber/10 text-amber border-amber/20' },
};

const categoryIcon = {
  video: Video,
  image: Image,
  storyboard: Zap,
};

export default function EngineConfig() {
  const apiKeys = useAdminStore((s) => s.apiKeys);
  const engineEnabled = useAdminStore((s) => s.engineEnabled);
  const engineAssignments = useAdminStore((s) => s.engineAssignments);
  const toggleEngine = useAdminStore((s) => s.toggleEngine);
  const assignApiKeyToEngine = useAdminStore((s) => s.assignApiKeyToEngine);

  const [savedIndicator, setSavedIndicator] = useState<string | null>(null);

  const getFilteredKeys = (engineId: string) => {
    const engine = ENGINES.find((e) => e.id === engineId);
    if (!engine) return apiKeys;
    const filtered = apiKeys.filter(
      (k) =>
        k.provider === engine.category ||
        k.provider === 'OpenRouter' ||
        k.provider === 'Custom'
    );
    return filtered.length > 0 ? filtered : apiKeys;
  };

  const handleAssign = (engineId: string, apiKeyId: string) => {
    assignApiKeyToEngine(engineId, apiKeyId);
    setSavedIndicator(engineId);
    setTimeout(() => setSavedIndicator(null), 1500);
  };

  const handleToggle = (engineId: string) => {
    toggleEngine(engineId);
    setSavedIndicator(engineId);
    setTimeout(() => setSavedIndicator(null), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Engine Configuration</h1>
        <p className="text-text-secondary text-sm mt-0.5">
          Enable or disable AI engines and manage API key assignments
        </p>
      </div>

      {/* Engines grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {ENGINES.map((engine, i) => {
          const isEnabled = engineEnabled[engine.id] ?? false;
          const assignedKey = engineAssignments[engine.id];
          const CatIcon = categoryIcon[engine.category];

          return (
            <motion.div
              key={engine.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className={`glass-card rounded-xl p-5 transition-all duration-300 ${
                isEnabled
                  ? 'border-green/30 shadow-[0_0_12px_rgba(34,197,94,0.08)]'
                  : 'opacity-60 hover:opacity-80'
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isEnabled ? 'bg-bg-elevated' : 'bg-bg-elevated/50'
                    }`}
                  >
                    <CatIcon
                      className={`w-5 h-5 ${
                        isEnabled ? 'text-amber' : 'text-text-muted'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{engine.name}</h3>
                    <span
                      className={`inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                        isEnabled
                          ? categoryBadge[engine.category].color
                          : 'bg-bg-elevated text-text-muted border-border'
                      }`}
                    >
                      {categoryBadge[engine.category].label}
                    </span>
                  </div>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {savedIndicator === engine.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="flex items-center gap-1 text-green text-xs"
                      >
                        <Check className="w-3 h-3" />
                        Saved
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={() => handleToggle(engine.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      isEnabled ? 'bg-green/30' : 'bg-bg-elevated'
                    }`}
                  >
                    <motion.div
                      animate={{ x: isEnabled ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className={`absolute top-[2px] w-[20px] h-[20px] rounded-full shadow ${
                        isEnabled ? 'bg-green' : 'bg-text-muted'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                {engine.description}
              </p>

              {/* Rate limit */}
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted mb-4">
                <Zap className="w-3 h-3" />
                Rate limit: {engine.rateLimit}
              </div>

              {/* API Key assignment */}
              <div>
                <label className="block text-[11px] font-medium text-text-muted mb-1.5 uppercase tracking-wide">
                  Assigned API Key
                </label>
                <select
                  value={assignedKey || ''}
                  onChange={(e) => handleAssign(engine.id, e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm border transition-colors ${
                    isEnabled
                      ? 'bg-bg-primary border-border text-text-primary'
                      : 'bg-bg-primary/50 border-border/50 text-text-muted'
                  }`}
                  disabled={!isEnabled}
                >
                  {getFilteredKeys(engine.id).map((key) => (
                    <option key={key.id} value={key.id}>
                      {key.provider} — {key.name} ({((key.usage / key.limit) * 100).toFixed(0)}%)
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
