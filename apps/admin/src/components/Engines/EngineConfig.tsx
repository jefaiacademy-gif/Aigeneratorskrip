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
          <motion.div
            key={engine.engineId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-[#12121a]/80 backdrop-blur border rounded-xl p-5 transition ${engine.enabled ? 'border-[#00d4ff]/30 shadow-lg shadow-[#00d4ff]/5' : 'border-[#27273a] opacity-60'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#f0f0f5]">{engine.engineName}</h3>
                <span className="text-xs text-[#606070]">{engine.engineId}</span>
              </div>
              <button onClick={() => toggleEngine(engine.engineId)} className="transition hover:scale-110">
                {engine.enabled ? <ToggleRight size={28} className="text-[#00d4ff]" /> : <ToggleLeft size={28} className="text-[#27273a]" />}
              </button>
            </div>

            {engine.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[#9090a0] mb-1">API Key</label>
                  <select
                    value={engine.apiKeyId || ''}
                    onChange={(e) => assignApiKey(engine.engineId, e.target.value || null)}
                    className="w-full bg-[#0a0a0f] border border-[#27273a] rounded-lg px-3 py-2 text-xs text-[#f0f0f5] focus:outline-none focus:border-[#f59e0b]"
                  >
                    <option value="">-- Select API Key --</option>
                    {activeKeys.map((k) => (
                      <option key={k.id} value={k.id}>{k.name} ({k.provider})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#9090a0] mb-1">Rate Limit: {engine.rateLimit}/day</label>
                  <input
                    type="range"
                    min={100}
                    max={5000}
                    step={100}
                    value={engine.rateLimit}
                    onChange={(e) => setEngineRateLimit(engine.engineId, Number(e.target.value))}
                    className="w-full accent-[#f59e0b]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-[#f59e0b]" />
                  <span className="text-xs text-[#9090a0]">{engine.usage} / {engine.rateLimit} used today</span>
                </div>
                <div className="w-full h-1.5 bg-[#27273a] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${engine.usage / engine.rateLimit > 0.8 ? 'bg-red-400' : 'bg-[#f59e0b]'}`} style={{ width: `${Math.min((engine.usage / engine.rateLimit) * 100, 100)}%` }} />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}