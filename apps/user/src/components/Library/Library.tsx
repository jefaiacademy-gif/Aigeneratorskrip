import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Copy,
  Check,
  Trash2,
  Search,
  Library as LibraryIcon,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';

export default function Library() {
  const { library, toggleFavorite } = useStore();
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = library.filter(
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

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Library</h1>
              <p className="text-sm text-text-secondary mt-1">
                Your saved prompts ({library.length})
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
              placeholder="Search saved prompts..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-bg-card border border-border text-sm text-text-primary placeholder-text-muted focus:border-cyan transition-colors"
            />
          </div>
        </motion.div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <AnimatePresence>
              {filtered.map((entry) => (
                <motion.div
                  key={entry.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0 },
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-4 group"
                >
                  {/* Engine badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan bg-cyan/10 px-2 py-0.5 rounded-full">
                      {entry.engineName}
                    </span>
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleFavorite(entry.id)}
                        className="p-1.5 rounded-md hover:bg-bg-elevated transition-colors"
                      >
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Prompt text */}
                  <p className="text-sm text-text-primary leading-relaxed mb-4 line-clamp-4">
                    {entry.generatedPrompt}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-[11px] text-text-muted">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyToClipboard(entry.generatedPrompt, entry.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-bg-elevated text-text-secondary hover:text-text-primary text-xs transition-colors"
                    >
                      {copiedId === entry.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </motion.button>
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
        <LibraryIcon className="w-8 h-8 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">No saved prompts</h3>
      <p className="text-sm text-text-secondary max-w-sm">
        When you save prompts from the generator, they will appear here for quick access.
      </p>
    </motion.div>
  );
}
