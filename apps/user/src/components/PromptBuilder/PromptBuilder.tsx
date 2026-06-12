import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Star,
  Lightbulb,
  Sparkles,
  Type,
  ListFilter,
  SlidersHorizontal,
  ToggleLeft,
  Hash as HashIcon,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { getEngineById } from '../EnginePicker/EnginePicker';
import type { EngineField } from '../../types';

const fieldIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  text: Type,
  textarea: Type,
  select: ListFilter,
  slider: SlidersHorizontal,
  toggle: ToggleLeft,
  number: HashIcon,
};

export default function PromptBuilder() {
  const { selectedEngineId, addPrompt } = useStore();
  const engine = getEngineById(selectedEngineId);
  const [fieldValues, setFieldValues] = useState<Record<string, string | number | boolean>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Initialize default values when engine changes
  useEffect(() => {
    if (engine) {
      const defaults: Record<string, string | number | boolean> = {};
      engine.fields.forEach((f) => {
        if (f.defaultValue !== undefined) defaults[f.id] = f.defaultValue;
      });
      setFieldValues(defaults);
      setGeneratedPrompt('');
      setSaved(false);
    }
  }, [engine]);

  const handleFieldChange = useCallback(
    (fieldId: string, value: string | number | boolean) => {
      setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
      setGeneratedPrompt('');
    },
    []
  );

  const generatePrompt = useCallback(() => {
    if (!engine) return;
    let prompt = engine.promptTemplate;
    engine.fields.forEach((field) => {
      const value = fieldValues[field.id];
      const replacement = value !== undefined ? String(value) : '';
      prompt = prompt.replace(`{${field.id}}`, replacement);
    });
    // Clean up any unreplaced placeholders
    prompt = prompt.replace(/\{[^}]+\}/g, '');
    // Remove extra whitespace
    prompt = prompt.replace(/\s+/g, ' ').trim();
    setGeneratedPrompt(prompt);
    setSaved(false);
  }, [engine, fieldValues]);

  const copyToClipboard = useCallback(() => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedPrompt]);

  const saveToLibrary = useCallback(() => {
    if (!generatedPrompt || !engine) return;
    const entry = {
      id: `prompt-${Date.now()}`,
      engineId: engine.id,
      engineName: engine.name,
      values: { ...fieldValues },
      generatedPrompt,
      timestamp: Date.now(),
      favorite: true,
    };
    addPrompt(entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [generatedPrompt, engine, fieldValues, addPrompt]);

  if (!engine) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted">
        Select an engine to get started
      </div>
    );
  }

  const allRequiredFilled = engine.fields
    .filter((f) => f.required)
    .every((f) => {
      const v = fieldValues[f.id];
      return v !== undefined && v !== '';
    });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Engine Header */}
        <motion.div
          key={engine.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-text-primary">{engine.name}</h1>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                engine.category === 'video'
                  ? 'bg-cyan/10 text-cyan'
                  : engine.category === 'image'
                  ? 'bg-purple/10 text-purple'
                  : 'bg-pink/10 text-pink'
              }`}
            >
              {engine.category}
            </span>
          </div>
          <p className="text-text-secondary text-sm">{engine.description}</p>
        </motion.div>

        {/* Form Fields */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {engine.fields.map((field, i) => (
              <motion.div
                key={`${engine.id}-${field.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.05 }}
              >
                <FieldRenderer
                  field={field}
                  value={fieldValues[field.id]}
                  onChange={(v) => handleFieldChange(field.id, v)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={generatePrompt}
          disabled={!allRequiredFilled}
          className={`w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
            allRequiredFilled
              ? 'opacity-100 cursor-pointer'
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{
            background: allRequiredFilled
              ? 'linear-gradient(135deg, #00d4ff, #a855f7)'
              : 'linear-gradient(135deg, #3a3a50, #27273a)',
          }}
        >
          <Sparkles className="w-5 h-5" />
          Generate Prompt
        </motion.button>

        {/* Generated Prompt */}
        <AnimatePresence>
          {generatedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-cyan uppercase tracking-wider">
                    Generated Prompt
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={saveToLibrary}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        saved
                          ? 'bg-cyan/20 text-cyan'
                          : 'bg-bg-elevated text-text-secondary hover:text-yellow-400'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${saved ? 'fill-cyan' : ''}`} />
                      {saved ? 'Saved' : 'Save'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyToClipboard}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-elevated text-text-secondary hover:text-text-primary text-xs font-medium transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </motion.button>
                  </div>
                </div>
                <div className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                  <HighlightedPrompt prompt={generatedPrompt} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Engine Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-yellow-400 mb-1">Engine Tip</p>
            <p className="text-sm text-text-secondary">{engine.tip}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: EngineField;
  value: string | number | boolean | undefined;
  onChange: (v: string | number | boolean) => void;
}) {
  const Icon = fieldIcons[field.type] || Hash;
  const currentValue = value !== undefined ? value : field.defaultValue || '';

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-text-muted" />
        <label className="text-sm font-medium text-text-primary">
          {field.label}
          {field.required && <span className="text-pink ml-1">*</span>}
        </label>
      </div>

      {field.description && (
        <p className="text-xs text-text-muted mb-2">{field.description}</p>
      )}

      {field.type === 'text' && (
        <input
          type="text"
          value={String(currentValue)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-3 py-2.5 rounded-lg bg-bg-elevated border border-border text-text-primary placeholder-text-muted text-sm focus:border-cyan transition-colors"
        />
      )}

      {field.type === 'textarea' && (
        <div>
          <textarea
            value={String(currentValue)}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-3 py-2.5 rounded-lg bg-bg-elevated border border-border text-text-primary placeholder-text-muted text-sm focus:border-cyan transition-colors resize-none"
          />
          <div className="text-right text-[11px] text-text-muted mt-1">
            {String(currentValue).length} chars
          </div>
        </div>
      )}

      {field.type === 'select' && (
        <select
          value={String(currentValue)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-bg-elevated border border-border text-text-primary text-sm focus:border-cyan transition-colors appearance-none cursor-pointer"
        >
          {field.options?.map((opt) => (
            <option key={opt} value={opt} className="bg-bg-elevated">
              {opt}
            </option>
          ))}
        </select>
      )}

      {field.type === 'slider' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <input
              type="range"
              min={field.min}
              max={field.max}
              step={field.step}
              value={Number(currentValue)}
              onChange={(e) => onChange(Number(e.target.value))}
              className="flex-1 mr-3"
            />
            <span className="text-sm text-cyan font-mono min-w-[40px] text-right">
              {currentValue}
            </span>
          </div>
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>{field.min}</span>
            <span>{field.max}</span>
          </div>
        </div>
      )}

      {field.type === 'toggle' && (
        <button
          onClick={() => onChange(!currentValue)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            currentValue ? 'bg-cyan' : 'bg-bg-elevated border border-border'
          }`}
        >
          <motion.div
            animate={{ x: currentValue ? 20 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
          />
        </button>
      )}

      {field.type === 'number' && (
        <input
          type="number"
          value={String(currentValue)}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          className="w-full px-3 py-2.5 rounded-lg bg-bg-elevated border border-border text-text-primary placeholder-text-muted text-sm focus:border-cyan transition-colors"
        />
      )}
    </div>
  );
}

// Simple syntax highlighting for the prompt
function HighlightedPrompt({ prompt }: { prompt: string }) {
  // Split into parts and color them differently
  const words = prompt.split(' ');
  const colors = [
    'text-text-primary',
    'text-cyan',
    'text-purple',
    'text-pink',
    'text-text-secondary',
  ];

  return (
    <>
      {words.map((word, i) => (
        <span key={i} className={`${colors[i % colors.length]} `}>
          {word}{' '}
        </span>
      ))}
    </>
  );
}
