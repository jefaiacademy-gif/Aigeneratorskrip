import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Copy,
  Check,
  Trash2,
  Search,
  History as HistoryIcon,
  Clock,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';

export default function History() {
  const { history, toggleFavorite, deleteFromHistory } = useStore();
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = history.filter(
    (entry) =>
      !search ||
      entry.generatedPrompt.toLowerCase().includes(search.toLowerCase()) ||
      entry.engineName.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">History</h1>
              <p className="text-sm text-text-secondary mt-1">
                Your past generations ({history.length})
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-bg-card border border-border text-sm text-text-primary placeholder-text-muted focus:border-cyan transition-colors"
            />
          </div>
        </motion.div>

        {/* List */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.04 } },
            }}
            className="space-y-2"
          >
            <AnimatePresence>
              {filtered.map((entry) => (
                <motion.div
                  key={entry.id}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    show: { opacity: 1, x: 0 },
                  }}
                  exit={{ opacity: 0, x: 10 }}
                  className="glass-card p-4 group hover:border-border-hover transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Favorite toggle */}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(entry.id)}
                      className="mt-0.5 p-1 rounded-md hover:bg-bg-elevated transition-colors flex-shrink-0"
                    >
                      <Star
                        className={`w-4 h-4 transition-colors ${
                          entry.favorite
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-text-muted'
                        }`}
                      />
                    </motion.button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan bg-cyan/10 px-1.5 py-0.5 rounded-full">
                          {entry.engineName}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-text-muted">
                          <Clock className="w-3 h-3" />
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-text-primary leading-relaxed line-clamp-2">
                        {entry.generatedPrompt}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyToClipboard(entry.generatedPrompt, entry.id)}
                        className="p-2 rounded-md hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
                        title="Copy prompt"
                      >
                        {copiedId === entry.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteFromHistory(entry.id)}
                        className="p-2 rounded-md hover:bg-pink/10 text-text-muted hover:text-pink transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border flex items-center justify-center mb-4">
        <HistoryIcon className="w-8 h-8 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">No history yet</h3>
      <p className="text-sm text-text-secondary max-w-sm">
        Your generation history will appear here. Start creating prompts to build your history.
      </p>
    </motion.div>
  );
}
