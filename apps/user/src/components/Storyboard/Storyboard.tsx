import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus,
  Trash2,
  GripVertical,
  Film,
  Clock,
  Download,
  Clapperboard,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import type { StoryboardFrame } from '../../types';

const shotTypes = ['Wide', 'Medium', 'Close-up', 'Extreme Close-up', 'Overhead', 'POV'];
const transitions = ['Cut', 'Dissolve', 'Fade', 'Wipe', 'Zoom', 'None'];

export default function Storyboard() {
  const { storyboardFrames, addFrame, removeFrame, reorderFrames } = useStore();
  const [previewIndex, setPreviewIndex] = useState(0);

  // Keep preview index in bounds
  useEffect(() => {
    if (previewIndex >= storyboardFrames.length) {
      setPreviewIndex(Math.max(0, storyboardFrames.length - 1));
    }
  }, [storyboardFrames.length, previewIndex]);

  const totalDuration = storyboardFrames.reduce((acc, f) => acc + f.duration, 0);

  const handleAddFrame = () => {
    const newFrame: StoryboardFrame = {
      id: `frame-${Date.now()}`,
      order: storyboardFrames.length + 1,
      shotType: 'Medium',
      description: '',
      transition: 'Cut',
      duration: 3,
    };
    addFrame(newFrame);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-bg-card/40 flex-shrink-0">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddFrame}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #a855f7)' }}
          >
            <Plus className="w-4 h-4" />
            Add Frame
          </motion.button>
          <div className="flex items-center gap-1.5 text-sm text-text-secondary">
            <Clock className="w-4 h-4" />
            <span>Total: {totalDuration}s</span>
            <span className="text-text-muted mx-1">&middot;</span>
            <span>{storyboardFrames.length} frames</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-elevated border border-border text-sm font-medium text-text-primary hover:border-border-hover transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Storyboard
        </motion.button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Frame List */}
        <div className="flex-1 overflow-y-auto p-4">
          {storyboardFrames.length === 0 ? (
            <EmptyState onAdd={handleAddFrame} />
          ) : (
            <div className="space-y-3 max-w-4xl">
              <Reorder.Group
                axis="y"
                values={storyboardFrames}
                onReorder={(newOrder) => {
                  reorderFrames(newOrder.map((f, i) => ({ ...f, order: i + 1 })));
                }}
                className="space-y-3"
              >
                <AnimatePresence>
                  {storyboardFrames.map((frame, index) => (
                    <FrameCard
                      key={frame.id}
                      frame={frame}
                      index={index}
                      onRemove={removeFrame}
                    />
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {storyboardFrames.length > 0 && (
          <div className="w-72 border-l border-border bg-bg-card/30 p-4 flex-shrink-0 overflow-y-auto hidden xl:block">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Preview</h3>

            {/* Current frame preview */}
            <div className="aspect-video rounded-lg bg-bg-elevated border border-border mb-4 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Film className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-xs text-text-muted">
                    Frame {previewIndex + 1} of {storyboardFrames.length}
                  </p>
                </div>
              </div>
              {/* Shot type badge */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-cyan/20 text-cyan text-[10px] font-semibold">
                {storyboardFrames[previewIndex]?.shotType}
              </div>
              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-bg-card/80 text-text-secondary text-[10px]">
                {storyboardFrames[previewIndex]?.duration}s
              </div>
            </div>

            {/* Frame description */}
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              {storyboardFrames[previewIndex]?.description || 'No description'}
            </p>

            {/* Thumbnail strip */}
            <div className="border-t border-border pt-4">
              <p className="text-xs font-medium text-text-muted mb-3">All Frames</p>
              <div className="flex flex-wrap gap-2">
                {storyboardFrames.map((_frame, i) => (
                  <motion.button
                    key={_frame.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPreviewIndex(i)}
                    className={`w-12 h-8 rounded-md flex items-center justify-center text-[10px] font-semibold transition-colors ${
                      i === previewIndex
                        ? 'bg-cyan/20 text-cyan border border-cyan/40'
                        : 'bg-bg-elevated text-text-muted border border-border'
                    }`}
                  >
                    {i + 1}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-border mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Shot types used:</span>
                <span className="text-text-primary">
                  {[...new Set(storyboardFrames.map((f) => f.shotType))].join(', ')}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Total duration:</span>
                <span className="text-text-primary">{totalDuration}s</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FrameCard({
  frame,
  index,
  onRemove,
}: {
  frame: StoryboardFrame;
  index: number;
  onRemove: (id: string) => void;
}) {
  const { reorderFrames, storyboardFrames } = useStore();
  const [localFrame, setLocalFrame] = useState(frame);

  // Sync local frame when store updates
  useEffect(() => {
    const storeFrame = storyboardFrames.find((f) => f.id === frame.id);
    if (storeFrame) {
      setLocalFrame(storeFrame);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyboardFrames, frame.id]);

  const updateFrame = (updates: Partial<StoryboardFrame>) => {
    const updated = { ...localFrame, ...updates };
    setLocalFrame(updated);
    const newFrames = storyboardFrames.map((f) =>
      f.id === frame.id ? updated : f
    );
    reorderFrames(newFrames);
  };

  return (
    <Reorder.Item
      value={frame}
      id={frame.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="glass-card p-4"
    >
      <div className="flex items-start gap-3">
        {/* Drag handle + order number */}
        <div className="flex items-center gap-2 pt-1">
          <div className="cursor-grab active:cursor-grabbing text-text-muted hover:text-text-secondary transition-colors">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="w-7 h-7 rounded-full bg-cyan/10 flex items-center justify-center">
            <span className="text-xs font-bold text-cyan">{index + 1}</span>
          </div>
        </div>

        {/* Fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Shot Type */}
          <div>
            <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1 block">
              Shot
            </label>
            <select
              value={localFrame.shotType}
              onChange={(e) => updateFrame({ shotType: e.target.value })}
              className="w-full px-2 py-1.5 rounded-md bg-bg-elevated border border-border text-xs text-text-primary focus:border-cyan transition-colors"
            >
              {shotTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Transition */}
          <div>
            <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1 block">
              Transition
            </label>
            <select
              value={localFrame.transition}
              onChange={(e) => updateFrame({ transition: e.target.value })}
              className="w-full px-2 py-1.5 rounded-md bg-bg-elevated border border-border text-xs text-text-primary focus:border-cyan transition-colors"
            >
              {transitions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1 block">
              Duration (s)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={localFrame.duration}
              onChange={(e) => updateFrame({ duration: Number(e.target.value) })}
              className="w-full px-2 py-1.5 rounded-md bg-bg-elevated border border-border text-xs text-text-primary focus:border-cyan transition-colors"
            />
          </div>

          {/* Delete */}
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRemove(frame.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-pink/10 text-pink hover:bg-pink/20 transition-colors text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </motion.button>
          </div>

          {/* Description - full width */}
          <div className="md:col-span-4">
            <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1 block">
              Description
            </label>
            <textarea
              value={localFrame.description}
              onChange={(e) => updateFrame({ description: e.target.value })}
              placeholder="Describe the shot composition, action, camera movement..."
              rows={2}
              className="w-full px-3 py-2 rounded-md bg-bg-elevated border border-border text-xs text-text-primary placeholder-text-muted focus:border-cyan transition-colors resize-none"
            />
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-96 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border flex items-center justify-center mb-4">
        <Clapperboard className="w-8 h-8 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        No frames yet
      </h3>
      <p className="text-sm text-text-secondary mb-6 max-w-sm">
        Start building your storyboard by adding frames. Each frame represents a shot in your scene.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
        style={{ background: 'linear-gradient(135deg, #00d4ff, #a855f7)' }}
      >
        <Plus className="w-4 h-4" />
        Add First Frame
      </motion.button>
    </motion.div>
  );
}
