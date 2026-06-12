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

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Star, Wand2, AlertTriangle, Sparkles, Zap, Crown, ArrowUp } from 'lucide-react';
import { useStore, PLAN_CONFIG } from '../../hooks/useStore';
import { engines } from '../../shared/engines';

export default function PromptBuilder() {
  const { user, selectedEngineId, addPrompt, addToLibrary } = useStore();
  const [values, setValues] = useState<Record<string, any>>({});
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);
  const [limitError, setLimitError] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [savedToLibrary, setSavedToLibrary] = useState(false);

  const engine = engines.find((e) => e.id === selectedEngineId);
  if (!engine) return null;

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setLimitError(false);
  };

  const generatePrompt = () => {
    setLimitError(false);
    setGenerated('');
    const prompt = engine.promptTemplate(values);
    const result = addPrompt(engine.id, engine.name, prompt, values);
    if (result.success) {
      setGenerated(prompt);
      setSavedToLibrary(false);
    } else if (result.error === 'LIMIT_REACHED') {
      setLimitError(true);
      setShowUpgrade(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const enhancePrompt = () => {
    setEnhancing(true);
    setTimeout(() => {
      setGenerated((g) => `[CINEMATIC] ${g} | ultra detailed, professional quality, 8K render, perfect lighting, highly detailed textures`);
      setEnhancing(false);
    }, 1200);
  };

  const saveToLib = () => {
    addToLibrary({
      id: Math.random().toString(36).substring(2, 10),
      engineId: engine.id,
      engineName: engine.name,
      prompt: generated,
      values,
      createdAt: new Date().toISOString(),
      favorite: true,
    });
    setSavedToLibrary(true);
    setTimeout(() => setSavedToLibrary(false), 2000);
  };

  const usagePercent = user ? (user.promptsThisMonth / user.promptLimit) * 100 : 0;
  const usageColor = usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-amber-500' : 'bg-[#00d4ff]';

  const shotPresets = [
    'Epic cinematic wide shot', 'Close-up portrait', 'Aerial drone shot', 'Slow motion detail',
    'Tracking shot following subject', 'Static wide establishing', 'Overhead top-down',
    'Low angle dramatic', 'Handheld gritty', 'Smooth gimbal glide',
  ];

  return (
    <div className="flex flex-col gap-5 p-4 max-w-4xl mx-auto">
      {/* Engine Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {engine.name}
          </h2>
          <p className="text-sm text-[#9090a0] mt-0.5">{engine.description}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20 uppercase tracking-wide">
          {engine.category}
        </span>
      </div>

      {/* Usage Bar */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#12121a]/80 backdrop-blur border border-[#27273a] rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#9090a0]">Monthly Usage</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.plan === 'free' ? 'bg-gray-500/20 text-gray-400' : user.plan === 'premium' ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'}`}>
                {PLAN_CONFIG[user.plan].name}
              </span>
            </div>
            <span className={`text-sm font-bold ${usagePercent > 90 ? 'text-red-400' : 'text-[#00d4ff]'}`}>
              {user.promptsThisMonth} / {user.promptLimit === 999999 ? '∞' : user.promptLimit}
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#27273a] rounded-full overflow-hidden">
            <motion.div className={`h-full rounded-full ${usageColor}`} initial={{ width: 0 }} animate={{ width: `${Math.min(usagePercent, 100)}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
          </div>
          {user.plan === 'free' && usagePercent > 75 && (
            <button onClick={() => setShowUpgrade(true)} className="mt-2 text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition">
              <ArrowUp size={12} /> Upgrade for {PLAN_CONFIG.premium.promptLimit} prompts/month
            </button>
          )}
        </motion.div>
      )}

      {/* Limit Error */}
      <AnimatePresence>
        {limitError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-400 font-semibold text-sm">Monthly Limit Reached</p>
              <p className="text-[#9090a0] text-xs mt-1">You have used all {user?.promptLimit} prompts this month.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2">
        {shotPresets.slice(0, 5).map((preset) => (
          <button
            key={preset}
            onClick={() => handleChange('prompt', preset)}
            className="px-3 py-1.5 rounded-lg bg-[#12121a] border border-[#27273a] text-xs text-[#9090a0] hover:border-[#00d4ff]/50 hover:text-[#f0f0f5] transition"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Dynamic Form */}
      <div className="bg-[#12121a]/80 backdrop-blur border border-[#27273a] rounded-xl p-5 space-y-4">
        {engine.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-[#f0f0f5] mb-1.5">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            {field.type === 'textarea' && (
              <textarea value={values[field.name] || ''} onChange={(e) => handleChange(field.name, e.target.value)} placeholder={field.placeholder} rows={3} className="w-full bg-[#0a0a0f] border border-[#27273a] rounded-lg px-4 py-3 text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#00d4ff] transition resize-none text-sm" />
            )}
            {field.type === 'text' && (
              <input type="text" value={values[field.name] || ''} onChange={(e) => handleChange(field.name, e.target.value)} placeholder={field.placeholder} className="w-full bg-[#0a0a0f] border border-[#27273a] rounded-lg px-4 py-3 text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#00d4ff] transition text-sm" />
            )}
            {field.type === 'select' && (
              <select value={values[field.name] || field.default || ''} onChange={(e) => handleChange(field.name, e.target.value)} className="w-full bg-[#0a0a0f] border border-[#27273a] rounded-lg px-4 py-3 text-[#f0f0f5] focus:outline-none focus:border-[#00d4ff] transition text-sm">
                {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}
            {field.type === 'slider' && (
              <div className="flex items-center gap-4">
                <input type="range" min={field.min} max={field.max} step={field.step || 1} value={values[field.name] || field.default || field.min} onChange={(e) => handleChange(field.name, Number(e.target.value))} className="flex-1 accent-[#00d4ff]" />
                <span className="text-[#00d4ff] font-mono text-sm min-w-[40px] text-right">{values[field.name] || field.default || field.min}</span>
              </div>
            )}
            {field.type === 'toggle' && (
              <button onClick={() => handleChange(field.name, !values[field.name])} className={`w-12 h-6 rounded-full transition relative ${values[field.name] ? 'bg-[#00d4ff]' : 'bg-[#27273a]'}`}>
                <motion.div className="absolute top-1 w-4 h-4 rounded-full bg-white" animate={{ left: values[field.name] ? 28 : 4 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
              </button>
            )}
            {field.type === 'number' && (
              <input type="number" min={field.min} max={field.max} value={values[field.name] || field.default || ''} onChange={(e) => handleChange(field.name, Number(e.target.value))} className="w-full bg-[#0a0a0f] border border-[#27273a] rounded-lg px-4 py-3 text-[#f0f0f5] focus:outline-none focus:border-[#00d4ff] transition text-sm" />
            )}
          </div>
        ))}

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generatePrompt} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#a855f7] text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#00d4ff]/20 transition">
          <Wand2 size={18} /> Generate Prompt
        </motion.button>
      </div>

      {/* Generated Output */}
      <AnimatePresence>
        {generated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#12121a]/80 backdrop-blur border border-[#27273a] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#f0f0f5] flex items-center gap-2"><Sparkles size={14} className="text-[#00d4ff]" /> Generated Prompt</h3>
              <div className="flex gap-2">
                <button onClick={enhancePrompt} disabled={enhancing} className="px-3 py-1.5 rounded-lg bg-[#a855f7]/20 text-[#a855f7] text-xs font-medium flex items-center gap-1 hover:bg-[#a855f7]/30 transition disabled:opacity-50"><Zap size={12} /> {enhancing ? 'Enhancing...' : 'Enhance'}</button>
                <button onClick={copyToClipboard} className="px-3 py-1.5 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs font-medium flex items-center gap-1 hover:bg-[#00d4ff]/30 transition">{copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied!' : 'Copy'}</button>
                <button onClick={saveToLib} className="px-3 py-1.5 rounded-lg bg-[#27273a] text-[#9090a0] text-xs font-medium flex items-center gap-1 hover:bg-[#3a3a50] transition">{savedToLibrary ? <Check size={12} /> : <Star size={12} />}</button>
              </div>
            </div>
            <div className="bg-[#0a0a0f] rounded-lg p-4 font-mono text-sm text-[#f0f0f5] leading-relaxed border border-[#27273a]/50">{generated}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Engine Tip */}
      {engine.tip && (
        <div className="bg-[#00d4ff]/5 border border-[#00d4ff]/10 rounded-xl p-4">
          <p className="text-xs text-[#9090a0] flex items-start gap-2"><Sparkles size={14} className="text-[#00d4ff] shrink-0 mt-0.5" />{engine.tip}</p>
        </div>
      )}

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgrade && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowUpgrade(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#12121a] border border-[#27273a] rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ec4899] flex items-center justify-center"><Crown size={20} className="text-white" /></div>
                <h3 className="text-lg font-bold text-white">Upgrade Your Plan</h3>
              </div>
              <p className="text-sm text-[#9090a0] mb-5">You have reached your monthly limit. Upgrade to generate more prompts.</p>
              <div className="space-y-3">
                {(Object.keys(PLAN_CONFIG) as Array<keyof typeof PLAN_CONFIG>).filter((p) => p !== user?.plan).map((plan) => (
                  <div key={plan} className="bg-[#0a0a0f] border border-[#27273a] rounded-xl p-4 hover:border-[#a855f7]/50 transition cursor-pointer" onClick={() => { useStore.getState().upgradePlan(plan); setShowUpgrade(false); setLimitError(false); }}>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">{PLAN_CONFIG[plan].name}</span>
                      <span className="text-[#a